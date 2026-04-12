// utils/jwtUtils.js
const jwt = require('jsonwebtoken')

/**
 * Generate a new JWT token for a user (can be a user, driver, or admin).
 *
 * @param {Object} user - The user object containing id, name, email, and role
 * @returns {String} - The generated JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id, // User's ID
            name: user.name, // User's name
            role: user.role, // User's role (admin, driver, or user)
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time
        }
    )
}

/**
 * Verify a JWT token.
 *
 * @param {String} token - The token to be verified
 * @returns {Object} - The decoded token payload if valid, else throws an error
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    generateToken,
    verifyToken,
}
