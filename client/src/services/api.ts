import type { User, Driver, Ride, Rating, AuthResponse, RideStatus } from '../types'

const BASE_URL = '/api/v1'

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('swiperide_token')
  const headers: Record<string, string> = {}
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || ''
  
  if (contentType.includes('application/json')) {
    const data = await res.json()
    if (!res.ok) {
      const errorMsg = data.message || data.msg || 'An error occurred'
      throw new Error(errorMsg)
    }
    return data
  }

  // Non-JSON response (e.g. Vercel serverless 500/504 error page or HTML)
  const text = await res.text()
  if (!res.ok) {
    if (text.includes('FUNCTION_INVOCATION_TIMEOUT')) {
      throw new Error('Serverless function timed out. Please verify MONGO_URI in Vercel settings.')
    }
    if (text.includes('A server error') || text.includes('Internal Server Error')) {
      throw new Error('Backend server error. Please ensure MONGO_URI is set in Vercel and MongoDB Atlas IP is whitelisted (0.0.0.0/0).')
    }
    throw new Error(text.slice(0, 150) || `Server responded with status ${res.status}`)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Unexpected response format from server.')
  }
}

export const api = {
  // Authentication
  async login(payload: { loginMethod: 'email' | 'phone'; identifier: string; password?: string; otp?: string }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await handleResponse<AuthResponse>(res)
    if (data.data?.token) {
      localStorage.setItem('swiperide_token', data.data.token)
      localStorage.setItem('swiperide_user', JSON.stringify(data.data))
    }
    return data
  },

  async registerUser(payload: { name: string; phone: string; password: string; email?: string }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/user`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await handleResponse<AuthResponse>(res)
    if (data.data?.token) {
      localStorage.setItem('swiperide_token', data.data.token)
      localStorage.setItem('swiperide_user', JSON.stringify(data.data))
    }
    return data
  },

  async registerDriver(payload: {
    name: string
    email: string
    phone: string
    password: string
    motorcycleType: string
    motorcycleColor: string
    licenseNumber: string
    motorcycleNumber: string
    motorcycleYear: string | number
    address: {
      street: string
      city: string
      state: string
      country: string
      postalCode: string
    }
  }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/driver`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await handleResponse<AuthResponse>(res)
    if (data.data?.token) {
      localStorage.setItem('swiperide_token', data.data.token)
      localStorage.setItem('swiperide_user', JSON.stringify(data.data))
    }
    return data
  },

  async sendOtp(identifier: string, verificationMethod = 'phone'): Promise<{ success: boolean; message: string; devOtp?: string }> {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, verificationMethod }),
    })
    return handleResponse(res)
  },

  async verifyOtp(identifier: string, otp: string, verificationMethod = 'phone'): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, otp, verificationMethod }),
    })
    return handleResponse(res)
  },

  logout() {
    localStorage.removeItem('swiperide_token')
    localStorage.removeItem('swiperide_user')
  },

  // User Profile
  async getUserProfile(): Promise<{ success: boolean; data: User }> {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async updateUserProfile(updates: Partial<User>): Promise<{ success: boolean; data: User }> {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    })
    return handleResponse(res)
  },

  // Driver Endpoints
  async getDriverProfile(): Promise<{ success: boolean; data: Driver }> {
    const res = await fetch(`${BASE_URL}/drivers/profile`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async updateDriverStatus(status: 'available' | 'unavailable' | 'onRide'): Promise<{ success: boolean; data: Driver }> {
    const res = await fetch(`${BASE_URL}/drivers/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return handleResponse(res)
  },

  async updateDriverLocation(coordinates: [number, number]): Promise<{ success: boolean; data: Driver }> {
    const res = await fetch(`${BASE_URL}/drivers/location`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ coordinates }),
    })
    return handleResponse(res)
  },

  async getDriverWallet(): Promise<{ success: boolean; walletBalance: number }> {
    const res = await fetch(`${BASE_URL}/drivers/wallet`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  // Ride Endpoints
  async createRide(payload: { pickupLocation: string; dropoffLocations: string[] }): Promise<{ success: boolean; data: Ride }> {
    const res = await fetch(`${BASE_URL}/rides`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
    return handleResponse(res)
  },

  async getRideDetails(id: string): Promise<{ success: boolean; data: Ride }> {
    const res = await fetch(`${BASE_URL}/rides/${id}`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async updateRideStatus(id: string, status: RideStatus): Promise<{ success: boolean; data: Ride; message?: string }> {
    const res = await fetch(`${BASE_URL}/rides/status/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    })
    return handleResponse(res)
  },

  async getRideHistory(page = 1, limit = 10): Promise<{
    success: boolean
    count: number
    totalRides: number
    totalPages: number
    currentPage: number
    data: Ride[]
  }> {
    const res = await fetch(`${BASE_URL}/rides/history?page=${page}&limit=${limit}`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  // Ratings
  async rateRide(rideId: string, rating: number, comment: string): Promise<{ success: boolean; data: Rating; message: string }> {
    const res = await fetch(`${BASE_URL}/ratings/${rideId}/rate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating, comment }),
    })
    return handleResponse(res)
  },

  async getRideRatings(rideId: string): Promise<{ success: boolean; count: number; data: Rating[] }> {
    const res = await fetch(`${BASE_URL}/ratings/${rideId}/ratings`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  // File Upload
  async uploadAvatar(file: File): Promise<{ success: boolean; url: string; message: string }> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('updateProfile', 'true')
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    })
    return handleResponse(res)
  },
}
