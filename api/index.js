const { app } = require('../app')
const connectDB = require('../connectDB/connectDB')
const { connectRedis } = require('../utils')

let isDbConnected = false

module.exports = async (req, res) => {
    try {
        if (!isDbConnected && process.env.MONGO_URI) {
            await connectDB(process.env.MONGO_URI)
            isDbConnected = true
        }
        await connectRedis()
    } catch (err) {
        console.error('Serverless init error:', err)
    }
    return app(req, res)
}
