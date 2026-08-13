import crypto from 'node:crypto'
import { getDb, nowIso } from './db.js'
import { getMe, decodeTokenExpiry, refreshSession as refreshBbbscSession } from './lib/bbbscApi.js'
import { normalizePermissions } from './lib/permissions.js'

const SESSION_COOKIE = 'bbbsc_session'
const LOCAL_SESSION_TTL_MS = 15 * 24 * 60 * 60 * 1000
const REVALIDATE_INTERVAL_MS = 15 * 60 * 1000
const ACCESS_REFRESH_SKEW_MS = 60 * 1000
const STAFF_ROLES = ['ADMIN', 'SUPER_ADMIN', 'GURU', 'STAFF', 'INSTRUCTOR']
const refreshInFlight = new Map()

function refreshTokenKey() {
  return crypto.createHash('sha256').update(`${process.env.SESSION_SECRET}:central-refresh-v1`).digest()
}

function encryptRefreshToken(value) {
  if (!value) return null
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', refreshTokenKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), encrypted.toString('base64url')].join('.')
}

function decryptRefreshToken(value) {
  if (!value) return null
  const [version, iv, tag, encrypted] = value.split('.')
  if (version !== 'v1' || !iv || !tag || !encrypted) return null
  const decipher = crypto.createDecipheriv('aes-256-gcm', refreshTokenKey(), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8')
}

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}

export function defaultLocalRoleName(centralRole) {
  if (['SUPER_ADMIN', 'ADMIN', 'GURU'].includes(centralRole)) return 'administrator'
  if (centralRole === 'STAFF') return 'editor'
  if (centralRole === 'INSTRUCTOR') return 'author'
  return 'reader'
}

export function hasIntranetAccess(userId, role) {
  if (isStaffRole(role)) return true
  const access = getDb().prepare('SELECT enabled FROM intranet_user_access WHERE bbbsc_user_id = ?').get(userId)
  return access?.enabled === 1
}

function parsePermissions(value) {
  try { return normalizePermissions(JSON.parse(value || '{}')) }
  catch { return normalizePermissions() }
}

export function getIntranetIdentity(userId, centralRole) {
  const db = getDb()
  const access = db.prepare('SELECT enabled, role_id FROM intranet_user_access WHERE bbbsc_user_id = ?').get(userId)
  const defaultRoleName = defaultLocalRoleName(centralRole)
  const role = centralRole === 'SUPER_ADMIN'
    ? db.prepare('SELECT * FROM intranet_roles WHERE name = ?').get('administrator')
    : access?.role_id
      ? db.prepare('SELECT * FROM intranet_roles WHERE id = ?').get(access.role_id)
      : db.prepare('SELECT * FROM intranet_roles WHERE name = ?').get(defaultRoleName)

  return {
    enabled: isStaffRole(centralRole) || access?.enabled === 1,
    localRole: role ? { id: role.id, name: role.name, label: role.label, color: role.color } : null,
    permissions: parsePermissions(role?.permissions),
  }
}

