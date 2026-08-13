import { Router } from 'express'
import sanitizeHtml from 'sanitize-html'
import { getDb, nowIso } from '../db.js'
import { requirePermission } from '../auth.js'
import { slugify, uniqueSlug } from '../lib/slugify.js'
import { PERMISSIONS } from '../lib/permissions.js'

export const publicPostsRouter = Router()
export const adminPostsRouter = Router()

const CATEGORIES = ['Embajada', 'Programas', 'Consejos']

const SANITIZE_OPTIONS = {
  allowedTags: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote', 'img'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer nofollow' }),
  },
}

function sanitizeContent(html) {
  return sanitizeHtml(html || '', SANITIZE_OPTIONS)
}

function toPublicPost(row) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at ? row.published_at.slice(0, 10) : row.created_at.slice(0, 10),
    readTime: row.read_time,
    image: { src: row.image_src, alt: row.image_alt },
    author: { name: row.author_name, role: row.author_role },
  }
}

function toAdminSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    status: row.withdrawn_at ? 'withdrawn' : row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    imageSrc: row.image_src,
    authorName: row.author_name,
  }
}

function toAdminFull(row) {
  return {
    ...toAdminSummary(row),
    contentHtml: row.content_html,
    imageAlt: row.image_alt,
    authorRole: row.author_role,
    readTime: row.read_time,
    createdAt: row.created_at,
  }
}

// ---- Público ----

publicPostsRouter.get('/posts', (_req, res) => {
  const db = getDb()
  const rows = db.prepare("SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC").all()
  res.json({ ok: true, posts: rows.map(toPublicPost) })
})

publicPostsRouter.get('/posts/:slug', (req, res) => {
  const db = getDb()
  const row = db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").get(req.params.slug)
  if (!row) return res.status(404).json({ ok: false, error: 'not_found' })
  res.json({ ok: true, post: { ...toPublicPost(row), contentHtml: row.content_html } })
})

// ---- Admin ----

adminPostsRouter.use(requirePermission(PERMISSIONS.POSTS_VIEW_ALL))

adminPostsRouter.get('/posts', (req, res) => {
  const db = getDb()
  const { status, search } = req.query

  let sql = 'SELECT * FROM posts WHERE 1=1'
  const params = []

  if (status === 'withdrawn') {
    sql += ' AND withdrawn_at IS NOT NULL'
  } else if (status === 'draft' || status === 'published') {
    sql += ' AND status = ? AND withdrawn_at IS NULL'
    params.push(status)
  }
  if (search?.trim()) {
    sql += ' AND title LIKE ?'
    params.push(`%${search.trim()}%`)
  }
  sql += ' ORDER BY updated_at DESC'

  const rows = db.prepare(sql).all(...params)
  res.json({ ok: true, posts: rows.map(toAdminSummary) })
})

adminPostsRouter.get('/posts/:id', (req, res) => {
  const db = getDb()
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ ok: false, error: 'not_found' })
  res.json({ ok: true, post: toAdminFull(row) })
})

function validatePostBody(body) {
  const { title, excerpt, category, contentHtml, imageSrc, authorName, authorRole } = body || {}
  if (!title?.trim()) return 'El título es obligatorio.'
  if (!excerpt?.trim()) return 'El resumen es obligatorio.'
  if (!CATEGORIES.includes(category)) return 'La categoría no es válida.'
  if (!contentHtml?.trim()) return 'El contenido es obligatorio.'
  if (!imageSrc?.trim()) return 'La imagen es obligatoria.'
  if (!authorName?.trim()) return 'El autor es obligatorio.'
  if (!authorRole?.trim()) return 'El rol del autor es obligatorio.'
  return null
}

