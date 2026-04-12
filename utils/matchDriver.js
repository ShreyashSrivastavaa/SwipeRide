const Driver = require('../models/Driver')

/**
 * Match drivers based on dynamic radius and select best driver using criteria (ratings, proximity).
 */
const matchDriver = async (
    pickupCoordinates,
    maxRadius = 2,
    stepRadius = 1
) => {
    let radius = stepRadius // start with a small radius (in km)
    let matchedDriver = null

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
            status: 'available', // Only drivers that are available
        })
            .sort({ ratings: -1, numOfReviews: -1 }) // Sort by best driver criteria (ratings and reviews)
            .select(
                '_id name phone profilePicture motorcycleType motorcycleColor motorcycleNumber ratings status location'
            )

        console.log('Available drivers within radius:', availableDrivers)

        if (availableDrivers.length > 0) {
            // Assign the best driver (e.g., first one based on the sort)
            matchedDriver = availableDrivers[0]
            break
        }

        // If no driver is found, increase the search radius
        radius += stepRadius
    }

    return matchedDriver
}

module.exports = matchDriver
