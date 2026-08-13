import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function VisitTracker({ enabled }: { enabled: boolean }) {
  const location = useLocation()

  useEffect(() => {
    if (!enabled || location.pathname.startsWith('/intranet')) return

    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: location.pathname + location.search,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {})
  }, [enabled, location.key, location.pathname, location.search])

  return null
}
