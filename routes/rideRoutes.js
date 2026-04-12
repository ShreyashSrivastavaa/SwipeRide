const express = require('express')
const router = express.Router()
const {
    createRide,
    updateRide,
    getRideDetails,
    getRideHistory,
    getAllRides,
    deleteRide,
    updateRideStatusByDriver,
} = require('../controllers/rideController')
const {
    protect,
    isUser,
    validate,
    isUserOrDriver,
    isAdmin,
    verifyUser,
    isDriver,
} = require('../middleware')
const { rideValidator } = require('../validators')
// Create a new ride
router.post('/', protect, isUser, validate(rideValidator), createRide)

// Update a ride
router.put(
    '/:id',
    protect,
    isUser,
    verifyUser,
    validate(rideValidator),
    updateRide
)

router.patch('/status/:id', protect, isDriver, updateRideStatusByDriver)

// Get ride history for a user or driver
router.get('/history', protect, isUserOrDriver, getRideHistory)

// Get details of a specific ride
router.get('/:id', protect, isUserOrDriver, getRideDetails)

// Get all rides (Admin only)
router.get('/', protect, isAdmin, getAllRides)

// Delete a ride (Admin only)
router.delete('/:id', protect, isAdmin, deleteRide)

module.exports = router
