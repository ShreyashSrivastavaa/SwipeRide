const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
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

    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash',
    },
    preferredLanguage: {
        type: String,
        enum: ['en', 'es', 'fr', 'de'], // Example language options (English, Spanish, French, German)
        default: 'en',
    },

    role: {
        type: String,
        enum: ['user'],
        default: 'user',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

// Pre-save hook to hash password
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

// Method to generate a password reset token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash token and set it to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set token expiration time (e.g., 1 hour)
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 hour

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)
