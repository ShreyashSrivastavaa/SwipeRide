export type UserRole = 'user' | 'driver' | 'admin'

export type RideStatus = 'pending' | 'accepted' | 'inProgress' | 'completed' | 'canceled'

export interface User {
  _id: string
  id?: string
  name: string
  phone: string
  email?: string
  role: UserRole
  profilePicture?: string
  paymentMethod?: 'cash' | 'card' | 'wallet'
  preferredLanguage?: string
  createdAt?: string
}

export interface Driver {
  _id: string
  id?: string
  name: string
  email: string
  phone: string
  role: 'driver'
  profilePicture?: string
  motorcycleType: string
  motorcycleColor: string
  licenseNumber: string
  motorcycleNumber: string
  motorcycleYear: string | number
  ratings: number
  numOfReviews: number
  status: 'available' | 'unavailable' | 'onRide'
  suspended?: boolean
  wallet?: number
  debt?: number
  location?: {
    type: string
    coordinates: [number, number] // [lng, lat]
  }
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Ride {
  _id: string
  user: User | string
  driver: Driver | string
  pickupLocation: {
    type: string
    coordinates: [number, number] // [lng, lat]
  }
  dropoffLocations: Array<{
    type: string
    coordinates: [number, number]
  }>
  status: RideStatus
  fare: number
  driverEarnings?: number
  distance?: number
  duration?: number
  paymentStatus: 'pending' | 'paid'
  rating?: number | null
  eta?: number
  createdAt: string
  completedAt?: string | null
}

export interface Rating {
  _id: string
  ride: string
  user: User | string
  driver: Driver | string
  rating: number
  comment: string
  createdAt: string
}

export interface FleetTier {
  id: 'swift' | 'cargo' | 'volt'
  name: string
  tagline: string
  description: string
  multiplier: number
  capacity: string
  speedEst: string
  icon: string
  color: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data?: {
    id: string
    name: string
    email?: string
    phone: string
    role: UserRole
    profilePicture?: string
    token: string
  }
}
