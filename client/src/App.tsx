import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { RideProvider, useRide } from './context/RideContext'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { Preloader } from './components/common/Preloader'
import { HeroSection } from './components/landing/HeroSection'
import { FareCalculatorWidget } from './components/landing/FareCalculatorWidget'
import { FleetRadarWidget } from './components/landing/FleetRadarWidget'
import { FleetTiersSection } from './components/landing/FleetTiersSection'
import { SafetySection } from './components/landing/SafetySection'
import { RideBookingScreen } from './components/ride/RideBookingScreen'
import { LiveRideTrackingScreen } from './components/ride/LiveRideTrackingScreen'
import { PostRideRatingModal } from './components/ride/PostRideRatingModal'
import { RideHistoryScreen } from './components/ride/RideHistoryScreen'
import { AuthModal } from './components/auth/AuthModal'
import { DriverSimulatorDock } from './components/simulator/DriverSimulatorDock'

function MainApp() {
  const { activeRide, ratingModalOpen, recentCompletedRide, closeRatingModal, clearActiveRide } = useRide()

  const [isLoadingApp, setIsLoadingApp] = useState(true)
  const [currentView, setCurrentView] = useState<'landing' | 'booking' | 'tracking' | 'history'>('landing')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  // Preloaded route selections from landing calculator
  const [prefilledPickup, setPrefilledPickup] = useState('Yaba Tech, Lagos')
  const [prefilledDropoff, setPrefilledDropoff] = useState('Adetokunbo Ademola, Victoria Island')

  const handleStartBooking = (pickup?: string, dropoff?: string) => {
    if (pickup) setPrefilledPickup(pickup)
    if (dropoff) setPrefilledDropoff(dropoff)
    setCurrentView('booking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenCalculator = () => {
    const el = document.getElementById('calculator')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      setCurrentView('landing')
      setTimeout(() => {
        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleRideRequested = () => {
    setCurrentView('tracking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookAnother = () => {
    clearActiveRide()
    setCurrentView('booking')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07090C] text-[#F3F4F6]">
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={() => setIsAuthModalOpen(true)}
        toggleSimulator={() => setIsSimulatorOpen(!isSimulatorOpen)}
        isSimulatorOpen={isSimulatorOpen}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <HeroSection
              onStartBooking={() => handleStartBooking()}
              onOpenCalculator={handleOpenCalculator}
            />
            <FareCalculatorWidget
              onSelectRoute={(pickup, dropoff) => handleStartBooking(pickup, dropoff)}
            />
            <FleetRadarWidget />
            <FleetTiersSection
              onSelectTier={() => handleStartBooking()}
            />
            <SafetySection />
          </>
        )}

        {currentView === 'booking' && (
          <RideBookingScreen
            initialPickup={prefilledPickup}
            initialDropoff={prefilledDropoff}
            onRideRequested={handleRideRequested}
            onRequireAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'tracking' && (
          <LiveRideTrackingScreen
            onCancelRide={() => {
              clearActiveRide()
              setCurrentView('booking')
            }}
            onBookAnother={handleBookAnother}
          />
        )}

        {currentView === 'history' && (
          <RideHistoryScreen
            onBookRide={handleBookAnother}
            onOpenRating={() => {}}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Dock Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false)
        }}
      />

      <PostRideRatingModal
        ride={recentCompletedRide || activeRide}
        isOpen={ratingModalOpen}
        onClose={closeRatingModal}
        onRatedSuccess={() => {
          closeRatingModal()
          setCurrentView('history')
        }}
      />

      <DriverSimulatorDock
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Futuristic Kinetic Preloader */}
      {isLoadingApp && (
        <Preloader onComplete={() => setIsLoadingApp(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RideProvider>
        <MainApp />
      </RideProvider>
    </AuthProvider>
  )
}
