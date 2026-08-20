const request = require('supertest')
const { app } = require('../app')
const { connectTestDB, clearTestDB, closeTestDB } = require('./setup')

jest.setTimeout(60000)

beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = 'test_jwt_secret_key_12345'
    process.env.JWT_EXPIRES_IN = '1d'
    await connectTestDB()
})

afterEach(async () => {
    await clearTestDB()
})

afterAll(async () => {
    await closeTestDB()
})

describe('SwipeRide Auth API', () => {
    const validUser = {
        name: 'Test Rider',
        phone: '+2348012345678',
        email: 'rider@example.com',
        password: 'Password123!',
    }

    const validDriver = {
        name: 'Test Driver',
        phone: '+2348098765432',
        email: 'driver@example.com',
        password: 'DriverPassword123!',
        motorcycleType: 'Yamaha Crux 110',
        motorcycleColor: 'Black',
        licenseNumber: 'DRV-LAG-8899',
        motorcycleNumber: 'KJA-123-AA',
        motorcycleYear: '2023',
        address: {
            street: '10 Alpha Street',
            city: 'Ikeja',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
        },
    }

    const validAdmin = {
        name: 'Test Admin',
        phone: '+2348000000000',
        email: 'admin@swiperide.com',
        password: 'AdminPassword123!',
        address: {
            street: '1 Broad St',
            city: 'Lagos Island',
            state: 'Lagos',
            country: 'Nigeria',
            postalCode: '100001',
        },
    }

    test('1. Register User successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/user')
            .send(validUser)
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.token).toBeDefined()
        expect(res.body.data.role).toBe('user')
    })

    test('2. Register User fails with duplicate phone', async () => {
        await request(app).post('/api/v1/auth/user').send(validUser)
        const res = await request(app).post('/api/v1/auth/user').send(validUser)
        expect(res.status).toBe(400)
    })

    test('3. Register Driver successfully with motorcycle details', async () => {
        const res = await request(app)
            .post('/api/v1/auth/driver')
            .send(validDriver)
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.role).toBe('driver')
    })

    test('4. Register Admin successfully', async () => {
        const res = await request(app)
            .post('/api/v1/auth/admin')
            .send(validAdmin)
        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.data.role).toBe('admin')
    })

    test('5. Login with valid email and password', async () => {
        await request(app).post('/api/v1/auth/user').send(validUser)
        const res = await request(app).post('/api/v1/auth/login').send({
            loginMethod: 'email',
            identifier: 'rider@example.com',
            password: 'Password123!',
        })
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.token).toBeDefined()
        expect(res.body.data.name).toBe('Test Rider')
    })

    test('6. Login with valid phone and password', async () => {
        await request(app).post('/api/v1/auth/user').send(validUser)
        const res = await request(app).post('/api/v1/auth/login').send({
            loginMethod: 'phone',
            identifier: '+2348012345678',
            password: 'Password123!',
        })
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data.token).toBeDefined()
    })

    test('7. Login fails with incorrect password (returns 401)', async () => {
        await request(app).post('/api/v1/auth/user').send(validUser)
        const res = await request(app).post('/api/v1/auth/login').send({
            loginMethod: 'email',
            identifier: 'rider@example.com',
            password: 'WrongPassword999!',
        })
        expect(res.status).toBe(401)
        expect(res.body.msg).toBe('Invalid credentials')
    })

    test('8. Login fails with non-existent user (returns 401)', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({
            loginMethod: 'email',
            identifier: 'ghost@example.com',
            password: 'Password123!',
        })
        expect(res.status).toBe(401)
        expect(res.body.msg).toBe('Invalid credentials')
    })

    test('9. Protected route with valid token returns profile', async () => {
        const reg = await request(app).post('/api/v1/auth/user').send(validUser)
        const token = reg.body.data.token

        const res = await request(app)
            .get('/api/v1/users/profile')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(200)
        expect(res.body.data.name).toBe('Test Rider')
    })

    test('10. Protected route without token returns 401', async () => {
        const res = await request(app).get('/api/v1/users/profile')
        expect(res.status).toBe(401)
    })

    test('11. User accessing Admin route receives 403 Forbidden', async () => {
        const reg = await request(app).post('/api/v1/auth/user').send(validUser)
        const token = reg.body.data.token

        const res = await request(app)
            .get('/api/v1/admins/profile')
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(403)
    })

    test('12. Send OTP and verify OTP endpoint flow', async () => {
        const otpRes = await request(app).post('/api/v1/auth/send-otp').send({
            identifier: '+2348012345678',
            verificationMethod: 'phone',
        })
        expect(otpRes.status).toBe(200)
        const devOtp = otpRes.body.devOtp

        if (devOtp) {
            const verifyRes = await request(app).post('/api/v1/auth/verify-otp').send({
                identifier: '+2348012345678',
                otp: devOtp,
                verificationMethod: 'phone',
            })
            expect(verifyRes.status).toBe(200)
            expect(verifyRes.body.success).toBe(true)
        }
    })
})
