# SwipeRide 🏍️
![SwipeRide Banner](./images/banner.png)

SwipeRide is a production-grade, real-time motorcycle ride-hailing API. Optimized for scalability and security, it features a low-latency driver-matching engine, Redis-backed location tracking, and a robust payment integration architecture.

## 🚀 Key Features

*   **Real-time Matching**: Efficient driver-passenger matching using Socket.io Rooms and Geospatial indexing.
*   **Scalable Architecture**: Highly optimized MongoDB schema designed to handle unlimited ride history without document size issues.
*   **Secure Auth**: Multi-role JWT-based authentication with Firebase integration for mobile notifications.
*   **Redis Caching**: Ultra-fast driver location tracking.
*   **API Documentation**: Comprehensive documentation for easy frontend integration.

## 📋 Table of Contents

-   [Features](#features)
-   [Technologies](#technologies)
-   [Setup](#setup)
-   [Environment Variables](#environment-variables)
-   [API Endpoints](#api-endpoints)
-   [License](#license)

## 🌟 Features

-   User, Driver, and Admin registration and authentication.
-   Login and logout functionality with **JWT**.
-   Email and SMS verification for new users.
-   Motorcycle ride request and dynamic driver matching using **Google Maps API**.
-   Payment integration using **Paystack**.
-   Driver ratings and reviews system.
-   Admin can suspend drivers.
-   Multiple pickup and drop-off locations for rides.
-   Real-time ride tracking with WebSockets.
-   Driver availability and location tracking in real-time.
-   Dynamic radius for driver search with radius expansion if no drivers are found.
-   WebSocket optimization with **Redis** for in-memory driver location tracking.
-   Race condition prevention using **MongoDB transactions**.
-   Granular error handling for external services like **Google Maps API**.
-   Real-time driver matching using WebSockets.
-   Distance-based fare calculation using **Google Maps API**.
-   Geospatial queries with **MongoDB’s $geoNear** for nearby driver searches.
-   Periodic driver location updates.
-   Ride status management (e.g., pending, in-progress).
-   Driver selection based on ratings and ride history.

## 🛠️ Technologies

-   **Node.js** (JavaScript runtime)
-   **Express.js** (Web framework for Node.js)
-   **MongoDB** with **Mongoose** (NoSQL Database)
-   **JWT** (JSON Web Tokens for Authentication)
-   **Bcrypt.js** (Password hashing)
-   **Paystack** (Payment gateway)
-   **Google Maps API** (Geolocation services)
-   **Nodemailer** (Email sending)
-   **Redis** (In-memory caching for WebSocket optimization)
-   **WebSockets** (Real-time communication for ride tracking)

## ⚙️ Setup

To run this project locally, follow these steps:

### Prerequisites:

-   **Node.js** installed on your system
-   **MongoDB** running locally or using a cloud service like **MongoDB Atlas**
-   A **Paystack** account for payment integration
-   **Google Maps API** credentials for geolocation services
-   **Redis** for WebSocket optimization (optional but recommended)

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/freedom-backend.git
cd freedom-backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freedom-app
JWT_SECRET=yourSecretKey
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=yourPaystackSecretKey
GOOGLE_MAPS_API_KEY=yourGoogleMapsAPIKey
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=yourEmailUsername
EMAIL_PASS=yourEmailPassword
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Step 4: Run the application

```bash
npm start
```

The application will be running at `http://localhost:3000`.

## 🌍 Environment Variables

The app requires the following environment variables to function correctly:

-   `PORT`: The port on which the server will run.
-   `MONGO_URI`: The MongoDB connection string.
-   `JWT_SECRET`: The secret key used to sign JWT tokens.
-   `JWT_EXPIRES_IN`: The expiration time for JWT tokens.
-   `PAYSTACK_SECRET_KEY`: The secret key for Paystack payment integration.
-   `GOOGLE_MAPS_API_KEY`: Your Google Maps API key for geolocation.
-   `EMAIL_SERVICE`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: These are used for email services (e.g., verification emails).
-   `REDIS_HOST`, `REDIS_PORT`: For in-memory caching of driver locations.

## 🚦 API Endpoints

# Authentication Service

## Overview

This authentication service handles the registration and login functionalities for users, drivers, and admins. It provides endpoints to create accounts, authenticate users, and log out of the system.

## Endpoints

### 1. Register User

**Endpoint:** `POST /auth/user`

**Request Body:**

```json
{
    "name": "John Doe",
    "phone": "1234567890"
}
```

**Response:**

-   **201 Created:**

```json
{
    "success": true,
    "message": "User registered successfully."
}
```

-   **400 Bad Request:** User already exists with this phone number.

---

### 2. Register Driver

**Endpoint:** `POST /auth/driver`

**Request Body:**

```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "profilePicture": "http://example.com/profile.jpg",
    "motorcycleType": "Honda",
    "motorcycleColor": "Black",
    "licenseNumber": "AB123456",
    "motorcycleNumber": "XYZ789",
    "motorcycleYear": 2020,
    "address": "123 Main Street"
}
```

**Response:**

-   **201 Created:**

```json
{
    "success": true,
    "message": "Driver registered successfully."
}
```

-   **400 Bad Request:** Driver already exists.

---

### 3. Register Admin

**Endpoint:** `POST /auth/admin`

**Request Body:**

```json
{
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "555666777",
    "address": "456 Admin Street"
}
```

**Response:**

-   **201 Created:**

```json
{
    "success": true,
    "message": "Admin registered successfully."
}
```

-   **400 Bad Request:** Admin already exists.

---

### 4. Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
    "loginMethod": "email",
    "identifier": "jane@example.com"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "data": {
        "id": "64dfc1a5eabc123456789",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "driver",
        "token": "<jwt-token>"
    }
}
```

-   **400 Bad Request:** Invalid login method or missing fields.
-   **401 Unauthorized:** Invalid credentials.

---

### 5. Logout

**Endpoint:** `POST /auth/logout`

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

## Validation

The request payloads are validated using middleware and the following validator rules:

-   **userValidator:** Ensures name and phone are provided.
-   **registerDriverValidator:** Validates all driver fields (e.g., email, phone, motorcycle details).
-   **adminValidator:** Ensures name, email, phone, and address are valid.
-   **loginValidator:** Checks loginMethod and identifier.

## Error Handling

-   **400 Bad Request:** Invalid input or duplicate entries.
-   **401 Unauthorized:** Incorrect credentials during login.
-   **500 Internal Server Error:** Unhandled exceptions.

## Utilities

-   `generateToken`: Used for creating JWT tokens.
-   `validate`: Middleware for request validation.

# User Service

## Overview

This user service manages user profiles and provides endpoints for retrieving, updating, and deleting user data. Admin-specific routes are also included for managing users.

## Endpoints

### 1. Get My Profile

**Endpoint:** `GET /users/:id`

**Headers:**

```json
{
    "Authorization": "Bearer <jwt-token>"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "data": {
        "id": "64dfc1a5eabc123456789",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
    }
}
```

-   **404 Not Found:** User not found.

---

### 2. Update My Profile

**Endpoint:** `PATCH /users/profile`

**Headers:**

```json
{
    "Authorization": "Bearer <jwt-token>"
}
```

**Request Body:**

```json
{
    "name": "John Updated",
    "phone": "0987654321"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "data": {
        "id": "64dfc1a5eabc123456789",
        "name": "John Updated",
        "phone": "0987654321"
    }
}
```

-   **404 Not Found:** User not found.

---

### 3. Get All Users (Admin Only)

**Endpoint:** `GET /users`

**Headers:**

```json
{
    "Authorization": "Bearer <jwt-token>"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "id": "64dfc1a5eabc123456789",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890"
        },
        {
            "id": "64dfc1a5eabc987654321",
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "9876543210"
        }
    ]
}
```

---

### 4. Update User Profile by ID (Admin Only)

**Endpoint:** `PATCH /users/:id`

**Headers:**

```json
{
    "Authorization": "Bearer <jwt-token>"
}
```

**Request Body:**

```json
{
    "name": "Jane Updated",
    "phone": "1112223333"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "data": {
        "id": "64dfc1a5eabc987654321",
        "name": "Jane Updated",
        "phone": "1112223333"
    }
}
```

-   **404 Not Found:** User not found.

---

### 5. Delete User (Admin Only)

**Endpoint:** `DELETE /users/:id`

**Headers:**

```json
{
    "Authorization": "Bearer <jwt-token>"
}
```

**Response:**

-   **200 OK:**

```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

-   **404 Not Found:** User not found.

## Validation

The request payloads are validated using middleware and the following validator rules:

-   **userValidator:** Ensures valid input for updating profiles.

## Error Handling

-   **404 Not Found:** When a user is not found in the database.
-   **500 Internal Server Error:** For unhandled exceptions.

## Utilities

-   **protect:** Middleware for verifying JWT tokens.
-   **isUser:** Middleware for ensuring the user role.
-   **isAdmin:** Middleware for admin-specific operations.

# Driver Service

## Overview

The `driverController` and `driverRoutes` modules provide functionality for managing driver-related operations in your e-hailing application. These endpoints allow authenticated drivers and administrators to perform actions such as viewing profiles, updating statuses, managing locations, fetching wallet balances, and generating earnings reports.

## Endpoints

### 1. Get Driver Profile

**URL**: `/driver/profile`  
**Method**: GET  
**Access**: Protected (Driver only)  
**Description**: Fetches the authenticated driver's profile details.

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
    "success": true,
    "data": {
        "_id": "driverId",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "1234567890",
        "status": "active",
        "location": {
            "coordinates": [12.345, 67.89]
        }
    }
}
```

### 2. Update Driver Status

**URL**: `/driver/status`  
**Method**: PUT  
**Access**: Protected (Driver only)  
**Description**: Updates the driver's availability status.

**Request Body**:

```json
{
    "status": "active"
}
```

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
    "success": true,
    "data": {
        "_id": "driverId",
        "status": "active",
        "lastActiveAt": "2025-01-27T12:34:56.789Z"
    }
}
```

### 3. Update Driver Location

**URL**: `/driver/location`  
**Method**: PUT  
**Access**: Protected (Driver only)  
**Description**: Updates the driver's current location.

**Request Body**:

```json
{
    "coordinates": [12.345, 67.89]
}
```

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
    "success": true,
    "data": {
        "_id": "driverId",
        "location": {
            "coordinates": [12.345, 67.89]
        },
        "lastActiveAt": "2025-01-27T12:34:56.789Z"
    }
}
```

### 4. Get Driver Wallet Balance

**URL**: `/driver/wallet`  
**Method**: GET  
**Access**: Protected (Driver only)  
**Description**: Fetches the authenticated driver's wallet balance.

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
    "success": true,
    "walletBalance": 1000.0
}
```

### 5. Get Driver Earnings (Date Filter)

**URL**: `/driver/earnings`  
**Method**: GET  
**Access**: Protected (Driver only)  
**Description**: Retrieves the driver's earnings for rides completed within the specified date range.

**Query Parameters**:

-   `startDate` (optional): Start date for filtering earnings.
-   `endDate` (optional): End date for filtering earnings.

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
  "success": true,
  "totalEarnings": 500.0,
  "rideCount": 10,
  "rides": [
    {
      "rideId": "ride1",
      "completedAt": "2025-01-01T10:00:00.000Z",
      "driverEarnings": 50.0
    },
    ...
  ]
}
```

### 6. Get Driver Earnings Report

**URL**: `/earnings/report`  
**Method**: GET  
**Access**: Protected (Driver only)  
**Description**: Generates a daily or weekly earnings report for the driver.

**Query Parameters**:

-   `reportType`: `daily` or `weekly`.

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
  "success": true,
  "reportType": "daily",
  "earningsReport": [
    {
      "_id": "2025-01-01",
      "totalEarnings": 100.0,
      "rideCount": 2
    },
    ...
  ]
}
```

