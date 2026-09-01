import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton'
import { VisitTracker } from './VisitTracker'
import { TrackingScripts } from './TrackingScripts'
import { CookieConsent, type TrackingConsent } from './CookieConsent'
import { RouteFocus } from './RouteFocus'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function Layout() {
  const [trackingConsent, setTrackingConsent] = useState<TrackingConsent>(() => {
    const value = localStorage.getItem('bbbsc_tracking_consent')
    return value === 'accepted' || value === 'rejected' ? value : null
  })
  const trackingEnabled = trackingConsent === 'accepted'

  // GTM ya carga en index.html con Consent Mode en "denied" por defecto (para
  // que las etiquetas del contenedor lo respeten desde la primera carga). Acá
  // solo se avisa el cambio cuando la persona elige — o ya eligió antes, en
  // cuyo caso esto corre una vez al montar y confirma su elección guardada.
  useEffect(() => {
    if (trackingConsent === null) return
    window.gtag?.('consent', 'update', {
      ad_storage: trackingEnabled ? 'granted' : 'denied',
      analytics_storage: trackingEnabled ? 'granted' : 'denied',
      ad_user_data: trackingEnabled ? 'granted' : 'denied',
      ad_personalization: trackingEnabled ? 'granted' : 'denied',
    })
  }, [trackingConsent, trackingEnabled])

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="site-glow -left-64 top-[3%]" />
        <div className="site-glow site-glow-delayed -right-60 top-[30%]" />
        <div className="site-glow site-glow-slow left-[5%] top-[62%]" />
        <div className="site-glow site-glow-late right-[8%] top-[86%]" />
      </div>
      <a href="#main-content" className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-brand px-4 py-2 font-bold text-white transition-transform focus:translate-y-0">
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
