const BBBSC_API_URL = process.env.BBBSC_API_URL || 'https://api.bbbsc.com'
const REQUEST_TIMEOUT_MS = 10_000

class BbbscApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function requestCentralOffers(path, options = {}) {
  const response = await fetch(`${BBBSC_API_URL}/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(' ') : data?.message
    throw new BbbscApiError(response.status, message || 'Error al comunicarse con la API de ofertas.')
  }

  return data
}

export function listOffers() {
  return requestCentralOffers('/offers')
}

export function getOfferBySlug(slug) {
  return requestCentralOffers(`/offers/slug/${encodeURIComponent(slug)}`)
}

export function getOfferById(id) {
  return requestCentralOffers(`/offers/${encodeURIComponent(id)}`)
}

export function getMyCurrentOffer(accessToken) {
  return requestCentralOffers('/offers/me/current', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export function applyToOffer(accessToken, offerId, body) {
  return requestCentralOffers(`/offers/${encodeURIComponent(offerId)}/apply`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  })
}

export { BbbscApiError as OffersApiError }
