import React, { useState, useEffect } from 'react'
import { MotorcycleIcon } from '../icons/CustomIcons'
import { Radio, Compass, Wifi } from 'lucide-react'

export const FleetRadarWidget: React.FC = () => {
  const [activeBikes, setActiveBikes] = useState([
    { id: 'MOTO-01', x: 28, y: 35, speed: 42, driver: 'Vikram S.', model: 'Bajaj Pulsar 150', angle: 45 },
    { id: 'MOTO-04', x: 62, y: 28, speed: 48, driver: 'Rahul D.', model: 'Hero Splendor Plus', angle: 120 },
    { id: 'MOTO-09', x: 45, y: 68, speed: 38, driver: 'Rajesh K.', model: 'TVS Raider 125', angle: 210 },
    { id: 'MOTO-12', x: 78, y: 72, speed: 45, driver: 'Amit P.', model: 'Ather 450X EV', angle: 310 },
    { id: 'MOTO-17', x: 18, y: 80, speed: 36, driver: 'Karthik N.', model: 'Honda Shine 125', angle: 90 },
  ])

  const [selectedBike, setSelectedBike] = useState<typeof activeBikes[0] | null>(activeBikes[0])

  // Periodic simulated movement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBikes((prev) =>
        prev.map((b) => {
          const dx = (Math.random() - 0.5) * 2
          const dy = (Math.random() - 0.5) * 2
          const newSpeed = Math.floor(32 + Math.random() * 22)
          return {
            ...b,
            x: Math.max(10, Math.min(90, b.x + dx)),
            y: Math.max(10, Math.min(90, b.y + dy)),
            speed: newSpeed,
          }
        })
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 border-b border-[#1F2738] bg-[#090B0E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00F0A0]/10 border border-[#00F0A0]/30 text-xs font-mono font-bold text-[#00F0A0] uppercase">
              <Radio size={14} className="animate-pulse" />
              Redis Live Geospatial Telemetry
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Tactical Fleet Radar
            </h2>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Every SwipeRide motorcycle pings location data into our low-latency Redis spatial index at sub-second intervals. When you hit request, our matching algorithm dispatches the nearest high-rated pilot in under 90 seconds.
            </p>

            {selectedBike && (
              <div className="panel-mech p-4 bg-[#121620] border-[#2D374D] space-y-2">
                <div className="flex items-center justify-between border-b border-[#1F2738] pb-2">
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
                    CALLSIGN: {selectedBike.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#FF5500] font-bold">DISPATCH READY</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">PILOT</span>
                    <span className="text-white font-bold">{selectedBike.driver}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">SPEED</span>
                    <span className="text-[#00F0A0] font-bold">{selectedBike.speed} km/h</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">MOTORCYCLE</span>
                    <span className="text-white">{selectedBike.model}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-[10px]">SIGNAL</span>
                    <span className="text-white flex items-center gap-1">
                      <Wifi size={11} className="text-[#00F0A0]" />
                      5G 10Hz
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Radar Canvas HUD */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] max-h-[420px] w-full rounded-2xl bg-[#07090C] border border-[#2D374D] overflow-hidden p-4 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              
              {/* Radar Sweep Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1F2738_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>

              {/* Concentric Radar Distance Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3/4 h-3/4 rounded-full border border-[#1F2738]/60"></div>
                <div className="w-1/2 h-1/2 rounded-full border border-[#1F2738]/80"></div>
                <div className="w-1/4 h-1/4 rounded-full border border-[#2D374D]"></div>
                {/* Center Crosshairs */}
                <div className="absolute w-full h-[1px] bg-[#1F2738]/40"></div>
                <div className="absolute h-full w-[1px] bg-[#1F2738]/40"></div>
              </div>

              {/* Radar Sweep Ray */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full animate-radar origin-center bg-gradient-to-tr from-transparent via-transparent to-[#FF5500]/15 rounded-full"></div>
              </div>

              {/* Top Telemetry Header */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] bg-[#121620]/90 px-3 py-1.5 rounded border border-[#1F2738]">
                <span className="flex items-center gap-2 text-white font-bold">
                  <Compass size={13} className="text-[#FF5500]" />
                  ZONE: BENGALURU METROPOLITAN (12.9716° N, 77.5946° E)
                </span>
                <span className="text-[#00F0A0] font-bold">ACTIVE SCAN: 5 PILOTS IN SECTOR</span>
              </div>

              {/* Interactive Bike Points */}
              <div className="absolute inset-4">
                {activeBikes.map((bike) => (
                  <div
                    key={bike.id}
                    onClick={() => setSelectedBike(bike)}
                    style={{ left: `${bike.x}%`, top: `${bike.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-1000"
                  >
                    {/* Pulsing ring */}
                    <div className="absolute -inset-2 rounded-full bg-[#FF5500]/20 animate-ping"></div>
                    
                    {/* Bike Marker Button */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-transform ${
                        selectedBike?.id === bike.id
                          ? 'bg-[#FF5500] border-white scale-125 shadow-[0_0_15px_#FF5500]'
                          : 'bg-[#181E2C] border-[#FF5500] hover:scale-110'
                      }`}
                    >
                      <MotorcycleIcon size={14} color="#FFFFFF" />
                    </div>

                    {/* Tooltip Tag */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B0E14] px-1.5 py-0.5 rounded border border-[#2D374D] text-[9px] font-mono font-bold text-white shadow">
                      {bike.id} • {bike.speed}km/h
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
