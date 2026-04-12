const { Server } = require('socket.io')
const matchDriver = require('./matchDriver')
const {
    getCoordinatesFromLocationName,
} = require('../services/googleMapsService')
const { redisClient, connectRedis } = require('./redisClient')
const calculateETA = require('../services/calculateETA')
const Ride = require('../models/Ride')
const Driver = require('../models/Driver')

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        path: '/ws',
        transports: ['websocket'],
    })

    io.on('connection', (socket) => {
        console.log('A user connected: ' + socket.id)

        // Join room based on userId or driverId
        socket.on('join', (data) => {
            const { userId, driverId } = data
            if (userId) socket.join(`user_${userId}`)
            if (driverId) socket.join(`driver_${driverId}`)
            console.log(`Socket ${socket.id} joined room: ${userId ? 'user_' + userId : 'driver_' + driverId}`)
        })

        socket.on('driverLocationUpdate', async (data) => {
            const { driverId, lat, lng } = data
            try {
                if (!redisClient.isOpen) await connectRedis()

                await redisClient.hSet(
                    `driver:${driverId}`,
                    'lat',
                    lat,
                    'lng',
                    lng
                )
                await redisClient.expire(`driver:${driverId}`, 3600)

                // NO BROADCAST. Driver location only shown to assigned users via specific rooms if needed.
                // Or broadcast only to nearby users (not implemented here for privacy).
            } catch (error) {
                console.error('Error updating driver location in Redis:', error)
                socket.emit('error', {
                    message: 'Failed to update driver location',
                })
            }
        })

        socket.on('requestRide', async (data) => {
            const { userId, pickupLocation, dropoffLocation } = data
            try {
                const pickupCoordinates =
                    await getCoordinatesFromLocationName(pickupLocation)
                const matchedDriver = await matchDriver(pickupCoordinates)

                if (!matchedDriver) {
                    socket.emit('rideError', {
                        message: 'No available drivers found',
                    })
                    return
                }

                // Target the driver's room
                io.to(`driver_${matchedDriver._id}`).emit('rideRequest', {
                    userId,
                    pickupLocation,
                    dropoffLocation,
                })

                socket.emit('rideMatched', {
                    driverId: matchedDriver._id,
                    pickupLocation,
                    dropoffLocation,
                })
            } catch (error) {
                console.error('Error handling ride request:', error)
                socket.emit('rideError', { message: error.message })
            }
        })

        socket.on('rideResponse', async (data) => {
            const { rideId, driverId, accepted } = data
            const ride = await Ride.findById(rideId).populate('user')

            if (accepted) {
                await Ride.findByIdAndUpdate(rideId, { status: 'accepted' })
                const eta = await calculateETA(
                    ride.driver.location,
                    ride.pickupLocation.coordinates
                )

                // Target the user's room
                io.to(`user_${ride.user._id}`).emit('rideAccepted', {
                    driver: ride.driver,
                    eta,
                })
            } else {
                await Ride.findByIdAndUpdate(rideId, { status: 'declined' })
                const newDriver = await matchDriver(
                    ride.pickupLocation.coordinates
                )

                if (newDriver) {
                    io.to(`driver_${newDriver._id}`).emit('rideRequest', {
                        rideId,
                        pickupLocation: ride.pickupLocation,
                    })
                } else {
                    io.to(`user_${ride.user._id}`).emit('rideError', {
                        message: 'No drivers available',
                    })
                }
            }
        })

        socket.on('driverArrived', async (data) => {
            const { rideId } = data
            await Ride.findByIdAndUpdate(rideId, { status: 'arrived' })
            const ride = await Ride.findById(rideId).populate('user')
            io.to(`user_${ride.user._id}`).emit('driverArrived')
        })

        socket.on('rideStarted', async (data) => {
            const { rideId } = data
            const ride = await Ride.findByIdAndUpdate(rideId, {
                status: 'inProgress',
            })

            const eta = await calculateETA(
                ride.pickupLocation.coordinates,
                ride.dropoffLocation.coordinates
            )
            io.to(`user_${ride.user._id}`).emit('rideStarted', { eta })
        })

        socket.on('rideCompleted', async (data) => {
            const { rideId } = data
            const ride = await Ride.findByIdAndUpdate(rideId, {
                status: 'completed',
            })
            const driver = await Driver.findById(ride.driver._id)
            driver.status = 'available'
            await driver.save()
            io.to(`user_${ride.user._id}`).emit('rideCompleted')
        })

        socket.on('disconnect', () => {
            console.log('User disconnected: ' + socket.id)
        })
    })

    return io
}

module.exports = initializeSocket