### 7. Get All Drivers (Admin Only)

**URL**: `/driver`  
**Method**: GET  
**Access**: Protected (Admin only)  
**Description**: Retrieves all registered drivers with pagination.

**Query Parameters**:

-   `page`: Page number (default: 1).
-   `limit`: Number of drivers per page (default: 10).

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "driverId",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "1234567890",
      "status": "active"
    },
    ...
  ]
}
```

### 8. Delete Driver (Admin Only)

**URL**: `/driver/:id`  
**Method**: DELETE  
**Access**: Protected (Admin only)  
**Description**: Deletes a driver's account.

**Request Header**:

```json
{
    "Authorization": "Bearer <token>"
}
```

**Response**:

-   **200 OK**:

```json
{
    "success": true,
    "message": "Driver account deleted successfully"
}
```

## Notes

-   Use proper authentication headers (JWT tokens) for all protected routes.
-   Validation middleware ensures that request bodies and query parameters meet requirements.
-   Pagination is implemented for admin endpoints to manage large datasets.

# Admin Service

## Overview

The Admin API is designed to allow administrative users to manage the application, including viewing their profile and managing drivers. All routes require authentication and are restricted to users with admin privileges.

---

## Admin Controller

### 1. Get Admin Profile

**Endpoint:** `GET /admin/profile`

-   **Description:** Retrieve the profile information of the currently authenticated admin.
-   **Access Level:** Admin Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "string",
                "name": "string",
                "email": "string"
            }
        }
        ```
