import { useState } from 'react'
import { Link } from 'react-router-dom'

export type TrackingConsent = 'accepted' | 'rejected' | null

const STORAGE_KEY = 'bbbsc_tracking_consent'

export function CookieConsent({ consent, onChange }: { consent: TrackingConsent; onChange: (value: Exclude<TrackingConsent, null>) => void }) {
  const [visible, setVisible] = useState(consent === null)

  if (!visible) return null

  function choose(value: Exclude<TrackingConsent, null>) {
    localStorage.setItem(STORAGE_KEY, value)
    onChange(value)
    setVisible(false)
  }

  return (
    <section
      aria-label="Preferencias de privacidad"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-ink-800 p-5 shadow-2xl"
    >
      <p className="text-sm leading-relaxed text-white/80">
        Usamos analítica opcional para mejorar el sitio. Puedes rechazarla y la página seguirá funcionando. Consulta nuestros{' '}
        <Link to="/terminos-y-condiciones" className="font-semibold text-brand underline underline-offset-2">términos y tratamiento de datos</Link>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose('accepted')} className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-ink">
          Aceptar analítica
        </button>
        <button type="button" onClick={() => choose('rejected')} className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white">
          Rechazar
        </button>
      </div>
    </section>
  )
}
