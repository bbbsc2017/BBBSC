import { useEffect, useState, type FormEvent } from 'react'
import {
  BadgeDollarSign,
  CheckCircle2,
  Copy,
  Download,
  FileSignature,
  Gift,
  Send,
  Share2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { FormField, TextInput } from '../components/ui/FormField'
import { ProgramHero } from '../components/ui/ProgramHero'
import { RecaptchaNotice } from '../components/ui/RecaptchaNotice'
import { SubmittingOverlay } from '../components/ui/SubmittingOverlay'
import huntersHero from '../assets/hunters/hunters-hero.png'
import { apiCredentials, apiUrl } from '../lib/apiBase'
import { executeRecaptcha } from '../lib/recaptcha'
import bbbIcon from '../assets/logo/bbb-icon.svg'

const TERMS_URL = 'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhAdzzu06-KYCx1yEDivO0vlvlLdVJn47OmLpgUdOk8nZ3lcybsd2ne-IePHwUqlsiA*&hosted=false'
const emptyForm = { firstName: '', lastName: '', email: '', phone: '', cedula: '', applicantType: '', referrerCode: '' }
type ApplicantType = 'hunter' | 'referred'
type Status = 'idle' | 'submitting' | 'success' | 'error'

function loadCanvasImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No pudimos cargar el logo de BBB Student Center.'))
    image.src = source
  })
}

function fittedFontSize(context: CanvasRenderingContext2D, text: string, maxWidth: number, maximum: number, minimum: number, weight = 900, family = 'Arial, sans-serif') {
  let size = maximum
  while (size > minimum) {
    context.font = `${weight} ${size}px ${family}`
    if (context.measureText(text).width <= maxWidth) return size
    size -= 2
  }
  return minimum
}

