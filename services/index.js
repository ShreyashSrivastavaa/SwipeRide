const calculateETA = require('./calculateETA.js')
const { admin, firebase } = require('./firebaseConfig.js')
const {
    calculateFare,
    getDistanceMatrix,
    getCoordinatesFromLocationName,
} = require('./googleMapsService.js')

module.exports = {
    calculateETA,
    admin,
    firebase,
    calculateFare,
    getDistanceMatrix,
    getCoordinatesFromLocationName,
}
