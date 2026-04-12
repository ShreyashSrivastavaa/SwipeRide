const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes')
const Ride = require('../models/Ride')
const User = require('../models/User')
const Driver = require('../models/Driver')
const { NotFoundError, BadRequestError } = require('../errors')
const {
    calculateFare,
    getDistanceMatrix,
    getCoordinatesFromLocationName,
    calculateETA,
} = require('../services')

const { matchDriver } = require('../utils')

/**
 * Create a Ride with dynamic driver matching
 */
const createRide = async (req, res, next) => {
    const { pickupLocation, dropoffLocations } = req.body // Dropoff locations as an array
    const userId = req.user.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // Ensure user exists
        const user = await User.findById(userId).session(session)
        if (!user) throw new NotFoundError('User not found')

        // Get coordinates for pickup location
        const pickupCoordinates =
            await getCoordinatesFromLocationName(pickupLocation)
        if (!pickupCoordinates)
            throw new Error('Failed to get pickup coordinates')

        // Get coordinates for each drop-off location
        const dropoffCoordinatesArray = await Promise.all(
            dropoffLocations.map(async (location) => {
                const coordinates =
                    await getCoordinatesFromLocationName(location)
                if (!coordinates)
                    throw new Error(
                        `Failed to get coordinates for: ${location}`
                    )
                return coordinates
            })
        )

        // Match a driver
        const matchedDriver = await matchDriver(pickupCoordinates)
        if (!matchedDriver)
            throw new NotFoundError('No available drivers found in your area.')

        console.log('Driver coordinates:', matchedDriver.location.coordinates)
        console.log('Pickup coordinates:', pickupCoordinates)

        // Calculate driver-to-pickup ETA
        const driverEtaInMinutes = await calculateETA(
            matchedDriver.location.coordinates,
            pickupCoordinates
        ).catch((err) => {
            console.error('Error calculating driver ETA:', err.message)
            return 10 // Default fallback ETA
        })

        // Calculate total distance and fare for multiple drop-off locations
        let totalDistance = 0
        let prevCoordinates = pickupCoordinates

        for (const dropoffCoordinates of dropoffCoordinatesArray) {
            const distanceData = await getDistanceMatrix(
                prevCoordinates,
                dropoffCoordinates
            )
            if (!distanceData || !distanceData.distance) {
                throw new Error(
                    'Failed to calculate distance between locations.'
                )
            }
            totalDistance += distanceData.distance.value / 1000 // Meters to kilometers
            prevCoordinates = dropoffCoordinates
        }

        const fare = calculateFare(totalDistance)

        // Create the ride with multiple drop-offs
        const ride = new Ride({
            user: userId,
            driver: matchedDriver._id,
            pickupLocation: {
                type: 'Point',
                coordinates: [pickupCoordinates.lng, pickupCoordinates.lat],
            },
            dropoffLocations: dropoffCoordinatesArray.map((coords) => ({
                type: 'Point',
                coordinates: [coords.lng, coords.lat],
            })),
            fare,
            eta: driverEtaInMinutes,
            status: 'pending',
        })

        matchedDriver.status = 'onRide'
        await matchedDriver.save({ session })
        await ride.save({ session })

        await session.commitTransaction()
        session.endSession()

        res.status(StatusCodes.CREATED).json({ success: true, data: ride })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        console.error('Error in createRide:', error.message)
        next(error)
    }
}

const updateRide = async (req, res, next) => {
    const { id } = req.params
    const { pickupLocation, dropoffLocations } = req.body

    try {
        const ride = await Ride.findById(id)
        if (!ride) throw new NotFoundError('Ride not found')

        // Update pickup location if provided
        let pickupCoordinates = ride.pickupLocation.coordinates
        if (pickupLocation) {
            const newPickupCoordinates =
                await getCoordinatesFromLocationName(pickupLocation)
            if (!newPickupCoordinates)
                throw new Error('Failed to get new pickup coordinates')
            ride.pickupLocation = {
                type: 'Point',
                coordinates: [
                    newPickupCoordinates.lng,
                    newPickupCoordinates.lat,
                ],
            }
            pickupCoordinates = [
                newPickupCoordinates.lng,
                newPickupCoordinates.lat,
            ]
        }

        // Update drop-off locations if provided
        let dropoffCoordinatesArray = ride.dropoffLocations.map(
            (loc) => loc.coordinates
        )
        if (dropoffLocations) {
            const newDropoffCoordinatesArray = await Promise.all(
                dropoffLocations.map(async (location) => {
                    const coords =
                        await getCoordinatesFromLocationName(location)
                    if (!coords)
                        throw new Error(
                            `Failed to get coordinates for: ${location}`
                        )
                    return coords
                })
            )
            ride.dropoffLocations = newDropoffCoordinatesArray.map(
                (coords) => ({
                    type: 'Point',
                    coordinates: [coords.lng, coords.lat],
                })
            )
            dropoffCoordinatesArray = newDropoffCoordinatesArray.map(
                (coords) => [coords.lng, coords.lat]
            )
        }

        // Recalculate distance and fare
        let totalDistance = 0
        let prevCoordinates = pickupCoordinates

        for (const dropoffCoordinates of dropoffCoordinatesArray) {
            const distanceData = await getDistanceMatrix(prevCoordinates, {
                lat: dropoffCoordinates[1],
                lng: dropoffCoordinates[0],
            })
            if (!distanceData || !distanceData.distance) {
                throw new Error(
                    'Failed to calculate distance between locations.'
                )
            }
            totalDistance += distanceData.distance.value / 1000 // Meters to kilometers
            prevCoordinates = {
                lng: dropoffCoordinates[0],
                lat: dropoffCoordinates[1],
            }
        }

        ride.fare = calculateFare(totalDistance)

        await ride.save()
        res.status(StatusCodes.OK).json({ success: true, data: ride })
    } catch (error) {
        console.error('Error in updateRide:', error.message)
        next(error)
    }
}

