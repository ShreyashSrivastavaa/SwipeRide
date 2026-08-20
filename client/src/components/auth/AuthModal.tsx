import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MotorcycleIcon, HelmetIcon } from '../icons/CustomIcons'
import { X, Lock, Phone, Mail, User as UserIcon, AlertCircle, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, registerRider, registerDriver, loginAsDemo } = useAuth()

  const [roleTab, setRoleTab] = useState<'user' | 'driver'>('user')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Rider Form State
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  // Driver Form State
  const [motorcycleType, setMotorcycleType] = useState('Bajaj Pulsar 150')
  const [motorcycleColor, setMotorcycleColor] = useState('Matte Black')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [motorcycleNumber, setMotorcycleNumber] = useState('')

  if (!isOpen) return null

  const handleDemoLogin = async (role: 'user' | 'driver' | 'admin') => {
    setLoading(true)
    setError(null)
    try {
      await loginAsDemo(role)
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const isEmail = identifier.includes('@')
        await login({
          loginMethod: isEmail ? 'email' : 'phone',
          identifier: identifier.trim(),
          password,
        })
      } else {
        if (roleTab === 'user') {
          if (!name || name.length < 3) throw new Error('Name must be at least 3 characters')
          if (!phone || phone.length < 8) throw new Error('Please enter a valid phone number')
          if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')

          await registerRider({
            name,
            phone,
            email: email || undefined,
            password,
          })
        } else {
          // Driver register
          if (!name || name.length < 3) throw new Error('Name must be at least 3 characters')
          if (!email || !email.includes('@')) throw new Error('Please enter a valid email address')
          if (!phone || phone.length < 8) throw new Error('Please enter a valid phone number')
          if (!password || password.length < 6) throw new Error('Password must be at least 6 characters')
          if (!licenseNumber) throw new Error('Driver license number is required')
          if (!motorcycleNumber) throw new Error('Motorcycle plate number is required')

          await registerDriver({
            name,
            email,
            phone,
            password,
            motorcycleType,
            motorcycleColor,
            licenseNumber,
            motorcycleNumber,
            motorcycleYear: 2024,
            address: {
              street: '12 100ft Ring Road, Indiranagar',
              city: 'Bengaluru',
              state: 'Karnataka',
              country: 'India',
              postalCode: '560038',
            },
          })
        }
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  // Combined identifier for login
  const identifier = phone || email

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121620] border border-[#2D374D] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0B0E14] px-6 py-4 border-b border-[#1F2738] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#FF5500]/50 shadow-[0_0_12px_rgba(255,85,0,0.4)] bg-[#121620]">
              <img src="/logo.jpg" alt="SwipeRide Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                {mode === 'login' ? 'Authenticate Profile' : `Register New ${roleTab === 'user' ? 'Rider' : 'Pilot'}`}
              </h3>
              <p className="text-[10px] font-mono text-[#9CA3AF]">
                SwipeRide Secured JWT Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#9CA3AF] hover:text-white hover:bg-[#1E2536] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* 1-Click Quick Demo Evaluation Bar */}
          <div className="mb-5 p-3 rounded-lg bg-[#07090C] border border-[#2D374D]">
            <p className="text-[11px] font-mono font-bold text-[#FFB800] uppercase mb-2 flex items-center gap-1.5">
              <span>⚡</span> Instant 1-Click Demo Evaluation:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="px-2 py-1.5 bg-[#1A202C] hover:bg-[#2D3748] border border-[#4A5568] text-white text-[11px] font-bold font-mono rounded flex items-center justify-center gap-1 transition-colors"
              >
                <HelmetIcon size={12} color="#00F0A0" />
                Rider
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('driver')}
                disabled={loading}
                className="px-2 py-1.5 bg-[#1A202C] hover:bg-[#2D3748] border border-[#4A5568] text-white text-[11px] font-bold font-mono rounded flex items-center justify-center gap-1 transition-colors"
              >
                <MotorcycleIcon size={12} color="#FF5500" />
                Pilot
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="px-2 py-1.5 bg-[#1A202C] hover:bg-[#2D3748] border border-[#4A5568] text-white text-[11px] font-bold font-mono rounded flex items-center justify-center gap-1 transition-colors"
              >
                <Shield size={12} className="text-[#0091FF]" />
                Admin
              </button>
            </div>
          </div>

          {/* Role & Mode Switcher */}
          <div className="flex bg-[#07090C] p-1 rounded-lg border border-[#1F2738] mb-5">
            <button
              type="button"
              onClick={() => setRoleTab('user')}
              className={`flex-1 py-1.5 rounded text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'user'
                  ? 'bg-[#FF5500] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <HelmetIcon size={14} />
              Rider Account
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('driver')}
              className={`flex-1 py-1.5 rounded text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'driver'
                  ? 'bg-[#FF5500] text-white shadow-sm'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              <MotorcycleIcon size={14} />
              Pilot Partner
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-[#FF334B]/10 border border-[#FF334B]/30 flex items-start gap-2.5 text-xs text-[#FF334B]">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9CA3AF] mb-1 font-bold">
                  Full Legal Name
                </label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3 top-3 text-[#6B7280]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-mech pl-9 text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#9CA3AF] mb-1 font-bold">
                {mode === 'login' ? 'Phone Number or Email' : 'Phone Number (+91 Mobile)'}
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-3 text-[#6B7280]" />
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210 or user@email.com"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-mech pl-9 text-xs font-mono"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9CA3AF] mb-1 font-bold">
                  Email Address {roleTab === 'user' && '(Optional)'}
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-[#6B7280]" />
                  <input
                    type="email"
                    required={roleTab === 'driver'}
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-mech pl-9 text-xs"
                  />
                </div>
              </div>
            )}

            {/* Extra Driver Fields on Registration */}
            {mode === 'register' && roleTab === 'driver' && (
              <div className="space-y-3 pt-2 border-t border-[#1F2738]">
                <p className="text-[10px] font-mono text-[#00F0A0] uppercase font-bold tracking-wider">
                  Motorcycle & License Credentials (RTO)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9CA3AF] mb-0.5">
                      Bike Model
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bajaj Pulsar 150"
                      value={motorcycleType}
                      onChange={(e) => setMotorcycleType(e.target.value)}
                      className="input-mech text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9CA3AF] mb-0.5">
                      Bike Color
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Matte Black"
                      value={motorcycleColor}
                      onChange={(e) => setMotorcycleColor(e.target.value)}
                      className="input-mech text-xs py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9CA3AF] mb-0.5">
                      Plate Number (RTO)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="KA-01-MJ-4820"
                      value={motorcycleNumber}
                      onChange={(e) => setMotorcycleNumber(e.target.value)}
                      className="input-mech text-xs py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9CA3AF] mb-0.5">
                      Driving License
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="DL-KA-01-20210048"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="input-mech text-xs py-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#9CA3AF] mb-1 font-bold">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-[#6B7280]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-mech pl-9 pr-9 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6B7280] hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-nitro w-full py-3 mt-2 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'login' ? (
                <>
                  <CheckCircle2 size={16} />
                  Authorize & Sign In
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Complete Registration
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-5 pt-4 border-t border-[#1F2738] text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError(null)
              }}
              className="text-xs text-[#9CA3AF] hover:text-[#FF5500] transition-colors"
            >
              {mode === 'login'
                ? "Don't have an account? Create one now"
                : 'Already registered? Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
