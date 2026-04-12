const mongoose = require('mongoose')

// Define the Ride schema
const RideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user reference'],
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: 'Driver',
        required: [true, 'Please provide driver reference'],
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: [true, 'Please provide pickup location coordinates'],
        },
    },
    dropoffLocations: [
        {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: [
                    true,
                    'Please provide drop-off location coordinates',
                ],
            },
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'inProgress', 'completed', 'canceled'],
        default: 'pending',
    },
    fare: {
        // The cost of the ride
        type: Number,
    },
    driverEarnings: {
        type: Number,
        default: 0,
    },
    distance: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 0,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
    },
    eta: {
        type: Number, // Store ETA in minutes
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: {
        type: Date,
        default: null,
    },
})

RideSchema.index({ user: 1, createdAt: -1 })
RideSchema.index({ driver: 1, createdAt: -1 })
RideSchema.index({ pickupLocation: '2dsphere' })

module.exports = mongoose.model('Ride', RideSchema)
