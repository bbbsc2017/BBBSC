import { useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  Gift,
  Loader2,
  MapPin,
  Plus,
  Plane,
  PartyPopper,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { RecaptchaNotice } from '../components/ui/RecaptchaNotice'
import { SubmittingOverlay } from '../components/ui/SubmittingOverlay'
import { apiCredentials, apiUrl } from '../lib/apiBase'
import { executeRecaptcha } from '../lib/recaptcha'

type Attendee = { firstName: string; lastName: string; email: string; phone: string }
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const eventImage = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=90'
const summerImage = 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=1200&q=90'
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
  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#202020] px-4 text-sm font-medium text-white outline-none transition placeholder:text-white/35 focus:border-[#f9b000] focus:ring-2 focus:ring-[#f9b000]/30'
  return (
    <fieldset className={`${isParticipant ? '' : 'border-t border-black/15 pt-6'} ${isParticipant ? '' : 'mt-2'}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-white/60">{isParticipant ? 'Tu registro' : `Invitado ${index}`}</p>
          <h3 className="mt-1 text-lg font-black text-white">{isParticipant ? 'Datos del participante' : 'Datos de tu acompañante'}</h3>
        </div>
        {onRemove && <button type="button" onClick={onRemove} className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:border-red-300/60 hover:bg-red-50/15 hover:text-white" aria-label={`Eliminar invitado ${index}`}><Trash2 className="size-4" /></button>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-white">Nombre <span className="text-white/60">*</span><input required className={inputClass} autoComplete="given-name" value={attendee.firstName} onChange={(event) => onChange('firstName', event.target.value)} placeholder="Nombre" /></label>
        <label className="text-sm font-bold text-white">Apellidos <span className="text-white/60">*</span><input required className={inputClass} autoComplete="family-name" value={attendee.lastName} onChange={(event) => onChange('lastName', event.target.value)} placeholder="Apellidos" /></label>
        <label className="text-sm font-bold text-white">Correo electrónico <span className="text-white/60">*</span><input required className={inputClass} type="email" autoComplete="email" value={attendee.email} onChange={(event) => onChange('email', event.target.value)} placeholder="correo@ejemplo.com" /></label>
        <label className="text-sm font-bold text-white">Teléfono <span className="text-white/60">*</span><input required className={inputClass} type="tel" autoComplete="tel" value={attendee.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="312 380 8387" /></label>
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
      <div className="absolute inset-0 -z-10 bg-[#1c1c1c]" />
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1c1c] shadow-2xl shadow-black/35">
          <img src={eventImage} alt="Participantes colombianos disfrutando una experiencia internacional" className="absolute inset-0 size-full object-cover object-center" fetchPriority="high" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,.94)_0%,rgba(28,28,28,.76)_45%,rgba(28,28,28,.32)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/65 to-transparent" />
          <div className="relative flex min-h-[590px] flex-col justify-end px-6 py-9 sm:min-h-[620px] sm:px-12 sm:py-12 lg:px-16">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-brand/45 bg-transparent px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-brand backdrop-blur-sm"><Sparkles className="size-3.5" /> Invitación exclusiva · Bucaramanga</p>
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
        <div className="border-y border-white/10 py-8 sm:py-10">
          <p className="text-center text-[10px] font-black uppercase tracking-[.22em] text-brand">Requisitos principales</p>
          <div className="mt-7 grid gap-7 sm:grid-cols-3 sm:gap-10">
            <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/30 text-brand"><Users className="size-4" /></span><div><p className="font-black text-white">Ser estudiante</p><p className="mt-1 text-sm leading-6 text-white/55">Estar matriculado en una institución de educación superior.</p></div></div>
            <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/30 text-brand"><Plane className="size-4" /></span><div><p className="font-black text-white">Inglés conversacional</p><p className="mt-1 text-sm leading-6 text-white/55">Tener el nivel necesario para comunicarte en tu trabajo y día a día.</p></div></div>
            <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand/30 text-brand"><CalendarDays className="size-4" /></span><div><p className="font-black text-white">Disponibilidad de verano</p><p className="mt-1 text-sm leading-6 text-white/55">Contar con el tiempo para vivir tu experiencia en Estados Unidos.</p></div></div>
          </div>
        </div>
      </Container>
    </section>

    <section className="pb-20 pt-4 sm:pb-32 sm:pt-10">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand">Una inauguración para recordar</p>
            <h2 className="mt-5 max-w-xl text-balance text-4xl font-black tracking-[-.055em] text-white sm:text-5xl">No vienes a escuchar la aventura. Vienes a sentir que ya comenzó.</h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-white/65">Una tarde para celebrar, comer rico, recibir sorpresas y conocer a quienes podrían compartir contigo una de las experiencias más memorables de tu vida universitaria.</p>
            <div className="mt-9 space-y-6">
              <div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><PartyPopper className="size-5" /></span><div><h3 className="font-black text-white">Una bienvenida que se siente</h3><p className="mt-1 text-sm leading-6 text-white/55">Sorpresas, regalos y una forma diferente de imaginar tu próximo verano.</p></div></div>
              <div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><Users className="size-5" /></span><div><h3 className="font-black text-white">Mejor con tu gente</h3><p className="mt-1 text-sm leading-6 text-white/55">Invita a un amigo o familiar y hagan de esta historia algo que puedan compartir.</p></div></div>
              <div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><Gift className="size-5" /></span><div><h3 className="font-black text-white">Un motivo extra para invitar</h3><p className="mt-1 text-sm leading-6 text-white/55">Recibes USD 50 de descuento cuando tu invitado nuevo se inscribe durante el evento y cumple los requisitos del programa.</p></div></div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-10 rounded-full bg-brand/15 blur-3xl" />
            <img src={summerImage} alt="Jóvenes disfrutando una experiencia de verano" loading="lazy" className="relative aspect-[4/3] w-full rounded-[2.5rem] object-cover shadow-2xl shadow-black/35" />
            <div className="absolute -bottom-5 left-5 max-w-[13rem] rounded-2xl border border-white/15 bg-[#1c1c1c]/75 p-4 backdrop-blur-md sm:left-8"><Camera className="size-5 text-brand" /><p className="mt-3 text-sm font-black text-white">Historias que comienzan juntas.</p></div>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-8 border-y border-white/10 py-9 sm:mt-28 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4"><CalendarDays className="mt-0.5 size-5 shrink-0 text-brand" /><div><p className="text-xs font-black uppercase tracking-[.18em] text-white/45">Cuándo</p><p className="mt-1 font-bold text-white">Fecha por confirmar · 4:00 p.m.</p></div></div>
          <div className="flex gap-4"><MapPin className="mt-0.5 size-5 shrink-0 text-brand" /><div><p className="text-xs font-black uppercase tracking-[.18em] text-white/45">Dónde</p><p className="mt-1 font-bold text-white">Colorworking · Oficinas BBB, Bucaramanga</p></div></div>
          <a href="#registro" className="inline-flex items-center gap-2 text-sm font-black text-brand transition hover:text-white">Quiero estar allí <ArrowRight className="size-4" /></a>
        </div>
      </Container>
    </section>

    <section id="registro" className="scroll-mt-20 pb-24 sm:pb-36">
      <Container>
        <div className="px-1 py-4 sm:px-0 sm:py-8">
          <div className="grid items-start gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-16">
            <div className="pt-2 lg:pt-8">
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#f9b000]">Registro de asistentes</p>
              <h2 className="mt-5 max-w-md text-balance text-4xl font-black leading-[.94] tracking-[-.055em] text-white sm:text-5xl">La pregunta no es si vas. Es con quién empiezas.</h2>
              <p className="mt-6 max-w-md text-pretty leading-7 text-white/65">Registra tu asistencia y la de las personas que quieres llevar contigo. Cada registro se gestiona de forma independiente para que podamos acompañarlos mejor.</p>
              <a href="/work-and-travel-usa" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#f9b000]/65 px-5 text-sm font-black text-[#f9b000] transition hover:border-[#f9b000] hover:bg-[#f9b000]/10 hover:text-white">Conoce Summer Work &amp; Travel USA <Plane className="size-4" /></a>
              <div className="mt-10 flex items-start gap-3 text-sm text-white/60"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#f9b000]" /><p>Tus datos están protegidos.</p></div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#2b2b2b] p-5 shadow-2xl shadow-black/20 sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[.22em] text-white/60">Journey Begins Bucaramanga</p>
              <h3 className="mt-2 text-3xl font-black tracking-[-.045em] text-white">Reserva tu lugar.</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">Completa tus datos y añade a tus invitados si vienes acompañado.</p>
              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <AttendeeFields attendee={participant} index={0} onChange={updateParticipant} />
              <div ref={guestSectionRef} className="space-y-4">
                {guests.map((guest, index) => <AttendeeFields key={index} attendee={guest} index={index + 1} onChange={(key, value) => updateGuest(index, key, value)} onRemove={() => setGuests((current) => current.filter((_, guestIndex) => guestIndex !== index))} />)}
                <button type="button" onClick={addGuest} disabled={guests.length >= 8} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#f9b000]/70 px-5 text-sm font-black text-[#f9b000] transition hover:bg-[#f9b000]/10 disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" /> {guests.length ? 'Agregar otro invitado' : 'Agregar un invitado'}</button>
                {guests.length >= 8 && <p className="text-center text-xs text-white/55">Puedes registrar hasta ocho invitados en un mismo envío.</p>}
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-white/75">
                <input type="checkbox" required checked={dataConsent} onChange={(event) => { setDataConsent(event.target.checked); setStatus('idle') }} className="mt-0.5 size-5 shrink-0 accent-[#f9b000]" />
                <span>Autorizo a BBB Student Center a recolectar y tratar mis datos personales para gestionar mi asistencia al evento, contactarme sobre Summer Work &amp; Travel USA 2027 y compartir información relacionada, de acuerdo con la <a href="/terminos-y-condiciones" target="_blank" rel="noreferrer" className="font-bold text-white underline underline-offset-2">política de tratamiento de datos</a>.</span>
              </label>
              <RecaptchaNotice />
              {status === 'error' && <p role="alert" className="rounded-xl border border-red-900/25 bg-red-900/10 px-4 py-3 text-sm font-medium text-red-900">{error}</p>}
              <button disabled={status === 'submitting'} className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#f9b000] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ffbe21] disabled:cursor-wait disabled:opacity-60">{status === 'submitting' ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}{status === 'submitting' ? 'Registrando asistencia…' : 'Confirmar mi asistencia'}</button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section className="-mt-12 pb-16 sm:-mt-20 sm:pb-24">
      <Container>
        <div className="ml-auto max-w-xl border-t border-white/10 pt-6">
          <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#f9b000]">Condiciones de la promoción</p>
          <p className="mt-3 text-xs leading-6 text-white/50">El descuento de USD 50 aplica solo durante el evento cuando el invitado es nuevo para BBB Student Center, se inscribe y cumple los requisitos del programa. No es acumulable con otras ofertas. Consulta los <a href="/terminos-y-condiciones" target="_blank" rel="noreferrer" className="font-bold text-white/75 underline underline-offset-2 transition hover:text-[#f9b000]">términos y condiciones completos</a>.</p>
        </div>
      </Container>
    </section>

    {guestPromptOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="guest-prompt-title">
      <div className="w-full max-w-lg rounded-[2rem] border border-brand/30 bg-[#222] p-7 shadow-2xl shadow-black/60 sm:p-9">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white"><Gift className="size-6" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-brand">Una oportunidad para compartir</p>
        <h2 id="guest-prompt-title" className="mt-3 text-balance text-3xl font-black tracking-[-.045em] text-white">No puedes perder esta oportunidad.</h2>
        <p className="mt-4 text-pretty leading-7 text-white/70">Trae a un amigo o familiar al evento. Recibes <strong className="font-black text-brand">USD 50 de descuento</strong> únicamente si es un participante nuevo, se inscribe durante el evento y cumple los requisitos del programa. No es acumulable con otras ofertas.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2"><button type="button" onClick={focusGuestSection} className="min-h-12 rounded-full bg-brand px-5 text-sm font-black text-white transition hover:bg-brand-400">Agregar invitado</button><button type="button" onClick={() => { setGuestPromptOpen(false); void submitRegistration() }} className="min-h-12 rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:border-white/40">Enviar sin invitado</button></div>
      </div>
    </div>}
    <SubmittingOverlay show={status === 'submitting'} label="Registrando asistentes…" />
  </>
}
