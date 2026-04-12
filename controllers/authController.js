const User = require('../models/User')
const Driver = require('../models/Driver')
const Admin = require('../models/Admin')
const { generateToken } = require('../utils/jwt')
const { StatusCodes } = require('http-status-codes')
const {
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
} = require('../errors')

// Register User
const registerUser = async (req, res, next) => {
    const { name, phone } = req.body
    try {
        const userExists = await User.findOne({ phone })

        if (userExists) {
            throw new BadRequestError(
                'User already exists with this phone number'
            )
        }

        const user = new User({
            name,
            phone,
        })
        await user.save()

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully.',
        })
    } catch (error) {
        next(error)
    }
}

// Register Driver
const registerDriver = async (req, res, next) => {
    const {
        name,
        email,
        phone,
        profilePicture,
        motorcycleType,
        motorcycleColor,
        licenseNumber,
        motorcycleNumber,
        motorcycleYear,
        address,
    } = req.body
    try {
        const driverExists = await Driver.findOne({ email })

        if (driverExists) {
            throw new BadRequestError('Driver already exists')
        }

        const driver = new Driver({
            name,
            email,
            phone,
            profilePicture,
            motorcycleType,
            motorcycleColor,
            licenseNumber,
            motorcycleNumber,
            motorcycleYear,
            address,
        })
        await driver.save()

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Driver registered successfully.',
        })
    } catch (error) {
        next(error)
    }
}

// Register Admin
const registerAdmin = async (req, res, next) => {
    const { name, email, phone, address } = req.body
    try {
        const adminExists = await Admin.findOne({ email })

        if (adminExists) {
            throw new BadRequestError('Admin already exists')
        }

        const admin = new Admin({
            name,
            email,
            phone,
            address,
        })
        await admin.save()

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Admin registered successfully.',
        })
    } catch (error) {
        next(error)
    }
}

// Login
const login = async (req, res, next) => {
    const { loginMethod, identifier } = req.body
    try {
        if (!loginMethod || !identifier) {
            throw new BadRequestError(
                'Please provide login method and identifier'
            )
        }

        let userToAuth
        if (loginMethod === 'email') {
            userToAuth =
                (await User.findOne({ email: identifier })) ||
                (await Driver.findOne({ email: identifier })) ||
                (await Admin.findOne({ email: identifier }))
        } else if (loginMethod === 'phone') {
            userToAuth =
                (await User.findOne({ phone: identifier })) ||
                (await Driver.findOne({ phone: identifier })) ||
                (await Admin.findOne({ phone: identifier }))
        } else {
            throw new BadRequestError('Invalid login method')
        }

        if (!userToAuth) {
            throw new UnauthenticatedError('Invalid credentials')
        }

        // Generate JWT token
        const token = generateToken({
            _id: userToAuth._id,
            name: userToAuth.name,
            email: userToAuth.email,
            role: userToAuth.role,
        })

        res.status(StatusCodes.OK).json({
            success: true,
            data: {
                id: userToAuth._id,
                name: userToAuth.name,
                email: userToAuth.email,
                role: userToAuth.role,
                token,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Logout
const logout = (req, res) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Logged out successfully',
    })
}

module.exports = {
    registerUser,
    registerDriver,
    registerAdmin,
    login,
    logout,
}
