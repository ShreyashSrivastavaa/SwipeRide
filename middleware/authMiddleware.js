// middleware/authMiddleware.js
const { verifyToken } = require('../utils/jwt')
const User = require('../models/User')
const Driver = require('../models/Driver')
const Admin = require('../models/Admin')

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = verifyToken(token) // Verify the token and decode its payload

            // Find the user, driver, or admin based on the decoded payload
            req.user =
                (await User.findById(decoded.id)) ||
                (await Driver.findById(decoded.id)) ||
                (await Admin.findById(decoded.id))

            if (!req.user) {
                return res
                    .status(401)
                    .json({ message: 'Not authorized, token failed' })
            }

            next()
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' })
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' })
    }
}

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' })
    }
}

// Middleware to check if the user is a driver
const isDriver = (req, res, next) => {
    if (req.user && req.user.role === 'driver') {
        next()
    } else {
        res.status(403).json({ message: 'Not authorized as a driver' })
    }
}

// Middleware to check if the user is a normal user
const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next()
    } else {
        res.status(403).json({ message: 'Not authorized as a user' })
    }
}

const isUserOrDriver = (req, res, next) => {
    if (req.user && (req.user.role === 'user' || req.user.role === 'driver')) {
        next() // Pass to the next middleware/controller if the role is valid
    } else {
        res.status(403).json({ message: 'Not authorized as a user or driver' })
    }
}

module.exports = { protect, isAdmin, isDriver, isUser, isUserOrDriver }
