// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const {
    registerUser,
    registerDriver,
    registerAdmin,
    login,
    logout,
} = require('../controllers/authController')

// Import the validate middleware
const { validate } = require('../middleware')
const {
    userValidator,
    registerDriverValidator,
    adminValidator,
    loginValidator,
} = require('../validators')

// Auth Routes
router.post('/user', validate(userValidator), registerUser)
router.post('/driver', validate(registerDriverValidator), registerDriver)
router.post('/admin', validate(adminValidator), registerAdmin)
router.post('/login', validate(loginValidator), login)
router.post('/logout', logout)

module.exports = router
