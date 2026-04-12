const express = require('express')
const router = express.Router()
const { rateRide, getRideRatings } = require('../controllers/ratingController')
const { protect, isUser } = require('../middleware')
const validate = require('../middleware/validateMiddleware') // Ensure this points to the updated middleware
const ratingValidator = require('../validators/ratingValidator') // Ensure correct path to the validator

// Rate a Ride
router.post(
    '/:rideId/rate',
    protect,
    isUser,
    validate(ratingValidator),
    rateRide
)

// Get Ratings for a Ride
router.get('/:rideId/ratings', getRideRatings)

module.exports = router
