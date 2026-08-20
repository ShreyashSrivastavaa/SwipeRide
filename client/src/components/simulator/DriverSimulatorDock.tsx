import React, { useState, useEffect } from 'react'
import { HelmetIcon } from '../icons/CustomIcons'
import { useRide } from '../../context/RideContext'
import { socketService } from '../../services/socket'
import {
  Zap,
  X,
  Radio,
  CheckCircle,
  Play,
  Check,
  Compass,
} from 'lucide-react'

interface DriverSimulatorDockProps {
  isOpen: boolean
  onClose: () => void
}

export const DriverSimulatorDock: React.FC<DriverSimulatorDockProps> = ({ isOpen, onClose }) => {
  const { activeRide, rideStatus, updateStatus } = useRide()

  const [isDriverOnline, setIsDriverOnline] = useState(true)
  const driverId = 'demo_driver_01'
  const [incomingRequest, setIncomingRequest] = useState<any>(null)
  const [wallet, setWallet] = useState<number>(1450)
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number }>({ lat: 12.9716, lng: 77.5946 })

  // Socket listener for driver requests
  useEffect(() => {
    const socket = socketService.connect()

    const handleRideRequest = (data: any) => {
      console.log('[DriverSim] Received Ride Request:', data)
      setIncomingRequest(data)
    }

    socket.on('rideRequest', handleRideRequest)

    return () => {
      socket.off('rideRequest', handleRideRequest)
    }
  }, [])

  // Periodic GPS Location Ping over WebSocket (Bengaluru Metro coords)
  useEffect(() => {
    let interval: any
    if (isDriverOnline) {
      interval = setInterval(() => {
        const offsetLat = (Math.random() - 0.5) * 0.002
        const offsetLng = (Math.random() - 0.5) * 0.002
        const newCoords = {
          lat: 12.9716 + offsetLat,
          lng: 77.5946 + offsetLng,
        }
        setGpsCoords(newCoords)
        socketService.updateDriverLocation(driverId, newCoords.lat, newCoords.lng)
      }, 4000)
    }
    return () => clearInterval(interval)
  }, [isDriverOnline, driverId])

  if (!isOpen) return null

  const handleAcceptRide = () => {
    updateStatus('accepted')
    setIncomingRequest(null)
  }

  const handleDriverArrived = () => {
    const socket = socketService.getSocket()
    if (socket && activeRide) {
      socket.emit('driverArrived', { rideId: activeRide._id })
    }
  }

  const handleStartTrip = () => {
    updateStatus('inProgress')
  }

  const handleCompleteTrip = () => {
    updateStatus('completed')
    if (activeRide?.fare) {
      setWallet((prev) => prev + Math.round(activeRide.fare * 0.8))
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm bg-[#121620] border-2 border-[#FFB800] rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] overflow-hidden animate-slide-up font-mono text-xs">
      
      {/* Top Header */}
      <div className="bg-[#0B0E14] px-4 py-2.5 border-b border-[#1F2738] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse"></div>
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={14} className="text-[#FFB800]" />
            Dual-Sided Pilot Simulator
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#9CA3AF] hover:text-white p-1 rounded"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* Status & Online Toggle */}
        <div className="flex items-center justify-between bg-[#07090C] p-2.5 rounded-lg border border-[#1F2738]">
          <div className="flex items-center gap-2">
            <Radio size={14} className={isDriverOnline ? 'text-[#00F0A0] animate-pulse' : 'text-[#6B7280]'} />
            <span className="text-white font-bold">
              Pilot Status: {isDriverOnline ? 'ONLINE (READY)' : 'OFFLINE'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDriverOnline(!isDriverOnline)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
              isDriverOnline
                ? 'bg-[#00F0A0]/20 text-[#00F0A0] border border-[#00F0A0]/40'
                : 'bg-[#1F2738] text-[#9CA3AF]'
            }`}
          >
            {isDriverOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        {/* Live GPS Telemetry Ping Status */}
        <div className="p-2 rounded bg-[#0B0E14] border border-[#1F2738] text-[10px] text-[#9CA3AF] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Compass size={12} className="text-[#FF5500]" />
            GPS Beacon: {gpsCoords.lat.toFixed(4)}°N, {gpsCoords.lng.toFixed(4)}°E
          </span>
          <span className="text-[#00F0A0] font-bold">10Hz SYNC</span>
        </div>

        {/* Wallet Balance Display */}
        <div className="flex items-center justify-between bg-[#0B0E14] p-2 rounded border border-[#1F2738] text-[11px]">
          <span className="text-[#9CA3AF]">Pilot Wallet (80% Cut)</span>
          <span className="text-[#00F0A0] font-bold">₹{wallet.toLocaleString()}</span>
        </div>

        {/* Active Ride Lifecycle Controls */}
        {activeRide && (
          <div className="space-y-2 pt-2 border-t border-[#1F2738]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#9CA3AF]">Current Ride Mission:</span>
              <span className={`badge-status badge-${rideStatus}`}>{rideStatus}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAcceptRide}
                disabled={rideStatus !== 'pending'}
                className="py-1.5 px-2 bg-[#181E2C] hover:bg-[#252D40] disabled:opacity-40 rounded border border-[#2D374D] text-white flex items-center justify-center gap-1"
              >
                <Check size={12} className="text-[#00F0A0]" />
                1. Accept
              </button>

              <button
                type="button"
                onClick={handleDriverArrived}
                disabled={rideStatus !== 'accepted'}
                className="py-1.5 px-2 bg-[#181E2C] hover:bg-[#252D40] disabled:opacity-40 rounded border border-[#2D374D] text-white flex items-center justify-center gap-1"
              >
                <HelmetIcon size={12} color="#FF5500" />
                2. At Pickup
              </button>

              <button
                type="button"
                onClick={handleStartTrip}
                disabled={rideStatus !== 'accepted'}
                className="py-1.5 px-2 bg-[#181E2C] hover:bg-[#252D40] disabled:opacity-40 rounded border border-[#2D374D] text-white flex items-center justify-center gap-1"
              >
                <Play size={12} className="text-[#0091FF]" />
                3. Start (inProgress)
              </button>

              <button
                type="button"
                onClick={handleCompleteTrip}
                disabled={rideStatus !== 'inProgress'}
                className="py-1.5 px-2 bg-[#00F0A0]/20 hover:bg-[#00F0A0]/30 border border-[#00F0A0] text-[#00F0A0] disabled:opacity-40 rounded flex items-center justify-center gap-1 font-bold"
              >
                <CheckCircle size={12} />
                4. Complete
              </button>
            </div>
          </div>
        )}

        {/* Incoming Ride Alert Box */}
        {incomingRequest && (
          <div className="p-3 rounded-lg bg-[#FF5500]/10 border-2 border-[#FF5500] space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-[#FF5500] font-bold">
              <span>🚨 INCOMING RIDE REQUEST</span>
              <span>₹172</span>
            </div>
            <p className="text-[10px] text-white">Pickup: {incomingRequest.pickupLocation}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAcceptRide}
                className="btn-nitro flex-1 py-1.5 text-[10px] bg-[#00F0A0] text-[#07090C] hover:bg-[#00F0A0]/90"
              >
                Accept Ride
              </button>
              <button
                type="button"
                onClick={() => setIncomingRequest(null)}
                className="px-3 py-1.5 bg-[#1F2738] text-white rounded text-[10px]"
              >
                Decline
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
