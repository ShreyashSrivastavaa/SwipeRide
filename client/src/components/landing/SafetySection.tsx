import React from 'react'
import { HelmetIcon } from '../icons/CustomIcons'
import { ShieldCheck, UserCheck, PhoneCall, CheckCircle } from 'lucide-react'

export const SafetySection: React.FC = () => {
  return (
    <section className="py-16 bg-[#0B0E14] border-b border-[#1F2738]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00F0A0]/10 border border-[#00F0A0]/30 text-xs font-mono font-bold text-[#00F0A0] uppercase">
            <ShieldCheck size={14} />
            Zero Compromise Security
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            The SwipeRide Safety Shield
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Motorcycle riding requires discipline. We enforce stringent physical gear standards and background verifications before any pilot takes the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="panel-mech p-6 bg-[#121620] space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#FF5500]/10 border border-[#FF5500]/30 flex items-center justify-center">
              <HelmetIcon size={26} color="#FF5500" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">ISI/DOT Certified Dual Helmets</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Every pilot carries an extra passenger helmet certified to ISI/DOT standards with adjustable quick-release chin straps and single-use disposable hygiene hairnets.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#00F0A0]">
              <CheckCircle size={14} />
              <span>Mandatory pre-trip gear check</span>
            </div>
          </div>

          <div className="panel-mech p-6 bg-[#121620] space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#00F0A0]/10 border border-[#00F0A0]/30 flex items-center justify-center text-[#00F0A0]">
              <UserCheck size={26} />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Vetted & Licensed Pilots</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              100% of pilots undergo police background verification, driving license authentication with the RTO database, and in-person defensive riding assessments.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#00F0A0]">
              <CheckCircle size={14} />
              <span>Aadhaar + RTO License validation</span>
            </div>
          </div>

          <div className="panel-mech p-6 bg-[#121620] space-y-4">
            <div className="w-12 h-12 rounded-lg bg-[#FF334B]/10 border border-[#FF334B]/30 flex items-center justify-center text-[#FF334B]">
              <PhoneCall size={26} />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Real-Time Telemetry & SOS</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Every ride is monitored live on our operations radar. Speed governors alert our ops team to reckless acceleration, with one-tap emergency panic dispatch.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#00F0A0]">
              <CheckCircle size={14} />
              <span>24/7 Operations Command Center</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
