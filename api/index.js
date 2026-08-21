const mongoose = require('mongoose')
const { app } = require('../app')
const connectDB = require('../connectDB/connectDB')
const { connectRedis } = require('../utils')

let cachedDb = null

module.exports = async (req, res) => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
        return res.status(503).json({
            success: false,
            message: 'Database not configured. Please set MONGO_URI in your Vercel project Environment Variables.',
        })
    }

    try {
        if (!cachedDb || mongoose.connection.readyState !== 1) {
            cachedDb = await connectDB(mongoUri)
        }
    } catch (err) {
        console.error('Serverless MongoDB connection error:', err)
        return res.status(500).json({
            success: false,
            message: `Database connection error: ${err.message}. Please check MongoDB Atlas IP Whitelist (enable 0.0.0.0/0).`,
        })
    }

    // Connect to Redis only if remote REDIS_URL is provided (avoid blocking on localhost in serverless)
    if (process.env.REDIS_URL && !process.env.REDIS_URL.includes('127.0.0.1') && !process.env.REDIS_URL.includes('localhost')) {
        try {
            await connectRedis()
        } catch (err) {
            console.warn('Serverless Redis connection warning:', err.message)
        }
    }

    return app(req, res)
}

