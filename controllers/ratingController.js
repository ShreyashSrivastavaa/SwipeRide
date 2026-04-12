const { StatusCodes } = require('http-status-codes')
const Rating = require('../models/Rating')
const Ride = require('../models/Ride')
const { NotFoundError, BadRequestError } = require('../errors')

// Rate a Ride
const rateRide = async (req, res, next) => {
    const { id } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id // Get the userId from the authenticated session

    try {
        const ride = await Ride.findById(id)
        if (!ride) {
            throw new NotFoundError('Ride not found')
        }

        // Ensure the user rating the ride is the one who participated in the ride
        if (ride.user.toString() !== userId) {
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
            driver: ride.driver, // Assuming the ride document has the driver info
            rating,
            comment,
        })

        await newRating.save()

        res.status(StatusCodes.CREATED).json({ success: true, data: newRating })
    } catch (error) {
        next(error)
    }
}

// Get Ride Ratings
const getRideRatings = async (req, res, next) => {
    const { rideId } = req.params

    try {
        const ratings = await Rating.find({ ride: rideId })
        if (ratings.length === 0) {
            throw new NotFoundError('No ratings found for this ride')
        }

        res.status(StatusCodes.OK).json({ success: true, data: ratings })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    rateRide,
    getRideRatings,
}
