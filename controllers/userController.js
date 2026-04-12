const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')
const { NotFoundError } = require('../errors')

// Get User Profile
const getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            throw new NotFoundError('User not found')
        }
        res.status(StatusCodes.OK).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

// Update My Profile
const updateMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            throw new NotFoundError('User not found')
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key]
            }
        })

        await user.save()

        res.status(StatusCodes.OK).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

// Get All Users (Admin Only)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        res.status(StatusCodes.OK).json({
            success: true,
            count: users.length,
            data: users,
        })
    } catch (error) {
        next(error)
    }
}

// Update User Profile by ID
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            throw new NotFoundError('User not found')
        }

        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key]
            }
        })

        await user.save()

        res.status(StatusCodes.OK).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

// Delete User (Admin Only)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            throw new NotFoundError('User not found')
        }
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'User deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getMyProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    updateMyProfile,
}
