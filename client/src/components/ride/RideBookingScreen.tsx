import React, { useState } from 'react'
import { MotorcycleIcon, HelmetIcon, CargoBoxIcon } from '../icons/CustomIcons'
import { useAuth } from '../../context/AuthContext'
import { useRide } from '../../context/RideContext'
import {
  MapPin,
  Plus,
  Trash2,
  Navigation,
  ArrowRight,
  Shield,
  CreditCard,
  Banknote,
  Wallet,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react'

interface RideBookingScreenProps {
  initialPickup?: string
  initialDropoff?: string
  onRideRequested: () => void
  onRequireAuth: () => void
}

const POPULAR_LOCATIONS = [
  'Koramangala 5th Block, Bengaluru',
  'Indiranagar 100ft Rd, Bengaluru',
  'HSR Layout Sector 2, Bengaluru',
  'Electronic City Phase 1, Bengaluru',
  'Bandra Kurla Complex (BKC), Mumbai',
  'Cyber City, Gurgaon',
  'MG Road Metro Station, Bengaluru',
]

export const RideBookingScreen: React.FC<RideBookingScreenProps> = ({
  initialPickup = 'Koramangala 5th Block, Bengaluru',
  initialDropoff = 'Indiranagar 100ft Rd, Bengaluru',
  onRideRequested,
  onRequireAuth,
}) => {
  const { isAuthenticated } = useAuth()
  const { requestRide } = useRide()

  const [pickup, setPickup] = useState(initialPickup)
  const [dropoffs, setDropoffs] = useState<string[]>([initialDropoff])
  const [selectedTier, setSelectedTier] = useState<'swift' | 'cargo' | 'volt'>('swift')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddStop = () => {
    if (dropoffs.length < 3) {
      setDropoffs([...dropoffs, ''])
    }
  }

  const handleRemoveStop = (index: number) => {
    if (dropoffs.length > 1) {
      const updated = dropoffs.filter((_, i) => i !== index)
      setDropoffs(updated)
    }
  }

  const handleDropoffChange = (index: number, val: string) => {
    const updated = [...dropoffs]
    updated[index] = val
    setDropoffs(updated)
  }

  // Estimated fare calculation in INR
  const estimatedKm = dropoffs.length * 8.5
  const baseFare = 30
  const costPerKm = 12
  const tierMultipliers = { swift: 1.0, cargo: 1.25, volt: 1.1 }
  const estimatedFare = Math.round((baseFare + estimatedKm * costPerKm) * tierMultipliers[selectedTier])
  const estimatedDuration = Math.ceil((estimatedKm / 28) * 60) // in minutes

  const handleConfirmRide = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }

    if (!pickup.trim()) {
      setError('Please provide a valid pickup location')
      return
    }

    const validDropoffs = dropoffs.filter((d) => d.trim().length > 0)
    if (validDropoffs.length === 0) {
      setError('Please provide at least one drop-off location')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await requestRide(pickup, validDropoffs)
      onRideRequested()
    } catch (err: any) {
      setError(err.message || 'Failed to request ride. Please check locations.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#FF5500] flex items-center justify-center">
              <MotorcycleIcon size={20} color="#FFFFFF" />
            </div>
            Dispatch a Motorcycle
          </h1>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1">
            Real-time geospatial matching • Fixed transparent INR rates
          </p>
        </div>
        <span className="badge-status badge-accepted hidden sm:inline-flex">
          AVG ARRIVAL: 3 MINS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Route Setup & Preferences Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="panel-mech p-6 bg-[#0E121A]">
            
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-[#FF334B]/10 border border-[#FF334B]/30 text-xs text-[#FF334B] flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleConfirmRide} className="space-y-5">
              
              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#00F0A0] mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
                  Pickup Point
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-[#00F0A0]" />
                  <input
                    type="text"
                    required
                    placeholder="Enter pickup address or metro station..."
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="input-mech pl-10 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Drop-off Locations (Multi-stop) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold uppercase text-[#FF5500] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF5500]"></span>
                    Destination Point{dropoffs.length > 1 ? 's' : ''}
                  </label>
                  {dropoffs.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="text-[11px] font-mono text-[#0091FF] hover:text-[#0091FF]/80 flex items-center gap-1 font-bold"
                    >
                      <Plus size={13} />
                      Add Stop
                    </button>
                  )}
                </div>

                {dropoffs.map((d, index) => (
                  <div key={index} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Navigation size={16} className="absolute left-3.5 top-3.5 text-[#FF5500]" />
                      <input
                        type="text"
                        required
                        placeholder={`Stop ${index + 1} destination...`}
                        value={d}
                        onChange={(e) => handleDropoffChange(index, e.target.value)}
                        className="input-mech pl-10 text-sm font-medium"
                      />
                    </div>
                    {dropoffs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(index)}
                        className="p-3 bg-[#181E2C] border border-[#1F2738] rounded-md text-[#9CA3AF] hover:text-[#FF334B]"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Location Shortcuts */}
              <div>
                <p className="text-[11px] font-mono text-[#9CA3AF] uppercase mb-2 font-bold">
                  Quick Urban Shortcuts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleDropoffChange(0, loc)}
                      className="px-2.5 py-1 bg-[#181E2C] hover:bg-[#252D40] border border-[#1F2738] rounded text-[11px] text-slate-300 transition-colors"
                    >
                      + {loc.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fleet Class Selection */}
              <div className="pt-3 border-t border-[#1F2738]">
                <p className="text-xs font-mono uppercase font-bold text-white mb-3">
                  Select Fleet Tier
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setSelectedTier('swift')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedTier === 'swift'
                        ? 'bg-[#181E2C] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                        : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                    }`}
                  >
                    <MotorcycleIcon size={22} color={selectedTier === 'swift' ? '#FF5500' : '#9CA3AF'} />
                    <p className="text-xs font-bold text-white mt-2">Moto Swift</p>
                    <p className="text-[10px] font-mono text-[#00F0A0]">Fast Lane Split</p>
                  </div>

                  <div
                    onClick={() => setSelectedTier('cargo')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedTier === 'cargo'
                        ? 'bg-[#181E2C] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                        : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                    }`}
                  >
                    <CargoBoxIcon size={22} color={selectedTier === 'cargo' ? '#FF5500' : '#9CA3AF'} />
                    <p className="text-xs font-bold text-white mt-2">Cargo Box</p>
                    <p className="text-[10px] font-mono text-[#9CA3AF]">45L Lockbox</p>
                  </div>

                  <div
                    onClick={() => setSelectedTier('volt')}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedTier === 'volt'
                        ? 'bg-[#181E2C] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                        : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                    }`}
                  >
                    <Sparkles size={20} className={selectedTier === 'volt' ? 'text-[#00F0A0]' : 'text-[#9CA3AF]'} />
                    <p className="text-xs font-bold text-white mt-2">Volt EV</p>
                    <p className="text-[10px] font-mono text-[#00F0A0]">Zero Emission</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3 border-t border-[#1F2738]">
                <p className="text-xs font-mono uppercase font-bold text-white mb-2.5">
                  Payment Method (UPI / Cash / Card)
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-md border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-[#181E2C] border-[#00F0A0] text-[#00F0A0]'
                        : 'bg-[#0B0E14] border-[#1F2738] text-[#9CA3AF]'
                    }`}
                  >
                    <Banknote size={14} />
                    Cash / UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-md border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#181E2C] border-[#00F0A0] text-[#00F0A0]'
                        : 'bg-[#0B0E14] border-[#1F2738] text-[#9CA3AF]'
                    }`}
                  >
                    <CreditCard size={14} />
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 px-3 rounded-md border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-[#181E2C] border-[#00F0A0] text-[#00F0A0]'
                        : 'bg-[#0B0E14] border-[#1F2738] text-[#9CA3AF]'
                    }`}
                  >
                    <Wallet size={14} />
                    Wallet
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="btn-nitro w-full py-4 text-sm mt-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Contacting Dispatch Engine...</span>
                ) : (
                  <>
                    <Navigation size={18} />
                    Confirm & Dispatch Nearest Moto
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Dynamic Live Telemetry & Fare Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="panel-mech-highlight p-6 bg-[#0E121A]">
            
            <div className="flex items-center justify-between border-b border-[#1F2738] pb-4 mb-6">
              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                TRIP TELEMETRY SUMMARY
              </span>
              <span className="badge-status badge-accepted">
                FIXED RATE
              </span>
            </div>

            {/* Total Fare Card in INR */}
            <div className="bg-[#07090C] p-5 rounded-xl border border-[#1F2738] mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-[#9CA3AF] uppercase">Guaranteed Fare (INR)</p>
                  <p className="font-mono-tabular text-4xl font-extrabold text-white mt-1">
                    ₹{estimatedFare.toLocaleString()}
                  </p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-[#00F0A0] block font-bold">ETA ~{estimatedDuration} MINS</span>
                  <span className="text-[11px] text-[#9CA3AF]">~{estimatedKm.toFixed(1)} km route</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2738] text-[11px] font-mono text-[#9CA3AF] flex items-center justify-between">
                <span>Base Fare: ₹30</span>
                <span>Distance Rate: ₹12/km</span>
                <span>Tier Multiplier: {tierMultipliers[selectedTier]}x</span>
              </div>
            </div>

            {/* Safety & Protocol Check */}
            <div className="space-y-3 bg-[#0B0E14] p-4 rounded-lg border border-[#1F2738]">
              <p className="text-xs font-mono font-bold uppercase text-white flex items-center gap-2">
                <Shield size={14} className="text-[#00F0A0]" />
                Ride Inclusions
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <HelmetIcon size={16} color="#FF5500" />
                  <span>ISI/DOT Certified Helmet + Sanitized Liner included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#00F0A0]" />
                  <span>Live Redis GPS tracking with 10Hz sync</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
