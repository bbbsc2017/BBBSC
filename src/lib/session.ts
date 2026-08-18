import { useCallback, useEffect, useState } from 'react'
import { apiCredentials, apiUrl } from './apiBase'

export interface SessionUser {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  isActive: boolean
  studentCode: string | null
  mustChangePassword: boolean
  bbbscAccessEnabled: boolean
}

// Sesión del participante en bbbsc.com — comparte cookie con admin.bbbsc.com /
// api.bbbsc.com (dominio .bbbsc.com), así que un solo GET /api/auth/me basta
// para saber si ya hay sesión activa (por ejemplo, iniciada en /perfil).
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(apiUrl('/api/auth/me'), { credentials: apiCredentials })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: SessionUser | null) => {
        if (cancelled) return
        if (!data?.id) {
          setUser(null)
          setPhotoUrl(null)
          return
        }
        setUser(data)
        fetch(apiUrl('/api/profiles/me'), { credentials: apiCredentials })
          .then((response) => (response.ok ? response.json() : null))
          .then((profile: { imageUrl?: string | null } | null) => {
            if (!cancelled) setPhotoUrl(profile?.imageUrl ?? null)
          })
          .catch(() => undefined)
      })
      .catch(() => { if (!cancelled) setUser(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [version])

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const logout = useCallback(async () => {
    await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: apiCredentials }).catch(() => undefined)
    setUser(null)
    setPhotoUrl(null)
  }, [])

  return { user, photoUrl, loading, refresh, logout }
}

export function initials(user: Pick<SessionUser, 'firstName' | 'lastName'>) {
  return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?'
}
