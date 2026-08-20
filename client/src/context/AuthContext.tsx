import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, UserRole } from '../types'
import { api } from '../services/api'
import { socketService } from '../services/socket'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: { loginMethod: 'email' | 'phone'; identifier: string; password?: string; otp?: string }) => Promise<void>
  registerRider: (payload: { name: string; phone: string; password: string; email?: string }) => Promise<void>
  registerDriver: (payload: any) => Promise<void>
  logout: () => void
  loginAsDemo: (role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('swiperide_token')
    const savedUser = localStorage.getItem('swiperide_user')

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsed)
        // Connect socket & join room
        socketService.connect()
        socketService.joinRoom(parsed.id || parsed._id)
      } catch (err) {
        localStorage.removeItem('swiperide_token')
        localStorage.removeItem('swiperide_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (payload: { loginMethod: 'email' | 'phone'; identifier: string; password?: string; otp?: string }) => {
    const res = await api.login(payload)
    if (res.data) {
      setUser(res.data as any)
      setToken(res.data.token)
      socketService.connect()
      socketService.joinRoom(res.data.id)
    }
  }

  const registerRider = async (payload: { name: string; phone: string; password: string; email?: string }) => {
    const res = await api.registerUser(payload)
    if (res.data) {
      setUser(res.data as any)
      setToken(res.data.token)
      socketService.connect()
      socketService.joinRoom(res.data.id)
    }
  }

  const registerDriver = async (payload: any) => {
    const res = await api.registerDriver(payload)
    if (res.data) {
      setUser(res.data as any)
      setToken(res.data.token)
      socketService.connect()
      socketService.joinRoom(undefined, res.data.id)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    setToken(null)
    socketService.disconnect()
  }

  // 1-Click Instant Demo Logins (Indian credentials)
  const loginAsDemo = async (role: UserRole) => {
    try {
      if (role === 'user') {
        const riderPhone = '+919800000001'
        const riderPassword = 'Password123!'
        try {
          await login({ loginMethod: 'phone', identifier: riderPhone, password: riderPassword })
        } catch {
          await registerRider({
            name: 'Pooja Iyer (Demo Rider)',
            phone: riderPhone,
            email: 'pooja.rider@swiperide.in',
            password: riderPassword,
          })
        }
      } else if (role === 'driver') {
        const driverEmail = 'vikram.pilot@swiperide.in'
        const driverPassword = 'DriverPassword123!'
        try {
          await login({ loginMethod: 'email', identifier: driverEmail, password: driverPassword })
        } catch {
          await registerDriver({
            name: 'Captain Vikram S. (Demo)',
            email: driverEmail,
            phone: '+919800000002',
            password: driverPassword,
            motorcycleType: 'Bajaj Pulsar 150 Dtsi',
            motorcycleColor: 'Stealth Nitro Orange',
            licenseNumber: 'DL-KA-01-20210048',
            motorcycleNumber: 'KA-01-MJ-4820',
            motorcycleYear: 2024,
            address: {
              street: '12 100ft Ring Road, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              country: 'India',
              postalCode: '560038',
            },
          })
        }
      } else if (role === 'admin') {
        const adminEmail = 'ops@swiperide.in'
        const adminPassword = 'AdminSuperPassword123!'
        try {
          await login({ loginMethod: 'email', identifier: adminEmail, password: adminPassword })
        } catch {
          // Register admin
          const res = await fetch('/api/v1/auth/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'SwipeRide India Ops',
              email: adminEmail,
              phone: '+919800000003',
              password: adminPassword,
              address: { street: 'Tech Park Tower B', city: 'Bengaluru', state: 'Karnataka', country: 'India', postalCode: '560100' },
            }),
          })
          const data = await res.json()
          if (data.data?.token) {
            localStorage.setItem('swiperide_token', data.data.token)
            localStorage.setItem('swiperide_user', JSON.stringify(data.data))
            setUser(data.data)
            setToken(data.data.token)
          }
        }
      }
    } catch (err: any) {
      console.error('Demo login error:', err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        registerRider,
        registerDriver,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
