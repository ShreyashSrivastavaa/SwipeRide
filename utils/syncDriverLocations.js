const cron = require('node-cron')
const Driver = require('../models/Driver') // Your Driver model
const { redisClient, connectRedis } = require('./redisClient') // Redis client and connection function

// Function to sync driver locations from Redis to MongoDB
const syncDriverLocations = async () => {
    try {
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

        console.log('Driver locations synced from Redis to MongoDB')
    } catch (error) {
        console.error('Error syncing driver locations:', error)
    }
}

// Initialize Redis and start the job
const startSyncJob = async () => {
    await connectRedis() // Ensure Redis is connected
    cron.schedule('* * * * *', syncDriverLocations) // Schedule sync job to run every minute
}

startSyncJob() // Start the sync job
