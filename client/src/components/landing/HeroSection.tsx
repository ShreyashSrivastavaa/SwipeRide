import React from 'react'
import { MotorcycleIcon, HelmetIcon, SpeedometerIcon, SurgeLightningIcon } from '../icons/CustomIcons'
import { Navigation, ShieldCheck, Clock, ArrowRight, Activity } from 'lucide-react'

interface HeroSectionProps {
  onStartBooking: () => void
  onOpenCalculator: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBooking, onOpenCalculator }) => {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#1F2738]">
      {/* Background Kinetic Street Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5500] to-transparent"></div>
        <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0A0] to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0091FF] to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Hero Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121620] border border-[#2D374D] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00F0A0] animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#00F0A0] uppercase">
                METRO FLEET ACTIVE • 420+ BIKES IN MOTION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
              LANE-SPLIT THE <br />
              <span className="text-[#FF5500] drop-shadow-[0_0_25px_rgba(255,85,0,0.3)]">
                GRIDLOCK.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#9CA3AF] max-w-xl leading-relaxed">
              When 4-wheel cars sit stationary for 2 hours in peak hour traffic, SwipeRide weaves through at 45 km/h. Fast, vetted motorcycle dispatch with live GPS tracking, certified dual helmets, and transparent per-km INR fares.
            </p>

            {/* Kinetic Telemetry Stats Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="panel-mech p-3 bg-[#0B0E14]">
                <p className="text-[10px] font-mono text-[#9CA3AF] uppercase">Avg Match Time</p>
                <p className="font-mono-tabular text-xl font-bold text-white flex items-center gap-1 mt-0.5">
                  <Clock size={16} className="text-[#FF5500]" />
                  84<span className="text-xs text-[#9CA3AF]">s</span>
                </p>
              </div>

              <div className="panel-mech p-3 bg-[#0B0E14]">
                <p className="text-[10px] font-mono text-[#9CA3AF] uppercase">Speed vs Cars</p>
                <p className="font-mono-tabular text-xl font-bold text-[#00F0A0] flex items-center gap-1 mt-0.5">
                  <SpeedometerIcon size={16} color="#00F0A0" />
                  3.4<span className="text-xs">x</span>
                </p>
              </div>

              <div className="panel-mech p-3 bg-[#0B0E14]">
                <p className="text-[10px] font-mono text-[#9CA3AF] uppercase">Base Fare</p>
                <p className="font-mono-tabular text-xl font-bold text-[#FFB800] flex items-center gap-1 mt-0.5">
                  <SurgeLightningIcon size={14} color="#FFB800" />
                  ₹30
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onStartBooking}
                className="btn-nitro py-3.5 px-7 text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(255,85,0,0.4)]"
              >
                <Navigation size={18} />
                Request Ride Now
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenCalculator}
                className="btn-subtle py-3.5 px-6 text-sm flex items-center gap-2"
              >
                <Activity size={16} className="text-[#00F0A0]" />
                Interactive Fare Radar
              </button>
            </div>
          </div>

          {/* Right Column - Kinetic Tactical Bike Card HUD */}
          <div className="lg:col-span-5 relative">
            <div className="panel-mech-highlight p-6 bg-[#0E121A] relative overflow-hidden">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-[#1F2738] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    TELEMETRY DISPATCH FEED
                  </span>
                </div>
                <span className="badge-status badge-accepted">LIVE SATELLITE 10Hz</span>
              </div>

              {/* Dynamic Moto Graphic */}
              <div className="relative h-48 bg-[#07090C] rounded-lg border border-[#1F2738] p-4 flex flex-col justify-between overflow-hidden">
                {/* Grid Scan Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#1F2738_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                
                {/* GPS Pin Route Simulation */}
                <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 bg-[#121620] px-2.5 py-1 rounded border border-[#2D374D]">
                    <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
                    <span>Koramangala 5th Block</span>
                  </div>
                  <span className="text-[#FF5500] font-bold">11.8 km • ₹172</span>
                  <div className="flex items-center gap-2 bg-[#121620] px-2.5 py-1 rounded border border-[#2D374D]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5500]"></span>
                    <span>Indiranagar 100ft Rd</span>
                  </div>
                </div>

                {/* Center Animated Bike Beacon */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-20 h-20 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/40 flex items-center justify-center animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-[#FF5500] flex items-center justify-center shadow-[0_0_20px_#FF5500]">
                      <MotorcycleIcon size={28} color="#FFFFFF" />
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Line */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] border-t border-[#1F2738] pt-2">
                  <span>PILOT: CAPT. VIKRAM (4.9★)</span>
                  <span className="text-[#00F0A0] font-bold">DISPATCH: 3 MINS</span>
                </div>
              </div>

              {/* Verified Safety Badge */}
              <div className="mt-4 p-3 rounded-lg bg-[#07090C] border border-[#1F2738] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <HelmetIcon size={18} color="#FF5500" />
                  <span className="text-slate-300 font-medium">Dual ISI/DOT Helmets + Sanitized Liners</span>
                </div>
                <ShieldCheck size={16} className="text-[#00F0A0]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
