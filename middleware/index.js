const {
    protect,
    isAdmin,
    isDriver,
    isUser,
    isUserOrDriver,
} = require('./authMiddleware')
const verifyUser = require('./verifyUser')
const validate = require('./validateMiddleware')

module.exports = {
    protect,
    isAdmin,
    isDriver,
    isUser,
    isUserOrDriver,
    validate,
    verifyUser,
}
