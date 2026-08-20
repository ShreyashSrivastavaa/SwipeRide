const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide an email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Please provide a phone number'],
        validate: {
            validator: validator.isMobilePhone,
            message: 'Please provide a valid phone number',
        },
    },
    address: {
        type: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            postalCode: { type: String, required: true },
        },
        required: [true, 'Please provide your address'],
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Pre-save hook to hash password
AdminSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Method to generate a password reset token
AdminSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 hour expiration

    return resetToken
}

// Method to suspend or unsuspend a driver
AdminSchema.methods.suspendDriver = async function (driverId, suspend = true) {
    const Driver = mongoose.model('Driver')

    const driver = await Driver.findById(driverId)
    if (!driver) {
        throw new Error('Driver not found')
    }

    driver.suspended = suspend
    await driver.save()

    return driver
}

module.exports = mongoose.model('Admin', AdminSchema)
