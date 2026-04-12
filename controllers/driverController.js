const { StatusCodes } = require('http-status-codes')
const Driver = require('../models/Driver')
const { NotFoundError } = require('../errors')
const Ride = require('../models/Ride')

// Get Driver Profile
const getDriverProfile = async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.user.id).select('-password')
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }
        res.status(StatusCodes.OK).json({ success: true, data: driver })
    } catch (error) {
        next(error)
    }
}

// Get All Drivers (Admin Only)
const getAllDrivers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1
        const limit = parseInt(req.query.limit, 10) || 10
        const startIndex = (page - 1) * limit

        const drivers = await Driver.find()
            .select('-password')
            .skip(startIndex)
            .limit(limit)

        res.status(StatusCodes.OK).json({
            success: true,
            count: drivers.length,
            data: drivers,
        })
    } catch (error) {
        next(error)
    }
}

// Update Driver Status
const updateDriverStatus = async (req, res, next) => {
    const { status } = req.body

    try {
        const driver = await Driver.findById(req.user.id)
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }

        driver.status = status
        driver.lastActiveAt = Date.now()

        await driver.save()

        res.status(StatusCodes.OK).json({ success: true, data: driver })
    } catch (error) {
        next(error)
    }
}

const updateDriverLocation = async (req, res, next) => {
    const { coordinates } = req.body

    try {
        if (!coordinates || coordinates.length !== 2) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message:
                    'Coordinates must be provided in [longitude, latitude] format.',
            })
        }

        const driver = await Driver.findById(req.user.id)
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }

        driver.location.coordinates = coordinates
        driver.lastActiveAt = Date.now() // Optional: Track the last update time

        await driver.save()

        res.status(StatusCodes.OK).json({ success: true, data: driver })
    } catch (error) {
        next(error)
    }
}

// Update Driver Profile by ID
const updateDriverProfile = async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.params.id)
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                driver[key] = req.body[key]
            }
        })

        await driver.save()

        res.status(StatusCodes.OK).json({ success: true, data: driver })
    } catch (error) {
        next(error)
    }
}

const getDriverWalletBalance = async (req, res, next) => {
    try {
        const driverId = req.user._id
        const driver = await Driver.findById(driverId)

        if (!driver) throw new NotFoundError('Driver not found')

        res.status(StatusCodes.OK).json({
            success: true,
            walletBalance: driver.wallet,
        })
    } catch (error) {
        next(error)
    }
}

const getDriverEarningsWithDateFilter = async (req, res, next) => {
    try {
        const driverId = req.user._id // Ensure the driver is authenticated
        const { startDate, endDate } = req.query

        const query = { driver: driverId, status: 'completed' }

        // Add date filters if provided
        if (startDate) query.completedAt = { $gte: new Date(startDate) }
        if (endDate)
            query.completedAt = {
                ...query.completedAt,
                $lte: new Date(endDate),
            }

        const completedRides = await Ride.find(query)

        const totalEarnings = completedRides.reduce((sum, ride) => {
            return sum + (ride.driverEarnings || 0)
        }, 0)

        res.status(StatusCodes.OK).json({
            success: true,
            totalEarnings,
            rideCount: completedRides.length,
            rides: completedRides,
        })
    } catch (error) {
        next(error)
    }
}

const getDriverEarningsReport = async (req, res, next) => {
    try {
        const driverId = req.user._id
        const { reportType } = req.query // daily or weekly

        let groupBy
        if (reportType === 'daily') {
            groupBy = {
                $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
            }
        } else if (reportType === 'weekly') {
            groupBy = { $week: '$completedAt' }
        } else {
            throw new BadRequestError(
                'Invalid reportType. Use "daily" or "weekly".'
            )
        }

        const earningsReport = await Ride.aggregate([
            { $match: { driver: driverId, status: 'completed' } },
            {
                $group: {
                    _id: groupBy,
                    totalEarnings: { $sum: '$driverEarnings' },
                    rideCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }, // Sort by date or week
        ])

        res.status(StatusCodes.OK).json({
            success: true,
            reportType,
            earningsReport,
        })
    } catch (error) {
        next(error)
    }
}

// Delete Driver
const deleteDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id)
        if (!driver) {
            throw new NotFoundError('Driver not found')
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Driver account deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllDrivers,
    getDriverProfile,
    updateDriverProfile,
    updateDriverStatus,
    deleteDriver,
    updateDriverLocation,
    getDriverWalletBalance,
    getDriverEarningsReport,
    getDriverEarningsWithDateFilter,
}
