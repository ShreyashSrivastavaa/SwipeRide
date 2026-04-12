const axios = require('axios')
const Payment = require('../models/Payment')
const { StatusCodes } = require('http-status-codes')
const { CustomAPIError, BadRequestError } = require('../errors')

exports.initiatePayment = async (req, res, next) => {
    try {
        const { userId, amount, rideId, email } = req.body

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100,
                reference: `TX_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const { data } = response.data

        const payment = new Payment({
            user: userId,
            amount,
            ride: rideId,
            reference: data.reference,
            status: 'pending',
        })
        await payment.save()

        res.status(StatusCodes.OK).json({ paymentUrl: data.authorization_url })
    } catch (error) {
        next(new CustomAPIError('Payment initiation failed'))
    }
}

exports.verifyPayment = async (req, res, next) => {
    try {
        const { reference } = req.query

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const { data } = response.data

        if (data.status === 'success') {
            const payment = await Payment.findOneAndUpdate(
                { reference: data.reference },
                {
                    status: 'success',
                    transactionId: data.id,
                },
                { new: true }
            )

            res.status(StatusCodes.OK).json({
                message: 'Payment verified successfully',
                payment,
            })
        } else {
            throw new BadRequestError('Payment verification failed')
        }
    } catch (error) {
        next(new CustomAPIError('Payment verification failed'))
    }
}
