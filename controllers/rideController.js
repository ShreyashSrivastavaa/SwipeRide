const { StatusCodes } = require('http-status-codes')
const Ride = require('../models/Ride')
const User = require('../models/User')
const Driver = require('../models/Driver')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors')
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
    const { pickupLocation, dropoffLocations } = req.body
    const userId = req.user._id || req.user.id

    try {
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError('User not found')

        // Normalize dropoff locations array
        const rawDropoffs = Array.isArray(dropoffLocations)
            ? dropoffLocations
            : [dropoffLocations]

        if (!rawDropoffs.length || !rawDropoffs[0]) {
            throw new BadRequestError('At least one drop-off location is required')
        }

        // Get coordinates for pickup location
        const pickupCoordinates =
            await getCoordinatesFromLocationName(pickupLocation)
        if (!pickupCoordinates)
            throw new BadRequestError('Failed to get pickup coordinates')

        // Get coordinates for each drop-off location
        const dropoffCoordinatesArray = await Promise.all(
            rawDropoffs.map(async (location) => {
                const coordinates =
                    await getCoordinatesFromLocationName(location)
                if (!coordinates)
                    throw new BadRequestError(
                        `Failed to get coordinates for: ${location}`
                    )
                return coordinates
            })
        )

        // Match a driver
        const matchedDriver = await matchDriver(pickupCoordinates)
        if (!matchedDriver)
            throw new NotFoundError('No available drivers found in your area.')

        // Calculate driver-to-pickup ETA
        const driverEtaInMinutes = await calculateETA(
            matchedDriver.location?.coordinates || pickupCoordinates,
            pickupCoordinates
        ).catch(() => 5)

        // Calculate total distance and fare
        let totalDistance = 0
        let prevCoordinates = pickupCoordinates

        for (const dropoffCoordinates of dropoffCoordinatesArray) {
            const distanceData = await getDistanceMatrix(
                prevCoordinates,
                dropoffCoordinates
            )
            if (!distanceData || !distanceData.distance) {
                throw new BadRequestError(
                    'Failed to calculate distance between locations.'
                )
            }
            totalDistance += distanceData.distance.value / 1000 // Meters to km
            prevCoordinates = dropoffCoordinates
        }

        const fare = calculateFare(totalDistance)

        // Create the ride
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
            distance: Math.round(totalDistance * 10) / 10,
            duration: Math.ceil((totalDistance / 30) * 60),
            fare,
            eta: driverEtaInMinutes,
            status: 'pending',
        })

        matchedDriver.status = 'onRide'
        await matchedDriver.save()
        await ride.save()

        const populatedRide = await Ride.findById(ride._id)
            .populate('user', 'name phone email profilePicture')
            .populate('driver', 'name phone email profilePicture motorcycleType motorcycleColor motorcycleNumber ratings')

        res.status(StatusCodes.CREATED).json({
            success: true,
            data: populatedRide,
        })
    } catch (error) {
        next(error)
    }
}

const updateRide = async (req, res, next) => {
    const { id } = req.params
    const { pickupLocation, dropoffLocations } = req.body
    const userId = req.user._id || req.user.id

    try {
        const ride = await Ride.findById(id)
        if (!ride) throw new NotFoundError('Ride not found')

        if (ride.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            throw new UnauthorizedError('Not authorized to update this ride')
        }

        if (ride.status !== 'pending') {
            throw new BadRequestError('Only pending rides can be edited')
        }

        let pickupCoordinates = {
            lng: ride.pickupLocation.coordinates[0],
            lat: ride.pickupLocation.coordinates[1],
        }

        if (pickupLocation) {
            const newPickupCoordinates =
                await getCoordinatesFromLocationName(pickupLocation)
            if (newPickupCoordinates) {
                ride.pickupLocation = {
                    type: 'Point',
                    coordinates: [
                        newPickupCoordinates.lng,
                        newPickupCoordinates.lat,
                    ],
                }
                pickupCoordinates = newPickupCoordinates
            }
        }

        let dropoffCoordinatesArray = ride.dropoffLocations.map((loc) => ({
            lng: loc.coordinates[0],
            lat: loc.coordinates[1],
        }))

        if (dropoffLocations) {
            const rawDropoffs = Array.isArray(dropoffLocations)
                ? dropoffLocations
                : [dropoffLocations]

            dropoffCoordinatesArray = await Promise.all(
                rawDropoffs.map(async (loc) => {
                    const coords = await getCoordinatesFromLocationName(loc)
                    return coords
                })
            )

            ride.dropoffLocations = dropoffCoordinatesArray.map((coords) => ({
                type: 'Point',
                coordinates: [coords.lng, coords.lat],
            }))
        }

        // Recalculate distance and fare
        let totalDistance = 0
        let prevCoordinates = pickupCoordinates

        for (const dropoffCoordinates of dropoffCoordinatesArray) {
            const distanceData = await getDistanceMatrix(
                prevCoordinates,
                dropoffCoordinates
            )
            if (distanceData && distanceData.distance) {
                totalDistance += distanceData.distance.value / 1000
            }
            prevCoordinates = dropoffCoordinates
        }

        ride.distance = Math.round(totalDistance * 10) / 10
        ride.fare = calculateFare(totalDistance)
        await ride.save()

        const updated = await Ride.findById(ride._id)
            .populate('user', 'name phone email')
            .populate('driver', 'name phone email motorcycleType motorcycleColor motorcycleNumber ratings')

        res.status(StatusCodes.OK).json({ success: true, data: updated })
    } catch (error) {
        next(error)
    }
}