async function createHunterCard(name: string, code: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No pudimos generar tu pieza Hunter.')

  const background = context.createLinearGradient(0, 0, 1080, 1080)
  background.addColorStop(0, '#10100f')
  background.addColorStop(0.58, '#24211a')
  background.addColorStop(1, '#0a0a09')
  context.fillStyle = background
  context.fillRect(0, 0, 1080, 1080)

  context.globalAlpha = 0.16
  context.fillStyle = '#f9b000'
  context.beginPath()
  context.arc(950, 95, 340, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.arc(70, 1020, 290, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 1

  const logo = await loadCanvasImage(bbbIcon)
  context.drawImage(logo, 72, 66, 104, 104)
  context.textAlign = 'left'
  context.fillStyle = '#ffffff'
  context.font = '800 34px Arial, sans-serif'
  context.fillText('BBB STUDENT CENTER', 198, 132)
  context.fillStyle = '#f9b000'
  context.font = '900 27px Arial, sans-serif'
  context.fillText('INVITACIÓN PERSONAL · INICIATIVA HUNTERS', 72, 252)
  context.fillStyle = '#ffffff'
  context.font = '900 72px Arial, sans-serif'
  context.fillText('TE INVITO A VIVIR', 72, 342)
  context.fillText('UNA EXPERIENCIA', 72, 420)
  context.fillText('INTERNACIONAL', 72, 498)
  context.fillStyle = 'rgba(255,255,255,.72)'
  context.font = '600 30px Arial, sans-serif'
  context.fillText('Quiero compartir contigo una oportunidad', 72, 568)
  context.fillText('de BBB Student Center.', 72, 608)

  context.fillStyle = 'rgba(255,255,255,.08)'
  context.beginPath()
  context.roundRect(72, 640, 936, 126, 30)
  context.fill()
  context.fillStyle = 'rgba(255,255,255,.55)'
  context.font = '700 22px Arial, sans-serif'
  context.fillText('UNA INVITACIÓN DE', 108, 686)
  const displayName = name.trim().toUpperCase().slice(0, 50) || 'TU HUNTER'
  const nameSize = fittedFontSize(context, displayName, 864, 42, 24, 900)
  context.font = `900 ${nameSize}px Arial, sans-serif`
  context.fillStyle = '#ffffff'
  context.fillText(displayName, 108, 734)

  context.fillStyle = '#f9b000'
  context.beginPath()
  context.roundRect(72, 798, 936, 164, 34)
  context.fill()
  context.fillStyle = '#171714'
  context.font = '900 23px Arial, sans-serif'
  context.fillText('USA MI CÓDIGO HUNTER AL REGISTRARTE', 108, 844)
  const codeSize = fittedFontSize(context, code, 864, 58, 32, 900, 'ui-monospace, SFMono-Regular, Menlo, monospace')
  context.font = `900 ${codeSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
  context.fillText(code, 108, 910)
  context.fillStyle = 'rgba(23,23,20,.7)'
  context.font = '700 21px Arial, sans-serif'
  context.fillText('bbbsc.com/hunters', 108, 946)

  context.fillStyle = 'rgba(255,255,255,.5)'
  context.font = '700 22px Arial, sans-serif'
  context.fillText('Tu próxima experiencia puede comenzar con una recomendación.', 72, 1020)

  return canvas.toDataURL('image/png', 1)
}

function dataUrlToFile(dataUrl: string, fileName: string) {
  const [metadata, content] = dataUrl.split(',')
  const mime = metadata.match(/data:(.*?);/)?.[1] ?? 'image/png'
  const bytes = atob(content)
  const buffer = new Uint8Array(bytes.length)
  for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index)
  return new File([buffer], fileName, { type: mime })
}

export default function Hunters() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [hunterCode, setHunterCode] = useState('')
  const [cardUrl, setCardUrl] = useState('')
  const [cardOpen, setCardOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const applicantType = form.applicantType as ApplicantType | ''

  useEffect(() => {
    if (!cardOpen && !termsOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [cardOpen, termsOpen])

  function update(key: keyof typeof emptyForm, value: string) {
    setStatus('idle')
    setErrorMessage('')
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  async function sendRegistration() {
    setStatus('submitting')
    setErrorMessage('')
    const recaptchaToken = await executeRecaptcha('hunters_registration')
    const response = await fetch(apiUrl('/api/web/forms/hunters'), {
      method: 'POST',
      credentials: apiCredentials,
      headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
      body: JSON.stringify({
        ...form,
        applicantType,
        referrerCode: applicantType === 'referred' ? form.referrerCode.trim().toUpperCase() : undefined,
      }),
    })
    const data = await response.json().catch(() => ({ ok: false }))
    if (!response.ok || !data.ok) throw new Error(data.message || data.error || 'No pudimos completar tu registro. Intenta nuevamente.')
    return String(data.hunterCode || '')
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!/^\d{5,15}$/.test(form.cedula)) {
      setStatus('error')
      setErrorMessage('Escribe la cédula únicamente con números, sin puntos ni espacios.')
      return
    }
    if (!applicantType) {
      setStatus('error')
      setErrorMessage('Selecciona si quieres registrarte como Hunter o como referido.')
      return
    }
    if (applicantType === 'referred' && !/^\d{5,15}SWT27$/i.test(form.referrerCode.trim())) {
      setStatus('error')
      setErrorMessage('El código del Hunter debe tener el formato 1234567890SWT27.')
      return
    }

    try {
      const code = await sendRegistration()
      if (applicantType === 'referred') {
        setHunterCode('')
        setStatus('success')
        setForm(emptyForm)
        return
      }
      const verifiedCode = code || `${form.cedula}SWT27`
      const image = await createHunterCard(`${form.firstName} ${form.lastName}`.trim(), verifiedCode)
      setHunterCode(verifiedCode)
      setCardUrl(image)
      setStatus('idle')
      setCardOpen(true)
    } catch (cause) {
      setStatus('error')
      setErrorMessage(cause instanceof Error ? cause.message : 'No pudimos completar tu registro. Intenta nuevamente.')
    }
  }

  function finishTerms() {
    setTermsOpen(false)
    setStatus('success')
    setForm(emptyForm)
  }

  function downloadCard() {
    const link = document.createElement('a')
    link.href = cardUrl
    link.download = `BBB-Hunter-${hunterCode}.png`
    link.click()
  }

  async function shareCard() {
    const file = dataUrlToFile(cardUrl, `BBB-Hunter-${hunterCode}.png`)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: 'Mi código BBB Hunter', text: `Usa mi código Hunter ${hunterCode}`, files: [file] })
      return
    }
    await copyCode()
  }

  async function copyCode() {
    await navigator.clipboard.writeText(hunterCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (status === 'success') {
    return (
      <>
        <Seo title="Hunters" description="Refiere nuevos participantes a BBB Student Center y gana por cada referido." path="/hunters/" />
        <section className="relative min-h-[70vh] overflow-hidden bg-ink-mesh py-24">
          <Container className="flex flex-col items-center gap-5 text-center">
            <span className="flex size-20 items-center justify-center rounded-3xl bg-brand text-ink shadow-brand"><CheckCircle2 className="size-10" /></span>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-brand">Registro completo</p>
            <h1 className="max-w-2xl text-4xl font-black text-white sm:text-5xl">¡Gracias por registrarte!</h1>
            <p className="max-w-xl text-balance text-lg text-white/65">Tu información fue registrada correctamente. Pronto nos comunicaremos contigo.</p>
            {hunterCode && <div className="rounded-2xl border border-brand/30 bg-brand/10 px-6 py-4"><p className="text-xs font-bold uppercase tracking-wider text-white/50">Tu código Hunter</p><p className="mt-1 font-mono text-xl font-black text-brand">{hunterCode}</p></div>}
            <button type="button" onClick={() => { setStatus('idle'); setHunterCode(''); setCardUrl('') }} className="mt-3 rounded-full bg-brand px-7 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5">Registrar otra persona</button>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title="Iniciativa Hunters" description="Refiere a familiares y amigos, gana dinero e impulsa tu próxima experiencia con BBB Student Center." path="/hunters/" image={huntersHero} imageAlt="Jóvenes compartiendo oportunidades de la iniciativa Hunters" />

      <ProgramHero
        eyebrow="Programa de referidos"
        title="Iniciativa Hunters"
        description="Haz que tus conexiones te acerquen a tu próxima experiencia. Refiere a familiares y amigos, gana dinero y avanza hacia el pago de tu programa con BBB Student Center."
        country="BBB Student Center"
        image={{ src: huntersHero, alt: 'Jóvenes compartiendo oportunidades de la iniciativa Hunters' }}
        requirements={['Refiere a familiares y amigos', 'Comparte tu código Hunter', 'Avanza hacia el pago de tu programa']}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Iniciativa Hunters' }]}
        primaryTo="#registro-hunters"
        primaryLabel="Quiero participar"
        secondaryTo="#como-funciona"
        secondaryLabel="Cómo funciona"
        requirementsLabel="Convierte tus conexiones en oportunidades"
      />

      <section id="como-funciona" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Users, 'Refiere', 'Invita a personas interesadas en vivir una experiencia internacional.'],
              [Share2, 'Comparte tu código', 'Recibe una pieza personalizada lista para descargar y compartir.'],
              [BadgeDollarSign, 'Gana dinero', 'Impulsa el pago de tu programa compartiendo la oportunidad con las personas que conoces.'],
            ].map(([Icon, title, text]) => {
              const CardIcon = Icon as typeof Users
              return <article key={String(title)} className="rounded-3xl border border-white/10 bg-ink-800 p-6"><CardIcon className="size-7 text-brand" /><h2 className="mt-5 text-xl font-black text-white">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-white/55">{String(text)}</p></article>
            })}
          </div>
        </Container>
      </section>

      <section id="registro-hunters" className="scroll-mt-24 pb-20">
        <Container className="grid items-start gap-8 lg:grid-cols-[.72fr_1.28fr]">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-[.2em] text-brand">Únete a la iniciativa</p>
            <h2 className="mt-3 text-4xl font-black text-white">Completa tu registro</h2>
            <p className="mt-4 text-base leading-7 text-white/60">Puedes postularte para recomendar personas como Hunter o registrarte usando el código de quien te refirió.</p>
            <div className="mt-6 space-y-3 text-sm text-white/60"><p className="flex items-center gap-3"><ShieldCheck className="size-5 shrink-0 text-brand" /> Tus datos se envían de forma segura.</p><p className="flex items-center gap-3"><Gift className="size-5 shrink-0 text-brand" /> El código Hunter se genera automáticamente.</p></div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-ink-800 p-5 shadow-2xl shadow-black/20 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Nombres" required><TextInput required autoComplete="given-name" placeholder="Escribe tus nombres" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} /></FormField>
              <FormField label="Apellidos" required><TextInput required autoComplete="family-name" placeholder="Escribe tus apellidos" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} /></FormField>
              <FormField label="Correo electrónico" required><TextInput required type="email" autoComplete="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => update('email', event.target.value)} /></FormField>
              <FormField label="Teléfono" required><TextInput required type="tel" autoComplete="tel" placeholder="300 000 0000" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></FormField>
              <FormField label="Cédula" required hint="Solo números, sin puntos ni espacios." className="sm:col-span-2"><TextInput required inputMode="numeric" pattern="[0-9]{5,15}" placeholder="1234567890" value={form.cedula} onChange={(event) => update('cedula', event.target.value.replace(/\D/g, '').slice(0, 15))} /></FormField>
            </div>

            <fieldset className="mt-7 border-t border-white/10 pt-7">
              <legend className="text-sm font-black text-white">¿Cómo quieres registrarte?</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ['hunter', 'Quiero ser Hunter', 'Recibiré mi código para referir personas.'],
                  ['referred', 'Soy referido de un Hunter', 'Tengo un código que quiero registrar.'],
                ].map(([value, title, description]) => (
                  <label key={value} className={`cursor-pointer rounded-2xl border p-4 transition ${applicantType === value ? 'border-brand bg-brand/10' : 'border-white/10 bg-white/[.025] hover:border-white/25'}`}>
                    <input type="radio" name="applicantType" value={value} checked={applicantType === value} onChange={() => update('applicantType', value)} className="sr-only" />
                    <span className="flex items-start gap-3"><span className={`mt-1 size-4 shrink-0 rounded-full border-2 ${applicantType === value ? 'border-brand bg-brand shadow-[inset_0_0_0_3px_#27251f]' : 'border-white/30'}`} /><span><strong className="block text-sm text-white">{title}</strong><span className="mt-1 block text-xs leading-5 text-white/50">{description}</span></span></span>
                  </label>
                ))}
              </div>
            </fieldset>

            {applicantType === 'referred' && <div className="mt-6"><FormField label="Código del Hunter" required hint="Escríbelo completo, por ejemplo: 1234567890SWT27."><TextInput required autoCapitalize="characters" placeholder="1234567890SWT27" value={form.referrerCode} onChange={(event) => update('referrerCode', event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 30))} /></FormField></div>}
            {status === 'error' && <p role="alert" className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300">{errorMessage}</p>}
            <div className="mt-7"><RecaptchaNotice /></div>
            <button type="submit" disabled={status === 'submitting'} className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-black text-ink transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"><Send className="size-4" />{status === 'submitting' ? 'Enviando…' : applicantType === 'hunter' ? 'Enviar y generar mi código' : 'Enviar registro'}</button>
          </form>
        </Container>
      </section>

      {cardOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="hunter-card-title">
          <section className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-ink-800 p-5 shadow-2xl sm:p-7">
            <div><p className="text-xs font-black uppercase tracking-[.2em] text-brand">Registro enviado · Tu código está listo</p><h2 id="hunter-card-title" className="mt-2 text-2xl font-black text-white">Comparte tu pieza Hunter</h2></div>
            {cardUrl && <img src={cardUrl} alt={`Pieza Hunter con el código ${hunterCode}`} className="mx-auto mt-5 aspect-square w-full max-w-md rounded-2xl border border-white/10" />}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={downloadCard} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-brand/50 hover:text-brand"><Download className="size-4" /> Descargar</button>
              <button type="button" onClick={() => void shareCard()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-brand/50 hover:text-brand"><Share2 className="size-4" /> Compartir</button>
              <button type="button" onClick={() => void copyCode()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-brand/50 hover:text-brand"><Copy className="size-4" /> {copied ? 'Copiado' : 'Copiar código'}</button>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6 text-center"><p className="mb-4 text-sm text-white/55">Para continuar debes abrir los términos y condiciones de Hunters.</p><button type="button" onClick={() => { setCardOpen(false); setTermsOpen(true) }} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5"><FileSignature className="size-4" /> Firmar términos y condiciones</button></div>
          </section>
        </div>
      )}

      {termsOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-2 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="hunter-terms-title">
          <section className="flex h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-ink-800 shadow-2xl">
            <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6"><div><p className="text-[10px] font-black uppercase tracking-widest text-brand">Adobe Acrobat Sign</p><h2 id="hunter-terms-title" className="text-sm font-black text-white sm:text-base">Términos y condiciones Hunters</h2></div><button type="button" onClick={finishTerms} className="rounded-full border border-white/10 p-2 text-white/60 hover:text-white" aria-label="Cerrar términos"><X className="size-5" /></button></header>
            <div className="min-h-0 flex-1 overflow-auto bg-white"><iframe src={TERMS_URL} title="Términos y condiciones de la iniciativa Hunters" className="block h-full min-h-[700px] w-full min-w-[600px] border-0" allow="clipboard-read; clipboard-write" referrerPolicy="strict-origin-when-cross-origin" /></div>
            <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:px-6"><p className="text-center text-xs text-white/50 sm:text-left">Puedes revisar o firmar el documento directamente en Adobe Acrobat Sign.</p><button type="button" onClick={finishTerms} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-black text-ink"><CheckCircle2 className="size-4" /> Cerrar y continuar</button></footer>
          </section>
        </div>
      )}

      <SubmittingOverlay show={status === 'submitting'} label="Enviando tu registro Hunter…" />
    </>
  )
}
