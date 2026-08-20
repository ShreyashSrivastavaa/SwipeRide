import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRide } from '../../context/RideContext'
import { User as UserIcon, LogOut, History, Zap, Navigation, Menu, X } from 'lucide-react'

interface HeaderProps {
  currentView: 'landing' | 'booking' | 'tracking' | 'history'
  setCurrentView: (view: 'landing' | 'booking' | 'tracking' | 'history') => void
  openAuthModal: () => void
  toggleSimulator: () => void
  isSimulatorOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  openAuthModal,
  toggleSimulator,
  isSimulatorOpen,
}) => {
  const { user, isAuthenticated, logout } = useAuth()
  const { activeRide, rideStatus } = useRide()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNav = (view: 'landing' | 'booking' | 'tracking' | 'history') => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090C]/95 backdrop-blur-md border-b border-[#1F2738]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNav('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#FF5500]/50 shadow-[0_0_20px_rgba(255,85,0,0.4)] group-hover:scale-105 transition-transform bg-[#121620]">
            <img src="/logo.jpg" alt="SwipeRide Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-white flex items-center">
              SWIPE<span className="text-[#FF5500]">RIDE</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#9CA3AF] uppercase block -mt-1 font-semibold">
              Street Moto Dispatch
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#121620] px-2 py-1.5 rounded-lg border border-[#1F2738]">
          <button
            onClick={() => handleNav('landing')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold font-display uppercase tracking-wider transition-all ${
              currentView === 'landing'
                ? 'bg-[#FF5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1E2536]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('booking')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              currentView === 'booking'
                ? 'bg-[#FF5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#1E2536]'
            }`}
          >
            <Navigation size={13} />
            Book Ride
          </button>
          {activeRide && rideStatus !== 'idle' && (
            <button
              onClick={() => handleNav('tracking')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 transition-all animate-pulse ${
                currentView === 'tracking'
                  ? 'bg-[#00F0A0] text-[#07090C] font-extrabold'
                  : 'bg-[#00F0A0]/20 text-[#00F0A0] border border-[#00F0A0]/40'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
              Live Ride ({rideStatus})
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => handleNav('history')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                currentView === 'history'
                  ? 'bg-[#FF5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#1E2536]'
              }`}
            >
              <History size={13} />
              Trips
            </button>
          )}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Driver Simulator Dock Toggle */}
          <button
            onClick={toggleSimulator}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              isSimulatorOpen
                ? 'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.25)]'
                : 'bg-[#121620] border-[#1F2738] text-[#9CA3AF] hover:text-white hover:border-[#2D374D]'
            }`}
            title="Toggle Live Driver Simulator"
          >
            <Zap size={13} className={isSimulatorOpen ? 'text-[#FFB800]' : 'text-[#9CA3AF]'} />
            <span className="hidden sm:inline">Driver Sim</span>
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="bg-[#121620] border border-[#1F2738] rounded-md px-3 py-1.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FF5500]/20 text-[#FF5500] flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="text-[9px] font-mono text-[#9CA3AF] uppercase leading-tight mt-0.5">{user.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-[#9CA3AF] hover:text-[#FF334B] hover:bg-[#181E2C] rounded-md transition-colors"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="btn-nitro text-xs py-2 px-4 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,85,0,0.3)]"
            >
              <UserIcon size={14} />
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#9CA3AF] hover:text-white bg-[#121620] border border-[#1F2738] rounded-md"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E121A] border-b border-[#1F2738] px-4 py-3 space-y-2 font-display text-xs">
          <button
            onClick={() => handleNav('landing')}
            className={`w-full text-left py-2 px-3 rounded-md font-bold uppercase ${
              currentView === 'landing' ? 'bg-[#FF5500] text-white' : 'text-[#9CA3AF]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNav('booking')}
            className={`w-full text-left py-2 px-3 rounded-md font-bold uppercase flex items-center gap-2 ${
              currentView === 'booking' ? 'bg-[#FF5500] text-white' : 'text-[#9CA3AF]'
            }`}
          >
            <Navigation size={14} />
            Book Ride
          </button>
          {activeRide && rideStatus !== 'idle' && (
            <button
              onClick={() => handleNav('tracking')}
              className="w-full text-left py-2 px-3 rounded-md font-bold uppercase text-[#00F0A0] bg-[#00F0A0]/10 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
              Live Ride ({rideStatus})
            </button>
          )}
          {isAuthenticated && (
            <button
              onClick={() => handleNav('history')}
              className={`w-full text-left py-2 px-3 rounded-md font-bold uppercase flex items-center gap-2 ${
                currentView === 'history' ? 'bg-[#FF5500] text-white' : 'text-[#9CA3AF]'
              }`}
            >
              <History size={14} />
              Trips & History
            </button>
          )}
        </div>
      )}
    </header>
  )
}
