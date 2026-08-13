const CLIENTIFY_BASE_URL = 'https://api.clientify.net/v1'
const CLIENTIFY_V2_BASE_URL = 'https://api-plus.clientify.com/v2'

function clientifyHeaders() {
  return {
    Authorization: `Token ${process.env.CLIENTIFY_API_KEY}`,
    'Content-Type': 'application/json',
  }
}
async function clientifyRequest(path, options = {}, baseUrl = CLIENTIFY_BASE_URL) {
  const response = await fetch(`${baseUrl}${path}`, {
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

function clientifyV2Request(path, options = {}) {
  return clientifyRequest(path, options, CLIENTIFY_V2_BASE_URL)
}

function resultsFrom(data) {
  return Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
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

export async function getAllClientifyProducts() {
  const products = []
  let path = '/products/?fields=id,name,description,price,currency,sku,picture_url,active'
  for (let page = 0; path && page < 100; page += 1) {
    const data = await clientifyV2Request(path)
    products.push(...resultsFrom(data))
    if (!data?.next) break
    const next = new URL(data.next)
    if (next.origin !== new URL(CLIENTIFY_V2_BASE_URL).origin || !next.pathname.startsWith('/v2/products/')) {
      throw new Error('clientify_invalid_pagination')
    }
    path = `${next.pathname.replace(/^\/v2/, '')}${next.search}`
  }
  return products.map((product) => ({
    id: String(product.id),
    name: String(product.name || '').trim(),
    sku: String(product.sku || '').trim(),
    price: Number.isFinite(Number(product.price)) ? Number(product.price) : 0,
    currency: String(product.currency || 'USD').trim().toUpperCase().slice(0, 3) || 'USD',
    description: String(product.description || '').trim(),
    active: product.active !== false,
    raw: product,
  })).filter((product) => product.id && product.name)
}

export function upsertClientifyContact(payload) {
  return clientifyV2Request('/contacts/', { method: 'POST', body: JSON.stringify(payload) })
}

export async function findClientifyDealByApplication(applicationId) {
  const key = `[BBBSC-APP-${applicationId}]`
  const params = new URLSearchParams({ fields: 'id,name,contact_id', query: key })
  const data = await clientifyV2Request(`/deals/?${params}`)
  return resultsFrom(data).find((deal) => String(deal.name || '').includes(key)) || null
}

export function createClientifyDeal(payload) {
  return clientifyV2Request('/deals/', { method: 'POST', body: JSON.stringify(payload) })
}
