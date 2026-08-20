const Joi = require('joi')
const validator = require('validator')

const adminValidator = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Please provide a name',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Please provide an email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Please provide a password',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
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
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
    })
        .required()
        .messages({
            'any.required': 'Please provide your address',
        }),
    role: Joi.string().valid('admin').default('admin'),
})

const suspendDriverValidator = Joi.object({
    suspend: Joi.boolean().required().messages({
        'boolean.base': 'Suspend must be a boolean value (true/false)',
        'any.required': 'Suspend status is required',
    }),
})

module.exports = {
    adminValidator,
    adminRegisterValidator: adminValidator,
    suspendDriverValidator,
}
