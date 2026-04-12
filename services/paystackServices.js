// services/paystackService.js
const axios = require('axios')

const paystackInstance = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
})

exports.initiatePayment = async (email, amount) => {
    const response = await paystackInstance.post('/transaction/initialize', {
        email,
        amount: amount * 100, // Paystack works with the smallest currency unit (e.g., kobo)
    })
    return response.data.data
}

exports.verifyPayment = async (reference) => {
    const response = await paystackInstance.get(
        `/transaction/verify/${reference}`
    )
    return response.data.data
}
