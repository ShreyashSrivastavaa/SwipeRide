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
} = require('../middleware')
const { updateUserValidator } = require('../validators')

// User Routes (Protected)
const router = express.Router()

router.get('/profile', protect, isUser, (req, res, next) => {
    req.params.id = req.user._id || req.user.id
    getMyProfile(req, res, next)
})
router.get('/:id', protect, isUser, getMyProfile)
router.patch(
    '/profile',
    protect,
    isUser,
    validate(updateUserValidator),
    updateMyProfile
)
// Admin-only routes
router.get('/', protect, isAdmin, getAllUsers)
router.delete('/:id', protect, isAdmin, deleteUser)
router.patch(
    '/:id',
    protect,
    isAdmin,
    validate(updateUserValidator),
    updateUserProfile
)

module.exports = router
