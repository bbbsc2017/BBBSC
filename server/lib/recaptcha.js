const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5)

export async function verifyRecaptchaToken(token, expectedAction, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    const error = new Error('recaptcha_not_configured')
    error.code = 'not_configured'
    throw error
  }
  if (!token || typeof token !== 'string' || token.length > 5000) return { ok: false, reason: 'missing_or_invalid_token' }

  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp)

  const response = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(8_000),
  })
  if (!response.ok) throw new Error('recaptcha_unavailable')

  const result = await response.json()
  if (!result.success) return { ok: false, reason: (result['error-codes'] || []).join(',') || 'verification_failed' }
  if (result.action && result.action !== expectedAction) return { ok: false, reason: 'action_mismatch' }
  if (typeof result.score === 'number' && result.score < MIN_SCORE) return { ok: false, reason: 'low_score', score: result.score }
  return { ok: true, score: result.score, hostname: result.hostname }
}
export function requireRecaptcha(expectedAction) {
  return async (req, res, next) => {
    try {
      const result = await verifyRecaptchaToken(req.body?.recaptchaToken, expectedAction, req.ip || req.socket.remoteAddress)
      if (!result.ok) {
        console.warn(`[bbbsc-server] reCAPTCHA rechazado (${expectedAction}): ${result.reason}`)
        return res.status(403).json({ ok: false, error: 'No pudimos validar la protección anti-spam. Recarga la página e intenta de nuevo.' })
      }
      req.recaptcha = result
      next()
    } catch (error) {
      const configurationError = error?.code === 'not_configured'
      console.error(`[bbbsc-server] reCAPTCHA ${configurationError ? 'no configurado' : 'no disponible'} (${expectedAction}).`)
      return res.status(503).json({ ok: false, error: configurationError ? 'La protección anti-spam no está configurada en el servidor.' : 'La protección anti-spam no está disponible. Intenta nuevamente en unos minutos.' })
    }
  }
}
