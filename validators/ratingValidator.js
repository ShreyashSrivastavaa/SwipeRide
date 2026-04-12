const Joi = require('joi')

const ratingValidator = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        'number.base': 'Please provide a rating between 1 and 5',
    }),
    comment: Joi.string().max(500).required().messages({
        'string.empty': 'Please provide review text',
    }),
})

module.exports = ratingValidator
