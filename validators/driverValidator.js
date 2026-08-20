const Joi = require('joi')
const validator = require('validator')

const registerDriverValidator = Joi.object({
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
        street: Joi.string().required().messages({ 'any.required': 'Street is required' }),
        city: Joi.string().required().messages({ 'any.required': 'City is required' }),
        state: Joi.string().required().messages({ 'any.required': 'State is required' }),
        country: Joi.string().required().messages({ 'any.required': 'Country is required' }),
        postalCode: Joi.string().required().messages({ 'any.required': 'Postal code is required' }),
    })
        .required()
        .messages({
            'any.required': 'Please provide your address',
        }),
    motorcycleType: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'Please provide the motorcycle type',
        'any.required': 'Motorcycle type is required',
    }),
    motorcycleColor: Joi.string().required().messages({
        'string.empty': 'Please provide the motorcycle color',
        'any.required': 'Motorcycle color is required',
    }),
    licenseNumber: Joi.string().required().messages({
        'string.empty': 'Please provide a license number',
        'any.required': 'License number is required',
    }),
    motorcycleNumber: Joi.string().required().messages({
        'string.empty': 'Please provide the motorcycle number',
        'any.required': 'Motorcycle number is required',
    }),
    motorcycleYear: Joi.alternatives().try(Joi.string(), Joi.number()).required().messages({
        'any.required': 'Motorcycle year is required',
    }),
    profilePicture: Joi.string().optional(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de').default('en'),
})

const updateDriverValidator = Joi.object({
    name: Joi.string().min(3).max(50).messages({
        'string.empty': 'Please provide a name',
    }),
    email: Joi.string().email().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Please provide an email',
    }),
    password: Joi.string().min(6).messages({
        'string.min': 'Password must be at least 6 characters long',
    }),
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
    }),
    motorcycleType: Joi.string().min(2).max(50),
    motorcycleColor: Joi.string(),
    licenseNumber: Joi.string(),
    motorcycleNumber: Joi.string(),
    motorcycleYear: Joi.alternatives().try(Joi.string(), Joi.number()),
    profilePicture: Joi.string(),
    preferredLanguage: Joi.string().valid('en', 'es', 'fr', 'de'),
})

const updateDriverStatusValidator = Joi.object({
    status: Joi.string()
        .valid('available', 'unavailable', 'onRide')
        .required()
        .messages({
            'any.only': 'Status must be available, unavailable, or onRide',
            'any.required': 'Status is required',
        }),
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
            'array.length': 'Coordinates must contain exactly two values [longitude, latitude].',
            'any.required': 'Coordinates are required.',
        }),
})

module.exports = {
    registerDriverValidator,
    updateDriverStatusValidator,
    updateDriverValidator,
    updateDriverLocationValidator,
}
