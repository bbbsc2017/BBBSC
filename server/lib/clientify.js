const CLIENTIFY_BASE_URL = 'https://api.clientify.net/v1'

function clientifyHeaders() {
  return {
    Authorization: `Token ${process.env.CLIENTIFY_API_KEY}`,
    'Content-Type': 'application/json',
  }
}
async function clientifyRequest(path, options = {}) {
  const response = await fetch(`${CLIENTIFY_BASE_URL}${path}`, {
    ...options,
    headers: { ...clientifyHeaders(), ...(options.headers || {}) },
    signal: AbortSignal.timeout(10_000),
  })
  const text = await response.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (!response.ok) {
    console.error('[bbbsc-server] Error de Clientify:', response.status, typeof data === 'string' ? data : JSON.stringify(data))
    const error = new Error('clientify_error')
    error.status = response.status
    throw error
  }
  return data
}

export function createClientifyContact(payload) {
  return clientifyRequest('/contacts/', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getClientifyCustomFields() {
  const data = await clientifyRequest('/custom-fields/')
  const entries = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
  return entries
    .map((field) => ({
      id: String(field.id ?? field.pk ?? field.name ?? field.label ?? ''),
      name: String(field.name ?? field.label ?? field.field ?? '').trim(),
      type: String(field.type ?? field.field_type ?? 'custom'),
    }))
    .filter((field) => field.name)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
