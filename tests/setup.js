const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

jest.setTimeout(60000)

let mongoServer

const connectTestDB = async () => {
    // 1. Try local MongoDB if running
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/swiperide_test', {
            serverSelectionTimeoutMS: 2000,
        })
        return
    } catch (localErr) {
        // Fallback to MongoMemoryServer
    }

    try {
        mongoServer = await MongoMemoryServer.create()
        const uri = mongoServer.getUri()
        await mongoose.connect(uri)
    } catch (err) {
        console.warn('Test DB connection warning:', err.message)
    }
}

const clearTestDB = async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            await collections[key].deleteMany({})
        }
    }
}

const closeTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase().catch(() => {})
        await mongoose.connection.close().catch(() => {})
    }
    if (mongoServer) {
        await mongoServer.stop().catch(() => {})
    }
}

module.exports = {
    connectTestDB,
    clearTestDB,
    closeTestDB,
}