-   **Errors:**
    -   404 Not Found: Admin not found.

### 2. Suspend or Unsuspend Driver

**Endpoint:** `PUT /admin/:id`

-   **Description:** Suspend or unsuspend a driver account.
-   **Access Level:** Admin Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Parameters:**
        -   `id`: The ID of the driver to be suspended/unsuspended.
    -   **Body:**
        ```json
        {
            "suspend": true
        }
        ```
        -   `suspend`: A boolean value indicating whether to suspend (`true`) or unsuspend (`false`) the driver.
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "message": "Driver suspended successfully"
        }
        ```
        or
        ```json
        {
            "success": true,
            "message": "Driver unsuspended successfully"
        }
        ```
-   **Errors:**
    -   404 Not Found: Driver not found.

---

## Admin Routes

### Route Table

| HTTP Method | Endpoint   | Description                 | Access Level |
| ----------- | ---------- | --------------------------- | ------------ |
| GET         | `/profile` | Get admin profile           | Admin Only   |
| PUT         | `/:id`     | Suspend or unsuspend driver | Admin Only   |

### Middleware

-   **protect:** Ensures the user is authenticated.
-   **isAdmin:** Ensures the user has admin privileges.
-   **verifyUser:** (Optional) Additional validation for user identity (if needed).

---

## Notes

-   All endpoints require a valid JWT token passed in the `Authorization` header.
-   Ensure proper error handling and logging for debugging and monitoring purposes.
-   Validate all input to prevent malicious data from being processed.

# Ride Service

## Overview

This document provides a comprehensive overview of the Ride API endpoints. The Ride API facilitates ride creation, updates, and management for users, drivers, and administrators. It includes features like dynamic driver matching, fare calculation, ride status updates, and history retrieval.

---

## Ride Controller

### 1. Create a Ride

**Endpoint:** `POST /rides`

-   **Description:** Creates a new ride with dynamic driver matching and supports multiple drop-off locations.
-   **Access Level:** User Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Body:**
        ```json
        {
            "pickupLocation": "string",
            "dropoffLocations": ["string", "string"]
        }
        ```
-   **Response:**
    -   **Status Code:** 201 Created
    -   **Body:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "string",
                "user": "string",
                "driver": "string",
                "pickupLocation": {
                    "type": "Point",
                    "coordinates": ["number", "number"]
                },
                "dropoffLocations": [
                    {
                        "type": "Point",
                        "coordinates": ["number", "number"]
                    }
                ],
                "fare": "number",
                "eta": "number",
                "status": "string"
            }
        }
        ```
