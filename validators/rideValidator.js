const Joi = require('joi')

const rideValidator = Joi.object({
    pickupLocation: Joi.string().required().messages({
        'string.empty': 'Please provide pickup location',
        'any.required': 'Pickup location is required',
    }),
    dropoffLocations: Joi.alternatives()
        .try(
            Joi.string().required(), // Single drop-off location
            Joi.array().items(Joi.string().required()).min(1) // Array of drop-off locations
        )
        .required()
        .messages({
            'alternatives.match':
                'Please provide a valid drop-off location or an array of drop-off locations',
            'any.required': 'Drop-off location(s) are required',
        }),
})

module.exports = rideValidator
