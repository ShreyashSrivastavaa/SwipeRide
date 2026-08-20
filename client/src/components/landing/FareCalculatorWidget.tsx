import React, { useState } from 'react'
import { MotorcycleIcon, CargoBoxIcon, SpeedometerIcon, SurgeLightningIcon } from '../icons/CustomIcons'
import { Navigation, ArrowRight, Zap, Clock } from 'lucide-react'

interface FareCalculatorWidgetProps {
  onSelectRoute: (pickup: string, dropoff: string) => void
}

const PRESET_ROUTES = [
  { pickup: 'Koramangala 5th Block, Bengaluru', dropoff: 'Indiranagar 100ft Rd, Bengaluru', distanceKm: 8.5, carMinutes: 55, motoMinutes: 18 },
  { pickup: 'HSR Layout Sector 2, Bengaluru', dropoff: 'Electronic City Phase 1, Bengaluru', distanceKm: 14.2, carMinutes: 80, motoMinutes: 24 },
  { pickup: 'Bandra Kurla Complex (BKC), Mumbai', dropoff: 'Lower Parel Commercial Hub, Mumbai', distanceKm: 10.5, carMinutes: 65, motoMinutes: 20 },
  { pickup: 'Cyber City, Gurgaon', dropoff: 'Connaught Place, New Delhi', distanceKm: 26.0, carMinutes: 110, motoMinutes: 36 },
]

export const FareCalculatorWidget: React.FC<FareCalculatorWidgetProps> = ({ onSelectRoute }) => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0)
  const [tier, setTier] = useState<'swift' | 'cargo' | 'volt'>('swift')

  const route = PRESET_ROUTES[selectedRouteIdx]

  const tierMultipliers = {
    swift: 1.0,
    cargo: 1.25,
    volt: 1.1,
  }

  const baseFare = 30
  const costPerKm = 12
  const distanceFare = route.distanceKm * costPerKm
  const totalFare = Math.round((baseFare + distanceFare) * tierMultipliers[tier])

  const timeSaved = route.carMinutes - route.motoMinutes
  const percentFaster = Math.round((timeSaved / route.carMinutes) * 100)

  return (
    <section id="calculator" className="py-16 border-b border-[#1F2738] bg-[#07090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 text-xs font-mono font-bold text-[#FF5500] uppercase">
            <SpeedometerIcon size={14} color="#FF5500" />
            Live Traffic vs Lane-Split Simulator
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Calculate Fare & Time Saved
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Select common urban commuter corridors to see real-time INR price breakdowns and exact minutes saved vs 4-wheel car traffic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Preset Route Selector & Tier Selection */}
          <div className="lg:col-span-6 space-y-5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF] font-bold">
              1. Select Commuter Corridor
            </h4>

            <div className="space-y-2.5">
              {PRESET_ROUTES.map((r, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRouteIdx(idx)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    selectedRouteIdx === idx
                      ? 'bg-[#181E2C] border-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.2)]'
                      : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
                      <span>{r.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF]">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500]"></span>
                      <span>{r.dropoff}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-white block">{r.distanceKm} km</span>
                    <span className="text-[10px] text-[#00F0A0]">Save {r.carMinutes - r.motoMinutes}m</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Vehicle Tier Switcher */}
            <div className="pt-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF] font-bold mb-3">
                2. Choose Fleet Tier
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTier('swift')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tier === 'swift'
                      ? 'bg-[#181E2C] border-[#FF5500]'
                      : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                  }`}
                >
                  <MotorcycleIcon size={20} color={tier === 'swift' ? '#FF5500' : '#9CA3AF'} />
                  <p className="text-xs font-bold font-display text-white mt-1.5">Moto Swift</p>
                  <p className="text-[10px] font-mono text-[#9CA3AF]">110-150cc • 1x</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('cargo')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tier === 'cargo'
                      ? 'bg-[#181E2C] border-[#FF5500]'
                      : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                  }`}
                >
                  <CargoBoxIcon size={20} color={tier === 'cargo' ? '#FF5500' : '#9CA3AF'} />
                  <p className="text-xs font-bold font-display text-white mt-1.5">Cargo Box</p>
                  <p className="text-[10px] font-mono text-[#9CA3AF]">45L Trunk • 1.25x</p>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('volt')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    tier === 'volt'
                      ? 'bg-[#181E2C] border-[#FF5500]'
                      : 'bg-[#0B0E14] border-[#1F2738] hover:border-[#2D374D]'
                  }`}
                >
                  <Zap size={20} className={tier === 'volt' ? 'text-[#00F0A0]' : 'text-[#9CA3AF]'} />
                  <p className="text-xs font-bold font-display text-white mt-1.5">Volt EV</p>
                  <p className="text-[10px] font-mono text-[#9CA3AF]">Zero Emission • 1.1x</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Telemetry & Fare Breakdown Card */}
          <div className="lg:col-span-6">
            <div className="panel-mech-highlight p-6 bg-[#0E121A]">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1F2738] pb-4 mb-6">
                <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  ESTIMATED FARE & COMMUTE EFFICIENCY
                </span>
                <span className="badge-status badge-inProgress">
                  NO SURGE PRICING
                </span>
              </div>

              {/* Total Fare Figure in INR */}
              <div className="bg-[#07090C] p-5 rounded-xl border border-[#1F2738] mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-[#9CA3AF] uppercase">Guaranteed Fixed Fare (INR)</p>
                  <p className="font-mono-tabular text-4xl font-extrabold text-white mt-1">
                    ₹{totalFare.toLocaleString()}
                  </p>
                  <p className="text-[11px] font-mono text-[#00F0A0] mt-0.5">
                    Base ₹30 + ₹12/km × {route.distanceKm} km
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center">
                  <SurgeLightningIcon size={24} color="#FF5500" />
                </div>
              </div>

              {/* Time Savings Comparison Visualizer */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9CA3AF]">COMMUTE TIME COMPARISON</span>
                  <span className="text-[#00F0A0] font-bold">{percentFaster}% FASTER BY MOTO</span>
                </div>

                {/* SwipeRide Moto Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <MotorcycleIcon size={14} color="#FF5500" />
                      SwipeRide Motorcycle
                    </span>
                    <span className="font-mono text-[#00F0A0]">{route.motoMinutes} mins</span>
                  </div>
                  <div className="w-full h-3 bg-[#1F2738] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF5500] to-[#00F0A0] rounded-full"
                      style={{ width: `${(route.motoMinutes / route.carMinutes) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4-Wheel Car in Traffic Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-[#9CA3AF]">
                    <span>4-Wheel Car (Traffic Gridlock)</span>
                    <span className="font-mono text-[#FF334B]">{route.carMinutes} mins</span>
                  </div>
                  <div className="w-full h-3 bg-[#1F2738] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF334B]/60 rounded-full w-full"></div>
                  </div>
                </div>

                <div className="p-3 bg-[#07090C] rounded-lg border border-[#1F2738] flex items-center gap-2.5 text-xs text-slate-300">
                  <Clock size={16} className="text-[#00F0A0] shrink-0" />
                  <span>
                    You save <strong className="text-white font-mono">{timeSaved} minutes</strong> on this trip alone.
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectRoute(route.pickup, route.dropoff)}
                className="btn-nitro w-full py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                Book This Route with SwipeRide
                <ArrowRight size={14} />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
