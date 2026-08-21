import { useState, type FormEvent } from 'react'
import { CheckCircle2, LockKeyhole, Send } from 'lucide-react'
import { Seo } from '../components/Seo'
import { ProgramHero } from '../components/ui/ProgramHero'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { FormField, FileInput, SelectInput, TextInput } from '../components/ui/FormField'
import { RecaptchaNotice } from '../components/ui/RecaptchaNotice'
import { SubmittingOverlay } from '../components/ui/SubmittingOverlay'
import { airlines } from '../data/airlines'
import { executeRecaptcha } from '../lib/recaptcha'
import { apiCredentials, apiUrl } from '../lib/apiBase'
import { whatsappLink } from '../lib/site'
import airportFlightHero from '../assets/travel/airport-flight-report-hero.png'

type Direction = 'ida' | 'regreso'

const copy: Record<Direction, { title: string; eyebrow: string; description: string; fechaLabel: string; numeroLabel: string; path: string; recaptchaAction: string; context: string; checklist: string[] }> = {
  ida: {
    title: 'Reporta tu vuelo de ida',
    eyebrow: 'Reporte de vuelos',
    description: 'Cuéntanos los datos de tu vuelo de ida y adjunta el PDF de tu itinerario para que quede registrado en tu proceso.',
    fechaLabel: 'Fecha de vuelo de ida',
    numeroLabel: 'Número del vuelo de ida',
    path: '/reporte-vuelo-ida/',
    recaptchaAction: 'reporte_vuelo_ida',
    context: 'Tu salida internacional',
    checklist: ['Ten a la mano tu itinerario', 'Adjunta el documento en PDF', 'Verifica la fecha y el número de vuelo'],
  },
  regreso: {
    title: 'Reporta tu vuelo de regreso',
    eyebrow: 'Reporte de vuelos',
    description: 'Cuéntanos los datos de tu vuelo de regreso y adjunta el PDF de tu itinerario para que quede registrado en tu proceso.',
    fechaLabel: 'Fecha de regreso',
    numeroLabel: 'Número de vuelo de regreso',
    path: '/reporte-vuelo-regreso/',
    recaptchaAction: 'reporte_vuelo_regreso',
    context: 'Tu regreso a Colombia',
    checklist: ['Ten a la mano tu itinerario', 'Adjunta el documento en PDF', 'Verifica la fecha y el número de vuelo'],
  },
}

const emptyForm = { numeroIdentificacion: '', firstName: '', lastName: '', email: '', phone: '', aerolinea: '', numeroVuelo: '', fecha: '' }

export default function ReportaVuelo({ direction }: { direction: Direction }) {
  const info = copy[direction]
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!file) {
      setStatus('error')
      setErrorMessage('Debes subir el PDF de tus vuelos.')
      return
    }
    setStatus('submitting')
    setErrorMessage('')

    try {
      const recaptchaToken = await executeRecaptcha(info.recaptchaAction)
      const body = new FormData()
      body.append('direction', direction)
      for (const [key, value] of Object.entries(form)) body.append(key, value)
      body.append('file', file)

      const response = await fetch(apiUrl('/api/web/forms/flight-report'), {
        method: 'POST',
        credentials: apiCredentials,
        headers: { 'x-recaptcha-token': recaptchaToken },
        body,
      })
      const data = await response.json().catch(() => ({ ok: false }))
      if (!response.ok || !data.ok) throw new Error(data.error || 'No pudimos enviar tu reporte. Intenta de nuevo.')
      setStatus('success')
      setForm(emptyForm)
      setFile(null)
    } catch (cause) {
      setStatus('error')
      setErrorMessage(cause instanceof Error ? cause.message : 'No pudimos enviar tu reporte. Intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Seo title={info.title} description={info.description} path={info.path} noIndex />
        <section className="relative overflow-hidden bg-ink-mesh py-24">
          <Container className="flex flex-col items-center gap-5 text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-white"><CheckCircle2 className="size-8" /></span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">¡Reporte recibido!</h1>
            <p className="max-w-md text-balance text-white/70">Gracias por reportar tu vuelo. Un asesor validará la información y tu documento.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <CTAButton to="/">Volver al inicio</CTAButton>
              <CTAButton href={whatsappLink('¡Hola! Tengo una pregunta sobre mi reporte de vuelo.')} icon={false} variant="ghost">Escríbenos por WhatsApp</CTAButton>
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo title={info.title} description={info.description} path={info.path} noIndex />
      <ProgramHero
        eyebrow={info.eyebrow}
        title={info.title}
        description={info.description}
        country={info.context}
        image={{ src: airportFlightHero, alt: 'Avión en un aeropuerto internacional al atardecer' }}
        requirements={info.checklist}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: info.title }]}
        primaryTo="#formulario-reporte"
        primaryLabel="Completar reporte"
        secondaryTo="#formulario-reporte"
        secondaryLabel="Ver qué necesitas"
        requirementsLabel="Antes de enviar"
      />

      <section id="formulario-reporte" className="scroll-mt-24 py-8 sm:py-12">
        <Container className="max-w-3xl">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-ink-800 p-5 shadow-2xl shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-brand">Datos personales</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Número de identificación" required>
                    <TextInput required inputMode="numeric" placeholder="Número de identificación" value={form.numeroIdentificacion} onChange={(event) => update('numeroIdentificacion', event.target.value)} />
                  </FormField>
                  <FormField label="Correo" required>
                    <TextInput required type="email" autoComplete="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => update('email', event.target.value)} />
                  </FormField>
                  <FormField label="Nombres" required>
                    <TextInput required autoComplete="given-name" placeholder="Escribe tus nombres" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
                  </FormField>
                  <FormField label="Apellidos" required>
                    <TextInput required autoComplete="family-name" placeholder="Escribe tus apellidos" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
                  </FormField>
                  <FormField label="Teléfono" required hint="Incluye el indicativo del país." className="sm:col-span-2">
                    <TextInput required type="tel" autoComplete="tel" placeholder="+57 300 000 0000" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
                  </FormField>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-brand">Datos del vuelo</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Aerolínea" required>
                    <SelectInput required placeholder="Selecciona aerolínea" value={form.aerolinea} onChange={(event) => update('aerolinea', event.target.value)}>
                      {airlines.map((airline) => <option key={airline} value={airline}>{airline}</option>)}
                    </SelectInput>
                  </FormField>
                  <FormField label={info.numeroLabel} required>
                    <TextInput required placeholder="Ej: AV0025" value={form.numeroVuelo} onChange={(event) => update('numeroVuelo', event.target.value)} />
                  </FormField>
                  <FormField label={info.fechaLabel} required className="sm:col-span-2">
                    <TextInput required type="date" value={form.fecha} onChange={(event) => update('fecha', event.target.value)} />
                  </FormField>
                </div>
              </div>

              <FormField label="Sube tu documento" required hint="En este campo debes subir el PDF de tus vuelos.">
                <FileInput required file={file} onChange={setFile} />
              </FormField>

              {status === 'error' && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300">{errorMessage}</p>}
              <RecaptchaNotice />
              <p className="flex items-center gap-2 text-xs text-white/45"><LockKeyhole className="size-4 text-brand" /> Tus datos y tu documento se envían de forma segura.</p>

              <button type="submit" disabled={status === 'submitting'} className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-brand px-7 text-sm font-bold text-white shadow-brand transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="size-4" /> {status === 'submitting' ? 'Enviando…' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        </Container>
      </section>
      <SubmittingOverlay show={status === 'submitting'} label="Enviando tu reporte…" />
    </>
  )
}