adminPostsRouter.post('/posts', requirePermission(PERMISSIONS.POSTS_CREATE), (req, res) => {
  if (req.body?.status === 'published' && req.user.role !== 'SUPER_ADMIN' && !req.user.permissions?.[PERMISSIONS.POSTS_PUBLISH]) {
    return res.status(403).json({ ok: false, error: 'Tu rol puede crear borradores, pero no publicarlos.' })
  }
  const error = validatePostBody(req.body)
  if (error) return res.status(400).json({ ok: false, error })

  const db = getDb()
  const { title, excerpt, category, contentHtml, imageSrc, imageAlt, authorName, authorRole, readTime, status, slug } =
    req.body

  const baseSlug = slugify(slug || title)
  const finalSlug = uniqueSlug(baseSlug, (candidate) => !!db.prepare('SELECT id FROM posts WHERE slug = ?').get(candidate))

  const timestamp = nowIso()
  const finalStatus = status === 'published' ? 'published' : 'draft'
  const publishedAt = finalStatus === 'published' ? timestamp : null

  const result = db
    .prepare(
      `INSERT INTO posts
        (slug, title, excerpt, category, content_html, image_src, image_alt, author_name, author_role, read_time, status, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      finalSlug,
      title.trim(),
      excerpt.trim(),
      category,
      sanitizeContent(contentHtml),
      imageSrc.trim(),
      imageAlt?.trim() || '',
      authorName.trim(),
      authorRole.trim(),
      readTime?.trim() || '',
      finalStatus,
      publishedAt,
      timestamp,
      timestamp,
    )

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json({ ok: true, post: toAdminFull(row) })
})

adminPostsRouter.put('/posts/:id', requirePermission(PERMISSIONS.POSTS_EDIT), (req, res) => {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ ok: false, error: 'not_found' })
  const existingStatus = existing.withdrawn_at ? 'withdrawn' : existing.status
  if (req.body?.status !== existingStatus && req.user.role !== 'SUPER_ADMIN' && !req.user.permissions?.[PERMISSIONS.POSTS_PUBLISH]) {
    return res.status(403).json({ ok: false, error: 'Tu rol no puede cambiar el estado de publicación.' })
  }

  const error = validatePostBody(req.body)
  if (error) return res.status(400).json({ ok: false, error })

  const { title, excerpt, category, contentHtml, imageSrc, imageAlt, authorName, authorRole, readTime, status, slug } =
    req.body

  let finalSlug = existing.slug
  const requestedSlug = slugify(slug || title)
  if (requestedSlug !== existing.slug) {
    finalSlug = uniqueSlug(
      requestedSlug,
      (candidate) => candidate !== existing.slug && !!db.prepare('SELECT id FROM posts WHERE slug = ?').get(candidate),
    )
  }

  const finalStatus = status === 'published' ? 'published' : 'draft'
  const publishedAt = existing.published_at || (finalStatus === 'published' ? nowIso() : null)
  const withdrawnAt = status === 'withdrawn' ? (existing.withdrawn_at || nowIso()) : null

  db.prepare(
    `UPDATE posts SET
      slug = ?, title = ?, excerpt = ?, category = ?, content_html = ?, image_src = ?, image_alt = ?,
      author_name = ?, author_role = ?, read_time = ?, status = ?, published_at = ?, withdrawn_at = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    finalSlug,
    title.trim(),
    excerpt.trim(),
    category,
    sanitizeContent(contentHtml),
    imageSrc.trim(),
    imageAlt?.trim() || '',
    authorName.trim(),
    authorRole.trim(),
    readTime?.trim() || '',
    finalStatus,
    publishedAt,
    withdrawnAt,
    nowIso(),
    req.params.id,
  )

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  res.json({ ok: true, post: toAdminFull(row) })
})

adminPostsRouter.patch('/posts/:id/status', requirePermission(PERMISSIONS.POSTS_PUBLISH), (req, res) => {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ ok: false, error: 'not_found' })

  const { status } = req.body || {}
  if (!['draft', 'published', 'withdrawn'].includes(status)) {
    return res.status(400).json({ ok: false, error: 'Estado inválido.' })
  }

  const databaseStatus = status === 'withdrawn' ? 'draft' : status
  const publishedAt = existing.published_at || (status === 'published' ? nowIso() : null)
  const withdrawnAt = status === 'withdrawn' ? nowIso() : null
  db.prepare('UPDATE posts SET status = ?, published_at = ?, withdrawn_at = ?, updated_at = ? WHERE id = ?').run(
    databaseStatus,
    publishedAt,
    withdrawnAt,
    nowIso(),
    req.params.id,
  )

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  res.json({ ok: true, post: toAdminSummary(row) })
})

