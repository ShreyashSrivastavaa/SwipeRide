const {
    adminValidator,
    adminRegisterValidator,
    suspendDriverValidator,
} = require('./adminValidator')
const {
    userValidator,
    userRegisterValidator,
    updateUserValidator,
} = require('./userValidator')
const {
    rideValidator,
    createRideValidator,
    updateRideValidator,
    updateRideStatusValidator,
} = require('./rideValidator')
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
    sendOtpValidator,
} = require('./authValidator')

module.exports = {
    adminValidator,
    adminRegisterValidator,
    suspendDriverValidator,
    userValidator,
    userRegisterValidator,
    updateUserValidator,
    rideValidator,
    createRideValidator,
    updateRideValidator,
    updateRideStatusValidator,
    ratingValidator,
    updateDriverValidator,
    updateDriverStatusValidator,
    registerDriverValidator,
    updateDriverLocationValidator,
    loginValidator,
    otpValidator,
    resendOtpValidator,
    sendOtpValidator,
}
