const Joi = require('joi')
const validator = require('validator')

const registerDriverValidator = Joi.object({
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
    phone: Joi.string().required(),
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
    motorcycleType: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Please provide the motorcycle type',
    }),
    motorcycleColor: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    motorcycleNumber: Joi.string().required(),
    motorcycleYear: Joi.string().required(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').default('en'),
    // verificationMethod: Joi.string().valid('email', 'phone').required(),
})

const updateDriverValidator = Joi.object({
    name: Joi.string().min(3).max(50).messages({
        'string.empty': 'Please provide a name',
    }),
    email: Joi.string().email().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Please provide an email',
    }),
    // password: Joi.string().min(6).messages({
    //     'string.empty': 'Please provide a password',
    // }),
    phone: Joi.string().custom((value, helpers) => {
        if (!validator.isMobilePhone(value)) {
            return helpers.message('Please provide a valid phone number')
        }
        return value
    }),
    address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        country: Joi.string(),
        postalCode: Joi.string(),
    }).messages({
        any: 'Please provide your address',
    }),
    motorcycleType: Joi.string().min(3).max(50).messages({
        'string.empty': 'Please provide the motorcycle type',
    }),
    motorcycleColor: Joi.string(),
    licenseNumber: Joi.string(),
    motorcycleNumber: Joi.string(),
    motorcycleYear: Joi.string(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').default('en'),
})

const updateDriverStatusValidator = Joi.object({
    status: Joi.string()
        .valid('available', 'unavailable', 'onRide')
        .default('unavailable'),
})

const updateDriverLocationValidator = Joi.object({
    coordinates: Joi.array()
        .items(
            Joi.number().min(-180).max(180).required(), // Longitude
            Joi.number().min(-90).max(90).required() // Latitude
        )
        .length(2)
        .required()
        .messages({
            'array.base':
                'Coordinates must be an array of [longitude, latitude].',
            'array.length': 'Coordinates must contain exactly two values.',
            'array.includes': 'Each coordinate value must be a valid number.',
            'any.required': 'Coordinates are required.',
        }),
})

module.exports = {
    registerDriverValidator,
    updateDriverStatusValidator,
    updateDriverValidator,
    updateDriverLocationValidator,
}
