import React from 'react'
import { MotorcycleIcon, CargoBoxIcon } from '../icons/CustomIcons'
import { Zap, Check, ArrowRight } from 'lucide-react'

interface FleetTiersSectionProps {
  onSelectTier: (tier: 'swift' | 'cargo' | 'volt') => void
}

export const FleetTiersSection: React.FC<FleetTiersSectionProps> = ({ onSelectTier }) => {
  return (
    <section className="py-16 border-b border-[#1F2738] bg-[#07090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0091FF]/10 border border-[#0091FF]/30 text-xs font-mono font-bold text-[#0091FF] uppercase">
            Specialized Moto Classes
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Built for Indian Urban Commutes
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            From lightning single-commuter lane splitting to secure courier cargo and eco-friendly EV speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tier 1: Moto Swift */}
          <div className="panel-mech p-6 bg-[#0E121A] hover:border-[#FF5500] transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                <MotorcycleIcon size={28} color="#FF5500" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-white">Moto Swift</h3>
                  <span className="badge-status badge-pending">1.0x Regular</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">110cc - 150cc Street Agility</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The fastest way from A to B. Engineered for razor-sharp lane splitting through standstill rush-hour highway traffic.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#9CA3AF] border-t border-[#1F2738] pt-4">
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>1 Passenger + Sanitized Helmet</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Max Traffic Filter Capability</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Starting at ₹30 base</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('swift')}
              className="btn-nitro w-full py-3 text-xs mt-6 flex items-center justify-center gap-2"
            >
              Select Moto Swift
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Tier 2: Cargo Box Moto (Highlighted) */}
          <div className="panel-mech-highlight p-6 bg-[#121622] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF5500] text-white text-[10px] font-mono font-bold px-3 py-1 uppercase rounded-bl-lg">
              Courier Favorite
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#FF5500] flex items-center justify-center text-white shadow-[0_0_15px_#FF5500]">
                <CargoBoxIcon size={28} color="#FFFFFF" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-white">Cargo Box Moto</h3>
                  <span className="badge-status badge-accepted">1.25x Priority</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">45-Liter Lockable Rear Trunk</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Equipped with a weather-sealed hard-shell top trunk. Perfect for carrying backpacks, laptops, or critical courier deliveries dry.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#9CA3AF] border-t border-[#1F2738] pt-4">
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>1 Passenger + 45L Cargo Box</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Waterproof Heavy-Duty Lock</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Priority Courier Pilots</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('cargo')}
              className="btn-nitro w-full py-3 text-xs mt-6 flex items-center justify-center gap-2"
            >
              Select Cargo Moto
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Tier 3: Volt EV Moto */}
          <div className="panel-mech p-6 bg-[#0E121A] hover:border-[#00F0A0] transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#00F0A0]/10 border border-[#00F0A0]/30 flex items-center justify-center text-[#00F0A0]">
                <Zap size={28} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-white">Volt EV Moto</h3>
                  <span className="badge-status badge-accepted">1.1x Clean</span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">Zero Emission Electric Cruiser</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Whisper-quiet high-torque electric acceleration with zero tailpipe emissions. Smooth, vibration-free ride for the modern city.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#9CA3AF] border-t border-[#1F2738] pt-4">
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>100% Electric Powertrain (Ather/Ola)</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Ultra-Smooth No-Vibration Ride</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check size={14} className="text-[#00F0A0]" />
                  <span>Zero Carbon Commute</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectTier('volt')}
              className="btn-nitro w-full py-3 text-xs mt-6 bg-[#00F0A0] text-[#07090C] hover:bg-[#00F0A0]/90 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,160,0.3)]"
            >
              Select Volt EV
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
