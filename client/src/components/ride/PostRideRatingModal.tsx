import React, { useState } from 'react'
import { api } from '../../services/api'
import type { Ride } from '../../types'
import confetti from 'canvas-confetti'
import { Star, CheckCircle, X, AlertCircle, Sparkles, ThumbsUp } from 'lucide-react'

interface PostRideRatingModalProps {
  ride: Ride | null
  isOpen: boolean
  onClose: () => void
  onRatedSuccess: () => void
}

const COMPLIMENT_TAGS = [
  '⚡ Speedy Traffic Filtering',
  '🪖 Clean ISI Helmet Provided',
  '🛡️ Very Safe & Defensive Pilot',
  '🛵 Smooth Acceleration & Braking',
  '⏱️ Arrived Right on Time',
  '👍 Polite & Professional Pilot',
]

export const PostRideRatingModal: React.FC<PostRideRatingModalProps> = ({
  ride,
  isOpen,
  onClose,
  onRatedSuccess,
}) => {
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)

  if (!isOpen || !ride) return null

  const handleStarClick = (score: number) => {
    setRating(score)
    if (score === 5) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#00F0A0', '#FFB800'],
      })
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const fullComment = [
        ...selectedTags,
        comment.trim(),
      ].filter(Boolean).join(' | ') || 'Excellent ride experience!'

      await api.rateRide(ride._id, rating, fullComment)
      setSubmitted(true)
      setTimeout(() => {
        onRatedSuccess()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  const driver = typeof ride.driver === 'object' ? ride.driver : null
  const driverName = driver?.name || 'Your Pilot'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121620] border border-[#2D374D] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#0B0E14] px-6 py-4 border-b border-[#1F2738] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#FFB800]" />
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Rate Your Ride
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#1E2536]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#00F0A0]/10 border border-[#00F0A0] flex items-center justify-center mx-auto text-[#00F0A0]">
                <CheckCircle size={30} />
              </div>
              <h4 className="font-display text-xl font-bold text-white">Rating Submitted!</h4>
              <p className="text-xs text-[#9CA3AF]">Thank you for helping keep SwipeRide pilots top-tier.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Pilot Card */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#1A2234] border-2 border-[#FF5500] flex items-center justify-center mx-auto text-2xl font-bold font-display text-white shadow-[0_0_15px_rgba(255,85,0,0.3)]">
                  {driverName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">{driverName}</h4>
                  <p className="text-xs font-mono text-[#9CA3AF]">
                    Trip completed • ₹{ride.fare?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Star Selector */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-[#2D374D] hover:scale-125 transition-transform"
                  >
                    <Star
                      size={32}
                      className={`${
                        (hoverRating || rating) >= star
                          ? 'text-[#FFB800] fill-[#FFB800]'
                          : 'text-[#2D374D]'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Compliment Badges */}
              <div>
                <p className="text-[11px] font-mono uppercase text-[#9CA3AF] mb-2 font-bold">
                  Compliment Your Pilot
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMPLIMENT_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                          isSelected
                            ? 'bg-[#FF5500]/20 border-[#FF5500] text-white'
                            : 'bg-[#0B0E14] border-[#1F2738] text-[#9CA3AF] hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Comments Textarea */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#9CA3AF] mb-1 font-bold">
                  Additional Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="Share details about the trip and helmet condition..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-mech text-xs resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded bg-[#FF334B]/10 border border-[#FF334B]/30 text-xs text-[#FF334B] flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-nitro w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <ThumbsUp size={14} />
                {loading ? 'Submitting Rating...' : 'Submit Pilot Rating'}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  )
}
