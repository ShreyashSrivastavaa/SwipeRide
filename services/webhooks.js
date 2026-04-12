exports.handleWebhook = async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY

    const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex')

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).json({ error: 'Invalid signature' })
    }

    const event = req.body

    // Handle different Paystack events (e.g., charge.success)
    if (event.event === 'charge.success') {
        const payment = await Payment.findOneAndUpdate(
            { reference: event.data.reference },
            {
                status: 'success',
                transactionId: event.data.id,
            },
            { new: true }
        )

        res.status(200).json({
            message: 'Payment success event handled',
            payment,
        })
    } else {
        res.status(200).json({ message: 'Event received' })
    }
}
