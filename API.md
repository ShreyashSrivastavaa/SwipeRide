# SwipeRide API Specification

Base URL: `http://localhost:5000/api/v1`  
WebSocket Path: `ws://localhost:5000/ws` (transports: `['websocket']`)

---

## 1. Authentication (`/api/v1/auth`)

### 1.1 Register Rider
- **Endpoint:** `POST /auth/user`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Alex Johnson",
  "phone": "+2348012345678",
  "email": "alex@example.com",
  "password": "Password123!",
  "preferredLanguage": "en",
  "paymentMethod": "cash"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alex Johnson",
    "phone": "+2348012345678",
    "email": "alex@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Register Driver
- **Endpoint:** `POST /auth/driver`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "David Okon",
  "email": "david@driver.swiperide.com",
  "phone": "+2348098765432",
  "password": "DriverSecret123!",
  "motorcycleType": "Yamaha Crux 110",
  "motorcycleColor": "Matte Black",
  "licenseNumber": "DRV-LAG-2024-9912",
  "motorcycleNumber": "KJA-482-XY",
  "motorcycleYear": 2023,
  "address": {
    "street": "14 Commercial Avenue",
    "city": "Yaba",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "100001"
  }
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Driver registered successfully.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "David Okon",
    "email": "david@driver.swiperide.com",
    "phone": "+2348098765432",
    "role": "driver",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Register Admin
- **Endpoint:** `POST /auth/admin`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "System Admin",
  "email": "admin@swiperide.com",
  "phone": "+2348000000000",
  "password": "AdminSuperPassword123!",
  "address": {
    "street": "1 Marina Blvd",
    "city": "Lagos Island",
    "state": "Lagos",
    "country": "Nigeria",
    "postalCode": "100001"
  }
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Admin registered successfully.",
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "System Admin",
    "email": "admin@swiperide.com",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.4 Login (Password or OTP)
- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Request Body (Password Login):**
```json
{
  "loginMethod": "email",
  "identifier": "alex@example.com",
  "password": "Password123!"
}
```
- **Request Body (Phone Login):**
```json
{
  "loginMethod": "phone",
  "identifier": "+2348012345678",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+2348012345678",
    "role": "user",
    "profilePicture": "default-avatar.jpg",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Response (401 Unauthorized):**
```json
{
  "msg": "Invalid credentials"
}
```

### 1.5 Send OTP
- **Endpoint:** `POST /auth/send-otp`
- **Access:** Public
- **Request Body:**
```json
{
  "identifier": "+2348012345678",
  "verificationMethod": "phone"
}
```

### 1.6 Verify OTP
- **Endpoint:** `POST /auth/verify-otp`
- **Access:** Public
- **Request Body:**
```json
{
  "identifier": "+2348012345678",
  "otp": "839201",
  "verificationMethod": "phone"
}
```

### 1.7 Logout
- **Endpoint:** `POST /auth/logout`
- **Access:** Public / Authenticated

---

## 2. Rides (`/api/v1/rides`)

### 2.1 Request a Ride
- **Endpoint:** `POST /rides`
- **Access:** Protected (`user`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "pickupLocation": "Yaba Tech, Lagos",
  "dropoffLocations": ["Victoria Island, Lagos"]
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a5e1c4d5e6f7a8b9c0e5",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Alex Johnson",
      "phone": "+2348012345678"
    },
    "driver": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "David Okon",
      "phone": "+2348098765432",
      "motorcycleType": "Yamaha Crux 110",
      "motorcycleColor": "Matte Black",
      "motorcycleNumber": "KJA-482-XY",
      "ratings": 4.9
    },
    "pickupLocation": {
      "type": "Point",
      "coordinates": [3.3853, 6.5167]
    },
    "dropoffLocations": [
      {
        "type": "Point",
        "coordinates": [3.4219, 6.4281]
      }
    ],
    "distance": 11.8,
    "duration": 24,
    "fare": 2070,
    "eta": 4,
    "status": "pending",
    "paymentStatus": "pending"
  }
}
```

### 2.2 Update Pending Ride
- **Endpoint:** `PUT /rides/:id`
- **Access:** Protected (`user`)
- **Request Body:**
```json
{
  "pickupLocation": "Yaba Tech Gate, Lagos",
  "dropoffLocations": ["Marina, Lagos"]
}
```