-   **Errors:**
    -   404 Not Found: User not found.
    -   404 Not Found: No available drivers found.
    -   400 Bad Request: Invalid location data.

### 2. Update a Ride

**Endpoint:** `PUT /rides/:id`

-   **Description:** Updates the details of an existing ride, including pickup and drop-off locations.
-   **Access Level:** User Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Parameters:**
        -   `id`: The ID of the ride to update.
    -   **Body:**
        ```json
        {
            "pickupLocation": "string",
            "dropoffLocations": ["string", "string"]
        }
        ```
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "string",
                "pickupLocation": {
                    "type": "Point",
                    "coordinates": ["number", "number"]
                },
                "dropoffLocations": [
                    {
                        "type": "Point",
                        "coordinates": ["number", "number"]
                    }
                ],
                "fare": "number"
            }
        }
        ```
-   **Errors:**
    -   404 Not Found: Ride not found.
    -   400 Bad Request: Invalid location data.

### 3. Update Ride Status by Driver

**Endpoint:** `PATCH /rides/status/:id`

-   **Description:** Allows a driver to update the status of a ride (e.g., pending, accepted, in-progress, completed).
-   **Access Level:** Driver Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Parameters:**
        -   `id`: The ID of the ride.
    -   **Body:**
        ```json
        {
            "status": "string"
        }
        ```
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "message": "Ride status updated to completed",
            "data": {
                "_id": "string",
                "status": "string",
                "completedAt": "string"
            }
        }
        ```
