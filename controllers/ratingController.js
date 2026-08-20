const { StatusCodes } = require('http-status-codes')
const Rating = require('../models/Rating')
const Ride = require('../models/Ride')
const Driver = require('../models/Driver')
const { NotFoundError, BadRequestError } = require('../errors')

// Rate a Ride
const rateRide = async (req, res, next) => {
    const id = req.params.rideId || req.params.id
    const { rating, comment } = req.body
    const userId = req.user.id || req.user._id

    try {
        const ride = await Ride.findById(id)
        if (!ride) {
            throw new NotFoundError('Ride not found')
        }

        // Ensure the ride is completed before rating
        if (ride.status !== 'completed') {
            throw new BadRequestError('You can only rate a completed ride')
        }

        // Ensure the user rating the ride is the one who participated in the ride
        if (ride.user.toString() !== userId.toString()) {
            throw new BadRequestError('You are not allowed to rate this ride')
        }

        // Check if the user has already rated this ride
        const existingRating = await Rating.findOne({ ride: id, user: userId })
        if (existingRating) {
            throw new BadRequestError('You have already rated this ride')
        }

        // Create a new rating
        const newRating = new Rating({
            ride: id,
            user: userId,
            driver: ride.driver,
            rating,
            comment,
        })

        await newRating.save()

        // Update ride rating field
        ride.rating = rating
        await ride.save()

        // Update Driver's aggregated rating
        if (ride.driver) {
            const allRatings = await Rating.find({ driver: ride.driver })
            if (allRatings.length > 0) {
                const sum = allRatings.reduce((acc, r) => acc + r.rating, 0)
                const avg = sum / allRatings.length
                await Driver.findByIdAndUpdate(ride.driver, {
                    ratings: Math.round(avg * 10) / 10,
                    numOfReviews: allRatings.length,
                })
            }
        }

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Rating submitted successfully',
            data: newRating,
        })
    } catch (error) {
        next(error)
    }
}

// Get Ride Ratings
const getRideRatings = async (req, res, next) => {
    const rideId = req.params.rideId || req.params.id

    try {
        const ratings = await Rating.find({ ride: rideId }).populate('user', 'name profilePicture')
        res.status(StatusCodes.OK).json({
            success: true,
            count: ratings.length,
            data: ratings,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    rateRide,
    getRideRatings,
}
