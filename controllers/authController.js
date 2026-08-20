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
const { sendOtp, verifyOtp } = require('../services/otpService')

// Register User
const registerUser = async (req, res, next) => {
    const { name, phone, email, password, preferredLanguage, paymentMethod } = req.body
    try {
        const query = [{ phone }]
        if (email) query.push({ email })
        const userExists = await User.findOne({ $or: query })

        if (userExists) {
            throw new BadRequestError(
                'User already exists with this phone number or email'
            )
        }

        const user = new User({
            name,
            phone,
            email: email || undefined,
            password,
            preferredLanguage: preferredLanguage || 'en',
            paymentMethod: paymentMethod || 'cash',
        })
        await user.save()

        // Generate token for instant onboarding
        const token = generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                token,
            },
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
        password,
        profilePicture,
        motorcycleType,
        motorcycleColor,
        licenseNumber,
        motorcycleNumber,
        motorcycleYear,
        address,
        preferredLanguage,
    } = req.body
    try {
        const driverExists = await Driver.findOne({
            $or: [
                { email },
                { phone },
                { licenseNumber },
                { motorcycleNumber },
            ],
        })

        if (driverExists) {
            throw new BadRequestError('Driver already exists with this email, phone, or motorcycle details')
        }

        const driver = new Driver({
            name,
            email,
            phone,
            password,
            profilePicture: profilePicture || 'default-driver-profile-pic.jpg',
            motorcycleType,
            motorcycleColor,
            licenseNumber,
            motorcycleNumber,
            motorcycleYear,
            address,
            preferredLanguage: preferredLanguage || 'en',
        })
        await driver.save()

        const token = generateToken({
            _id: driver._id,
            name: driver.name,
            email: driver.email,
            role: driver.role,
        })

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Driver registered successfully.',
            data: {
                id: driver._id,
                name: driver.name,
                email: driver.email,
                phone: driver.phone,
                role: driver.role,
                token,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Register Admin
const registerAdmin = async (req, res, next) => {
    const { name, email, phone, password, address } = req.body
    try {
        const adminExists = await Admin.findOne({
            $or: [{ email }, { phone }],
        })

        if (adminExists) {
            throw new BadRequestError('Admin already exists with this email or phone')
        }

        const admin = new Admin({
            name,
            email,
            phone,
            password,
            address,
        })
        await admin.save()

        const token = generateToken({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        })

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Admin registered successfully.',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Login
const login = async (req, res, next) => {
    const { loginMethod, identifier, password, otp } = req.body
    try {
        if (!loginMethod || !identifier) {
            throw new BadRequestError(
                'Please provide login method and identifier'
            )
        }

        let userToAuth
        if (loginMethod === 'email') {
            userToAuth =
                (await User.findOne({ email: identifier.toLowerCase() })) ||
                (await Driver.findOne({ email: identifier.toLowerCase() })) ||
                (await Admin.findOne({ email: identifier.toLowerCase() }))
        } else if (loginMethod === 'phone') {
            userToAuth =
                (await User.findOne({ phone: identifier })) ||
                (await Driver.findOne({ phone: identifier })) ||
                (await Admin.findOne({ phone: identifier }))
        } else {
            throw new BadRequestError('Invalid login method. Must be email or phone.')
        }

        if (!userToAuth) {
            throw new UnauthenticatedError('Invalid credentials')
        }

        // Check if driver is suspended
        if (userToAuth.role === 'driver' && userToAuth.suspended) {
            throw new UnauthenticatedError('Driver account suspended. Please contact support.')
        }

        // Verify credentials
        if (password) {
            const isPasswordCorrect = await userToAuth.comparePassword(password)
            if (!isPasswordCorrect) {
                throw new UnauthenticatedError('Invalid credentials')
            }
        } else if (otp) {
            const otpCheck = await verifyOtp({ identifier, otp })
            if (!otpCheck.success) {
                throw new UnauthenticatedError(otpCheck.message || 'Invalid credentials')
            }
        } else {
            throw new BadRequestError('Please provide a password or OTP to authenticate')
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
                phone: userToAuth.phone,
                role: userToAuth.role,
                profilePicture: userToAuth.profilePicture,
                token,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Request OTP
const requestOtp = async (req, res, next) => {
    const { identifier, verificationMethod = 'phone' } = req.body
    try {
        const result = await sendOtp({ identifier, verificationMethod })
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

// Verify OTP
const verifyOtpEndpoint = async (req, res, next) => {
    const { identifier, otp, verificationMethod = 'phone' } = req.body
    try {
        const result = await verifyOtp({ identifier, otp })
        if (!result.success) {
            throw new BadRequestError(result.message)
        }

        // If user/driver exists, mark verified
        if (verificationMethod === 'phone') {
            await User.findOneAndUpdate({ phone: identifier }, { isPhoneVerified: true })
            await Driver.findOneAndUpdate({ phone: identifier }, { isPhoneVerified: true })
        } else {
            await User.findOneAndUpdate({ email: identifier }, { isEmailVerified: true })
            await Driver.findOneAndUpdate({ email: identifier }, { isEmailVerified: true })
        }

        res.status(StatusCodes.OK).json(result)
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
    requestOtp,
    verifyOtp: verifyOtpEndpoint,
    logout,
}