-   **Errors:**
    -   404 Not Found: Ride not found.
    -   400 Bad Request: Invalid status transition or unauthorized driver.

### 4. Get Ride Details

**Endpoint:** `GET /rides/:id`

-   **Description:** Retrieves details of a specific ride.
-   **Access Level:** User or Driver
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Parameters:**
        -   `id`: The ID of the ride.
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "data": {
                "_id": "string",
                "user": {
                    "name": "string",
                    "email": "string"
                },
                "driver": {
                    "name": "string",
                    "email": "string"
                },
                "pickupLocation": {
                    "type": "Point",
                    "coordinates": ["number", "number"]
                },
                "dropoffLocations": [
                    {
                        "type": "Point",
                        "coordinates": ["number", "number"]
                    }
                ],
                "fare": "number",
                "status": "string"
            }
        }
        ```
-   **Errors:**
    -   404 Not Found: Ride not found.

### 5. Get Ride History

**Endpoint:** `GET /rides/history`

-   **Description:** Retrieves ride history for the authenticated user or driver.
-   **Access Level:** User or Driver
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "count": 2,
            "data": [
                {
                    "_id": "string",
                    "pickupLocation": {
                        "type": "Point",
                        "coordinates": ["number", "number"]
                    },
                    "dropoffLocations": [
                        {
                            "type": "Point",
                            "coordinates": ["number", "number"]
                        }
                    ],
                    "fare": "number",
                    "status": "string"
                }
            ]
        }
        ```
-   **Errors:**
    -   400 Bad Request: Unauthorized access.

### 6. Get All Rides (Admin Only)

**Endpoint:** `GET /rides`

