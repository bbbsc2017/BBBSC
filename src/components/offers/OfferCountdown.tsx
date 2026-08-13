import { useSyncExternalStore } from 'react'

let currentNow = Date.now()
let timer: ReturnType<typeof setInterval> | undefined
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!timer) {
    timer = setInterval(() => {
      currentNow = Date.now()
      listeners.forEach((notify) => notify())
    }, 1_000)
  }
  return () => {
    listeners.delete(listener)
    if (!listeners.size && timer) { clearInterval(timer); timer = undefined }
  }
}

function snapshot() { return currentNow }
function serverSnapshot() { return 0 }

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1_000))
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

export function OfferCountdown({ availableUntil, available }: { availableUntil: string; available: boolean }) {
  const now = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const remaining = new Date(availableUntil).getTime() - now
  if (!available || remaining <= 0) return <span className="font-bold text-red-300">Postulación finalizada</span>
  return <span className="font-black tabular-nums text-emerald-300">Cierra en {formatRemaining(remaining)}</span>
}
