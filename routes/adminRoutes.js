// routes/adminRoutes.js
const express = require('express')
const {
    getAdminProfile,
    suspendDriver,
} = require('../controllers/adminController')
const { protect, isAdmin, validate } = require('../middleware')
const { suspendDriverValidator } = require('../validators')

const router = express.Router()

// Admin Routes
router.get('/profile', protect, isAdmin, getAdminProfile)
// Admin can suspend/unsuspend a driver
router.put('/:id', protect, isAdmin, validate(suspendDriverValidator), suspendDriver)

module.exports = router
