import React from 'react'
import { HelmetIcon } from '../icons/CustomIcons'
import { Shield, Zap, Award, PhoneCall, Sparkles, Mail, ArrowUpRight, User } from 'lucide-react'

// Custom SVGs for Social Platforms
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const TwitterXIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
)

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
  </svg>
)

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090C] border-t border-[#1F2738] pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid: SwipeRide Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#FF5500]/50 shadow-[0_0_15px_rgba(255,85,0,0.4)] bg-[#121620]">
                <img src="/logo.jpg" alt="SwipeRide Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SWIPE<span className="text-[#FF5500]">RIDE</span>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Street-level motorcycle ride-hailing operating at speed in Indian urban traffic. Built with Redis-backed live telemetry and real-time Socket dispatch.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0A0]">
              <span className="w-2 h-2 rounded-full bg-[#00F0A0] animate-pulse"></span>
              METRO FLEET: 420+ BIKES ONLINE
            </div>
          </div>

          {/* Core Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF] font-bold">Guarantees</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <HelmetIcon size={16} color="#FF5500" />
                <span>ISI/DOT Certified Helmets Provided</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield size={16} className="text-[#00F0A0]" />
                <span>Vetted RTO & Police-Verified Pilots</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap size={16} className="text-[#FFB800]" />
                <span>Sub-90s Average Dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <Award size={16} className="text-[#0091FF]" />
                <span>Fixed Transparent INR Rates</span>
              </li>
            </ul>
          </div>

          {/* Quick Endpoints */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF] font-bold">API Specifications</h4>
            <ul className="space-y-1.5 text-xs font-mono text-[#9CA3AF]">
              <li><span className="text-[#FF5500]">POST</span> /api/v1/rides</li>
              <li><span className="text-[#0091FF]">PATCH</span> /api/v1/rides/status/:id</li>
              <li><span className="text-[#00F0A0]">PUT</span> /api/v1/drivers/location</li>
              <li><span className="text-[#FFB800]">WS</span> /ws (Live Telemetry)</li>
            </ul>
          </div>

          {/* Emergency SOS & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF] font-bold">Rapid Response</h4>
            <p className="text-xs text-[#9CA3AF]">
              Live 24/7 incident telemetry dispatch & road assistance center.
            </p>
            <div className="panel-mech p-3 flex items-center gap-3 border-[#FF334B]/30 bg-[#FF334B]/5">
              <PhoneCall size={18} className="text-[#FF334B]" />
              <div>
                <p className="text-[10px] font-mono text-[#FF334B] uppercase font-bold">SOS Telemetry Helpline</p>
                <p className="text-xs font-bold text-white font-mono">+91 (0) 800-SWIPE-RIDE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Creator & Company Affiliation Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0C101A] via-[#121624] to-[#0C101A] border border-[#232D42] p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Creator Profile + UpscaleTechSolutions Affiliation */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/30 text-[11px] font-mono font-bold text-[#FF5500] uppercase">
                  <User size={13} />
                  Solo Creator & Lead Architect
                </div>
                <h3 className="font-display text-2xl font-black text-white tracking-tight">
                  Shreyash Srivastava
                </h3>
                <p className="text-xs text-[#818CF8] font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#818CF8]" />
                  Software Engineer @ <span className="text-white underline decoration-[#818CF8]">UpscaleTechSolutions</span>
                </p>
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                SwipeRide is a personal engineering project architected from the ground up by <strong>Shreyash Srivastava</strong>. Currently working at <strong>UpscaleTechSolutions</strong>, building modern web experiences, autonomous agentic AI systems, and digital process automation for ambitious enterprises worldwide.
              </p>

              {/* Social Link Badges */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#181F30] hover:bg-[#28324A] border border-[#2D3952] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#181F30] hover:bg-[#28324A] border border-[#2D3952] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
                  title="Twitter / X"
                >
                  <TwitterXIcon />
                </a>
                <a
                  href="https://github.com/ShreyashSrivastavaa"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#181F30] hover:bg-[#28324A] border border-[#2D3952] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
                  title="GitHub Profile"
                >
                  <GitHubIcon />
                </a>
                <a
                  href="mailto:shreyashsr2004@gmail.com"
                  className="px-3 py-1.5 rounded-lg bg-[#181F30] hover:bg-[#28324A] border border-[#2D3952] text-xs font-mono text-[#818CF8] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={13} />
                  <span>shreyashsr2004@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Middle: Company Services Pills */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
                  UpscaleTechSolutions Services
                </h5>
                <span className="text-[10px] font-mono text-[#818CF8] font-semibold">Company</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#9CA3AF] font-medium">
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  AI Automation
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  Web Design & Dev
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  Agentic AI Systems
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  AI Strategy & Consulting
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  Maintenance & Support
                </span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]"></span>
                  High-Scale Architecture
                </span>
              </div>
            </div>

            {/* Right: Stay Updated CTA */}
            <div className="lg:col-span-3 space-y-3 bg-[#090C14] p-4 rounded-xl border border-[#1F2738]">
              <h5 className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
                Stay Updated
              </h5>
              <p className="text-[11px] text-[#9CA3AF]">
                Subscribe for AI engineering updates and tech insights.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-[#121622] border border-[#2D374D] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#818CF8]"
                />
                <a
                  href="mailto:shreyashsr2004@gmail.com?subject=Subscribe%20to%20SwipeRide%20Updates"
                  className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <span>Subscribe</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="border-t border-[#1F2738] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <p>© {new Date().getFullYear()} SwipeRide. All rights reserved.</p>
            <span className="hidden sm:inline text-[#2D374D]">•</span>
            <p className="text-[#9CA3AF]">
              Created & Developed by{' '}
              <strong className="text-white font-bold">Shreyash Srivastava</strong>{' '}
              <span className="text-[#818CF8] font-mono text-[11px]">(Software Engineer @ UpscaleTechSolutions)</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:shreyashsr2004@gmail.com" className="font-mono text-[#818CF8] hover:text-white transition-colors">
              shreyashsr2004@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
