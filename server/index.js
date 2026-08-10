import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 4000
const CLIENTIFY_API_KEY = process.env.CLIENTIFY_API_KEY
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean)

if (!CLIENTIFY_API_KEY) {
  console.error('[bbbsc-server] Falta CLIENTIFY_API_KEY en el archivo .env. El servidor no puede iniciar sin ella.')
  process.exit(1)
}

const app = express()
app.use(express.json({ limit: '10kb' }))
app.use(
  cors({
    origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : false,
  }),
)

// Rate limiting muy simple en memoria: máximo 5 comentarios cada 10 minutos por IP.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const requestLog = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/comments', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Demasiados comentarios en poco tiempo. Intenta de nuevo más tarde.' })
  }

  const { firstName, lastName, email, phone, comment, postSlug, postTitle } = req.body || {}

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !comment?.trim()) {
    return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios.' })
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ ok: false, error: 'El correo no es válido.' })
  }

  try {
    const clientifyResponse = await fetch('https://api.clientify.net/v1/contacts/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${CLIENTIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        contact_source: 'Blog BBBSC',
        tags: ['comentario-blog', postSlug ? `blog-${postSlug}` : 'blog-sin-articulo'],
        message: `Comentario en "${postTitle || 'artículo del blog'}":\n${comment.trim()}`,
      }),
    })

    if (!clientifyResponse.ok) {
      const errorBody = await clientifyResponse.text()
      console.error('[bbbsc-server] Error de Clientify:', clientifyResponse.status, errorBody)
      return res.status(502).json({ ok: false, error: 'No pudimos registrar tu comentario en este momento.' })
    }

    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('[bbbsc-server] Error llamando a Clientify:', error)
    return res.status(502).json({ ok: false, error: 'No pudimos registrar tu comentario en este momento.' })
  }
})

app.listen(PORT, () => {
  console.log(`[bbbsc-server] Escuchando en http://localhost:${PORT}`)
})