const updateRideStatusByDriver = async (req, res, next) => {
    const { id } = req.params // Ride ID from the request
    const { status } = req.body // New status from the request body
    const driverId = req.user.id // Driver ID from JWT or session

    try {
        // Find the ride by ID and ensure it exists
        const ride = await Ride.findById(id)
        if (!ride) throw new NotFoundError('Ride not found')

        // Check if the driver is the assigned driver for this ride
        if (ride.driver.toString() !== driverId) {
            throw new BadRequestError('Not authorized to update this ride')
        }

        // Valid transitions map
        const validTransitions = {
            pending: 'accepted',
            accepted: 'inProgress',
            inProgress: 'completed',
            completed: 'paid', // Mark payment status as "paid" when completed
        }

        // Ensure the requested status transition is allowed
        if (
            ride.status !== status &&
            validTransitions[ride.status] !== status
        ) {
            throw new BadRequestError(
                `Cannot transition from ${ride.status} to ${status}`
            )
        }

        // Update the ride status
        ride.status = status

        if (status === 'completed') {
            ride.completedAt = Date.now() // Timestamp for completion

            // Calculate driver's earnings (80% of fare) and update wallet and debt
            const driverEarnings = ride.fare
            const companyCut = ride.fare * 0.2

            const driver = await Driver.findById(driverId)
            if (!driver) throw new NotFoundError('Driver not found')

            driver.wallet += driverEarnings
            driver.debt += companyCut // Company share recorded as debt
            driver.status = 'available' // Set status to available for new rides

            // Save driver and ride updates
            await driver.save()
            ride.driverEarnings = driverEarnings
            ride.paymentStatus = 'paid' // Mark ride payment as paid
        }

        if (status === 'inProgress') {
            ride.pickupTime = Date.now() // Set pickup time when ride starts
        }

        // Save the updated ride
        await ride.save()

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Ride status updated to ${status}`,
            data: ride,
        })
    } catch (error) {
        next(error)
    }
}

const getRideDetails = async (req, res, next) => {
    const { id } = req.params

    try {
        const ride = await Ride.findById(id)
            .populate('user', 'name email')
            .populate('driver', 'name email')

        if (!ride) throw new NotFoundError('Ride not found')

        res.status(StatusCodes.OK).json({ success: true, data: ride })
    } catch (error) {
        next(error)
    }
}

const getRideHistory = async (req, res, next) => {
    try {
        let userId, driverId

        // Check if the authenticated user is a driver or a user
        if (req.user.role === 'user') {
            userId = req.user._id
        } else if (req.user.role === 'driver') {
            driverId = req.user._id
        } else {
            throw new BadRequestError('Not authorized to access ride history')
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const rides = await Ride.find({
            ...(userId && { user: userId }),
            ...(driverId && { driver: driverId }),
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalRides = await Ride.countDocuments({
            ...(userId && { user: userId }),
            ...(driverId && { driver: driverId }),
        })

        res.status(StatusCodes.OK).json({
            success: true,
            count: rides.length,
            totalRides,
            totalPages: Math.ceil(totalRides / limit),
            currentPage: page,
            data: rides,
        })
    } catch (error) {
        next(error)
    }
}

// Get All Rides (Admin Only)
const getAllRides = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        const rides = await Ride.find()
            .populate('user', 'name email')
            .populate('driver', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalRides = await Ride.countDocuments()

        res.status(StatusCodes.OK).json({
            success: true,
            count: rides.length,
            totalRides,
            totalPages: Math.ceil(totalRides / limit),
            currentPage: page,
            data: rides,
        })
    } catch (error) {
        next(error)
    }
}

// Delete Ride (Admin Only)
const deleteRide = async (req, res, next) => {
    try {
        const ride = await Ride.findByIdAndDelete(req.params.id)
        if (!ride) {
            throw new NotFoundError('Ride not found')
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Ride deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createRide,
    updateRide,
    getRideDetails,
    getRideHistory,
    getAllRides,
    deleteRide,
    matchDriver,
    updateRideStatusByDriver,
}
