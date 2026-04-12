const redis = require('redis')

// Create a Redis client with reconnection strategy
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6380',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                return new Error('Too many retries to connect to Redis')
            }
            // Attempt reconnect after 1 second
            return 10000
        },
    },
})

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err)
})

// Function to connect to Redis
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        // Check if the client is already connected
        try {
            await redisClient.connect()
            console.log('Connected to Redis')
        } catch (error) {
            console.error('Failed to connect to Redis', error)
        }
    }
}

// Export the client and connection function
module.exports = {
    redisClient,
    connectRedis,
}