adminPostsRouter.patch('/posts/:id/quick', requirePermission(PERMISSIONS.POSTS_EDIT), (req, res) => {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ ok: false, error: 'not_found' })

  const { category, authorName, publishedAt } = req.body || {}
  if (!CATEGORIES.includes(category)) return res.status(400).json({ ok: false, error: 'La categoria no es valida.' })
  if (!authorName?.trim()) return res.status(400).json({ ok: false, error: 'El autor es obligatorio.' })

  let normalizedPublishedAt = null
  if (publishedAt) {
    const date = new Date(publishedAt)
    if (Number.isNaN(date.getTime())) return res.status(400).json({ ok: false, error: 'La fecha no es valida.' })
    normalizedPublishedAt = date.toISOString()
  }

  db.prepare('UPDATE posts SET category = ?, author_name = ?, published_at = ?, updated_at = ? WHERE id = ?').run(
    category,
    authorName.trim(),
    normalizedPublishedAt,
    nowIso(),
    req.params.id,
  )

  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  return res.json({ ok: true, post: toAdminSummary(row) })
})

adminPostsRouter.post('/posts/bulk', (req, res) => {
  const ids = Array.isArray(req.body?.ids)
    ? [...new Set(req.body.ids.map(Number).filter((id) => Number.isInteger(id) && id > 0))]
    : []
  const { action } = req.body || {}
  const allowedActions = ['draft', 'publish', 'withdraw', 'delete', 'duplicate']

  if (ids.length === 0 || ids.length > 100) {
    return res.status(400).json({ ok: false, error: 'Selecciona entre 1 y 100 entradas.' })
  }
  if (!allowedActions.includes(action)) {
    return res.status(400).json({ ok: false, error: 'Accion masiva no valida.' })
  }
  const actionPermission = action === 'delete' ? PERMISSIONS.POSTS_DELETE : ['publish', 'withdraw'].includes(action) ? PERMISSIONS.POSTS_PUBLISH : action === 'duplicate' ? PERMISSIONS.POSTS_CREATE : PERMISSIONS.POSTS_EDIT
  if (req.user.role !== 'SUPER_ADMIN' && !req.user.permissions?.[actionPermission]) {
    return res.status(403).json({ ok: false, error: 'Tu rol no permite ejecutar esta acción masiva.' })
  }

  const db = getDb()
  const timestamp = nowIso()
  const placeholders = ids.map(() => '?').join(',')

  db.exec('BEGIN IMMEDIATE')
  try {
    if (action === 'delete') {
      db.prepare(`DELETE FROM posts WHERE id IN (${placeholders})`).run(...ids)
    } else if (action === 'draft') {
      db.prepare(`UPDATE posts SET status = 'draft', withdrawn_at = NULL, updated_at = ? WHERE id IN (${placeholders})`).run(timestamp, ...ids)
    } else if (action === 'publish') {
      db.prepare(`UPDATE posts SET status = 'published', published_at = COALESCE(published_at, ?), withdrawn_at = NULL, updated_at = ? WHERE id IN (${placeholders})`).run(timestamp, timestamp, ...ids)
    } else if (action === 'withdraw') {
      db.prepare(`UPDATE posts SET status = 'draft', withdrawn_at = ?, updated_at = ? WHERE id IN (${placeholders})`).run(timestamp, timestamp, ...ids)
    } else {
      const rows = db.prepare(`SELECT * FROM posts WHERE id IN (${placeholders}) ORDER BY id`).all(...ids)
      const insert = db.prepare(
        `INSERT INTO posts
          (slug, title, excerpt, category, content_html, image_src, image_alt, author_name, author_role, read_time, status, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', NULL, ?, ?)`,
      )
      for (const row of rows) {
        const copyTitle = `${row.title} (copia)`
        const copySlug = uniqueSlug(slugify(`${row.slug}-copia`), (candidate) => !!db.prepare('SELECT id FROM posts WHERE slug = ?').get(candidate))
        insert.run(copySlug, copyTitle, row.excerpt, row.category, row.content_html, row.image_src, row.image_alt, row.author_name, row.author_role, row.read_time, timestamp, timestamp)
      }
    }
    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    console.error('[bbbsc-server] Error en accion masiva de entradas:', error)
    return res.status(500).json({ ok: false, error: 'No pudimos completar la accion masiva.' })
  }

  return res.json({ ok: true, affected: ids.length })
})

adminPostsRouter.delete('/posts/:id', requirePermission(PERMISSIONS.POSTS_DELETE), (req, res) => {
  const db = getDb()
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ ok: false, error: 'not_found' })
  res.json({ ok: true })
})
