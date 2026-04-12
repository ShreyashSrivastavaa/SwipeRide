// routes/userRoutes.js
const express = require('express')
const {
    getMyProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    updateMyProfile,
} = require('../controllers/userController')
const {
    protect,
    isAdmin,
    isUser,
    validate,
    verifyUser,
} = require('../middleware')
const userValidator = require('../validators/userValidator')

// User Routes (Protected)
const router = express.Router()

router.get('/:id', protect, isUser, getMyProfile)
router.patch(
    '/profile',
    protect,
    isUser,
    validate(userValidator),
    updateMyProfile
)
// Admin-only route to get all users
router.get('/', protect, isAdmin, verifyUser, getAllUsers)
// Admin-only route to delete a user
router.delete('/:id', protect, isAdmin, verifyUser, deleteUser)
router.patch(
    '/:id',
    protect,
    isAdmin,
    validate(userValidator),
    updateUserProfile
)

module.exports = router
