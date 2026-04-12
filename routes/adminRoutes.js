// routes/adminRoutes.js
const express = require('express')
const {
    getAdminProfile,
    suspendDriver,
} = require('../controllers/adminController')
const { protect, isAdmin, verifyUser } = require('../middleware')

const router = express.Router()

// Admin Routes
router.get('/profile', protect, isAdmin, getAdminProfile)
// Admin can suspend/unsuspend a driver
router.put('/:id', protect, isAdmin, suspendDriver)

module.exports = router
