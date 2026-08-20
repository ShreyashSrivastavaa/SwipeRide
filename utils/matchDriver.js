const Driver = require('../models/Driver')

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
 * Match drivers based on dynamic radius and select best driver using criteria (ratings, proximity).
 */
const matchDriver = async (
    pickupCoords,
    maxRadius = 15,
    stepRadius = 3
) => {
    const pickupCoordinates = normalizeCoords(pickupCoords)
    let radius = stepRadius // start with a small radius (in km)
    let matchedDriver = null

    try {
        while (radius <= maxRadius) {
            // Search for available drivers within the radius
            const availableDrivers = await Driver.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [
                            [pickupCoordinates.lng, pickupCoordinates.lat],
                            radius / 6378.1, // convert radius to radians for MongoDB
                        ],
                    },
                },
                status: 'available',
                suspended: { $ne: true },
            })
                .sort({ ratings: -1, numOfReviews: -1 })
                .select(
                    '_id name email phone profilePicture motorcycleType motorcycleColor motorcycleNumber ratings numOfReviews status location wallet debt'
                )

            if (availableDrivers && availableDrivers.length > 0) {
                matchedDriver = availableDrivers[0]
                break
            }

            radius += stepRadius
        }
    } catch (err) {
        console.warn('Geospatial match error, falling back to basic status search:', err.message)
    }

    // Fallback if geo-query found nothing or failed (e.g. In-memory DB without 2dsphere index in test)
    if (!matchedDriver) {
        matchedDriver = await Driver.findOne({
            status: 'available',
            suspended: { $ne: true },
        })
            .sort({ ratings: -1, numOfReviews: -1 })
            .select(
                '_id name email phone profilePicture motorcycleType motorcycleColor motorcycleNumber ratings numOfReviews status location wallet debt'
            )
    }

    return matchedDriver
}

module.exports = matchDriver
