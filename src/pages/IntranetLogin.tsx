import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, KeyRound, LogIn, Mail, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { FormField, TextInput } from '../components/ui/FormField'
import logoMark from '../assets/logo/bbb-mark-white.svg'
import loginBackground from '../assets/intranet/login-road-bg.webp'
import { executeRecaptcha, isRecaptchaConfigured } from '../lib/recaptcha'

interface SessionUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  mustChangePassword?: boolean
}

type TwoFactorMethod = 'EMAIL' | 'TOTP'
type Stage = 'credentials' | 'setup-choice' | 'setup-confirm' | 'verify' | 'password-change'

async function postJson(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({ ok: false }))
  if (!response.ok || !data.ok) throw new Error(data.error || 'No pudimos completar la solicitud.')
  return data
}

export default function IntranetLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedNext = searchParams.get('next') || ''
  const nextPath = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/intranet'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [stage, setStage] = useState<Stage>('credentials')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState<SessionUser | null>(null)
  const [pendingToken, setPendingToken] = useState('')
  const [method, setMethod] = useState<TwoFactorMethod | null>(null)
  const [maskedEmail, setMaskedEmail] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => {
        if (response.ok) navigate(nextPath, { replace: true })
      })
      .catch(() => undefined)
  }, [navigate, nextPath])

  function completeLogin(authenticatedUser: SessionUser) {
    setUser(authenticatedUser)
    setStatus('idle')
    setStage(authenticatedUser.mustChangePassword ? 'password-change' : 'credentials')
    if (!authenticatedUser.mustChangePassword) navigate(nextPath, { replace: true })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setErrorMessage('')
    setStatus('submitting')

    let recaptchaToken = ''
    try { recaptchaToken = await executeRecaptcha('login') } catch {
      setStatus('error')
      setErrorMessage('No pudimos completar la verificacion de seguridad. Recarga la pagina e intenta de nuevo.')
      return
    }

    try {
      const data = await postJson('/api/auth/login', { email, password, recaptchaToken })
      if (data.status === 'requires_setup') {
        setPendingToken(data.pendingToken)
        setStage('setup-choice')
        setStatus('idle')
        return
      }
      if (data.status === 'requires_code') {
        setPendingToken(data.pendingToken)
        setMethod(data.method)
        setMaskedEmail(data.maskedEmail || '')
        setStage('verify')
        setStatus('idle')
        return
      }
      completeLogin(data.user)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos iniciar sesion.')
    }
  }

  async function chooseTwoFactor(selectedMethod: TwoFactorMethod) {
    setStatus('submitting')
    setErrorMessage('')
    try {
      const data = await postJson('/api/auth/2fa/setup/init', { pendingToken, method: selectedMethod })
      setMethod(selectedMethod)
      setMaskedEmail(data.maskedEmail || '')
      setQrDataUrl(data.qrDataUrl || '')
      setSecret(data.secret || '')
      setStage('setup-confirm')
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos configurar la verificacion.')
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      const path = stage === 'setup-confirm' ? '/api/auth/2fa/setup/verify' : '/api/auth/2fa/verify'
      const data = await postJson(path, { pendingToken, code })
      completeLogin(data.user)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'El codigo no es valido.')
    }
  }

  async function resendCode() {
    setStatus('submitting')
    setErrorMessage('')
    try {
      await postJson('/api/auth/2fa/resend', { pendingToken })
      setStatus('idle')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos reenviar el codigo.')
    }
  }

  async function changeInitialPassword(event: FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')
    try {
      await postJson('/api/auth/initial-password', { newPassword })
      setUser((current) => (current ? { ...current, mustChangePassword: false } : current))
      setStage('credentials')
      setStatus('idle')
      navigate(nextPath, { replace: true })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos actualizar la contrasena.')
    }
  }

  const error = status === 'error' ? <p className="text-sm font-medium text-red-400">{errorMessage}</p> : null
  const submitting = status === 'submitting'
  const cardClass = 'relative flex w-full flex-col gap-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1c1c]/90 p-6 shadow-2xl shadow-[#1c1c1c]/50 backdrop-blur-xl sm:p-9 lg:p-10'
  const actionClass = 'group inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-black uppercase tracking-[.14em] text-white transition hover:-translate-y-0.5 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-45'
  const loginInputClass = 'min-h-12 rounded-xl !border-white/10 !bg-[#2b2b2b] px-4 text-sm focus:!bg-[#2b2b2b]'

  return (
    <>
      <Seo title="Iniciar sesion - Intranet" description="Acceso a la intranet de BBB Student Center." path="/intranet/login" noIndex />
      <section className="relative isolate min-h-screen overflow-hidden bg-[#1c1c1c] text-white">
        <img src={loginBackground} alt="" className="absolute inset-0 -z-30 size-full object-cover object-[58%_center]" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(28,28,28,.9)_0%,rgba(28,28,28,.55)_48%,rgba(28,28,28,.76)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(28,28,28,.15)_0%,rgba(28,28,28,.18)_45%,rgba(28,28,28,.94)_100%)]" />
        <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 gap-6 px-5 py-6 sm:gap-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(390px,520px)] lg:items-center lg:gap-16 lg:px-14 lg:py-10 xl:px-20">
          <div className="flex min-h-[40vh] flex-col lg:min-h-[calc(100vh-5rem)]">
            <a href="/" className="inline-flex w-fit items-center gap-3 rounded-full py-2" aria-label="BBB Student Center — Inicio"><span className="flex size-11 items-center justify-center rounded-full bg-brand/10 ring-1 ring-brand/20"><img src={logoMark} alt="" className="size-9 object-contain" /></span><span className="text-base font-black uppercase tracking-[.12em]">BBBSC</span></a>
            <div className="my-auto max-w-3xl py-10 lg:py-8"><p className="text-xs font-black uppercase tracking-[.3em] text-brand">Portal del participante</p><h1 className="mt-6 text-[clamp(2.8rem,5.7vw,5.75rem)] font-black leading-[.88] tracking-[-.055em]">Tu camino<br /><span className="text-brand">comienza</span><br />aquí.</h1><p className="mt-7 max-w-md text-sm font-medium leading-6 text-white/50 sm:text-base sm:leading-7">Gestiona tu proceso, documentos, entrevistas y oportunidades en un solo lugar.</p></div>
            <p className="hidden text-xs font-semibold text-white/30 lg:block">© {new Date().getFullYear()} BBBSC. Todos los derechos reservados.</p>
          </div>
          <div className="mx-auto flex w-full max-w-[520px] items-center pb-8 lg:pb-0">
          {user && stage !== 'password-change' ? (
            <div className={`${cardClass} items-center text-center`}>
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white"><LogIn className="size-6" /></span>
              <h2 className="text-2xl font-black text-white">Bienvenido, {user.firstName} {user.lastName}</h2>
              <p className="text-sm text-white/70">
                Tu cuenta central esta conectada. Rol: <span className="font-semibold text-brand">{user.role}</span>.
              </p>
              <button type="button" onClick={() => navigate(nextPath)} className={actionClass}>
                Abrir panel de BBBSC<ArrowRight className="ml-3 size-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          ) : stage === 'password-change' ? (
            <form onSubmit={changeInitialPassword} className={cardClass}>
              <div><p className="text-xs font-black uppercase tracking-[.28em] text-brand">Acceso privado</p><h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">Crea tu nueva contraseña</h2><p className="mt-2 text-sm text-white/50">Debes reemplazar la contraseña temporal antes de continuar.</p></div>
              <FormField label="Nueva contrasena" required><TextInput required minLength={8} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></FormField>
              {error}
              <button type="submit" disabled={submitting || newPassword.length < 8} className={actionClass}>{submitting ? 'Guardando...' : 'Guardar contraseña'}<ArrowRight className="ml-3 size-4" /></button>
            </form>
          ) : stage === 'setup-choice' ? (
            <div className={cardClass}>
              <div><p className="text-xs font-black uppercase tracking-[.28em] text-brand">Acceso privado</p><ShieldCheck className="mt-5 size-9 text-brand" /><h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">Protege tu cuenta</h2><p className="mt-2 text-sm text-white/50">Tu rol requiere verificación en dos pasos.</p></div>
              <button type="button" disabled={submitting} onClick={() => chooseTwoFactor('TOTP')} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-left text-white hover:border-brand/60"><KeyRound className="size-5 text-brand" /><span><strong className="block text-sm">App autenticadora</strong><small className="text-white/50">Google Authenticator, Authy u otra app TOTP</small></span></button>
              <button type="button" disabled={submitting} onClick={() => chooseTwoFactor('EMAIL')} className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-left text-white hover:border-brand/60"><Mail className="size-5 text-brand" /><span><strong className="block text-sm">Codigo por correo</strong><small className="text-white/50">Recibelo en tu correo registrado</small></span></button>
              {error}
            </div>
          ) : stage === 'setup-confirm' || stage === 'verify' ? (
            <form onSubmit={verifyCode} className={cardClass}>
              <div><p className="text-xs font-black uppercase tracking-[.28em] text-brand">Acceso privado</p><ShieldCheck className="mt-5 size-9 text-brand" /><h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">Verificación en dos pasos</h2><p className="mt-2 text-sm text-white/50">{method === 'EMAIL' ? `Ingresa el código enviado a ${maskedEmail || 'tu correo'}.` : 'Ingresa el código generado por tu app autenticadora.'}</p></div>
              {method === 'TOTP' && qrDataUrl && <div className="flex flex-col items-center gap-2"><img src={qrDataUrl} alt="Codigo QR para configurar la app autenticadora" className="size-44 rounded-xl bg-white p-2" />{secret && <code className="break-all text-center text-xs text-white/60">{secret}</code>}</div>}
              <FormField label="Codigo de 6 digitos" required><TextInput required inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} /></FormField>
              <p className="text-xs leading-5 text-white/40">Después de verificarlo, este navegador permanecerá reconocido durante 15 días o hasta que cierres sesión.</p>
              {error}
              <button type="submit" disabled={submitting || code.length !== 6} className={actionClass}>{submitting ? 'Verificando...' : 'Verificar e ingresar'}<ArrowRight className="ml-3 size-4" /></button>
              {method === 'EMAIL' && <button type="button" disabled={submitting} onClick={resendCode} className="text-xs text-white/50 underline">Reenviar codigo</button>}
            </form>
          ) : (
            <form onSubmit={handleSubmit} className={cardClass}>
              <div><p className="text-[11px] font-black uppercase tracking-[.28em] text-brand">Acceso privado</p><h2 className="mt-5 text-3xl leading-none tracking-[-.04em] text-white sm:text-[2.15rem]"><span className="font-light">Bienvenido</span><br /><span className="font-black">de nuevo.</span></h2><p className="mt-4 max-w-sm text-sm italic leading-6 text-white/40">Ingresa con las credenciales de tu cuenta BBBSC.</p></div>
              <FormField label="Correo electrónico" required className="text-xs uppercase tracking-[.16em] text-white/45"><TextInput required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={loginInputClass} /></FormField>
              <FormField label="Contraseña" required className="text-xs uppercase tracking-[.16em] text-white/45"><div className="relative"><TextInput required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={`${loginInputClass} pr-14`} /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/30 transition hover:text-brand" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div></FormField>
              {!isRecaptchaConfigured && <p className="text-sm text-red-400">Falta configurar VITE_RECAPTCHA_SITE_KEY.</p>}
              {error}
              <button type="submit" disabled={submitting || !isRecaptchaConfigured} className={actionClass}>{submitting ? 'Ingresando...' : 'Acceder'}<ArrowRight className="ml-3 size-4 transition group-hover:translate-x-1" /></button>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.2em] text-white/20"><span className="h-px flex-1 bg-white/10" /><span>BBBSC · Acceso privado</span><span className="h-px flex-1 bg-white/10" /></div>
              <p className="text-center text-[10px] leading-4 text-white/25">Protegido por reCAPTCHA. Aplican la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Política de Privacidad</a> y los <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Términos de Servicio</a> de Google.</p>
            </form>
          )}
          </div>
          <p className="text-center text-xs font-semibold text-white/30 lg:hidden">© {new Date().getFullYear()} BBBSC. Todos los derechos reservados.</p>
        </div>
      </section>
    </>
  )
}