const updateRideStatusByDriver = async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body
    const driverId = (req.user._id || req.user.id).toString()

    try {
        const ride = await Ride.findById(id)
        if (!ride) throw new NotFoundError('Ride not found')

        if (ride.driver.toString() !== driverId && req.user.role !== 'admin') {
            throw new BadRequestError('Not authorized to update this ride')
        }

        const validTransitions = {
            pending: ['accepted', 'canceled'],
            accepted: ['inProgress', 'canceled'],
            inProgress: ['completed', 'canceled'],
            completed: [],
            canceled: [],
        }

        const allowed = validTransitions[ride.status] || []
        if (!allowed.includes(status) && ride.status !== status) {
            throw new BadRequestError(
                `Cannot transition ride status from ${ride.status} to ${status}`
            )
        }

        ride.status = status

        if (status === 'completed') {
            ride.completedAt = Date.now()
            const driverEarnings = Math.round(ride.fare * 0.8)
            const companyCut = ride.fare - driverEarnings

            const driver = await Driver.findById(ride.driver)
            if (driver) {
                driver.wallet = (driver.wallet || 0) + driverEarnings
                driver.debt = (driver.debt || 0) + companyCut
                driver.status = 'available'
                await driver.save()
            }

            ride.driverEarnings = driverEarnings
            ride.paymentStatus = 'paid'
        } else if (status === 'canceled') {
            const driver = await Driver.findById(ride.driver)
            if (driver) {
                driver.status = 'available'
                await driver.save()
            }
        }

        await ride.save()

        const updatedRide = await Ride.findById(ride._id)
            .populate('user', 'name phone email profilePicture')
            .populate('driver', 'name phone email profilePicture motorcycleType motorcycleColor motorcycleNumber ratings')

        res.status(StatusCodes.OK).json({
            success: true,
            message: `Ride status updated to ${status}`,
            data: updatedRide,
        })
    } catch (error) {
        next(error)
    }
}

const getRideDetails = async (req, res, next) => {
    const { id } = req.params
    const userId = (req.user._id || req.user.id).toString()

    try {
        const ride = await Ride.findById(id)
            .populate('user', 'name email phone profilePicture')
            .populate('driver', 'name email phone profilePicture motorcycleType motorcycleColor motorcycleNumber ratings')

        if (!ride) throw new NotFoundError('Ride not found')

        // Authorization check: user, assigned driver, or admin
        const isRider = ride.user?._id?.toString() === userId || ride.user?.toString() === userId
        const isDriver = ride.driver?._id?.toString() === userId || ride.driver?.toString() === userId
        const isAdmin = req.user.role === 'admin'

        if (!isRider && !isDriver && !isAdmin) {
            throw new UnauthorizedError('Not authorized to view this ride detail')
        }

        res.status(StatusCodes.OK).json({ success: true, data: ride })
    } catch (error) {
        next(error)
    }
}

const getRideHistory = async (req, res, next) => {
    try {
        let filter = {}
        const userId = req.user._id || req.user.id

        if (req.user.role === 'user') {
            filter.user = userId
        } else if (req.user.role === 'driver') {
            filter.driver = userId
        } else if (req.user.role === 'admin') {
            // Admin can see all or filter by query
            if (req.query.user) filter.user = req.query.user
            if (req.query.driver) filter.driver = req.query.driver
        } else {
            throw new BadRequestError('Not authorized to access ride history')
        }

        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.max(1, Number(req.query.limit) || 10)
        const skip = (page - 1) * limit

        const rides = await Ride.find(filter)
            .populate('user', 'name phone email profilePicture')
            .populate('driver', 'name phone email profilePicture motorcycleType motorcycleColor motorcycleNumber ratings')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalRides = await Ride.countDocuments(filter)

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
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.max(1, Number(req.query.limit) || 10)
        const skip = (page - 1) * limit

        const rides = await Ride.find()
            .populate('user', 'name email phone')
            .populate('driver', 'name email phone motorcycleNumber')
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
