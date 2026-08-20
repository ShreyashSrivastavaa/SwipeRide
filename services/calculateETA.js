require('dotenv').config()
const axios = require('axios')

/**
 * Normalize coordinate input from GeoJSON [lng, lat] or {lat, lng} object
 */
const normalizeCoords = (c) => {
    if (!c) return { lat: 6.5244, lng: 3.3792 } // Lagos default
    if (Array.isArray(c) && c.length >= 2) {
        return { lng: Number(c[0]), lat: Number(c[1]) }
    }
    if (typeof c === 'object') {
        return {
            lat: Number(c.lat ?? c.latitude ?? 6.5244),
            lng: Number(c.lng ?? c.longitude ?? 3.3792),
        }
    }
    return { lat: 6.5244, lng: 3.3792 }
}

/**
 * Haversine formula to calculate approximate distance in km
 */
const calculateHaversineDistance = (p1, p2) => {
    const R = 6371 // Earth radius in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((p1.lat * Math.PI) / 180) *
            Math.cos((p2.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

/**
 * Calculate ETA between two points (in minutes)
 */
async function calculateETA(origin, destination) {
    const orig = normalizeCoords(origin)
    const dest = normalizeCoords(destination)

    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
    const googleDistanceMatrixUrl =
        process.env.GOOGLE_DISTANCE_MATRIX_URL ||
        'https://maps.googleapis.com/maps/api/distancematrix/json'

    if (googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        try {
            const response = await axios.get(googleDistanceMatrixUrl, {
                params: {
                    origins: `${orig.lat},${orig.lng}`,
                    destinations: `${dest.lat},${dest.lng}`,
                    key: googleMapsApiKey,
                    mode: 'driving',
                },
                timeout: 3000,
            })

            if (
                response.data?.rows?.[0]?.elements?.[0]?.status === 'OK' &&
                response.data.rows[0].elements[0].duration
            ) {
                const durationInSeconds =
                    response.data.rows[0].elements[0].duration.value
                return Math.max(1, Math.ceil(durationInSeconds / 60))
            }
        } catch (error) {
            console.warn('Google Maps ETA API request failed, using haversine fallback:', error.message)
        }
    }

    // Fallback: Haversine distance assuming 30 km/h average motorcycle city speed
    const distanceKm = calculateHaversineDistance(orig, dest)
    // Avg city speed ~30 km/h with 1.25 road curvature factor
    const roadDistanceKm = distanceKm * 1.25
    const minutes = Math.max(1, Math.ceil((roadDistanceKm / 30) * 60))
    return minutes
}

module.exports = calculateETA
