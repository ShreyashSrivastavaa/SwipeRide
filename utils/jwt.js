// utils/jwtUtils.js
const jwt = require('jsonwebtoken')

/**
 * Generate a new JWT token for a user (can be a user, driver, or admin).
 *
 * @param {Object} user - The user object containing id, name, email, and role
 * @returns {String} - The generated JWT token
 */
const generateToken = (user) => {
    const secret = process.env.JWT_SECRET || 'swiperide_jwt_default_secret_key_2026'
    const expiresIn = process.env.JWT_EXPIRES_IN || process.env.JWT_LIFETIME || '30d'
    return jwt.sign(
        {
            id: user._id, // User's ID
            name: user.name, // User's name
            role: user.role, // User's role (admin, driver, or user)
        },
        secret,
        {
            expiresIn,
        }
    )
}

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'swiperide_jwt_default_secret_key_2026'
    return jwt.verify(token, secret)
}

module.exports = {
    generateToken,
    verifyToken,
}
