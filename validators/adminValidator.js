const Joi = require('joi')
const validator = require('validator')

const adminValidator = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Please provide a name',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Please provide an email',
    }),
    // password: Joi.string().min(6).required().messages({
    //     'string.empty': 'Please provide a password',
    // }),
    phone: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!validator.isMobilePhone(value)) {
                return helpers.message('Please provide a valid phone number')
            }
            return value
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
    verificationMethod: Joi.string().valid('email', 'phone').required(),
})

module.exports = adminValidator
