import { Router } from 'express'
import { getDb, nowIso } from '../db.js'
import { requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'

export const publicSettingsRouter = Router()
export const adminSettingsRouter = Router()

const SETTINGS_KEYS = {
  metaPixelId: 'meta_pixel_id',
  googleGtagId: 'google_gtag_id',
  clientifySiteId: 'clientify_site_id',
}

const SETTINGS_PATTERNS = {
  metaPixelId: /^\d{5,30}$/,
  googleGtagId: /^(G|GT|AW)-[A-Z0-9-]{4,30}$/i,
  clientifySiteId: /^[A-Za-z0-9_-]{4,80}$/,
}

function readSettings(db) {
  const rows = db.prepare('SELECT key, value, updated_at FROM settings').all()
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row]))

  const result = {}
  let updatedAt = null
  for (const [publicKey, dbKey] of Object.entries(SETTINGS_KEYS)) {
    result[publicKey] = byKey[dbKey]?.value || null
    if (byKey[dbKey]?.updated_at && (!updatedAt || byKey[dbKey].updated_at > updatedAt)) {
      updatedAt = byKey[dbKey].updated_at
    }
  }
  return { ...result, updatedAt }
}

publicSettingsRouter.get('/settings/public', (_req, res) => {
  const { updatedAt: _updatedAt, ...settings } = readSettings(getDb())
  res.json({ ok: true, ...settings })
})

adminSettingsRouter.use(requirePermission(PERMISSIONS.TRACKING_MANAGE))

adminSettingsRouter.get('/settings', (req, res) => {
  res.json({ ok: true, settings: readSettings(getDb()) })
})

adminSettingsRouter.put('/settings', (req, res) => {
  const db = getDb()
  const timestamp = nowIso()
  const upsert = db.prepare(
    'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
  )

  for (const [publicKey, dbKey] of Object.entries(SETTINGS_KEYS)) {
    if (publicKey in req.body) {
      const value = String(req.body[publicKey] || '').trim()
      if (value && !SETTINGS_PATTERNS[publicKey].test(value)) {
        return res.status(400).json({ ok: false, error: `El valor de ${publicKey} no tiene un formato válido.` })
      }
      upsert.run(dbKey, value, timestamp)
    }
  }

  res.json({ ok: true, settings: readSettings(db) })
})
