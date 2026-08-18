const configuredOrigin = import.meta.env.VITE_API_URL
const apiOrigin = (configuredOrigin ?? (import.meta.env.DEV ? '' : 'https://api.bbbsc.com')).replace(/\/$/, '')

export function apiUrl(path: string) {
  return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`
}

export const apiCredentials: RequestCredentials = 'include'
