const SupportTicketSchema = new Schema({
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
    issueType: {
        type: String,
        enum: ['ride_issue', 'payment_issue', 'account_issue', 'other'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open',
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

module.exports = mongoose.model('SupportTicket', SupportTicketSchema)
