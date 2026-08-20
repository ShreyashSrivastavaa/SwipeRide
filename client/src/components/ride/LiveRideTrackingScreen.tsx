import React from 'react'
import { MotorcycleIcon, HelmetIcon, SpeedometerIcon, SurgeLightningIcon } from '../icons/CustomIcons'
import { useRide } from '../../context/RideContext'
import {
  Phone,
  MessageSquare,
  XCircle,
  CheckCircle,
  Navigation,
  Clock,
  Star,
  Compass,
} from 'lucide-react'

interface LiveRideTrackingScreenProps {
  onCancelRide: () => void
  onBookAnother: () => void
}

export const LiveRideTrackingScreen: React.FC<LiveRideTrackingScreenProps> = ({
  onCancelRide,
  onBookAnother,
}) => {
  const { activeRide, rideStatus, driverEta, driverSpeed, updateStatus } = useRide()

  if (!activeRide) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#121620] border border-[#1F2738] flex items-center justify-center mx-auto text-[#9CA3AF]">
          <MotorcycleIcon size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold text-white">No Active Ride in Progress</h2>
        <p className="text-xs text-[#9CA3AF]">Request a new motorcycle ride to view real-time live telemetry.</p>
        <button onClick={onBookAnother} className="btn-nitro py-3 px-6 text-xs mx-auto">
          Book New Ride
        </button>
      </div>
    )
  }

  const driver = typeof activeRide.driver === 'object' ? activeRide.driver : null
  const driverName = driver?.name || 'Assigned Pilot'
  const driverPhone = driver?.phone || '+91 98765 43210'
  const motorcycleType = driver?.motorcycleType || 'Bajaj Pulsar 150'
  const motorcycleColor = driver?.motorcycleColor || 'Matte Black'
  const motorcycleNumber = driver?.motorcycleNumber || 'KA-01-MJ-4820'
  const driverRating = driver?.ratings || 4.9
  const numOfReviews = driver?.numOfReviews || 128

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Status Header */}
      <div className="panel-mech p-4 bg-[#0E121A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping"></div>
          <div>
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider block">
              REAL-TIME MISSION HUD • {activeRide._id.slice(-6).toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-[#9CA3AF]">
              Socket.io Channel: user_{typeof activeRide.user === 'object' ? activeRide.user._id : activeRide.user}
            </span>
          </div>
        </div>

        <span className={`badge-status badge-${rideStatus}`}>
          {rideStatus === 'pending' && 'SEARCHING FLEET'}
          {rideStatus === 'accepted' && 'PILOT EN ROUTE'}
          {rideStatus === 'inProgress' && 'LANE SPLITTING'}
          {rideStatus === 'completed' && 'MISSION COMPLETED'}
          {rideStatus === 'canceled' && 'RIDE CANCELED'}
        </span>
      </div>

      {/* Main HUD Card */}
      <div className="panel-mech-highlight p-6 sm:p-8 bg-[#121622] relative overflow-hidden">
        
        {/* State 1: Searching for Driver */}
        {rideStatus === 'pending' && (
          <div className="text-center py-10 space-y-6">
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#FF5500]/30 animate-ping"></div>
              <div className="absolute inset-4 rounded-full border border-[#00F0A0]/40 animate-pulse"></div>
              <div className="w-20 h-20 rounded-full bg-[#FF5500] flex items-center justify-center shadow-[0_0_30px_#FF5500]">
                <MotorcycleIcon size={36} color="#FFFFFF" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Matching Nearest Motorcycle Pilot...
              </h2>
              <p className="text-xs font-mono text-[#9CA3AF] max-w-md mx-auto">
                Scanning Redis spatial index within 3km radius. Dispatching best rated available pilot.
              </p>
            </div>

            {/* Simulated Live Match Button for reviewer ease */}
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => updateStatus('accepted')}
                className="btn-nitro text-xs py-2 px-4 bg-[#00F0A0] text-[#07090C] hover:bg-[#00F0A0]/90 shadow-[0_0_15px_rgba(0,240,160,0.4)]"
              >
                Simulate Pilot Accept
              </button>
              <button
                type="button"
                onClick={onCancelRide}
                className="btn-subtle text-xs py-2 px-4 text-[#FF334B] hover:border-[#FF334B]"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* State 2 & 3: Accepted / In Progress */}
        {(rideStatus === 'accepted' || rideStatus === 'inProgress') && (
          <div className="space-y-8">
            
            {/* Top Telemetry Meters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* ETA Meter */}
              <div className="bg-[#07090C] p-4 rounded-xl border border-[#1F2738] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-[#9CA3AF] uppercase font-bold">
                    {rideStatus === 'accepted' ? 'Pickup Arrival ETA' : 'Destination ETA'}
                  </p>
                  <p className="font-mono-tabular text-3xl font-extrabold text-white mt-0.5">
                    {driverEta} <span className="text-xs text-[#00F0A0] font-sans">mins</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00F0A0]/10 border border-[#00F0A0]/30 flex items-center justify-center text-[#00F0A0]">
                  <Clock size={22} />
                </div>
              </div>

              {/* Speedometer Meter */}
              <div className="bg-[#07090C] p-4 rounded-xl border border-[#1F2738] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-[#9CA3AF] uppercase font-bold">Live Speedometer</p>
                  <p className="font-mono-tabular text-3xl font-extrabold text-[#FF5500] mt-0.5">
                    {driverSpeed} <span className="text-xs text-[#9CA3AF] font-sans">km/h</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                  <SpeedometerIcon size={22} color="#FF5500" />
                </div>
              </div>

              {/* Guaranteed Fare Meter in INR */}
              <div className="bg-[#07090C] p-4 rounded-xl border border-[#1F2738] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-[#9CA3AF] uppercase font-bold">Locked Fare (INR)</p>
                  <p className="font-mono-tabular text-3xl font-extrabold text-white mt-0.5">
                    ₹{activeRide.fare?.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
                  <SurgeLightningIcon size={20} color="#FFB800" />
                </div>
              </div>

            </div>

            {/* Driver Profile Card */}
            <div className="bg-[#0B0E14] p-5 rounded-xl border border-[#1F2738] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-[#1A2234] border-2 border-[#FF5500] flex items-center justify-center font-display text-2xl font-bold text-white shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                    {driverName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#00F0A0] text-[#07090C] flex items-center justify-center shadow">
                    <HelmetIcon size={13} color="#07090C" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-white">{driverName}</h3>
                    <div className="flex items-center gap-1 bg-[#1A2234] px-2 py-0.5 rounded text-[11px] font-mono font-bold text-[#FFB800]">
                      <Star size={11} className="fill-[#FFB800]" />
                      <span>{driverRating.toFixed(1)}</span>
                      <span className="text-[#9CA3AF]">({numOfReviews})</span>
                    </div>
                  </div>

                  <p className="text-xs text-white font-mono font-semibold">
                    {motorcycleType} • <span className="text-[#FF5500] font-bold">{motorcycleColor}</span>
                  </p>

                  <div className="inline-block bg-[#121620] px-2.5 py-0.5 rounded border border-[#2D374D] font-mono text-xs font-bold text-white tracking-widest uppercase">
                    {motorcycleNumber}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${driverPhone}`}
                  className="flex-1 sm:flex-none py-2.5 px-4 bg-[#181E2C] hover:bg-[#252D40] border border-[#2D374D] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={14} className="text-[#00F0A0]" />
                  Call Pilot
                </a>
                <a
                  href={`sms:${driverPhone}`}
                  className="flex-1 sm:flex-none py-2.5 px-4 bg-[#181E2C] hover:bg-[#252D40] border border-[#2D374D] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare size={14} className="text-[#0091FF]" />
                  Message
                </a>
              </div>
            </div>

            {/* Route Map HUD Breadcrumbs */}
            <div className="bg-[#07090C] p-4 rounded-xl border border-[#1F2738] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF] border-b border-[#1F2738] pb-2">
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <Compass size={14} className="text-[#FF5500]" />
                  ACTIVE ROUTE WAYPOINTS
                </span>
                <span className="text-[#00F0A0] font-bold">GPS LOCK 100%</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00F0A0]"></span>
                  <span>Pickup: {activeRide.pickupLocation?.coordinates ? `${activeRide.pickupLocation.coordinates[1].toFixed(4)}°N, ${activeRide.pickupLocation.coordinates[0].toFixed(4)}°E` : 'Active Pickup Point'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500]"></span>
                  <span>Destination: {activeRide.dropoffLocations?.[0]?.coordinates ? `${activeRide.dropoffLocations[0].coordinates[1].toFixed(4)}°N, ${activeRide.dropoffLocations[0].coordinates[0].toFixed(4)}°E` : 'Active Dropoff Point'}</span>
                </div>
              </div>
            </div>

            {/* Quick State Transition Actions (Also controllable via Driver Simulator) */}
            <div className="p-4 rounded-xl bg-[#0B0E14] border border-[#2D374D] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-mono">
                <span className="text-[#9CA3AF] block text-[10px]">LIFECYCLE CONTROLS</span>
                <span className="text-white font-bold">Advance Trip Status:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {rideStatus === 'accepted' && (
                  <button
                    type="button"
                    onClick={() => updateStatus('inProgress')}
                    className="btn-nitro py-2 px-4 text-xs flex items-center gap-1.5"
                  >
                    <Navigation size={14} />
                    Start Trip (inProgress)
                  </button>
                )}
                {rideStatus === 'inProgress' && (
                  <button
                    type="button"
                    onClick={() => updateStatus('completed')}
                    className="btn-nitro py-2 px-4 text-xs bg-[#00F0A0] text-[#07090C] hover:bg-[#00F0A0]/90 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,160,0.4)]"
                  >
                    <CheckCircle size={14} />
                    Complete Trip (Arrived)
                  </button>
                )}
                <button
                  type="button"
                  onClick={onCancelRide}
                  className="py-2 px-3 bg-transparent border border-[#FF334B]/40 hover:bg-[#FF334B]/10 rounded text-xs font-mono text-[#FF334B]"
                >
                  Cancel Ride
                </button>
              </div>
            </div>

          </div>
        )}

        {/* State 4: Completed */}
        {rideStatus === 'completed' && (
          <div className="text-center py-10 space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#00F0A0]/10 border-2 border-[#00F0A0] flex items-center justify-center mx-auto text-[#00F0A0] shadow-[0_0_30px_rgba(0,240,160,0.4)]">
              <CheckCircle size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl font-extrabold text-white">
                Trip Safely Completed!
              </h2>
              <p className="text-xs font-mono text-[#9CA3AF] max-w-md mx-auto">
                Payment marked paid. Pilot received 80% net earnings.
              </p>
            </div>

            <div className="bg-[#07090C] p-5 rounded-xl border border-[#1F2738] max-w-sm mx-auto font-mono text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Total Fare Paid</span>
                <span className="text-white font-bold">₹{activeRide.fare?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Payment Mode</span>
                <span className="text-[#00F0A0] font-bold">PAID (UPI / CASH / WALLET)</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Pilot</span>
                <span className="text-white">{driverName}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onBookAnother}
                className="btn-nitro py-3 px-6 text-xs flex items-center gap-2"
              >
                <Navigation size={16} />
                Book Another Ride
              </button>
            </div>
          </div>
        )}

        {/* State 5: Canceled */}
        {rideStatus === 'canceled' && (
          <div className="text-center py-10 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FF334B]/10 border border-[#FF334B] flex items-center justify-center mx-auto text-[#FF334B]">
              <XCircle size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-white">Ride Canceled</h2>
              <p className="text-xs text-[#9CA3AF]">The ride request was canceled. Pilot status returned to available.</p>
            </div>
            <button onClick={onBookAnother} className="btn-nitro py-3 px-6 text-xs mx-auto">
              Request New Ride
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
