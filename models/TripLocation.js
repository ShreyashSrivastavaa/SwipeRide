const TripLocationSchema = new Schema({
    ride: {
        type: Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
    },
    driverLocation: {
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('TripLocation', TripLocationSchema)
