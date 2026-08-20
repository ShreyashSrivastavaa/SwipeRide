import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Ride, RideStatus, Driver } from '../types'
import { api } from '../services/api'
import { socketService } from '../services/socket'
import { useAuth } from './AuthContext'

interface RideContextType {
  activeRide: Ride | null
  rideStatus: RideStatus | 'idle'
  driverEta: number
  driverSpeed: number
  isSearching: boolean
  ratingModalOpen: boolean
  recentCompletedRide: Ride | null
  requestRide: (pickup: string, dropoffs: string[]) => Promise<Ride>
  cancelActiveRide: () => Promise<void>
  updateStatus: (newStatus: RideStatus) => Promise<void>
  openRatingModal: (ride: Ride) => void
  closeRatingModal: () => void
  clearActiveRide: () => void
}

const RideContext = createContext<RideContextType | undefined>(undefined)

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [activeRide, setActiveRide] = useState<Ride | null>(null)
  const [rideStatus, setRideStatus] = useState<RideStatus | 'idle'>('idle')
  const [driverEta, setDriverEta] = useState<number>(4)
  const [driverSpeed, setDriverSpeed] = useState<number>(0)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false)
  const [recentCompletedRide, setRecentCompletedRide] = useState<Ride | null>(null)

  // Listen to WebSocket events
  useEffect(() => {
    const socket = socketService.connect()

    const handleRideAccepted = (data: { driver: Driver; eta?: number }) => {
      console.log('[Socket] Ride Accepted by Driver:', data)
      setRideStatus('accepted')
      if (data.eta) setDriverEta(data.eta)
      if (activeRide) {
        setActiveRide({ ...activeRide, status: 'accepted', driver: data.driver })
      }
    }

    const handleDriverArrived = () => {
      console.log('[Socket] Driver Arrived at pickup!')
      setRideStatus('accepted')
      setDriverEta(0)
    }

    const handleRideStarted = (data: { eta?: number }) => {
      console.log('[Socket] Ride Started in progress!')
      setRideStatus('inProgress')
      if (data?.eta) setDriverEta(data.eta)
    }

    const handleRideCompleted = () => {
      console.log('[Socket] Ride Completed!')
      if (activeRide) {
        const completed = { ...activeRide, status: 'completed' as RideStatus }
        setActiveRide(completed)
        setRecentCompletedRide(completed)
        setRideStatus('completed')
        setRatingModalOpen(true)
      }
    }

    const handleRideError = (data: { message: string }) => {
      console.warn('[Socket] Ride Error:', data.message)
      setIsSearching(false)
    }

    socket.on('rideAccepted', handleRideAccepted)
    socket.on('driverArrived', handleDriverArrived)
    socket.on('rideStarted', handleRideStarted)
    socket.on('rideCompleted', handleRideCompleted)
    socket.on('rideError', handleRideError)

    return () => {
      socket.off('rideAccepted', handleRideAccepted)
      socket.off('driverArrived', handleDriverArrived)
      socket.off('rideStarted', handleRideStarted)
      socket.off('rideCompleted', handleRideCompleted)
      socket.off('rideError', handleRideError)
    }
  }, [activeRide])

  // Speedometer simulation when in progress
  useEffect(() => {
    let interval: any
    if (rideStatus === 'inProgress') {
      interval = setInterval(() => {
        const speed = Math.floor(34 + Math.random() * 24)
        setDriverSpeed(speed)
      }, 1500)
    } else {
      setDriverSpeed(0)
    }
    return () => clearInterval(interval)
  }, [rideStatus])

  const requestRide = async (pickup: string, dropoffs: string[]): Promise<Ride> => {
    setIsSearching(true)
    setRideStatus('pending')
    try {
      const res = await api.createRide({
        pickupLocation: pickup,
        dropoffLocations: dropoffs,
      })
      const ride = res.data
      setActiveRide(ride)
      setRideStatus(ride.status)
      setDriverEta(ride.eta || 4)
      setIsSearching(false)

      // Notify socket server of new ride
      const socket = socketService.getSocket()
      if (socket && user) {
        socket.emit('requestRide', {
          userId: user._id || user.id,
          pickupLocation: pickup,
          dropoffLocation: dropoffs[0],
        })
      }

      return ride
    } catch (error) {
      setIsSearching(false)
      setRideStatus('idle')
      throw error
    }
  }

  const updateStatus = async (newStatus: RideStatus) => {
    if (!activeRide) return
    try {
      const res = await api.updateRideStatus(activeRide._id, newStatus)
      const updated = res.data
      setActiveRide(updated)
      setRideStatus(newStatus)

      const socket = socketService.getSocket()
      if (socket) {
        if (newStatus === 'accepted') socket.emit('rideResponse', { rideId: activeRide._id, accepted: true })
        if (newStatus === 'inProgress') socket.emit('rideStarted', { rideId: activeRide._id })
        if (newStatus === 'completed') socket.emit('rideCompleted', { rideId: activeRide._id })
      }

      if (newStatus === 'completed') {
        setRecentCompletedRide(updated)
        setRatingModalOpen(true)
      }
    } catch (err: any) {
      console.error('Failed to update ride status:', err.message)
      throw err
    }
  }

  const cancelActiveRide = async () => {
    if (!activeRide) return
    await updateStatus('canceled')
    setRideStatus('canceled')
  }

  const openRatingModal = (ride: Ride) => {
    setRecentCompletedRide(ride)
    setRatingModalOpen(true)
  }

  const closeRatingModal = () => {
    setRatingModalOpen(false)
  }

  const clearActiveRide = () => {
    setActiveRide(null)
    setRideStatus('idle')
    setDriverSpeed(0)
  }

  return (
    <RideContext.Provider
      value={{
        activeRide,
        rideStatus,
        driverEta,
        driverSpeed,
        isSearching,
        ratingModalOpen,
        recentCompletedRide,
        requestRide,
        cancelActiveRide,
        updateStatus,
        openRatingModal,
        closeRatingModal,
        clearActiveRide,
      }}
    >
      {children}
    </RideContext.Provider>
  )
}

export const useRide = () => {
  const context = useContext(RideContext)
  if (!context) throw new Error('useRide must be used within a RideProvider')
  return context
}
