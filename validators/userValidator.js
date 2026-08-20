const Joi = require('joi')
const validator = require('validator')

const userRegisterValidator = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Please provide a name',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required',
    }),
    phone: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!validator.isMobilePhone(value)) {
                return helpers.message('Please provide a valid phone number')
            }
            return value
        })
        .messages({
            'any.required': 'Phone number is required',
        }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Please provide a password',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    role: Joi.string().valid('user').default('user'),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').default('en'),
    paymentMethod: Joi.string().valid('cash', 'card', 'wallet').default('cash'),
})

const updateUserValidator = Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
        'string.empty': 'Name cannot be empty',
    }),
    phone: Joi.string()
        .optional()
        .custom((value, helpers) => {
            if (!validator.isMobilePhone(value)) {
                return helpers.message('Please provide a valid phone number')
            }
            return value
        }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string().min(6).optional().messages({
        'string.min': 'Password must be at least 6 characters long',
    }),
    profilePicture: Joi.string().optional(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').optional(),
    paymentMethod: Joi.string().valid('cash', 'card', 'wallet').optional(),
})

module.exports = {
    userValidator: userRegisterValidator,
    userRegisterValidator,
    updateUserValidator,
}
