require('dotenv').config() // Ensure dotenv is loaded at the start of the file
const axios = require('axios')

// Load the API key and URL from environment variables
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
const googleDistanceMatrixUrl = process.env.GOOGLE_DISTANCE_MATRIX_URL

/**
 * Calculate ETA between two coordinates using Google Maps Distance Matrix API
 * @param {Object} origin - Object with lat and lng for the starting point.
 * @param {Object} destination - Object with lat and lng for the destination point.
 * @returns {Promise<number>} - Estimated time in minutes.
 */
async function calculateETA(origin, destination) {
    try {
        const response = await axios.get(googleDistanceMatrixUrl, {
            params: {
                origins: `${origin.lng},${origin.lat}`,
                destinations: `${destination.lat},${destination.lng}`,
                key: googleMapsApiKey,
                mode: 'driving',
            },
        })

        if (response.data.rows[0].elements[0].status === 'OK') {
            const durationInSeconds =
                response.data.rows[0].elements[0].duration.value
            return Math.ceil(durationInSeconds / 60) // Convert to minutes
        } else {
            throw new Error(
                'Unable to calculate ETA - No valid response from API'
            )
        }
    } catch (error) {
        console.error('Error calculating ETA:', error.message || error)
        throw new Error(
            'Failed to calculate ETA. Please check the API key, URL, and origin/destination values.'
        )
    }
}

module.exports = calculateETA
