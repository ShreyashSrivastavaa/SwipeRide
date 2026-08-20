// Load environment variables from .env file
require('dotenv').config()

// Enable async error handling for Express
require('express-async-errors')

// Sync driver locations
require('./utils/syncDriverLocations')

// Core modules
const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const fs = require('fs')

// Utility modules
const { connectRedis } = require('./utils')
const socketServer = require('./utils/socketServer')

// Middleware modules
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

// Firebase Admin SDK
const admin = require('firebase-admin')

// Route modules
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const driverRoutes = require('./routes/driverRoutes')
const rideRoutes = require('./routes/rideRoutes')
const ratingRoutes = require('./routes/ratingsRoute')
const uploadRoutes = require('./routes/uploadRoutes')

// Database connection function
const connectDB = require('./connectDB/connectDB')

// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Basic configuration
app.set('trust proxy', 1)

// Morgan logging (disabled in test)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('tiny'))
}

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors())
app.use(xss())
app.use(mongoSanitize())

// Parse JSON
app.use(express.json())

// Ensure public and uploads directories exist
const publicDir = path.join(__dirname, 'public')
const uploadsDir = path.join(publicDir, 'uploads')
const clientDistDir = path.join(__dirname, 'client', 'dist')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// Serve static files
app.use(express.static(publicDir))
if (fs.existsSync(clientDistDir)) {
    app.use(express.static(clientDistDir))
}

// File upload configuration (max size: 5MB)
app.use(
    fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true,
    })
)

// Rate limiters: Split into strict auth limiter and general API limiter
const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts. Please try again later.' },
    skip: () => process.env.NODE_ENV === 'test',
})

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 300, // 300 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' },
    skip: (req) =>
        process.env.NODE_ENV === 'test' ||
        req.path.includes('/location') ||
        req.path.includes('/status'),
})

// Firebase setup
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

if (firebaseConfig.projectId && firebaseConfig.privateKey) {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        projectId: firebaseConfig.projectId,
    })
} else if (process.env.NODE_ENV !== 'test') {
    console.warn('Firebase configuration missing in environment variables. Skipping initialization.')
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'SwipeRide API', timestamp: new Date().toISOString() })
})

// Define API routes with rate limiters
app.use('/api/v1/auth', authLimiter, authRoutes)
app.use('/api/v1/users', apiLimiter, userRoutes)
app.use('/api/v1/admins', apiLimiter, adminRoutes)
app.use('/api/v1/drivers', apiLimiter, driverRoutes)
app.use('/api/v1/rides', apiLimiter, rideRoutes)
app.use('/api/v1/ratings', apiLimiter, ratingRoutes)
app.use('/api/v1/upload', apiLimiter, uploadRoutes)

// SPA frontend fallback
if (fs.existsSync(clientDistDir)) {
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/ws') || req.path.startsWith('/uploads')) {
            return next()
        }
        res.sendFile(path.join(clientDistDir, 'index.html'))
    })
}

// Error handling routes
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Create HTTP server
const server = http.createServer(app)

// Initialize WebSocket server
socketServer(server)

// Server start function
const port = process.env.PORT || 5000
const start = async () => {
    try {
        if (process.env.MONGO_URI) {
            await connectDB(process.env.MONGO_URI)
        }
        await connectRedis()
        server.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        )
    } catch (error) {
        console.error('Error starting the server:', error)
    }
}

if (require.main === module && process.env.NODE_ENV !== 'test') {
    start()
}

module.exports = { app, server, start }
