const redis = require('redis')

// Create a Redis client with exponential backoff reconnection strategy
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                // Stop retrying after 10 attempts to avoid spamming logs
                console.warn('Redis: maximum reconnect attempts reached (10), pausing retries.')
                return new Error('Too many retries to connect to Redis')
            }
            // Exponential backoff with a cap of 5000ms
            return Math.min(retries * 200, 5000)
        },
    },
})

let hasLoggedRedisError = false

redisClient.on('error', (err) => {
    // Log once concisely when offline without spamming
    if (process.env.NODE_ENV !== 'test' && !hasLoggedRedisError) {
        hasLoggedRedisError = true
        console.warn(`Redis unavailable (${err.message || 'connection failed'}). In-memory fallback mode active.`)
    }
})

redisClient.on('connect', () => {
    hasLoggedRedisError = false
    if (process.env.NODE_ENV !== 'test') {
        console.log('Connected to Redis server.')
    }
})

// Function to safely connect to Redis
const connectRedis = async () => {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect()
            if (process.env.NODE_ENV !== 'test') {
                console.log('Connected to Redis')
            }
        } catch (error) {
            if (process.env.NODE_ENV !== 'test') {
                console.warn('Redis not available, continuing with in-memory fallbacks.')
            }
        }
    }
}

module.exports = {
    redisClient,
    connectRedis,
}
