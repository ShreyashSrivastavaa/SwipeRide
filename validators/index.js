const adminValidator = require('./adminValidator')
const userValidator = require('./userValidator')
const rideValidator = require('./rideValidator')
const ratingValidator = require('./ratingValidator')
const {
    updateDriverValidator,
    registerDriverValidator,
    updateDriverStatusValidator,
    updateDriverLocationValidator,
} = require('./driverValidator')
const {
    loginValidator,
    otpValidator,
    resendOtpValidator,
} = require('./authValidator')

module.exports = {
    adminValidator,
    userValidator,
    rideValidator,
    ratingValidator,
    updateDriverValidator,
    updateDriverStatusValidator,
    registerDriverValidator,
    updateDriverLocationValidator,
    loginValidator,
    otpValidator,
    resendOtpValidator,
}
