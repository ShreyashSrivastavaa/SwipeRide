// Load environment variables from .env file
require('dotenv').config()

// Enable async error handling for Express
require('express-async-errors')

// Sync driver locations (custom utility module)
require('./utils/syncDriverLocations')

// Core modules
const express = require('express')
const app = express()
const http = require('http')

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

// Database connection function
const connectDB = require('./connectDB/connectDB')

// Error handling middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Basic configuration and middleware setup
app.set('trust proxy', 1) // Trust the first proxy for secure HTTPS setups

// Rate limiter to control request rates (60 requests per 15 minutes)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
)

// Morgan for request logging in 'tiny' format
app.use(morgan('tiny'))

// Security middleware
app.use(helmet()) // Set secure headers
app.use(cors()) // Enable CORS for cross-origin requests
app.use(xss()) // Prevent cross-site scripting attacks
app.use(mongoSanitize()) // Sanitize MongoDB queries

// Parse JSON and serve static files
app.use(express.json())
app.use(express.static('./public'))

// File upload configuration (max size: 5MB)
app.use(
    fileUpload({
        limits: { fileSize: 5 * 1024 * 1024 },
        abortOnLimit: true, // Abort on exceeding file size limit
    })
)

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
} else {
    console.warn('Firebase configuration missing in environment variables. Skipping initialization.')
}

// Define API routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/admins', adminRoutes)
app.use('/api/v1/drivers', driverRoutes)
app.use('/api/v1/rides', rideRoutes)
app.use('/api/v1/ratings', ratingRoutes)

// Error handling routes
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Create HTTP server to handle both Express and WebSocket connections
const server = http.createServer(app)

// Initialize WebSocket server
socketServer(server)

// Server start function with database connections
const port = process.env.PORT || 5000
const start = async () => {
    try {
        // Connect to MongoDB
        await connectDB(process.env.MONGO_URI)

        // Connect to Redis
        await connectRedis()

        // Start the server
        server.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        )
    } catch (error) {
        console.error('Error starting the server:', error)
    }
}

start()
