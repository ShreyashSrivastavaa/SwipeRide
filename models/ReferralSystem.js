const ReferralSchema = new Schema({
    referrer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    referee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Can be null until the referred user signs up
    },
    referralCode: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'expired'],
        default: 'pending', // 'completed' when the referee fulfills the requirements (e.g., completes first ride)
    },
    reward: {
        type: Number,
        default: 0, // Reward given to the referrer once the referral is completed
    },
    conditions: {
        type: String,
        default: 'Complete your first ride to earn the reward', // Custom conditions if needed
    },
    refereeCompletedFirstRide: {
        type: Boolean,
        default: false, // Indicates whether the referred user has completed their first ride
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    expirationDate: {
        type: Date, // Optional expiration date for the referral code
        default: null,
    },
})

module.exports = mongoose.model('Referral', ReferralSchema)
