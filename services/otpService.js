const nodemailer = require('nodemailer')
const twilio = require('twilio')
const { redisClient } = require('../utils/redisClient')

// In-memory fallback cache when Redis is offline
const memoryOtpCache = new Map()

/**
 * Generate a 6-digit numerical OTP code
 */
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Store OTP with 10-minute TTL in Redis (or in-memory fallback)
 */
const storeOtp = async (identifier, otp, ttlSeconds = 600) => {
    const key = `otp:${identifier}`
    try {
        if (redisClient.isOpen) {
            await redisClient.set(key, otp, { EX: ttlSeconds })
            return true
        }
    } catch (err) {
        console.warn('Redis unavailable for OTP storage, using memory fallback:', err.message)
    }

    // Memory fallback
    memoryOtpCache.set(key, {
        otp,
        expiresAt: Date.now() + ttlSeconds * 1000,
    })

    // Auto cleanup
    setTimeout(() => {
        if (memoryOtpCache.has(key)) {
            const item = memoryOtpCache.get(key)
            if (item && Date.now() >= item.expiresAt) {
                memoryOtpCache.delete(key)
            }
        }
    }, ttlSeconds * 1000)

    return true
}

/**
 * Retrieve stored OTP
 */
const getStoredOtp = async (identifier) => {
    const key = `otp:${identifier}`
    try {
        if (redisClient.isOpen) {
            const otp = await redisClient.get(key)
            if (otp) return otp
        }
    } catch (err) {
        console.warn('Redis read failed for OTP, checking memory fallback:', err.message)
    }

    const item = memoryOtpCache.get(key)
    if (item) {
        if (Date.now() <= item.expiresAt) {
            return item.otp
        }
        memoryOtpCache.delete(key)
    }
    return null
}

/**
 * Delete stored OTP
 */
const deleteStoredOtp = async (identifier) => {
    const key = `otp:${identifier}`
    try {
        if (redisClient.isOpen) {
            await redisClient.del(key)
        }
    } catch (err) {
        // ignore
    }
    memoryOtpCache.delete(key)
}

/**
 * Send OTP via Email or SMS
 */
const sendOtp = async ({ identifier, verificationMethod = 'phone' }) => {
    const otp = generateOtp()
    await storeOtp(identifier, otp)

    if (verificationMethod === 'email' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const emailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })

            await emailTransporter.sendMail({
                from: `"SwipeRide Support" <${process.env.EMAIL_USER}>`,
                to: identifier,
                subject: 'SwipeRide Account Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #FF5500; text-align: center;">SwipeRide</h2>
                        <p>Your one-time verification code is:</p>
                        <div style="font-size: 28px; font-weight: bold; text-align: center; color: #111; letter-spacing: 4px; padding: 12px; background: #F3F4F6; border-radius: 6px; margin: 20px 0;">${otp}</div>
                        <p style="color: #666; font-size: 13px;">This code is valid for 10 minutes. Do not share it with anyone.</p>
                    </div>
                `,
            })
            console.log(`[OTP] Email sent to ${identifier}`)
        } catch (error) {
            console.error('Failed to send OTP email:', error.message)
        }
    } else if (
        verificationMethod === 'phone' &&
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
    ) {
        try {
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
            await client.messages.create({
                body: `Your SwipeRide verification code is: ${otp}. Valid for 10 minutes.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: identifier,
            })
            console.log(`[OTP] SMS sent to ${identifier}`)
        } catch (error) {
            console.error('Failed to send OTP SMS via Twilio:', error.message)
        }
    } else {
        // Fallback for development/testing: log OTP clearly to console
        console.log(`[OTP DISPATCH - DEV] Code for ${identifier} (${verificationMethod}): ${otp}`)
    }

    return { success: true, message: 'OTP sent successfully', devOtp: process.env.NODE_ENV === 'test' || process.env.NODE_ENV !== 'production' ? otp : undefined }
}

/**
 * Verify OTP
 */
const verifyOtp = async ({ identifier, otp }) => {
    const storedOtp = await getStoredOtp(identifier)
    if (!storedOtp) {
        return { success: false, message: 'OTP has expired or was not requested' }
    }

    if (storedOtp !== otp.toString()) {
        return { success: false, message: 'Invalid OTP code' }
    }

    // OTP is valid - delete from storage
    await deleteStoredOtp(identifier)
    return { success: true, message: 'OTP verified successfully' }
}

module.exports = {
    generateOtp,
    storeOtp,
    getStoredOtp,
    deleteStoredOtp,
    sendOtp,
    verifyOtp,
}
