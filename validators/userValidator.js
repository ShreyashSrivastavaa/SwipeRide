const Joi = require('joi')
const validator = require('validator')

const userValidator = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Please provide a name',
    }),

    phone: Joi.string()
        .required()
        .custom((value, helpers) => {
            if (!validator.isMobilePhone(value)) {
                return helpers.message('Please provide a valid phone number')
            }
            return value
        }),
    role: Joi.string().valid('user').default('user'),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').default('en'),
    paymentMethod: Joi.string().valid('cash', 'card').default('cash'),
    // verificationMethod: Joi.string().valid('email', 'phone').required(),
})

module.exports = userValidator
