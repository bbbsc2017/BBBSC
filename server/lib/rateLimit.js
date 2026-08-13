// Rate limiting muy simple en memoria: máximo N solicitudes cada 10 minutos por clave (ip+ruta).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const requestLog = new Map()
let lastCleanup = 0

function cleanup(now) {
  if (now - lastCleanup < RATE_LIMIT_WINDOW_MS) return
  lastCleanup = now
  for (const [key, timestamps] of requestLog) {
    const active = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
    if (active.length > 0) requestLog.set(key, active)
    else requestLog.delete(key)
  }
}

export function isRateLimited(key, max) {
  const now = Date.now()
  cleanup(now)
  const timestamps = (requestLog.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(key, timestamps)
  return timestamps.length > max
}

export function getClientIp(req) {
  return req.ip || req.socket.remoteAddress || 'unknown'
}
