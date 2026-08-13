import { Router } from 'express'
import { getDb } from '../db.js'
import { requirePermission } from '../auth.js'
import { PERMISSIONS } from '../lib/permissions.js'

export const publicCommentsRouter = Router()
export const adminCommentsRouter = Router()

function toPublicComment(row) {
  return {
    id: row.id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    comment: row.body,
    date: row.created_at,
  }
}

function toAdminComment(row) {
  return {
    id: row.id,
    postSlug: row.post_slug,
    postTitle: row.post_title,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    comment: row.body,
    createdAt: row.created_at,
  }
}

publicCommentsRouter.get('/posts/:slug/comments', (req, res) => {
  const db = getDb()
  const rows = db
    .prepare('SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC')
    .all(req.params.slug)
  res.json({ ok: true, comments: rows.map(toPublicComment) })
})

adminCommentsRouter.use(requirePermission(PERMISSIONS.COMMENTS_VIEW))

adminCommentsRouter.get('/comments', (req, res) => {
  const db = getDb()
  const { postSlug } = req.query
  const rows = postSlug
    ? db.prepare('SELECT * FROM comments WHERE post_slug = ? ORDER BY created_at DESC').all(postSlug)
    : db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all()
  res.json({ ok: true, comments: rows.map(toAdminComment) })
})

adminCommentsRouter.delete('/comments/:id', requirePermission(PERMISSIONS.COMMENTS_MANAGE), (req, res) => {
  const db = getDb()
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ ok: false, error: 'not_found' })
  res.json({ ok: true })
})
