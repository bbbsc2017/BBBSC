import { Router } from 'express'
import { getDb, nowIso } from '../db.js'
import { requirePermission } from '../auth.js'
import { ALL_PERMISSIONS, PERMISSIONS, normalizePermissions } from '../lib/permissions.js'

export const adminRolesRouter = Router()
const COLORS = ['purple', 'blue', 'orange', 'green', 'red', 'cyan', 'pink', 'gray']

function toRole(row, userCount = 0) {
  let parsed = {}
  try { parsed = JSON.parse(row.permissions || '{}') } catch { parsed = {} }
  return {
    id: row.id,
    name: row.name,
    label: row.label,
    description: row.description,
    color: row.color,
    isSystem: row.is_system === 1,
    permissions: normalizePermissions(parsed),
    userCount,
  }
}

adminRolesRouter.get('/roles', requirePermission(PERMISSIONS.ROLES_VIEW), (_req, res) => {
  const db = getDb()
  const rows = db.prepare(
    `SELECT r.*, COUNT(a.bbbsc_user_id) AS user_count
     FROM intranet_roles r LEFT JOIN intranet_user_access a ON a.role_id = r.id
     GROUP BY r.id ORDER BY r.is_system DESC, r.id`,
  ).all()
  return res.json({ ok: true, roles: rows.map((row) => toRole(row, Number(row.user_count))) })
})

adminRolesRouter.post('/roles', requirePermission(PERMISSIONS.ROLES_MANAGE), (req, res) => {
  const { label, description, color, copyFrom } = req.body || {}
  const normalizedName = String(req.body?.name || label || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  if (!normalizedName || !String(label || '').trim()) return res.status(400).json({ ok: false, error: 'El nombre del rol es obligatorio.' })
  if (normalizedName.length > 40 || String(label).trim().length > 60) return res.status(400).json({ ok: false, error: 'El nombre del rol es demasiado largo.' })

  const db = getDb()
  if (db.prepare('SELECT id FROM intranet_roles WHERE name = ?').get(normalizedName)) {
    return res.status(409).json({ ok: false, error: 'Ya existe un rol con ese nombre.' })
  }
  const source = copyFrom ? db.prepare('SELECT permissions FROM intranet_roles WHERE id = ?').get(Number(copyFrom)) : null
  const timestamp = nowIso()
  const permissions = source?.permissions || JSON.stringify(normalizePermissions())
  const result = db.prepare(
    `INSERT INTO intranet_roles (name, label, description, color, is_system, permissions, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, ?, ?, ?)`,
  ).run(normalizedName, String(label).trim(), String(description || '').trim().slice(0, 240), COLORS.includes(color) ? color : 'blue', permissions, timestamp, timestamp)
  const row = db.prepare('SELECT * FROM intranet_roles WHERE id = ?').get(result.lastInsertRowid)
  return res.status(201).json({ ok: true, role: toRole(row) })
})

adminRolesRouter.put('/roles/:id', requirePermission(PERMISSIONS.ROLES_MANAGE), (req, res) => {
  const db = getDb()
  const role = db.prepare('SELECT * FROM intranet_roles WHERE id = ?').get(req.params.id)
  if (!role) return res.status(404).json({ ok: false, error: 'Rol no encontrado.' })
  if (role.name === 'administrator') return res.status(400).json({ ok: false, error: 'El rol Administrador web conserva todos los permisos.' })

  const permissions = normalizePermissions(req.body?.permissions || {})
  const unknown = Object.keys(req.body?.permissions || {}).filter((key) => !ALL_PERMISSIONS.includes(key))
  if (unknown.length > 0) return res.status(400).json({ ok: false, error: 'Se recibió un permiso no válido.' })

  const label = String(req.body?.label || role.label).trim().slice(0, 60)
  const description = String(req.body?.description ?? role.description).trim().slice(0, 240)
  const color = COLORS.includes(req.body?.color) ? req.body.color : role.color
  db.prepare('UPDATE intranet_roles SET label = ?, description = ?, color = ?, permissions = ?, updated_at = ? WHERE id = ?').run(
    label, description, color, JSON.stringify(permissions), nowIso(), role.id,
  )
  return res.json({ ok: true, role: toRole(db.prepare('SELECT * FROM intranet_roles WHERE id = ?').get(role.id)) })
})

adminRolesRouter.delete('/roles/:id', requirePermission(PERMISSIONS.ROLES_MANAGE), (req, res) => {
  const db = getDb()
  const role = db.prepare('SELECT * FROM intranet_roles WHERE id = ?').get(req.params.id)
  if (!role) return res.status(404).json({ ok: false, error: 'Rol no encontrado.' })
  if (role.is_system === 1) return res.status(400).json({ ok: false, error: 'Los roles base no se pueden eliminar.' })
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM intranet_user_access WHERE role_id = ?').get(role.id)
  if (total > 0) return res.status(409).json({ ok: false, error: `El rol está asignado a ${total} usuario(s). Reasígnalos antes de eliminarlo.` })
  db.prepare('DELETE FROM intranet_roles WHERE id = ?').run(role.id)
  return res.json({ ok: true })
})
