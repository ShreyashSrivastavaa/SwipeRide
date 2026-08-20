import React, { useState, useEffect } from 'react'
import { MotorcycleIcon } from '../icons/CustomIcons'
import { api } from '../../services/api'
import type { Ride } from '../../types'
import {
  History,
  Calendar,
  Star,
  Receipt,
  RotateCcw,
} from 'lucide-react'

interface RideHistoryScreenProps {
  onBookRide: () => void
  onOpenRating: (ride: Ride) => void
}

export const RideHistoryScreen: React.FC<RideHistoryScreenProps> = ({
  onBookRide,
  onOpenRating,
}) => {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getRideHistory(1, 20)
      setRides(res.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load ride history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const filteredRides = rides.filter((r) => {
    if (statusFilter === 'all') return true
    return r.status === statusFilter
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-2.5">
            <History size={26} className="text-[#FF5500]" />
            Trip Records & History
          </h1>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1">
            Historical trip logs, UPI/Cash receipts, and pilot ratings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            className="btn-subtle py-2 px-3 text-xs"
            title="Refresh History"
          >
            <RotateCcw size={14} />
            Refresh
          </button>
          <button
            onClick={onBookRide}
            className="btn-nitro py-2 px-4 text-xs"
          >
            Book New Ride
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 text-xs font-mono">
        {['all', 'completed', 'inProgress', 'accepted', 'pending', 'canceled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-md border uppercase font-bold transition-all ${
              statusFilter === st
                ? 'bg-[#FF5500] text-white border-[#FF5500]'
                : 'bg-[#121620] border-[#1F2738] text-[#9CA3AF] hover:text-white'
            }`}
          >
            {st} {st === 'all' ? `(${rides.length})` : ''}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-[#9CA3AF]">Loading trip telemetry records...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-[#FF334B]/10 border border-[#FF334B]/30 text-center space-y-3">
          <p className="text-sm text-[#FF334B]">{error}</p>
          <button onClick={fetchHistory} className="btn-nitro py-2 px-4 text-xs mx-auto">
            Retry
          </button>
        </div>
      ) : filteredRides.length === 0 ? (
        <div className="py-20 text-center space-y-4 panel-mech bg-[#0E121A] p-8">
          <div className="w-16 h-16 rounded-full bg-[#121620] border border-[#1F2738] flex items-center justify-center mx-auto text-[#9CA3AF]">
            <MotorcycleIcon size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-white">No Trips Found</h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'You have not requested any rides yet. Book your first motorcycle ride!'
              : `No rides matching status "${statusFilter}".`}
          </p>
          <button onClick={onBookRide} className="btn-nitro py-2.5 px-5 text-xs mx-auto">
            Book First Ride
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRides.map((ride) => {
            const driver = typeof ride.driver === 'object' ? ride.driver : null
            const driverName = driver?.name || 'Assigned Pilot'
            const dateStr = new Date(ride.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={ride._id}
                className="panel-mech p-5 bg-[#0E121A] hover:border-[#2D374D] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Route & Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`badge-status badge-${ride.status}`}>
                      {ride.status}
                    </span>
                    <span className="text-xs font-mono text-[#9CA3AF] flex items-center gap-1">
                      <Calendar size={13} />
                      {dateStr}
                    </span>
                    <span className="text-xs font-mono text-[#9CA3AF] hidden sm:inline">
                      ID: #{ride._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-white">
                      <span className="w-2 h-2 rounded-full bg-[#00F0A0]"></span>
                      <span className="font-medium">Pickup: {ride.pickupLocation?.coordinates ? `${ride.pickupLocation.coordinates[1].toFixed(4)}°N, ${ride.pickupLocation.coordinates[0].toFixed(4)}°E` : 'Pickup Point'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                      <span className="w-2 h-2 rounded-full bg-[#FF5500]"></span>
                      <span>Drop-off: {ride.dropoffLocations?.[0]?.coordinates ? `${ride.dropoffLocations[0].coordinates[1].toFixed(4)}°N, ${ride.dropoffLocations[0].coordinates[0].toFixed(4)}°E` : 'Destination Point'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#9CA3AF] pt-1">
                    <span>Pilot: <strong className="text-white">{driverName}</strong></span>
                    {ride.distance && <span>Dist: <strong className="text-white">{ride.distance} km</strong></span>}
                  </div>
                </div>

                {/* Right Fare & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#1F2738]">
                  <div className="font-mono-tabular text-xl font-bold text-white">
                    ₹{ride.fare?.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {ride.status === 'completed' && !ride.rating && (
                      <button
                        onClick={() => onOpenRating(ride)}
                        className="py-1.5 px-3 rounded bg-[#FF5500]/10 border border-[#FF5500]/30 hover:bg-[#FF5500]/20 text-[11px] font-mono text-[#FF5500] font-bold flex items-center gap-1"
                      >
                        <Star size={12} />
                        Rate Trip
                      </button>
                    )}
                    {ride.rating && (
                      <span className="text-xs font-mono text-[#FFB800] flex items-center gap-1">
                        <Star size={12} className="fill-[#FFB800]" />
                        {ride.rating}★ Rated
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedRide(ride)}
                      className="py-1.5 px-2.5 rounded bg-[#181E2C] hover:bg-[#252D40] border border-[#1F2738] text-[11px] font-mono text-white"
                    >
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#121620] border border-[#2D374D] rounded-xl p-6 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#1F2738] pb-3">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <Receipt size={16} className="text-[#FF5500]" />
                Official Trip Receipt (INR)
              </span>
              <button
                onClick={() => setSelectedRide(null)}
                className="text-[#9CA3AF] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Receipt ID</span>
                <span className="text-white">#{selectedRide._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Status</span>
                <span className="text-[#00F0A0] uppercase font-bold">{selectedRide.status}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Total Fare</span>
                <span className="text-white font-bold">₹{selectedRide.fare?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Payment Mode</span>
                <span className="text-white uppercase">{selectedRide.paymentStatus} (UPI / Cash)</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRide(null)}
              className="btn-nitro w-full py-2 text-xs mt-4"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
