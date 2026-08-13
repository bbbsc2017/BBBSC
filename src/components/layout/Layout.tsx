import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton'
import { VisitTracker } from './VisitTracker'
import { TrackingScripts } from './TrackingScripts'
import { CookieConsent, type TrackingConsent } from './CookieConsent'
import { RouteFocus } from './RouteFocus'

export function Layout() {
  const [trackingConsent, setTrackingConsent] = useState<TrackingConsent>(() => {
    const value = localStorage.getItem('bbbsc_tracking_consent')
    return value === 'accepted' || value === 'rejected' ? value : null
  })
  const trackingEnabled = trackingConsent === 'accepted'

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-brand px-4 py-2 font-bold text-ink transition-transform focus:translate-y-0">
        Saltar al contenido
      </a>
      <RouteFocus />
      <VisitTracker enabled={trackingEnabled} />
      <TrackingScripts enabled={trackingEnabled} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <CookieConsent consent={trackingConsent} onChange={setTrackingConsent} />
    </div>
  )
}
