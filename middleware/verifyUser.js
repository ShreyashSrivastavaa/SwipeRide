const User = require('../models/User')
const Driver = require('../models/Driver')
const Admin = require('../models/Admin')

const verifyUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' })
        }

        const user = req.user
        // If verification flag is set to false in strict verification mode:
        if (process.env.ENFORCE_VERIFICATION === 'true' && !user.isEmailVerified && !user.isPhoneVerified) {
            return res.status(403).json({
                message: 'Please verify your email or phone to access this route',
            })
        }

        next()
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = verifyUser
