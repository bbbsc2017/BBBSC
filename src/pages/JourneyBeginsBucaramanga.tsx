import { useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Gift,
  Loader2,
  MapPin,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { FormField, TextInput } from '../components/ui/FormField'
import { RecaptchaNotice } from '../components/ui/RecaptchaNotice'
import { SubmittingOverlay } from '../components/ui/SubmittingOverlay'
import { apiCredentials, apiUrl } from '../lib/apiBase'
import { executeRecaptcha } from '../lib/recaptcha'

type Attendee = { firstName: string; lastName: string; email: string; phone: string }
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const eventImage = 'https://d25ltszcjeom5i.cloudfront.net/206553/aoztnyskdh/journey-begins-participantes-colombianos.png'
const storyImage = 'https://d25ltszcjeom5i.cloudfront.net/206553/jwklpqfmxt/b36aa274-d08e-4951-b6df-9fde086a0b0a.png'
const emptyAttendee = (): Attendee => ({ firstName: '', lastName: '', email: '', phone: '' })

function AttendeeFields({
  attendee,
  index,
  onChange,
  onRemove,
}: {
  attendee: Attendee
  index: number
  onChange: (key: keyof Attendee, value: string) => void
  onRemove?: () => void
}) {
  const isParticipant = index === 0
  return (
    <fieldset className={`rounded-3xl border p-5 sm:p-6 ${isParticipant ? 'border-brand/30 bg-brand/[0.06]' : 'border-white/10 bg-white/[0.035] backdrop-blur-sm'}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand">{isParticipant ? 'Tu registro' : `Invitado ${index}`}</p>
          <h3 className="mt-1 text-lg font-black text-white">{isParticipant ? 'Datos del participante' : 'Datos de tu acompañante'}</h3>
        </div>
        {onRemove && <button type="button" onClick={onRemove} className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-red-300/50 hover:bg-red-400/10 hover:text-red-200" aria-label={`Eliminar invitado ${index}`}><Trash2 className="size-4" /></button>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre" required><TextInput required autoComplete="given-name" value={attendee.firstName} onChange={(event) => onChange('firstName', event.target.value)} placeholder="Nombre" /></FormField>
        <FormField label="Apellidos" required><TextInput required autoComplete="family-name" value={attendee.lastName} onChange={(event) => onChange('lastName', event.target.value)} placeholder="Apellidos" /></FormField>
        <FormField label="Correo electrónico" required><TextInput required type="email" autoComplete="email" value={attendee.email} onChange={(event) => onChange('email', event.target.value)} placeholder="correo@ejemplo.com" /></FormField>
        <FormField label="Teléfono" required><TextInput required type="tel" autoComplete="tel" value={attendee.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="312 380 8387" /></FormField>
      </div>
    </fieldset>
  )
}

export default function JourneyBeginsBucaramanga() {
  const [participant, setParticipant] = useState<Attendee>(emptyAttendee)
  const [guests, setGuests] = useState<Attendee[]>([])
  const [dataConsent, setDataConsent] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [error, setError] = useState('')
  const [guestPromptOpen, setGuestPromptOpen] = useState(false)
  const guestSectionRef = useRef<HTMLDivElement>(null)

  function updateParticipant(key: keyof Attendee, value: string) {
    setParticipant((current) => ({ ...current, [key]: value }))
    setStatus('idle')
  }

  function updateGuest(index: number, key: keyof Attendee, value: string) {
    setGuests((current) => current.map((guest, guestIndex) => guestIndex === index ? { ...guest, [key]: value } : guest))
    setStatus('idle')
  }

  function addGuest() {
    if (guests.length >= 8) return
    setGuests((current) => [...current, emptyAttendee()])
    window.setTimeout(() => guestSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0)
  }

  function focusGuestSection() {
    setGuestPromptOpen(false)
    addGuest()
  }

  async function submitRegistration() {
    setStatus('submitting')
    setError('')
    try {
      const recaptchaToken = await executeRecaptcha('journey_begins_bucaramanga')
      const response = await fetch(apiUrl('/api/web/forms/journey-begins-bucaramanga'), {
        method: 'POST',
        credentials: apiCredentials,
        headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
        body: JSON.stringify({ participant, guests, dataConsent }),
      })
      const data = await response.json().catch(() => ({ ok: false }))
      if (!response.ok || !data.ok) throw new Error(data.message || data.error || 'No pudimos registrar tu asistencia. Intenta nuevamente.')
      setStatus('success')
    } catch (cause) {
      setStatus('error')
      setError(cause instanceof Error ? cause.message : 'No pudimos registrar tu asistencia. Intenta nuevamente.')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!dataConsent) {
      setStatus('error')
      setError('Debes aceptar la autorización de tratamiento de datos para continuar.')
      return
    }
    if (guests.length === 0) {
      setGuestPromptOpen(true)
      return
    }
    await submitRegistration()
  }

  if (status === 'success') {
    return <>
      <Seo title="Registro confirmado · Journey Begins Bucaramanga" description="Registro confirmado para Journey Begins Bucaramanga." path="/journey-begins-bucaramanga" noIndex />
      <section className="relative isolate min-h-[76vh] overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-ink-mesh" />
        <Container className="flex max-w-3xl flex-col items-center text-center">
          <span className="flex size-20 items-center justify-center rounded-[1.75rem] bg-brand text-white shadow-brand"><CheckCircle2 className="size-10" /></span>
          <p className="mt-7 text-xs font-black uppercase tracking-[.25em] text-brand">Registro confirmado</p>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-[-.05em] text-white sm:text-6xl">¡Tu Journey Begins aquí!</h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-white/65">Gracias por registrar tu asistencia. Te esperamos para comenzar juntos la aventura Summer Work & Travel USA 2027.</p>
          <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-brand/25 bg-brand/10 p-5"><Users className="size-5 text-brand" /><p className="mt-3 text-sm font-bold text-white">Asistencia registrada</p><p className="mt-1 text-sm leading-6 text-white/60">Tu información y la de tus invitados quedaron confirmadas.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Sparkles className="size-5 text-brand" /><p className="mt-3 text-sm font-bold text-white">Nos vemos pronto</p><p className="mt-1 text-sm leading-6 text-white/60">Te compartiremos los detalles finales del evento por los canales registrados.</p></div>
          </div>
        </Container>
      </section>
    </>
  }

  return <>
    <Seo title="Journey Begins Bucaramanga · Summer Work & Travel USA 2027" description="Registra tu asistencia a Journey Begins Bucaramanga, el comienzo de la aventura Summer Work & Travel USA 2027." path="/journey-begins-bucaramanga" image={eventImage} imageAlt="Participantes colombianos disfrutando una experiencia internacional" />

    <section className="relative isolate overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-12">
      <div className="absolute inset-0 -z-10 bg-ink-mesh" />
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1c1c] shadow-2xl shadow-black/35">
          <img src={eventImage} alt="Participantes colombianos disfrutando una experiencia internacional" className="absolute inset-0 size-full object-cover object-center" fetchPriority="high" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,.94)_0%,rgba(28,28,28,.76)_45%,rgba(28,28,28,.32)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/65 to-transparent" />
          <div className="relative flex min-h-[590px] flex-col justify-end px-6 py-9 sm:min-h-[620px] sm:px-12 sm:py-12 lg:px-16">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/35 bg-brand/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-brand backdrop-blur-md"><Sparkles className="size-3.5" /> Invitación exclusiva · Bucaramanga</p>
              <p className="mt-6 text-xs font-black uppercase tracking-[.25em] text-white/55">Summer Work & Travel USA · Season 2027</p>
              <h1 className="mt-4 text-balance text-5xl font-black leading-[.9] tracking-[-.065em] text-white sm:text-7xl">Journey<br /><span className="text-brand">Begins.</span></h1>
              <p className="mt-6 max-w-xl text-pretty text-base font-medium leading-7 text-white/75 sm:text-lg">El primer capítulo de tu aventura Summer Work &amp; Travel USA 2027 empieza aquí. Ven a celebrar y conectar con quienes vivirán esta historia contigo.</p>
              <a href="#registro" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400">Registrar mi asistencia <ArrowRight className="ml-2 size-4" /></a>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand">Una inauguración para recordar</p>
            <h2 className="mt-4 max-w-xl text-balance text-3xl font-black tracking-[-.045em] text-white sm:text-4xl">No vienes a escuchar la aventura. Vienes a sentir que ya comenzó.</h2>
            <p className="mt-4 max-w-2xl text-pretty leading-7 text-white/65">Una tarde para celebrar, comer rico, recibir sorpresas y mirar alrededor pensando: “nos vamos”. Conoce cómo Summer Work &amp; Travel USA puede convertir tu receso universitario en una experiencia internacional.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand p-5 text-white"><Gift className="size-5" /><p className="mt-5 text-lg font-black">Regalos para empezar</p><p className="mt-2 text-sm leading-6 text-white/85">Sorpresas preparadas para esta nueva temporada.</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><Users className="size-5 text-brand" /><p className="mt-5 text-lg font-black text-white">Francachela y comilona</p><p className="mt-2 text-sm leading-6 text-white/60">Porque las grandes aventuras también se celebran.</p></div>
            </div>
          </div>
          <aside className="rounded-[2rem] border border-brand/30 bg-gradient-to-br from-brand/15 to-white/[0.03] p-7 backdrop-blur-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand">Guarda el momento</p>
            <div className="mt-7 space-y-5">
              <div className="flex gap-4"><CalendarDays className="mt-0.5 size-5 shrink-0 text-brand" /><div><p className="font-bold text-white">Fecha por confirmar</p><p className="mt-1 text-sm text-white/60">4:00 p.m.</p></div></div>
              <div className="flex gap-4"><MapPin className="mt-0.5 size-5 shrink-0 text-brand" /><div><p className="font-bold text-white">Colorworking</p><p className="mt-1 text-sm text-white/60">Oficinas BBB · Bucaramanga</p></div></div>
            </div>
            <div className="mt-9 rounded-2xl border border-brand/30 bg-[#1c1c1c]/65 p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-brand">Beneficio del evento</p><p className="mt-3 text-lg font-black text-white">Invita a alguien especial.</p><p className="mt-2 text-sm leading-6 text-white/65">Si tu invitado se inscribe durante el evento, recibes <strong className="font-black text-brand">USD 50 de descuento</strong> en tu programa Summer Work &amp; Travel.</p></div>
          </aside>
        </div>
      </Container>
    </section>

    <section id="registro" className="scroll-mt-20 pb-20 pt-4 sm:pb-32 sm:pt-10">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.15fr)] lg:gap-14">
          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 backdrop-blur-sm lg:sticky lg:top-24">
            <div className="relative h-64 overflow-hidden sm:h-72 lg:h-64"><img src={storyImage} alt="Participante preparándose para su viaje internacional" loading="lazy" className="size-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/20 to-transparent" /><span className="absolute bottom-5 left-6 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-white backdrop-blur-md">Tu crew cambia todo</span></div>
            <div className="p-6 sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand">Summer Work &amp; Travel 2027</p>
              <h2 className="mt-3 text-balance text-3xl font-black leading-[.95] tracking-[-.05em] text-white">La pregunta no es si vas. Es con quién empiezas.</h2>
              <p className="mt-5 text-sm leading-7 text-white/65">Registra a las personas que te acompañarán en Journey Begins. Cada una recibirá un contacto independiente y sabrá que fue invitada por ti.</p>
              <div className="mt-7 grid gap-3">
                <div className="group flex gap-4 rounded-2xl bg-brand p-4 text-white transition duration-300 hover:-translate-y-1"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/25"><Gift className="size-5" /></span><div><p className="text-sm font-black">Un beneficio para compartir</p><p className="mt-1 text-xs leading-5 text-white/85">Si tu invitado se inscribe durante el evento, recibes USD 50 de descuento.</p></div></div>
                <div className="flex gap-4 rounded-2xl bg-black/20 p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand"><Sparkles className="size-5" /></span><div><p className="text-sm font-black text-white">Conoce tu programa</p><p className="mt-1 text-xs leading-5 text-white/60">Descubre requisitos, oportunidades y los siguientes pasos para viajar.</p><a href="/work-and-travel-usa" className="mt-3 inline-flex items-center gap-1 text-xs font-black text-brand transition hover:text-white">Ver Summer Work &amp; Travel <ArrowRight className="size-3.5" /></a></div></div>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold text-white/70"><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">Bucaramanga</span><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">Colorworking</span><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">4:00 p.m.</span></div>
            </div>
          </aside>

          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8 lg:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-brand/15 blur-3xl" />
            <div className="relative"><p className="text-[10px] font-black uppercase tracking-[.22em] text-brand">Registro de asistentes</p><h2 className="mt-3 text-balance text-3xl font-black tracking-[-.045em] text-white sm:text-4xl">Haz que el comienzo cuente.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Tus datos quedan en una tarjeta propia. Agrega a tus invitados solo si quieres compartir la experiencia.</p><span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white/65"><ShieldCheck className="size-4 text-brand" /> Datos protegidos</span></div>

            <form className="relative mt-7 space-y-5" onSubmit={handleSubmit}>
              <AttendeeFields attendee={participant} index={0} onChange={updateParticipant} />
              <div ref={guestSectionRef} className="space-y-4">
                {guests.map((guest, index) => <AttendeeFields key={index} attendee={guest} index={index + 1} onChange={(key, value) => updateGuest(index, key, value)} onRemove={() => setGuests((current) => current.filter((_, guestIndex) => guestIndex !== index))} />)}
                <button type="button" onClick={addGuest} disabled={guests.length >= 8} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-brand/45 bg-brand/[0.04] px-5 text-sm font-black text-brand transition hover:border-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" /> {guests.length ? 'Agregar otro invitado' : 'Agregar un invitado'}</button>
                {guests.length >= 8 && <p className="text-center text-xs text-white/45">Puedes registrar hasta ocho invitados en un mismo envío.</p>}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-brand/20 bg-brand/[0.05] p-5 text-sm leading-6 text-white/75">
                <input type="checkbox" required checked={dataConsent} onChange={(event) => { setDataConsent(event.target.checked); setStatus('idle') }} className="mt-0.5 size-5 shrink-0 accent-brand" />
                <span>Autorizo a BBB Student Center a recolectar y tratar mis datos personales para gestionar mi asistencia al evento, contactarme sobre Summer Work &amp; Travel USA 2027 y compartir información relacionada, de acuerdo con la <a href="/terminos-y-condiciones" target="_blank" rel="noreferrer" className="font-bold text-brand underline underline-offset-2">política de tratamiento de datos</a>.</span>
              </label>
              <RecaptchaNotice />
              {status === 'error' && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-200">{error}</p>}
              <button disabled={status === 'submitting'} className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400 disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}{status === 'submitting' ? 'Registrando asistencia…' : 'Confirmar mi asistencia'}</button>
            </form>
          </div>
        </div>
      </Container>
    </section>

    {guestPromptOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="guest-prompt-title">
      <div className="w-full max-w-lg rounded-[2rem] border border-brand/30 bg-[#222] p-7 shadow-2xl shadow-black/60 sm:p-9">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white"><Gift className="size-6" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-brand">Una oportunidad para compartir</p>
        <h2 id="guest-prompt-title" className="mt-3 text-balance text-3xl font-black tracking-[-.045em] text-white">No puedes perder esta oportunidad.</h2>
        <p className="mt-4 text-pretty leading-7 text-white/70">Trae a un amigo o familiar al evento. Si se inscribe, ganas <strong className="font-black text-brand">USD 50 de descuento</strong> en tu programa Summer Work &amp; Travel.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" onClick={focusGuestSection} className="min-h-12 rounded-full bg-brand px-5 text-sm font-black text-white transition hover:bg-brand-400">Agregar invitado</button><button type="button" onClick={() => { setGuestPromptOpen(false); void submitRegistration() }} className="min-h-12 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-white/40">Enviar sin invitado</button></div>
      </div>
    </div>}
    <SubmittingOverlay show={status === 'submitting'} label="Registrando asistentes…" />
  </>
}
