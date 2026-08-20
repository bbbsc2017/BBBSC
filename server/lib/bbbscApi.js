const BBBSC_API_URL = process.env.BBBSC_API_URL || 'https://api.bbbsc.com'
const REQUEST_TIMEOUT_MS = 10_000
const CENTRAL_REFRESH_COOKIE = 'bbbsc_refresh'

class BbbscApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function requestBbbscApi(path, options = {}) {
  const response = await fetch(`${BBBSC_API_URL}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
    throw new BbbscApiError(response.status, message || 'Error al comunicarse con BBBSC.')
  }

  return { data, response }
}

async function callBbbscApi(path, options = {}) {
  const { data } = await requestBbbscApi(path, options)
  return data
}

function getResponseCookie(response, name) {
  const headers = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : [response.headers.get('set-cookie')].filter(Boolean)

  for (const header of headers) {
    const match = header.match(new RegExp(`(?:^|[,;]\\s*)${name}=([^;]+)`))
    if (match) return decodeURIComponent(match[1])
  }
  return null
}

function sessionResult(data, response) {
  const accessToken = data?.session?.access_token
  if (!accessToken) throw new BbbscApiError(502, 'La API central no devolvio una sesion valida.')
  return {
    user: data.user,
    accessToken,
    refreshToken: getResponseCookie(response, CENTRAL_REFRESH_COOKIE),
  }
}

export async function login(email, password, recaptchaToken) {
  const { data, response } = await requestBbbscApi('/auth/login', {
    method: 'POST',
    headers: recaptchaToken ? { 'x-recaptcha-token': recaptchaToken } : undefined,
    body: JSON.stringify({ email, password }),
  })
  if (data.requiresTwoFactorSetup) {
    return { status: 'requires_setup', pendingToken: data.pendingToken, user: data.user }
  }
  if (data.requiresTwoFactorCode) {
    return {
      status: 'requires_code',
      pendingToken: data.pendingToken,
      method: data.method,
      maskedEmail: data.maskedEmail,
      user: data.user,
    }
  }
  return { status: 'authenticated', ...sessionResult(data, response) }
}

export function initTwoFactorSetup(pendingToken, method) {
  return callBbbscApi('/auth/2fa/setup/init', {
    method: 'POST',
    body: JSON.stringify({ pendingToken, method }),
  })
}

export async function verifyTwoFactorSetup(pendingToken, code) {
  const { data, response } = await requestBbbscApi('/auth/2fa/setup/verify', {
    method: 'POST',
    body: JSON.stringify({ pendingToken, code }),
  })
  return sessionResult(data, response)
}

export async function verifyTwoFactorLogin(pendingToken, code) {
  const { data, response } = await requestBbbscApi('/auth/login/2fa/verify', {
    method: 'POST',
    body: JSON.stringify({ pendingToken, code }),
  })
  return sessionResult(data, response)
}

export async function refreshSession(refreshToken) {
  const { data, response } = await requestBbbscApi('/auth/refresh', {
    method: 'POST',
    headers: { Cookie: `${CENTRAL_REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}` },
  })
  const result = sessionResult(data, response)
  if (!result.refreshToken) {
    throw new BbbscApiError(502, 'La API central no pudo renovar la sesion persistente.')
  }
  return result
}

export function revokeSession(refreshToken) {
  return callBbbscApi('/auth/logout', {
    method: 'POST',
    headers: { Cookie: `${CENTRAL_REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}` },
  })
}

export function resendTwoFactorCode(pendingToken) {
  return callBbbscApi('/auth/2fa/resend-code', {
    method: 'POST',
    body: JSON.stringify({ pendingToken }),
  })
}

export async function getMe(accessToken) {
  const data = await callBbbscApi('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return data
}

export function getProfile(accessToken) {
  return callBbbscApi('/profiles/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function getStudentDashboard(accessToken) {
  return callBbbscApi('/me/dashboard', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function getStudentProfileLabel(accessToken) {
  return callBbbscApi('/me/profile-label', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function getStudentInfoSummary(accessToken) {
  return callBbbscApi('/me/info-summary', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function getUsers(accessToken) {
  return callBbbscApi('/users', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function setInitialPassword(accessToken, newPassword) {
  return callBbbscApi('/auth/set-initial-password', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ newPassword }),
  })
}

export function submitBasicLead(payload) {
  return callBbbscApi('/leads/basic', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function decodeTokenExpiry(accessToken) {
  const payloadSegment = accessToken.split('.')[1]
  if (!payloadSegment) return null

  const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
  const json = Buffer.from(base64, 'base64').toString('utf8')
  const payload = JSON.parse(json)
  return typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null
}

export { BbbscApiError }
