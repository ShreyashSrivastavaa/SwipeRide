const axios = require('axios')

// Helper functions

// Function to get coordinates from location name using Google Geocoding API
const getCoordinatesFromLocationName = async (locationName) => {
    try {
        const apiUrl = process.env.GOOGLE_GEOCODE_URL
        const apiKey = process.env.GOOGLE_MAPS_API_KEY
        const url = `${apiUrl}?address=${encodeURIComponent(locationName)}&key=${apiKey}`

        const response = await axios.get(url)
        const data = response.data

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location
            return { lat: location.lat, lng: location.lng }
        } else {
            throw new Error(`Location not found: ${locationName}`)
        }
    } catch (error) {
        console.error(
            `Error in getCoordinatesFromLocationName: ${error.message}`
        )
        if (error.response) {
            console.error('Response data:', error.response.data)
        }
        throw new Error(
            'Failed to fetch coordinates from Google Maps API. Please try again later.'
        )
    }
}

// Function to get distance using Google Distance Matrix API
const getDistanceMatrix = async (pickupCoordinates, dropoffCoordinates) => {
    try {
        const apiUrl = process.env.GOOGLE_DISTANCE_MATRIX_URL
        const apiKey = process.env.GOOGLE_MAPS_API_KEY
        const url = `${apiUrl}?origins=${pickupCoordinates.lat},${pickupCoordinates.lng}&destinations=${dropoffCoordinates.lat},${dropoffCoordinates.lng}&key=${apiKey}`

        const response = await axios.get(url)
        const data = response.data

        if (
            data.status === 'OK' &&
            data.rows.length > 0 &&
            data.rows[0].elements.length > 0
        ) {
            return data.rows[0].elements[0]
        } else {
            throw new Error(
                'Distance calculation failed. Please check the locations and try again.'
            )
        }
    } catch (error) {
        console.error(`Error in getDistanceMatrix: ${error.message}`)
        if (error.response) {
            console.error('Response data:', error.response.data)
        }
        throw new Error(
            'Failed to calculate distance from Google Maps API. Please try again later.'
        )
    }
}

// Function to calculate fare in Naira (based on distance)
const calculateFare = (distanceInKm) => {
    try {
        const baseFare = parseFloat(process.env.BASE_FARE) // Base fare in Naira
        const costPerKm = parseFloat(process.env.COST_PER_KM) // Cost per kilometer in Naira
        if (isNaN(baseFare) || isNaN(costPerKm)) {
            throw new Error(
                'Invalid fare configuration. Please check environment variables.'
            )
        }
        const fare = baseFare + costPerKm * distanceInKm
        return Math.round(fare)
    } catch (error) {
        console.error(`Error in calculateFare: ${error.message}`)
        throw new Error('Failed to calculate fare. Please contact support.')
    }
}

module.exports = {
    calculateFare,
    getDistanceMatrix,
    getCoordinatesFromLocationName,
}