export function createSession(bbbscUser, accessToken, refreshToken = null) {
  const db = getDb()
  const id = crypto.randomBytes(32).toString('hex')
  const now = nowIso()

  const localExpiry = Date.now() + LOCAL_SESSION_TTL_MS
  const tokenExpiry = decodeTokenExpiry(accessToken)?.getTime()
  const expiresAt = new Date(refreshToken || !tokenExpiry ? localExpiry : Math.min(localExpiry, tokenExpiry)).toISOString()

  const encryptedRefreshToken = encryptRefreshToken(refreshToken)
  db.prepare(
    `INSERT INTO sessions (id, bbbsc_user_id, email, first_name, last_name, role, access_token, central_refresh_token, last_synced_at, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(id, bbbscUser.id, bbbscUser.email, bbbscUser.firstName, bbbscUser.lastName, bbbscUser.role, accessToken, encryptedRefreshToken, now, now, expiresAt)

  return { id, expiresAt }
}

export function destroySession(sessionId) {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

export function getCentralRefreshToken(sessionId) {
  const record = getDb().prepare('SELECT central_refresh_token FROM sessions WHERE id = ?').get(sessionId)
  try { return decryptRefreshToken(record?.central_refresh_token) }
  catch { return null }
}

export function cleanupExpiredSessions() {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(nowIso())
}

export function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE, sessionId, {
    signed: true,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
    maxAge: LOCAL_SESSION_TTL_MS,
  })
}

function accessTokenNeedsRefresh(accessToken) {
  try {
    const expiresAt = decodeTokenExpiry(accessToken)?.getTime()
    return !expiresAt || expiresAt - Date.now() <= ACCESS_REFRESH_SKEW_MS
  } catch {
    return true
  }
}

async function refreshCentralAccess(session) {
  const existing = refreshInFlight.get(session.id)
  if (existing) return existing

  const operation = (async () => {
    const db = getDb()
    const current = db.prepare('SELECT * FROM sessions WHERE id = ?').get(session.id)
    let rawRefreshToken
    try { rawRefreshToken = decryptRefreshToken(current?.central_refresh_token) }
    catch { rawRefreshToken = null }
    if (!current || !rawRefreshToken) throw new Error('missing_central_refresh_token')

    const renewed = await refreshBbbscSession(rawRefreshToken)
    const roles = Array.isArray(renewed.user?.roles) && renewed.user.roles.length > 0
      ? renewed.user.roles
      : [renewed.user?.role || current.role]
    const role = roles.find(isStaffRole) || roles[0]
    const syncedAt = nowIso()
    const encryptedRefreshToken = encryptRefreshToken(renewed.refreshToken)
    db.prepare(
      `UPDATE sessions
          SET access_token = ?, central_refresh_token = ?, role = ?, first_name = ?, last_name = ?, last_synced_at = ?
        WHERE id = ?`,
    ).run(
      renewed.accessToken,
      encryptedRefreshToken,
      role,
      renewed.user?.firstName ?? current.first_name,
      renewed.user?.lastName ?? current.last_name,
      syncedAt,
      current.id,
    )
    return {
      ...current,
      access_token: renewed.accessToken,
      central_refresh_token: encryptedRefreshToken,
      role,
      first_name: renewed.user?.firstName ?? current.first_name,
      last_name: renewed.user?.lastName ?? current.last_name,
      last_synced_at: syncedAt,
    }
  })()

  refreshInFlight.set(session.id, operation)
  try { return await operation }
  finally { refreshInFlight.delete(session.id) }
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, { path: '/api' })
}

export function getSessionIdFromRequest(req) {
  return req.signedCookies?.[SESSION_COOKIE]
}

function toUser(session) {
  const identity = getIntranetIdentity(session.bbbsc_user_id, session.role)
  return {
    id: session.bbbsc_user_id,
    email: session.email,
    firstName: session.first_name,
    lastName: session.last_name,
    role: session.role,
    localRole: identity.localRole,
    permissions: identity.permissions,
  }
}

// Carga la sesión local, revalidando contra BBBSC central (GET /auth/me) si el
// snapshot cacheado tiene más de REVALIDATE_INTERVAL_MS, para reflejar cambios de
// rol o desactivación sin tener que llamar a la API externa en cada request.
async function loadSession(req, res) {
  const sessionId = getSessionIdFromRequest(req)
  if (!sessionId) {
    res.status(401).json({ ok: false, error: 'No autenticado.' })
    return null
  }

  const db = getDb()
  let session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId)
  if (!session || session.expires_at < nowIso()) {
    clearSessionCookie(res)
    res.status(401).json({ ok: false, error: 'Sesión expirada.' })
    return null
  }

  if (session.central_refresh_token && accessTokenNeedsRefresh(session.access_token)) {
    try {
      session = await refreshCentralAccess(session)
    } catch {
      destroySession(sessionId)
      clearSessionCookie(res)
      res.status(401).json({ ok: false, error: 'Sesión expirada.' })
      return null
    }
  }

  const staleMs = Date.now() - new Date(session.last_synced_at).getTime()
  if (staleMs > REVALIDATE_INTERVAL_MS) {
    try {
      const fresh = await getMe(session.access_token)
      if (!fresh.isActive) throw new Error('user_inactive')

      const syncedAt = nowIso()
      const freshRoles = Array.isArray(fresh.roles) && fresh.roles.length > 0 ? fresh.roles : [fresh.role || session.role]
      const freshRole = freshRoles.find(isStaffRole) || freshRoles[0]
      db.prepare('UPDATE sessions SET role = ?, first_name = ?, last_name = ?, last_synced_at = ? WHERE id = ?').run(
        freshRole,
        fresh.firstName,
        fresh.lastName,
        syncedAt,
        sessionId,
      )
      session = { ...session, role: freshRole, first_name: fresh.firstName, last_name: fresh.lastName, last_synced_at: syncedAt }
    } catch {
      destroySession(sessionId)
      clearSessionCookie(res)
      res.status(401).json({ ok: false, error: 'Sesión expirada.' })
      return null
    }
  }

  return session
}

export async function requireAuth(req, res, next) {
  const session = await loadSession(req, res)
  if (!session) return
  if (!hasIntranetAccess(session.bbbsc_user_id, session.role)) {
    return res.status(403).json({ ok: false, error: 'Tu acceso a esta intranet todavía no ha sido habilitado.' })
  }
  req.user = toUser(session)
  req.bbbscAccessToken = session.access_token
  next()
}

export async function requireStaff(req, res, next) {
  const session = await loadSession(req, res)
  if (!session) return
  if (!isStaffRole(session.role)) {
    return res.status(403).json({ ok: false, error: 'No tienes permisos de administrador.' })
  }
  req.user = toUser(session)
  req.bbbscAccessToken = session.access_token
  next()
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    if (!req.user) {
      const session = await loadSession(req, res)
      if (!session) return
      const identity = getIntranetIdentity(session.bbbsc_user_id, session.role)
      if (!identity.enabled) {
        return res.status(403).json({ ok: false, error: 'Tu acceso a esta intranet todavía no ha sido habilitado.' })
      }
      req.user = toUser(session)
      req.bbbscAccessToken = session.access_token
    }
    if (req.user.role === 'SUPER_ADMIN' || req.user.permissions?.[permission] === true) return next()
    return res.status(403).json({ ok: false, error: 'Tu rol no tiene permiso para realizar esta acción.' })
  }
}
