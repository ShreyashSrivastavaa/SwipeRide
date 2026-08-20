const cron = require('node-cron')
const Driver = require('../models/Driver')
const { redisClient, connectRedis } = require('./redisClient')

// Function to sync driver locations from Redis to MongoDB
const syncDriverLocations = async () => {
    try {
        if (!redisClient.isOpen) return

        // Get all driver keys in Redis
        const driverKeys = await redisClient.keys('driver:*')

        for (const key of driverKeys) {
            const driverId = key.split(':')[1]

            // Retrieve location data from Redis
            const [lat, lng] = await redisClient.hmGet(key, 'lat', 'lng')

            if (lat && lng) {
                // Update MongoDB only if Redis has valid coordinates
                await Driver.findByIdAndUpdate(driverId, {
                    location: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                })
            }
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.warn('Warning in syncDriverLocations:', error.message)
        }
    }
}

// Initialize Redis and start the job
const startSyncJob = async () => {
    if (process.env.NODE_ENV !== 'test') {
        await connectRedis()
        cron.schedule('* * * * *', syncDriverLocations)
    }
}

startSyncJob()

module.exports = { syncDriverLocations }
