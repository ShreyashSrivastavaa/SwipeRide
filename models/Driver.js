const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const DriverSchema = new mongoose.Schema({
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
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: 'default-driver-profile-pic.jpg',
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    role: {
        type: String,
        enum: ['driver'],
        default: 'driver',
    },
    motorcycleType: {
        type: String,
        required: [true, 'Please provide the motorcycle type'],
        minlength: 3,
        maxlength: 50,
    },
    motorcycleColor: {
        type: String,
        required: [true, 'Please provide the motorcycle color'],
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please provide a license number'],
        unique: true,
    },
    motorcycleNumber: {
        type: String,
        required: [true, 'Please provide the motorcycle number'],
        unique: true,
    },
    motorcycleYear: {
        type: String,
        required: [true, 'Please provide the motorcycle Year'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'onRide'],
        default: 'unavailable',
    },
    ratings: {
        type: Number,
        default: 5,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    suspended: {
        type: Boolean,
        default: false,
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    wallet: {
        type: Number,
        default: 0, // Start with 0 balance
    },
    debt: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

// Pre-save hook to hash password
DriverSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
DriverSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Method to generate a password reset token
DriverSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000
    return resetToken
}

// Index to optimize geospatial queries
DriverSchema.index({ location: '2dsphere' })

module.exports = mongoose.model('Driver', DriverSchema)
