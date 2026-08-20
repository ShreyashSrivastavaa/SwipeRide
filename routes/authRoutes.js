// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const {
    registerUser,
    registerDriver,
    registerAdmin,
    login,
    requestOtp,
    verifyOtp,
    logout,
} = require('../controllers/authController')

const { validate } = require('../middleware')
const {
    userValidator,
    registerDriverValidator,
    adminValidator,
    loginValidator,
    otpValidator,
    sendOtpValidator,
} = require('../validators')

// Auth Routes
router.post('/user', validate(userValidator), registerUser)
router.post('/driver', validate(registerDriverValidator), registerDriver)
router.post('/admin', validate(adminValidator), registerAdmin)
router.post('/login', validate(loginValidator), login)
router.post('/send-otp', validate(sendOtpValidator), requestOtp)
router.post('/verify-otp', validate(otpValidator), verifyOtp)
router.post('/logout', logout)

module.exports = router
