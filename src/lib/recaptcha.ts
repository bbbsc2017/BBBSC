declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
      }
    }
  }
}
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined
let scriptPromise: Promise<void> | null = null

export const isRecaptchaConfigured = Boolean(siteKey)

function loadRecaptcha() {
  if (!siteKey) return Promise.reject(new Error('Falta configurar la protección anti-spam.'))
  if (window.grecaptcha?.enterprise) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('grecaptcha-script') as HTMLScriptElement | null
    const script = existing || document.createElement('script')
    const timeout = window.setTimeout(() => reject(new Error('La protección anti-spam tardó demasiado en cargar.')), 10_000)
    script.addEventListener('load', () => { window.clearTimeout(timeout); resolve() }, { once: true })
    script.addEventListener('error', () => { window.clearTimeout(timeout); reject(new Error('No pudimos cargar la protección anti-spam.')) }, { once: true })
    if (!existing) {
      script.id = 'grecaptcha-script'
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }).catch((error) => { scriptPromise = null; throw error })

  return scriptPromise
}

export async function executeRecaptcha(action: string) {
  await loadRecaptcha()
  if (!siteKey || !window.grecaptcha?.enterprise) throw new Error('No pudimos iniciar la protección anti-spam.')
  return new Promise<string>((resolve, reject) => {
    window.grecaptcha!.enterprise.ready(() => {
      window.grecaptcha!.enterprise.execute(siteKey, { action }).then(resolve).catch(() => reject(new Error('No pudimos completar la protección anti-spam.')))
    })
  })
}
