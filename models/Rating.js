const mongoose = require('mongoose')

// Define the Rating/Review Schema
const ratingSchema = new mongoose.Schema(
    {
        // The numeric rating between 1 and 5 that the user gives the driver/ride.
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide a rating between 1 and 5'],
        },

        // A detailed comment where the user can describe their experience.
        comment: {
            type: String,
            required: [true, 'Please provide review text'],
            maxlength: 500,
        },

        // The user who gave the rating.
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },

        // The driver being reviewed or rated.
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'Driver',
            required: true,
        },

        // The ride that the review is associated with.
        ride: {
            type: mongoose.Schema.ObjectId,
            ref: 'Ride',
            required: true,
        },
    },

    // Automatically include createdAt and updatedAt timestamps for the review.
    { timestamps: true }
)

// Create an index to ensure a user can only review a driver once per ride (unique combination of ride and user).
ratingSchema.index({ ride: 1, user: 1 }, { unique: true })

/**
 * Calculate and update the driver's average rating and number of reviews.
 */
ratingSchema.statics.calculateAverageRating = async function (driverId) {
    const result = await this.aggregate([
        { $match: { driver: driverId } }, // Filter ratings for the specific driver
        {
            $group: {
                _id: null, // Group results
                averageRating: { $avg: '$rating' }, // Calculate average rating
                numOfReviews: { $sum: 1 }, // Count the number of reviews
            },
        },
    ])

    try {
        // Update the Driver's average rating and total reviews
        await this.model('Driver').findOneAndUpdate(
            { _id: driverId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        )
    } catch (error) {
        console.error('Error calculating average rating:', error)
    }
}

/**
 * Post-save hook: After a review is saved, recalculate the average rating for the driver.
 */
ratingSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.driver)
})

/**
 * Post-remove hook: After a review is removed, recalculate the average rating for the driver.
 */
ratingSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.driver)
})

// Export the Rating model
module.exports = mongoose.model('Rating', ratingSchema)
