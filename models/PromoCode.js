const PromoCodeSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
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

module.exports = mongoose.model('PromoCode', PromoCodeSchema)
