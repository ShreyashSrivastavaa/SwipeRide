const Joi = require('joi')

// Login Schema
const loginValidator = Joi.object({
    identifier: Joi.string().required(), // Can be email or phone
    loginMethod: Joi.string().valid('email', 'phone').required(),
})

// Define the validation schema
const otpValidator = Joi.object({
    identifier: Joi.string()
        .required()
        .when('verificationMethod', {
            is: 'phone',
            then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/), // E.164 phone format
            otherwise: Joi.string().email(), // Validate as email for 'email' verification method
        }),
    otp: Joi.string().length(6).required(), // Assumes OTP is a 6-digit code
    verificationMethod: Joi.string().valid('phone', 'email').required(),
})

// Resend OTP Schema
const resendOtpValidator = Joi.object({
    identifier: Joi.string().when('verificationMethod', {
        is: 'email',
        then: Joi.string().email().required(), // Ensures identifier is a valid email if method is 'email'
        otherwise: Joi.string()
            .pattern(/^[0-9]{10,15}$/)
            .required(), // Ensures identifier is a valid phone number if method is 'phone'
    }),
    verificationMethod: Joi.string().valid('email', 'phone').required(), // Required to specify either 'email' or 'phone'
})
module.exports = { loginValidator, otpValidator, resendOtpValidator }
