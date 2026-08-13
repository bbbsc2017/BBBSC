import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { getDb, nowIso } from './db.js'
import { seedDatabase } from './seed.js'
import { cleanupExpiredSessions } from './auth.js'
import { authRouter } from './routes/auth.js'
import { participantRouter } from './routes/participant.js'
import { publicPostsRouter, adminPostsRouter } from './routes/posts.js'
import { publicCommentsRouter, adminCommentsRouter } from './routes/comments.js'
import { adminUploadsRouter, UPLOADS_DIR } from './routes/uploads.js'
import { publicVisitsRouter, adminVisitsRouter } from './routes/visits.js'
import { publicSettingsRouter, adminSettingsRouter } from './routes/settings.js'
import { adminUsersRouter } from './routes/users.js'
import { adminRolesRouter } from './routes/roles.js'
import { publicOffersRouter, adminOffersRouter } from './routes/offers.js'
import { isRateLimited, getClientIp } from './lib/rateLimit.js'
import { createClientifyContact } from './lib/clientify.js'
import { publicFormsRouter, adminFormsRouter, buildClientifyPayload } from './routes/forms.js'
import { getFormDefinition } from './lib/formDefinitions.js'
import { requireRecaptcha } from './lib/recaptcha.js'
import { sitemapRouter } from './routes/sitemap.js'

const PORT = process.env.PORT || 4000
const CLIENTIFY_API_KEY = process.env.CLIENTIFY_API_KEY
const SESSION_SECRET = process.env.SESSION_SECRET
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean)
const PROXY_STRIPS_API_PREFIX = process.env.PROXY_STRIPS_API_PREFIX === 'true'

if (!CLIENTIFY_API_KEY) {
  console.error('[bbbsc-server] Falta CLIENTIFY_API_KEY en el archivo .env. El servidor no puede iniciar sin ella.')
  process.exit(1)
}

if (!SESSION_SECRET) {
  console.error('[bbbsc-server] Falta SESSION_SECRET en el archivo .env. El servidor no puede iniciar sin ella.')
  process.exit(1)
}

if (!process.env.VISITS_HASH_SECRET) {
  console.error('[bbbsc-server] Falta VISITS_HASH_SECRET en el archivo .env. El servidor no puede iniciar sin ella.')
  process.exit(1)
}

if (!process.env.BBBSC_API_URL) {
  console.error('[bbbsc-server] Falta BBBSC_API_URL en el archivo .env. El servidor no puede iniciar sin ella.')
  process.exit(1)
}

seedDatabase()
cleanupExpiredSessions()
setInterval(cleanupExpiredSessions, 60 * 60 * 1000)

const app = express()
app.set('trust proxy', 1)

// Algunos proxies de OpenLiteSpeed eliminan el prefijo del contexto (`/api/`)
// antes de reenviar la solicitud. Staging puede restaurarlo de forma explícita
// sin cambiar el comportamiento local ni el de producción.
if (PROXY_STRIPS_API_PREFIX) {
  app.use((req, _res, next) => {
    const requestPath = req.url.split('?', 1)[0]
    if (requestPath === '/' || (!requestPath.startsWith('/api/') && requestPath !== '/api')) {
      req.url = `/api${req.url}`
    }
    next()
  })
}

app.use(cookieParser(SESSION_SECRET))
app.use(
  cors({
    origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : false,
    credentials: true,
  }),
)

// Límite chico (20kb) para los endpoints públicos de escritura; el editor de blog
// de la intranet necesita uno más grande (2mb) por el HTML del contenido enriquecido.
const jsonSmall = express.json({ limit: '20kb' })
const jsonLarge = express.json({ limit: '2mb' })

app.use('/api/auth', jsonSmall, authRouter)
app.use('/api', participantRouter)
app.use('/api', publicPostsRouter)
app.use('/api/admin', jsonLarge, adminPostsRouter)
app.use('/api', publicCommentsRouter)
app.use('/api/admin', jsonSmall, adminCommentsRouter)
app.use('/api/admin', adminUploadsRouter)
app.use('/api/uploads', express.static(UPLOADS_DIR, { maxAge: '30d', index: false, dotfiles: 'deny' }))
app.use('/api', jsonSmall, publicVisitsRouter)
app.use('/api/admin', adminVisitsRouter)
app.use('/api', publicSettingsRouter)
app.use('/api', sitemapRouter)
app.use('/api', jsonSmall, publicFormsRouter)
app.use('/api', jsonSmall, publicOffersRouter)
app.use('/api/admin', jsonSmall, adminSettingsRouter)
app.use('/api/admin', jsonSmall, adminFormsRouter)
app.use('/api/admin', jsonSmall, adminUsersRouter)
app.use('/api/admin', jsonSmall, adminRolesRouter)
app.use('/api/admin', jsonLarge, adminOffersRouter)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_PUBLIC_FIELD_LENGTH = 500

