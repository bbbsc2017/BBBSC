import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, LogIn, X } from 'lucide-react'
import { fieldClass } from '../ui/FormField'
import { RecaptchaNotice } from '../ui/RecaptchaNotice'
import { executeRecaptcha } from '../../lib/recaptcha'
import { apiCredentials, apiUrl } from '../../lib/apiBase'

export function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onEscape)
    }
  }, [onClose])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const recaptchaToken = await executeRecaptcha('login')
      const loginResponse = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        credentials: apiCredentials,
        headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const loginData = await loginResponse.json().catch(() => ({}))
      if (!loginResponse.ok) throw new Error(loginData.message || 'Correo o contraseña incorrectos.')
      // Este formulario es solo para participantes: si la cuenta requiere un
      // paso adicional (2FA de staff), no lo completamos aquí.
      if (loginData.status && loginData.status !== 'ok') {
        throw new Error('Esta cuenta requiere verificación adicional. Ingresa desde admin.bbbsc.com.')
      }

      const meResponse = await fetch(apiUrl('/api/auth/me'), { credentials: apiCredentials })
      const me = await meResponse.json().catch(() => null)
      if (!me?.id) throw new Error('No pudimos confirmar tu sesión. Intenta de nuevo.')

      if (me.roles?.includes('STUDENT') && !me.bbbscAccessEnabled) {
        await fetch(apiUrl('/api/auth/logout'), { method: 'POST', credentials: apiCredentials }).catch(() => undefined)
        throw new Error('Tu acceso todavía no ha sido habilitado. Contacta a tu asesor BBBSC.')
      }

      onSuccess()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos iniciar sesión.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1c1c1c]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button type="button" className="absolute inset-0" onClick={onClose} aria-label="Cerrar" />
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm rounded-[2rem] border border-white/15 bg-[#1c1c1c] p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-white/50 transition hover:border-brand/40 hover:text-brand" aria-label="Cerrar">
          <X className="size-5" />
        </button>
        <p className="text-[10px] font-black uppercase tracking-[.2em] text-brand">Portal participante</p>
        <h2 id="login-title" className="mt-3 pr-10 text-2xl font-black">Iniciar sesión</h2>
        <div className="mt-6 flex flex-col gap-4">
          <label className="text-xs font-bold text-white/65">
            Correo
            <input
              autoFocus
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
          <label className="text-xs font-bold text-white/65">
            Contraseña
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`mt-2 ${fieldClass}`}
            />
          </label>
        </div>
        <RecaptchaNotice className="mt-4" />
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
        >
          {status === 'submitting' ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          {status === 'submitting' ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
