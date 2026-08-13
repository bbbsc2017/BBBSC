import { Router } from 'express'
import crypto from 'node:crypto'
import { getDb, nowIso } from '../db.js'
import { requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'
import { isRateLimited, getClientIp } from '../lib/rateLimit.js'

export const publicVisitsRouter = Router()
export const adminVisitsRouter = Router()

const VISITOR_COOKIE = 'bbbsc_vid'
const VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000
const VISITS_HASH_SECRET = process.env.VISITS_HASH_SECRET

function hashIp(ip) {
  return crypto.createHmac('sha256', VISITS_HASH_SECRET).update(ip).digest('hex')
}

function rangeToDays(range) {
  if (range === '90d') return 90
  if (range === '7d') return 7
  return 30
}

publicVisitsRouter.post('/visits', (req, res) => {
  let visitorId = req.cookies?.[VISITOR_COOKIE]
  if (!visitorId) {
    visitorId = crypto.randomBytes(16).toString('hex')
    res.cookie(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    })
  }

  res.status(204).end()

  const ip = getClientIp(req)
  if (isRateLimited(`visits:${ip}`, 60)) return

  const { path, referrer } = req.body || {}
  if (!path || typeof path !== 'string' || path.length > 500) return

  const db = getDb()
  db.prepare('INSERT INTO visits (path, referrer, session_id, ip_hash, created_at) VALUES (?, ?, ?, ?, ?)').run(
    path,
    typeof referrer === 'string' ? referrer.slice(0, 500) : null,
    visitorId,
    hashIp(ip),
    nowIso(),
  )
})

adminVisitsRouter.use(requirePermission(PERMISSIONS.ANALYTICS_VIEW))

adminVisitsRouter.get('/visits/summary', (req, res) => {
  const db = getDb()
  const days = rangeToDays(req.query.range)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const { totalVisits } = db.prepare('SELECT COUNT(*) AS totalVisits FROM visits WHERE created_at >= ?').get(since)
  const { uniqueVisitors } = db
    .prepare('SELECT COUNT(DISTINCT session_id) AS uniqueVisitors FROM visits WHERE created_at >= ?')
    .get(since)

  const byDay = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS date, COUNT(*) AS visits, COUNT(DISTINCT session_id) AS uniqueVisitors
       FROM visits WHERE created_at >= ? GROUP BY date ORDER BY date ASC`,
    )
    .all(since)

  const topPaths = db
    .prepare(
      `SELECT path, COUNT(*) AS visits FROM visits WHERE created_at >= ? GROUP BY path ORDER BY visits DESC LIMIT 10`,
    )
    .all(since)

  res.json({ ok: true, totalVisits, uniqueVisitors, byDay, topPaths })
})
