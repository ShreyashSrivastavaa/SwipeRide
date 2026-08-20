const request = require('supertest')
const { app } = require('../app')
const { connectTestDB, clearTestDB, closeTestDB } = require('./setup')

jest.setTimeout(60000)

beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = 'test_jwt_secret_key_12345'
    process.env.JWT_EXPIRES_IN = '1d'
    process.env.BASE_FARE = '300'
    process.env.COST_PER_KM = '150'
    await connectTestDB()
})

afterEach(async () => {
    await clearTestDB()
})

afterAll(async () => {
    await closeTestDB()
})

describe('SwipeRide Ride Lifecycle State Machine', () => {
    let riderToken, riderId, driverToken, driverId

    beforeEach(async () => {
        // Create Rider
        const riderRes = await request(app).post('/api/v1/auth/user').send({
            name: 'Kola Rider',
            phone: '+2348011111111',
            email: 'kola@example.com',
            password: 'Password123!',
        })
        riderToken = riderRes.body.data.token
        riderId = riderRes.body.data.id

        // Create Driver
        const driverRes = await request(app).post('/api/v1/auth/driver').send({
            name: 'Emeka Driver',
            phone: '+2348022222222',
            email: 'emeka@driver.com',
            password: 'DriverPassword123!',
            motorcycleType: 'Bajaj Boxer 150',
            motorcycleColor: 'Red',
            licenseNumber: 'DRV-LAG-5544',
            motorcycleNumber: 'LSR-998-AB',
            motorcycleYear: '2022',
            address: {
                street: '5 Yaba Road',
                city: 'Yaba',
                state: 'Lagos',
                country: 'Nigeria',
                postalCode: '100001',
            },
        })
        driverToken = driverRes.body.data.token
        driverId = driverRes.body.data.id

        // Driver sets location and goes available
        await request(app)
            .put('/api/v1/drivers/location')
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ coordinates: [3.3792, 6.5244] })

        await request(app)
            .put('/api/v1/drivers/status')
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ status: 'available' })
    })

    test('Full Ride Lifecycle: Request -> Accept -> Start -> Complete -> Rate -> History', async () => {
        // 1. Rider requests a ride
        const rideReqRes = await request(app)
            .post('/api/v1/rides')
            .set('Authorization', `Bearer ${riderToken}`)
            .send({
                pickupLocation: 'Yaba, Lagos',
                dropoffLocations: ['Victoria Island, Lagos'],
            })

        expect(rideReqRes.status).toBe(201)
        expect(rideReqRes.body.success).toBe(true)
        const rideId = rideReqRes.body.data._id
        expect(rideId).toBeDefined()
        expect(rideReqRes.body.data.status).toBe('pending')
        expect(rideReqRes.body.data.fare).toBeGreaterThan(0)

        // 2. Driver accepts ride (pending -> accepted)
        const acceptRes = await request(app)
            .patch(`/api/v1/rides/status/${rideId}`)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ status: 'accepted' })

        expect(acceptRes.status).toBe(200)
        expect(acceptRes.body.data.status).toBe('accepted')

        // 3. Driver starts ride (accepted -> inProgress)
        const startRes = await request(app)
            .patch(`/api/v1/rides/status/${rideId}`)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ status: 'inProgress' })

        expect(startRes.status).toBe(200)
        expect(startRes.body.data.status).toBe('inProgress')

        // 4. Driver completes ride (inProgress -> completed)
        const completeRes = await request(app)
            .patch(`/api/v1/rides/status/${rideId}`)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ status: 'completed' })

        expect(completeRes.status).toBe(200)
        expect(completeRes.body.data.status).toBe('completed')
        expect(completeRes.body.data.paymentStatus).toBe('paid')
        expect(completeRes.body.data.driverEarnings).toBeGreaterThan(0)

        // 5. Driver wallet updated
        const walletRes = await request(app)
            .get('/api/v1/drivers/wallet')
            .set('Authorization', `Bearer ${driverToken}`)
        expect(walletRes.status).toBe(200)
        expect(walletRes.body.walletBalance).toBeGreaterThan(0)

        // 6. Rider submits a rating (5 stars)
        const rateRes = await request(app)
            .post(`/api/v1/ratings/${rideId}/rate`)
            .set('Authorization', `Bearer ${riderToken}`)
            .send({
                rating: 5,
                comment: 'Fast ride through traffic! Very careful driver.',
            })

        expect(rateRes.status).toBe(201)
        expect(rateRes.body.success).toBe(true)

        // 7. Duplicate rating prevented
        const duplicateRateRes = await request(app)
            .post(`/api/v1/ratings/${rideId}/rate`)
            .set('Authorization', `Bearer ${riderToken}`)
            .send({
                rating: 4,
                comment: 'Second attempt',
            })
        expect(duplicateRateRes.status).toBe(400)

        // 8. Rider views ride history
        const historyRes = await request(app)
            .get('/api/v1/rides/history')
            .set('Authorization', `Bearer ${riderToken}`)

        expect(historyRes.status).toBe(200)
        expect(historyRes.body.count).toBe(1)
        expect(historyRes.body.data[0]._id).toBe(rideId)
    })

    test('Invalid state transition is rejected with 400', async () => {
        // Request a ride (status = pending)
        const rideReqRes = await request(app)
            .post('/api/v1/rides')
            .set('Authorization', `Bearer ${riderToken}`)
            .send({
                pickupLocation: 'Ikeja, Lagos',
                dropoffLocations: ['Lekki, Lagos'],
            })

        const rideId = rideReqRes.body.data._id

        // Attempting to jump directly from pending to completed should fail
        const invalidTransitionRes = await request(app)
            .patch(`/api/v1/rides/status/${rideId}`)
            .set('Authorization', `Bearer ${driverToken}`)
            .send({ status: 'completed' })

        expect(invalidTransitionRes.status).toBe(400)
    })
})
