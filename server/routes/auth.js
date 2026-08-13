import { Router } from 'express'
import {
  createSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  getSessionIdFromRequest,
  getCentralRefreshToken,
  hasIntranetAccess,
  isStaffRole,
  requireAuth,
} from '../auth.js'
import {
  login as bbbscLogin,
  initTwoFactorSetup,
  verifyTwoFactorSetup,
  verifyTwoFactorLogin,
  resendTwoFactorCode,
  getProfile,
  setInitialPassword,
  revokeSession as revokeBbbscSession,
  BbbscApiError,
} from '../lib/bbbscApi.js'
import { isRateLimited, getClientIp } from '../lib/rateLimit.js'

export const authRouter = Router()

function publicUser(user) {
  const roles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [user.role || 'STUDENT']
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: roles.find(isStaffRole) || roles[0],
    mustChangePassword: Boolean(user.mustChangePassword),
  }
}

function finishLogin(res, user, accessToken, refreshToken) {
  const normalizedUser = publicUser(user)
  if (!hasIntranetAccess(normalizedUser.id, normalizedUser.role)) {
    return res.status(403).json({ ok: false, error: 'Tu cuenta es válida, pero aún no está habilitada para esta intranet.' })
  }
  const session = createSession(normalizedUser, accessToken, refreshToken)
  setSessionCookie(res, session.id)
  return res.json({ ok: true, status: 'authenticated', user: normalizedUser })
}

function sendApiError(res, error, context) {
  if (error instanceof BbbscApiError) {
    return res.status(error.status).json({ ok: false, error: error.message })
  }
  console.error(`[bbbsc-server] ${context}:`, error)
  return res.status(502).json({ ok: false, error: 'No pudimos conectar con la plataforma BBBSC. Intenta de nuevo.' })
}

authRouter.post('/login', async (req, res) => {
  const ip = getClientIp(req)
  if (isRateLimited(`login:${ip}`, 10)) {
    return res.status(429).json({ ok: false, error: 'Demasiados intentos. Intenta de nuevo mas tarde.' })
  }

  const { email, password, recaptchaToken } = req.body || {}
  if (!email?.trim() || !password) {
    return res.status(400).json({ ok: false, error: 'Correo y contrasena son obligatorios.' })
  }
  if (!recaptchaToken) {
    return res.status(400).json({ ok: false, error: 'No se pudo completar la verificacion de seguridad.' })
  }

  try {
    const result = await bbbscLogin(email.trim(), password, recaptchaToken)
    if (result.status === 'requires_setup' || result.status === 'requires_code') {
      return res.json({ ok: true, ...result, user: publicUser(result.user) })
    }
    return finishLogin(res, result.user, result.accessToken, result.refreshToken)
  } catch (error) {
    return sendApiError(res, error, 'Error al iniciar sesion contra BBBSC')
  }
})

authRouter.post('/2fa/setup/init', async (req, res) => {
  const { pendingToken, method } = req.body || {}
  if (!pendingToken || !['EMAIL', 'TOTP'].includes(method)) {
    return res.status(400).json({ ok: false, error: 'Metodo de verificacion invalido.' })
  }
  try {
    const result = await initTwoFactorSetup(pendingToken, method)
    return res.json({ ok: true, ...result })
  } catch (error) {
    return sendApiError(res, error, 'Error iniciando configuracion 2FA')
  }
})

authRouter.post('/2fa/setup/verify', async (req, res) => {
  const { pendingToken, code } = req.body || {}
  if (!pendingToken || !/^\d{6}$/.test(code || '')) {
    return res.status(400).json({ ok: false, error: 'Ingresa un codigo valido de 6 digitos.' })
  }
  try {
    const result = await verifyTwoFactorSetup(pendingToken, code)
    return finishLogin(res, result.user, result.accessToken, result.refreshToken)
  } catch (error) {
    return sendApiError(res, error, 'Error verificando configuracion 2FA')
  }
})

authRouter.post('/2fa/verify', async (req, res) => {
  const { pendingToken, code } = req.body || {}
  if (!pendingToken || !/^\d{6}$/.test(code || '')) {
    return res.status(400).json({ ok: false, error: 'Ingresa un codigo valido de 6 digitos.' })
  }
  try {
    const result = await verifyTwoFactorLogin(pendingToken, code)
    return finishLogin(res, result.user, result.accessToken, result.refreshToken)
  } catch (error) {
    return sendApiError(res, error, 'Error verificando segundo factor')
  }
})

authRouter.post('/2fa/resend', async (req, res) => {
  const { pendingToken } = req.body || {}
  if (!pendingToken) return res.status(400).json({ ok: false, error: 'La verificacion expiro.' })
  try {
    await resendTwoFactorCode(pendingToken)
    return res.json({ ok: true })
  } catch (error) {
    return sendApiError(res, error, 'Error reenviando codigo 2FA')
  }
})

authRouter.post('/logout', async (req, res) => {
  const sessionId = getSessionIdFromRequest(req)
  const centralRefreshToken = sessionId ? getCentralRefreshToken(sessionId) : null
  if (sessionId) destroySession(sessionId)
  clearSessionCookie(res)
  if (centralRefreshToken) {
    try { await revokeBbbscSession(centralRefreshToken) }
    catch (error) { console.warn('[bbbsc-server] No se pudo revocar la sesión central durante el cierre:', error) }
  }
  return res.json({ ok: true })
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user })
})

authRouter.get('/profile', requireAuth, async (req, res) => {
  try {
    const profile = await getProfile(req.bbbscAccessToken)
    return res.json({ ok: true, profile })
  } catch (error) {
    return sendApiError(res, error, 'Error consultando perfil central')
  }
})

authRouter.post('/initial-password', requireAuth, async (req, res) => {
  const { newPassword } = req.body || {}
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ ok: false, error: 'La nueva contrasena debe tener al menos 8 caracteres.' })
  }
  try {
    await setInitialPassword(req.bbbscAccessToken, newPassword)
    return res.json({ ok: true })
  } catch (error) {
    return sendApiError(res, error, 'Error actualizando contrasena inicial')
  }
})
