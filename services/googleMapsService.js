const axios = require('axios')

/**
 * Normalize coordinate input
 */
const normalizeCoords = (c) => {
    if (!c) return { lat: 6.5244, lng: 3.3792 }
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

// Function to get coordinates from location name using Google Geocoding API (or mock/fallback)
const getCoordinatesFromLocationName = async (locationName) => {
    if (!locationName) {
        throw new Error('Location name is required')
    }

    // Check if locationName is already coordinates format (e.g. "6.5244,3.3792" or "lat,lng")
    if (typeof locationName === 'string' && locationName.includes(',')) {
        const parts = locationName.split(',').map((p) => parseFloat(p.trim()))
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            return { lat: parts[0], lng: parts[1] }
        }
    }

    const apiUrl =
        process.env.GOOGLE_GEOCODE_URL ||
        'https://maps.googleapis.com/maps/api/geocode/json'
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        try {
            const url = `${apiUrl}?address=${encodeURIComponent(locationName)}&key=${apiKey}`
            const response = await axios.get(url, { timeout: 3000 })
            const data = response.data

            if (data.status === 'OK' && data.results.length > 0) {
                const location = data.results[0].geometry.location
                return { lat: location.lat, lng: location.lng }
            }
        } catch (error) {
            console.warn('Geocoding API request failed, using deterministic coordinate fallback:', error.message)
        }
    }

    // Known landmark fallbacks (e.g. Lagos, Abuja, New York, etc.)
    const knownLocations = {
        'victoria island': { lat: 6.4281, lng: 3.4219 },
        'ikeja': { lat: 6.6018, lng: 3.3515 },
        'lekki': { lat: 6.4698, lng: 3.5852 },
        'yaba': { lat: 6.5167, lng: 3.3853 },
        'surulere': { lat: 6.4975, lng: 3.3556 },
        'marina': { lat: 6.4531, lng: 3.3958 },
        'lagos': { lat: 6.5244, lng: 3.3792 },
        'abuja': { lat: 9.0765, lng: 7.3986 },
        'central park': { lat: 40.785091, lng: -73.968285 },
        'times square': { lat: 40.758896, lng: -73.985130 },
    }

    const lower = locationName.toLowerCase()
    for (const [key, coords] of Object.entries(knownLocations)) {
        if (lower.includes(key)) {
            return coords
        }
    }

    // Deterministic pseudo-coordinates based on string hash for testing
    let hash = 0
    for (let i = 0; i < locationName.length; i++) {
        hash = (hash << 5) - hash + locationName.charCodeAt(i)
        hash |= 0
    }
    const latOffset = ((Math.abs(hash) % 1000) / 10000) * 0.1
    const lngOffset = ((Math.abs(hash * 31) % 1000) / 10000) * 0.1

    return {
        lat: 6.5244 + latOffset,
        lng: 3.3792 + lngOffset,
    }
}

// Function to get distance using Google Distance Matrix API (or Haversine fallback)
const getDistanceMatrix = async (pickupCoordinates, dropoffCoordinates) => {
    const orig = normalizeCoords(pickupCoordinates)
    const dest = normalizeCoords(dropoffCoordinates)

    const apiUrl =
        process.env.GOOGLE_DISTANCE_MATRIX_URL ||
        'https://maps.googleapis.com/maps/api/distancematrix/json'
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        try {
            const url = `${apiUrl}?origins=${orig.lat},${orig.lng}&destinations=${dest.lat},${dest.lng}&key=${apiKey}`
            const response = await axios.get(url, { timeout: 3000 })
            const data = response.data

            if (
                data.status === 'OK' &&
                data.rows.length > 0 &&
                data.rows[0].elements.length > 0 &&
                data.rows[0].elements[0].status === 'OK'
            ) {
                return data.rows[0].elements[0]
            }
        } catch (error) {
            console.warn('Distance Matrix API request failed, using haversine fallback:', error.message)
        }
    }

    // Fallback calculation
    const distanceKm = calculateHaversineDistance(orig, dest) * 1.25 // road curvature
    const distanceMeters = Math.round(distanceKm * 1000)
    const durationSeconds = Math.round((distanceKm / 30) * 3600) // ~30km/h avg motorcycle speed

    return {
        distance: {
            text: `${(distanceKm).toFixed(1)} km`,
            value: Math.max(500, distanceMeters),
        },
        duration: {
            text: `${Math.ceil(durationSeconds / 60)} mins`,
            value: Math.max(60, durationSeconds),
        },
        status: 'OK',
    }
}

// Function to calculate fare in Naira (based on distance)
const calculateFare = (distanceInKm) => {
    const baseFare = parseFloat(process.env.BASE_FARE) || 300 // Base fare in Naira
    const costPerKm = parseFloat(process.env.COST_PER_KM) || 150 // Cost per kilometer in Naira
    const dist = Math.max(0.5, Number(distanceInKm) || 1)
    const fare = baseFare + costPerKm * dist
    return Math.round(fare)
}

module.exports = {
    calculateFare,
    getDistanceMatrix,
    getCoordinatesFromLocationName,
}
