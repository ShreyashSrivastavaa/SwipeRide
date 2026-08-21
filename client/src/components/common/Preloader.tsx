import React, { useEffect, useState } from 'react'
import { Zap, Radio, Shield, Gauge } from 'lucide-react'

interface PreloaderProps {
  onComplete?: () => void
  minDurationMs?: number
}

const TELEMETRY_STEPS = [
  { text: 'INITIALIZING KINETIC TELEMETRY...', icon: Gauge },
  { text: 'CALIBRATING GPS & REALTIME MESH...', icon: Radio },
  { text: 'OPTIMIZING TRAFFIC ROUTING ENGINE...', icon: Zap },
  { text: 'PILOT NETWORK DISPATCH SYNCHRONIZED...', icon: Shield },
  { text: 'SYSTEM READY • SWIPERIDE PROTOCOL ONLINE', icon: Zap },
]

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDurationMs = 1800,
}) => {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const startTime = performance.now()

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime
      const rawProgress = Math.min(100, Math.floor((elapsed / minDurationMs) * 100))

      setProgress(rawProgress)

      const calculatedStep = Math.min(
        TELEMETRY_STEPS.length - 1,
        Math.floor((rawProgress / 100) * TELEMETRY_STEPS.length)
      )
      setStepIndex(calculatedStep)

      if (rawProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsExiting(true)
          setTimeout(() => {
            setIsFinished(true)
            onComplete?.()
          }, 600)
        }, 200)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [minDurationMs, onComplete])

  if (isFinished) return null

  const CurrentIcon = TELEMETRY_STEPS[stepIndex].icon

  return (
    <div
      aria-label="Loading SwipeRide"
      role="status"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090C] select-none transition-all duration-700 ease-out overflow-hidden ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none backdrop-blur-xl'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Cyber-Grid & Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.18)_0%,rgba(7,9,12,0.96)_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F273812_1px,transparent_1px),linear-gradient(to_bottom,#1F273812_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Center Kinetic Logo Container */}
      <div className="relative flex flex-col items-center justify-center z-10 px-6 max-w-sm w-full">
        
        {/* Multi-layered Rotating HUD Hologram Rings */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-8">
          
          {/* Outer Segmented Dashed Orange Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#FF5500]/40 animate-[spin_10s_linear_infinite]" />
          
          {/* Middle Cyan Telemetry Ring */}
          <div className="absolute inset-2 rounded-full border border-[#00F0A0]/30 border-t-[#00F0A0] border-b-[#00F0A0] animate-[spin_4s_linear_infinite_reverse]" />

          {/* Glowing Radial Halo */}
          <div className="absolute inset-4 rounded-full bg-[#FF5500]/15 blur-xl animate-pulse" />

          {/* Inner Hex-bordered Logo Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#121620] border-2 border-[#FF5500] shadow-[0_0_35px_rgba(255,85,0,0.5)] p-1 group">
            {/* Logo Image */}
            <img
              src="/logo.jpg"
              alt="SwipeRide Logo"
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
            />

            {/* Futuristic Scanline Sheen Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-y-full animate-[scanline_2.2s_ease-in-out_infinite] pointer-events-none" />
          </div>

          {/* RPM Kinetic Indicator Sparks */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FF5500] rounded-full shadow-[0_0_12px_#FF5500] animate-ping" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00F0A0] rounded-full shadow-[0_0_10px_#00F0A0]" />
        </div>

        {/* Brand Title with Metallic Glow */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center drop-shadow-[0_2px_15px_rgba(255,85,0,0.3)]">
            SWIPE<span className="text-[#FF5500] ml-1">RIDE</span>
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9CA3AF] mt-1 font-semibold flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
            STREET MOTO DISPATCH PROTOCOL
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0A0] animate-pulse" />
          </p>
        </div>

        {/* High-Tech Segmented Progress HUD */}
        <div className="w-full bg-[#121620]/90 border border-[#1F2738] rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.7)] backdrop-blur-md">
          {/* Telemetry Header Line */}
          <div className="flex items-center justify-between text-xs font-mono mb-2.5">
            <span className="flex items-center gap-1.5 text-[#00F0A0] font-bold tracking-wider">
              <CurrentIcon size={13} className="animate-spin-slow" />
              <span className="truncate max-w-[190px]">{TELEMETRY_STEPS[stepIndex].text}</span>
            </span>
            <span className="text-[#FF5500] font-extrabold tabular-nums ml-2 text-sm">
              {progress}%
            </span>
          </div>

          {/* Kinetic Progress Bar */}
          <div className="w-full h-2.5 bg-[#07090C] rounded-full overflow-hidden p-0.5 border border-[#1F2738]">
            <div
              className="h-full bg-gradient-to-r from-[#FF5500] via-[#FFB800] to-[#00F0A0] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(255,85,0,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live Equalizer / RPM Frequency Meter Bars */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1">
              {[40, 75, 100, 60, 90, 45, 80, 55, 95, 70, 85, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#1F2738] rounded-full overflow-hidden h-3 flex items-end"
                >
                  <div
                    className="w-full bg-[#FF5500] transition-all duration-150 rounded-full"
                    style={{
                      height: `${progress > i * 8 ? Math.min(100, (h * (progress / 100)) + Math.random() * 20) : 15}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <span className="text-[9px] font-mono text-[#6B7280] tracking-widest uppercase">
              V8.4 NITRO
            </span>
          </div>
        </div>

        {/* Dispatch Status Pill */}
        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-[#6B7280]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-ping" />
          <span>ESTABLISHING PEER-TO-PEER SOCKET</span>
        </div>
      </div>
    </div>
  )
}
