const Joi = require('joi')

// Login Schema
const loginValidator = Joi.object({
    identifier: Joi.string().required().messages({
        'string.empty': 'Please provide email or phone number',
        'any.required': 'Identifier is required',
    }),
    loginMethod: Joi.string().valid('email', 'phone').required().messages({
        'any.only': 'Login method must be either email or phone',
        'any.required': 'Login method is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Please provide a password',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
})

// OTP Verification Schema
const otpValidator = Joi.object({
    identifier: Joi.string().required().messages({
        'string.empty': 'Please provide phone number or email',
        'any.required': 'Identifier is required',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be a 6-digit code',
        'any.required': 'OTP is required',
    }),
    verificationMethod: Joi.string().valid('phone', 'email').default('phone'),
})

// Send / Resend OTP Schema
const resendOtpValidator = Joi.object({
    identifier: Joi.string().required().messages({
        'string.empty': 'Please provide phone number or email',
        'any.required': 'Identifier is required',
    }),
    verificationMethod: Joi.string().valid('email', 'phone').default('phone'),
})

module.exports = {
    loginValidator,
    otpValidator,
    resendOtpValidator,
    sendOtpValidator: resendOtpValidator,
}