-   **Description:** Retrieves all rides in the system. Admin only.
-   **Access Level:** Admin Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "count": 10,
            "data": [
                {
                    "_id": "string",
                    "user": {
                        "name": "string",
                        "email": "string"
                    },
                    "driver": {
                        "name": "string",
                        "email": "string"
                    },
                    "pickupLocation": {
                        "type": "Point",
                        "coordinates": ["number", "number"]
                    },
                    "dropoffLocations": [
                        {
                            "type": "Point",
                            "coordinates": ["number", "number"]
                        }
                    ],
                    "fare": "number",
                    "status": "string"
                }
            ]
        }
        ```

### 7. Delete a Ride (Admin Only)

**Endpoint:** `DELETE /rides/:id`

-   **Description:** Deletes a ride by its ID. Admin only.
-   **Access Level:** Admin Only
-   **Request:**
    -   **Headers:**
        -   Authorization: Bearer `<token>`
    -   **Parameters:**
        -   `id`: The ID of the ride to delete.
-   **Response:**
    -   **Status Code:** 200 OK
    -   **Body:**
        ```json
        {
            "success": true,
            "message": "Ride deleted successfully"
        }
        ```
-   **Errors:**
    -   404 Not Found: Ride not found.

---

## Ride Routes

### Route Table

| HTTP Method | Endpoint      | Description                  | Access Level |
| ----------- | ------------- | ---------------------------- | ------------ |
| POST        | `/`           | Create a new ride            | User Only    |
| PUT         | `/:id`        | Update ride details          | User Only    |
| PATCH       | `/status/:id` | Update ride status by driver | Driver Only  |
| GET         | `/history`    | Get ride history             | User/Driver  |
| GET         | `/:id`        | Get ride details             | User/Driver  |
| GET         | `/`           | Get all rides (by Admin)     | Admin Only   |

### Rating Service

This document outlines the endpoints and data used for rating a ride and retrieving ratings for a specific ride in your application.

#### 1. **Rate a Ride**

-   **Endpoint**: `POST /:rideId/rate`
-   **Description**: Allows a user to rate a specific ride with a rating and optional comment. Only the user who participated in the ride can rate it.
-   **Request Headers**:
    -   `Authorization: Bearer <token>`: User's JWT token to authenticate.
-   **Request Parameters**:
    -   `rideId` (Path parameter): The ID of the ride to be rated.
-   **Request Body**:

    ```json
    {
        "rating": 4, // A rating from 1 to 5
        "comment": "Great ride!" // Optional comment about the ride
    }
    ```

-   **Response**:

    -   **Success**:

        ```json
        {
            "success": true,
            "data": {
                "_id": "ratingId",
                "ride": "rideId",
                "user": "userId",
                "driver": "driverId",
                "rating": 4,
                "comment": "Great ride!"
            }
        }
        ```

        **HTTP Status Code**: 201 (Created)

    -   **Error**:

        -   **If Ride Not Found**:
            ```json
            {
                "message": "Ride not found"
            }
            ```
            **HTTP Status Code**: 404 (Not Found)
        -   **If User is Not Authorized to Rate**:
            ```json
            {
                "message": "You are not allowed to rate this ride"
            }
            ```
            **HTTP Status Code**: 400 (Bad Request)
        -   **If User Has Already Rated This Ride**:
            ```json
            {
                "message": "You have already rated this ride"
            }
            ```
            **HTTP Status Code**: 400 (Bad Request)

#### 2. **Get Ride Ratings**

-   **Endpoint**: `GET /:rideId/ratings`
-   **Description**: Retrieves all ratings for a specific ride.
-   **Request Parameters**:
    -   `rideId` (Path parameter): The ID of the ride whose ratings are being retrieved.
-   **Response**:

    -   **Success**:

        ```json
        {
            "success": true,
            "data": [
                {
                    "_id": "ratingId",
                    "ride": "rideId",
                    "user": "userId",
                    "driver": "driverId",
                    "rating": 5,
                    "comment": "Excellent service"
                },
                {
                    "_id": "ratingId2",
                    "ride": "rideId",
                    "user": "userId2",
                    "driver": "driverId",
                    "rating": 4,
                    "comment": "Good ride but could be better"
                }
            ]
        }
        ```

        **HTTP Status Code**: 200 (OK)

    -   **Error**:
        -   **If No Ratings Found**:
            ```json
            {
                "message": "No ratings found for this ride"
            }
            ```
            **HTTP Status Code**: 404 (Not Found)

---

### Notes:

-   The rating system supports values between 1 to 5.
-   Each user can only rate a ride once.
-   The user must have participated in the ride to be able to rate it.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
