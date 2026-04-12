require('dotenv').config()

const firebase = require('firebase/app')
require('firebase/auth')

// Initialize Firebase SDK
firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
})

module.exports = firebase
