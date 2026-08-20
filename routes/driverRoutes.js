// routes/driverRoutes.js
const express = require('express')
const router = express.Router()
const {
    getDriverProfile,
    updateDriverProfile,
    updateDriverStatus,
    deleteDriver,
    getAllDrivers,
    updateDriverLocation,
    getDriverWalletBalance,
    getDriverEarningsWithDateFilter,
    getDriverEarningsReport,
} = require('../controllers/driverController')

const {
    protect,
    isDriver,
    isAdmin,
    validate,
} = require('../middleware')
const {
    updateDriverValidator,
    updateDriverStatusValidator,
    updateDriverLocationValidator,
} = require('../validators')

// Driver Routes (Protected)
router.get('/profile', protect, isDriver, getDriverProfile)
router.patch(
    '/profile',
    protect,
    isDriver,
    validate(updateDriverValidator),
    (req, res, next) => {
        req.params.id = req.user._id || req.user.id
        updateDriverProfile(req, res, next)
    }
)
router.get('/wallet', protect, isDriver, getDriverWalletBalance)
router.get('/', protect, isAdmin, getAllDrivers)
router.patch(
    '/:id',
    protect,
    isAdmin,
    validate(updateDriverValidator),
    updateDriverProfile
)
router.put(
    '/status',
    protect,
    isDriver,
    validate(updateDriverStatusValidator),
    updateDriverStatus
)
router.put(
    '/location',
    protect,
    isDriver,
    validate(updateDriverLocationValidator),
    updateDriverLocation
)

// Route for earnings with date filter
router.get('/earnings', protect, isDriver, getDriverEarningsWithDateFilter)

// Route for earnings report (daily/weekly)
router.get('/earnings/report', protect, isDriver, getDriverEarningsReport)

router.delete('/:id', protect, isAdmin, deleteDriver)

module.exports = router
