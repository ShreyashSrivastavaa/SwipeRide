const NotificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'Driver',
        default: null,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['ride_update', 'payment', 'promo', 'system'],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Notification', NotificationSchema)