function hasInvalidPublicField(body) {
  return Object.entries(body || {}).some(([key, value]) => key !== 'recaptchaToken' && typeof value === 'string' && value.length > MAX_PUBLIC_FIELD_LENGTH)
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/comments', jsonSmall, requireRecaptcha('blog_comment'), async (req, res) => {
  const ip = getClientIp(req)

  if (isRateLimited(`comments:${ip}`, 5)) {
    return res.status(429).json({ ok: false, error: 'Demasiados comentarios en poco tiempo. Intenta de nuevo más tarde.' })
  }

  const { firstName, lastName, email, phone, comment, postSlug, postTitle } = req.body || {}

  if (hasInvalidPublicField(req.body)) {
    return res.status(400).json({ ok: false, error: 'Uno de los campos supera la longitud permitida.' })
  }

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !comment?.trim()) {
    return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios.' })
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ ok: false, error: 'El correo no es válido.' })
  }

  try {
    await createClientifyContact({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      contact_source: 'Blog BBBSC',
      tags: ['comentario-blog', postSlug ? `blog-${postSlug}` : 'blog-sin-articulo'],
      message: `Comentario en "${postTitle || 'artículo del blog'}":\n${comment.trim()}`,
    })

    const db = getDb()
    const createdAt = nowIso()
    const result = db
      .prepare(
        'INSERT INTO comments (post_slug, post_title, first_name, last_name, email, phone, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .run(postSlug || null, postTitle || null, firstName.trim(), lastName.trim(), email.trim(), phone.trim(), comment.trim(), createdAt)

    return res.status(201).json({
      ok: true,
      comment: { id: result.lastInsertRowid, name: `${firstName.trim()} ${lastName.trim()}`, comment: comment.trim(), date: createdAt },
    })
  } catch {
    return res.status(502).json({ ok: false, error: 'No pudimos registrar tu comentario en este momento.' })
  }
})

const REGISTRATION_REQUIRED_FIELDS = [
  'firstName', 'lastName', 'email', 'pasaporte', 'nivelIngles', 'participacionPrevia', 'visaAplicada', 'visaNegada',
  'condicionMedica', 'alergias', 'restriccionPeso', 'condicionFisicaMental', 'familiaresEEUU', 'fechaGrado', 'gdprAceptado',
]

app.post('/api/registrations', jsonSmall, requireRecaptcha('work_travel_registration'), async (req, res) => {
  const ip = getClientIp(req)

  if (isRateLimited(`registrations:${ip}`, 3)) {
    return res.status(429).json({ ok: false, error: 'Demasiadas solicitudes en poco tiempo. Intenta de nuevo más tarde.' })
  }

  const body = req.body || {}
  if (hasInvalidPublicField(body)) {
    return res.status(400).json({ ok: false, error: 'Uno de los campos supera la longitud permitida.' })
  }
  const missing = REGISTRATION_REQUIRED_FIELDS.filter((field) => {
    const value = body[field]
    return value === undefined || value === null || value === '' || value === false
  })

  if (missing.length > 0) {
    return res.status(400).json({ ok: false, error: `Faltan campos obligatorios: ${missing.join(', ')}` })
  }
  if (!EMAIL_REGEX.test(String(body.email).trim())) {
    return res.status(400).json({ ok: false, error: 'El correo no es válido.' })
  }

  const universidadCompuesta = [body.universidad, body.municipioUniversidad, body.departamentoUniversidadLabel]
    .filter(Boolean)
    .join(' · ')

  try {
    const form = getFormDefinition('registration_work-and-travel-usa')
    const fullName = `${String(body.firstName).trim()} ${String(body.lastName).trim()}`
    const payload = buildClientifyPayload(form, {
      ...body,
      universidadCompuesta,
      interestTag: form.interestTag,
      message: `${fullName} se inscribió en el formulario de la página web de Work and Travel USA.`,
      contactSource: form.source,
      programaActual: 'Work & Travel USA',
      tipoVisa: 'J1',
      terminosYCondiciones: body.gdprAceptado ? 'Aceptado' : '',
    })
    payload.tags = [...new Set([...(payload.tags || []), 'inscripcion-web', 'work-and-travel-usa'])]
    payload.addresses =
        body.direccion || body.municipioNacimientoLabel || body.departamentoNacimientoLabel
          ? [
              {
                type: 2,
                street: body.direccion || '',
                city: body.municipioNacimiento || '',
                state: body.departamentoNacimientoLabel || '',
                country: 'Colombia',
              },
            ]
          : undefined
    await createClientifyContact(payload)
    return res.status(201).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false, error: 'No pudimos enviar tu inscripción en este momento. Intenta de nuevo o escríbenos por WhatsApp.' })
  }
})

app.listen(PORT, () => {
  console.log(`[bbbsc-server] Escuchando en http://localhost:${PORT}`)
})