### 2.3 Update Ride Status (Driver)
- **Endpoint:** `PATCH /rides/status/:id`
- **Access:** Protected (`driver`)
- **Request Body:**
```json
{
  "status": "accepted" 
}
```
*Valid transitions: `pending -> accepted -> inProgress -> completed` (or `canceled`).*

### 2.4 Ride History
- **Endpoint:** `GET /rides/history?page=1&limit=10`
- **Access:** Protected (`user` or `driver`)
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "totalRides": 14,
  "totalPages": 2,
  "currentPage": 1,
  "data": [ ... ]
}
```

### 2.5 Ride Details
- **Endpoint:** `GET /rides/:id`
- **Access:** Protected (`user`, `driver`, `admin`)

---

## 3. Ratings (`/api/v1/ratings`)

### 3.1 Rate Completed Ride
- **Endpoint:** `POST /ratings/:rideId/rate`
- **Access:** Protected (`user`)
- **Request Body:**
```json
{
  "rating": 5,
  "comment": "Quick lane navigation through traffic. Very clean helmet!"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": {
    "ride": "64f1a5e1c4d5e6f7a8b9c0e5",
    "user": "64f1a2b3c4d5e6f7a8b9c0d1",
    "driver": "64f1a2b3c4d5e6f7a8b9c0d2",
    "rating": 5,
    "comment": "Quick lane navigation through traffic. Very clean helmet!"
  }
}
```

### 3.2 Get Ratings for Ride
- **Endpoint:** `GET /ratings/:rideId/ratings`
- **Access:** Public

---

## 4. Drivers (`/api/v1/drivers`)

- `GET    /drivers/profile` — Driver profile & bike metadata
- `PATCH  /drivers/profile` — Update driver profile
- `GET    /drivers/wallet` — Driver wallet balance & debt
- `GET    /drivers/earnings` — Earnings filtered by `startDate` & `endDate`
- `GET    /drivers/earnings/report?reportType=daily|weekly` — Aggregated report
- `PUT    /drivers/status` — `{ "status": "available" | "unavailable" }`
- `PUT    /drivers/location` — `{ "coordinates": [3.3792, 6.5244] }`
- `GET    /drivers` — List all drivers (Admin only)
- `PATCH  /drivers/:id` — Admin edit driver
- `DELETE /drivers/:id` — Admin delete driver

---

## 5. Users (`/api/v1/users`)

- `GET    /users/profile` — Current user profile
- `GET    /users/:id` — User profile by ID
- `PATCH  /users/profile` — Update self profile
- `GET    /users` — List all users (Admin only)
- `PATCH  /users/:id` — Admin edit user
- `DELETE /users/:id` — Admin delete user

---

## 6. File Uploads (`/api/v1/upload`)

- **Endpoint:** `POST /upload`
- **Access:** Protected (`user`, `driver`, `admin`)
- **Content-Type:** `multipart/form-data`
- **Form Fields:** `image` (file, max 5MB), `updateProfile` (optional boolean)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "/uploads/1724198400000_a1b2c3.jpg"
}
```

---

## 7. Admins (`/api/v1/admins`)

- `GET /admins/profile` — Admin profile
- `PUT /admins/:id` — `{ "suspend": true | false }` Suspend/unsuspend driver

---

## 8. Real-Time WebSocket Protocol (`/ws`)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join` | Client -> Server | `{ "userId": "...", "driverId": "..." }` | Join dedicated user/driver room |
| `driverLocationUpdate` | Driver -> Server | `{ "driverId": "...", "lat": 6.52, "lng": 3.37 }` | Real-time GPS coordinate ping |
| `requestRide` | Rider -> Server | `{ "userId": "...", "pickupLocation": "...", "dropoffLocation": "..." }` | Initiate instant socket match |
| `rideRequest` | Server -> Driver | `{ "userId": "...", "pickupLocation": "...", "dropoffLocation": "..." }` | Push incoming request to driver |
| `rideResponse` | Driver -> Server | `{ "rideId": "...", "driverId": "...", "accepted": true }` | Driver accepts/declines ride |
| `rideAccepted` | Server -> Rider | `{ "driver": {...}, "eta": 4 }` | Notify rider of accepted ride |
| `driverArrived` | Driver -> Server | `{ "rideId": "..." }` | Driver arrived at pickup |
| `rideStarted` | Driver -> Server | `{ "rideId": "..." }` | Ride in progress |
| `rideCompleted`| Driver -> Server | `{ "rideId": "..." }` | Trip completed |
