import { Router } from 'express'
import { defaultLocalRoleName, requirePermission } from '../auth.js'
import { getDb, nowIso } from '../db.js'
import { BbbscApiError, getUsers } from '../lib/bbbscApi.js'
import { PERMISSIONS } from '../lib/permissions.js'

export const adminUsersRouter = Router()

function normalizeRoles(user) {
  if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles
  return [user.role || 'STUDENT']
}

function isCentralStaff(roles) {
  return roles.some((role) => role !== 'STUDENT')
}

adminUsersRouter.get('/users', requirePermission(PERMISSIONS.USERS_VIEW), async (req, res) => {
  try {
    const centralUsers = await getUsers(req.bbbscAccessToken)
    const users = Array.isArray(centralUsers) ? centralUsers : centralUsers?.users || []
    const accessRows = getDb().prepare(
      `SELECT a.bbbsc_user_id, a.enabled, r.id AS role_id, r.name AS role_name, r.label AS role_label, r.color AS role_color
       FROM intranet_user_access a LEFT JOIN intranet_roles r ON r.id = a.role_id`,
    ).all()
    const accessById = new Map(accessRows.map((row) => [row.bbbsc_user_id, row]))
    const applications = getDb().prepare(
      `SELECT a.id AS application_id,a.participant_id,a.applied_at,o.id,o.title,o.slug,o.program,o.sponsor,o.employer,o.city,o.state,o.compensation_type,o.compensation_min,o.compensation_max,o.compensation_currency,o.compensation_period
       FROM job_applications a JOIN job_offers o ON o.id=a.offer_id WHERE a.status='active'`,
    ).all()
    const applicationByUser = new Map(applications.map((row) => [row.participant_id, row]))

    const roleOptions = req.user.role === 'SUPER_ADMIN' || req.user.permissions?.[PERMISSIONS.USERS_ASSIGN_ROLES]
      ? getDb().prepare('SELECT id, name, label, color FROM intranet_roles ORDER BY is_system DESC, id').all()
      : []
    return res.json({
      ok: true,
      roles: roleOptions,
      users: users.map((user) => {
        const roles = normalizeRoles(user)
        const group = isCentralStaff(roles) ? 'staff' : 'participant'
        const centralActive = user.isActive !== false
        const localAccess = accessById.get(user.id)
        const locallyEnabled = group === 'staff' ? true : localAccess?.enabled === 1
        const centralRole = roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : roles.includes('ADMIN') ? 'ADMIN' : roles.includes('GURU') ? 'GURU' : roles.includes('STAFF') ? 'STAFF' : roles.includes('INSTRUCTOR') ? 'INSTRUCTOR' : 'STUDENT'
        const fallbackRoleName = defaultLocalRoleName(centralRole)
        const fallbackRole = roleOptions.find((role) => role.name === fallbackRoleName) || { name: fallbackRoleName, label: fallbackRoleName, color: 'gray' }
        const current = applicationByUser.get(user.id)
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          photoUrl: user.photoUrl || null,
          roles,
          group,
          centralActive,
          panelActive: centralActive && locallyEnabled,
          localRole: localAccess?.role_id ? { id: localAccess.role_id, name: localAccess.role_name, label: localAccess.role_label, color: localAccess.role_color } : fallbackRole,
          studentCode: user.studentCode || null,
          createdAt: user.createdAt || null,
          currentOffer: current ? {
            applicationId: current.application_id, id: current.id, title: current.title, slug: current.slug, program: current.program,
            sponsor: current.sponsor, employer: current.employer, city: current.city, state: current.state, appliedAt: current.applied_at,
            compensationLabel: `${current.compensation_type === 'stipend' ? 'Estipendio' : 'Salario'} ${current.compensation_currency} ${current.compensation_min}${current.compensation_max ? ` - ${current.compensation_max}` : ''} / ${current.compensation_period}`,
          } : null,
        }
      }),
    })
  } catch (error) {
    if (error instanceof BbbscApiError) {
      return res.status(error.status).json({ ok: false, error: error.message })
    }
    console.error('[bbbsc-server] Error consultando usuarios centrales:', error)
    return res.status(502).json({ ok: false, error: 'No pudimos consultar los usuarios de BBBSC.' })
  }
})

adminUsersRouter.patch('/users/:id/access', requirePermission(PERMISSIONS.USERS_MANAGE_ACCESS), (req, res) => {
  const { enabled } = req.body || {}
  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ ok: false, error: 'El estado de acceso no es válido.' })
  }

  const db = getDb()
  db.prepare(
    `INSERT INTO intranet_user_access (bbbsc_user_id, enabled, updated_by, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(bbbsc_user_id) DO UPDATE SET enabled = excluded.enabled, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).run(req.params.id, enabled ? 1 : 0, req.user.id, nowIso())

  return res.json({ ok: true, panelActive: enabled })
})

adminUsersRouter.patch('/users/:id/role', requirePermission(PERMISSIONS.USERS_ASSIGN_ROLES), (req, res) => {
  const db = getDb()
  const role = db.prepare('SELECT id, name, label, color FROM intranet_roles WHERE id = ?').get(Number(req.body?.roleId))
  if (!role) return res.status(400).json({ ok: false, error: 'Selecciona un rol válido.' })
  db.prepare(
    `INSERT INTO intranet_user_access (bbbsc_user_id, enabled, updated_by, updated_at, role_id)
     VALUES (?, 0, ?, ?, ?)
     ON CONFLICT(bbbsc_user_id) DO UPDATE SET role_id = excluded.role_id, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
  ).run(req.params.id, req.user.id, nowIso(), role.id)
  return res.json({ ok: true, localRole: role })
})
