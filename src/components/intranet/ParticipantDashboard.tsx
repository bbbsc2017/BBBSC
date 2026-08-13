import { useEffect, useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, GraduationCap, History, IdCard, Languages, Mail, MapPin, Phone, School, Sparkles, UserRound } from 'lucide-react'
import { offerPath } from '../../lib/offers'
import { formatPanelDate, requestJson, type SessionUser } from './shared'

interface ParticipantProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  studentCode: string | null
  photoUrl: string | null
  profileLabel: string | null
  createdAt: string | null
  guruName: string | null
  personalInfo: {
    phone: string | null
    documentNumber: string | null
    birthDate: string | null
    city: string | null
    englishLevel: string | null
    university: string | null
    academicProgram: string | null
  }
}

interface DashboardOffer {
  id: number
  slug: string
  title: string
  program: string
  sponsor: string
  employer: string
  city: string
  state: string
  compensationLabel?: string
}

interface Application {
  id: number
  appliedAt: string
  source: 'participant' | 'admin'
  offer: DashboardOffer
}

interface HistoryItem {
  id: number
  eventType: 'applied' | 'assigned' | 'removed_returned' | 'removed_lost'
  note: string | null
  createdAt: string
  offer: DashboardOffer | null
}

interface ParticipantDashboardData {
  participant: ParticipantProfile
  application: Application | null
  history: HistoryItem[]
}

const historyLabels: Record<HistoryItem['eventType'], string> = {
  applied: 'Aplicaste a la oferta',
  assigned: 'Oferta asignada por el equipo BBBSC',
  removed_returned: 'Oferta retirada · vacante devuelta',
  removed_lost: 'Oferta retirada · vacante cerrada',
}

function displayDate(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function ProfileDetail({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string | null }) {
  return <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand"><Icon className="size-4" /></span>
    <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/30">{label}</p><p className={`mt-1 break-words text-sm font-semibold ${value ? 'text-white/80' : 'text-white/30'}`}>{value || 'Sin registrar'}</p></div>
  </div>
}

function ProfileSkeleton() {
  return <div className="grid animate-pulse gap-6 xl:grid-cols-[.8fr_1.2fr]"><div className="h-72 rounded-3xl bg-white/5" /><div className="h-72 rounded-3xl bg-white/5" /><div className="h-64 rounded-3xl bg-white/5 xl:col-span-2" /></div>
}

export function ParticipantDashboard({ user }: { user: SessionUser }) {
  const [data, setData] = useState<ParticipantDashboardData | null>(null)
  const [error, setError] = useState('')
  const [photoFailed, setPhotoFailed] = useState(false)

  useEffect(() => {
    requestJson('/api/participant/dashboard')
      .then(setData)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'No pudimos cargar tu perfil.'))
  }, [])

  if (error) return <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.06] p-7"><AlertTriangle className="size-7 text-red-300" /><h2 className="mt-4 text-xl font-black">No pudimos cargar tu perfil</h2><p className="mt-2 text-sm text-white/55">{error}</p></section>
  if (!data) return <ProfileSkeleton />

  const { participant, application, history } = data
  const fullName = `${participant.firstName || user.firstName} ${participant.lastName || user.lastName}`.trim()
  const initials = `${participant.firstName?.[0] || user.firstName?.[0] || ''}${participant.lastName?.[0] || user.lastName?.[0] || ''}`.toUpperCase() || 'BB'

  return <div className="flex flex-col gap-6">
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        {participant.photoUrl && !photoFailed ? <img src={participant.photoUrl} alt={`Foto de ${fullName}`} onError={() => setPhotoFailed(true)} className="size-28 shrink-0 rounded-3xl border-2 border-brand/40 object-cover shadow-brand sm:size-32" /> : <span className="flex size-28 shrink-0 items-center justify-center rounded-3xl border border-brand/25 bg-brand/10 text-3xl font-black text-brand sm:size-32">{initials}</span>}
        <div className="min-w-0 flex-1"><p className="text-[11px] font-black uppercase tracking-[.25em] text-brand">Perfil del participante</p><h2 className="mt-3 break-words text-2xl font-black sm:text-4xl">{fullName}</h2><p className="mt-2 break-all text-sm text-white/45">{participant.email}</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">{participant.profileLabel || 'Participante BBBSC'}</span>{participant.studentCode && <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/55">Código {participant.studentCode}</span>}{participant.guruName && <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs font-semibold text-emerald-300">Gurú: {participant.guruName}</span>}</div></div>
      </div>
    </section>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
      <section className="rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-6">
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><UserRound className="size-5" /></span><div><h2 className="font-black">Información personal</h2><p className="mt-0.5 text-xs text-white/35">Datos vinculados con tu cuenta BBBSC.</p></div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ProfileDetail icon={Mail} label="Correo" value={participant.email} />
          <ProfileDetail icon={Phone} label="Teléfono" value={participant.personalInfo.phone} />
          <ProfileDetail icon={IdCard} label="Documento" value={participant.personalInfo.documentNumber} />
          <ProfileDetail icon={CalendarDays} label="Fecha de nacimiento" value={displayDate(participant.personalInfo.birthDate)} />
          <ProfileDetail icon={MapPin} label="Ciudad" value={participant.personalInfo.city} />
          <ProfileDetail icon={Languages} label="Nivel de inglés" value={participant.personalInfo.englishLevel} />
          <ProfileDetail icon={School} label="Universidad" value={participant.personalInfo.university} />
          <ProfileDetail icon={GraduationCap} label="Programa académico" value={participant.personalInfo.academicProgram} />
        </div>
      </section>

      <section className={`rounded-3xl border p-5 sm:p-6 ${application ? 'border-emerald-400/20 bg-emerald-400/[0.055]' : 'border-brand/25 bg-brand/[0.055]'}`}>
        {application ? <>
          <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><CheckCircle2 className="size-6" /></span><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-emerald-300">Oferta seleccionada</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Ya escogiste tu oferta</h2><p className="mt-2 text-sm leading-6 text-white/60">Ponte en contacto con {participant.guruName ? <strong className="text-white">{participant.guruName}, tu gurú asignado</strong> : <strong className="text-white">tu gurú asignado</strong>} para que te guíe con el agendamiento de la entrevista con el sponsor y el empleador.</p></div></div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#1c1c1c]/55 p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-brand">{application.offer.sponsor}</p><h3 className="mt-2 text-lg font-black">{application.offer.title}</h3><p className="mt-1 text-sm text-white/55">{application.offer.employer}</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45"><span className="inline-flex items-center"><MapPin className="mr-1.5 size-3.5 text-brand" />{application.offer.city}, {application.offer.state}</span><span className="inline-flex items-center"><CalendarDays className="mr-1.5 size-3.5 text-brand" />Elegida {formatPanelDate(application.appliedAt)}</span></div>{application.offer.compensationLabel && <p className="mt-3 text-sm font-bold text-white/70">{application.offer.compensationLabel}</p>}<Link to={offerPath(application.offer as Parameters<typeof offerPath>[0])} className="mt-5 inline-flex items-center rounded-full border border-brand/35 px-4 py-2.5 text-xs font-black text-brand transition hover:bg-brand hover:text-white">Revisar oferta<ArrowRight className="ml-2 size-4" /></Link></div>
        </> : <>
          <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white"><Clock3 className="size-6" /></span><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-brand">Selección pendiente</p><h2 className="mt-2 text-xl font-black sm:text-2xl">Aún no has escogido una oferta</h2><p className="mt-2 text-sm leading-6 text-white/60">Te recomendamos no demorarte en escogerla. Las vacantes son limitadas y, si esperas demasiado, puede ser demasiado tarde para aplicar a la oportunidad que prefieres.</p></div></div>
          <div className="mt-6 rounded-2xl border border-brand/15 bg-[#1c1c1c]/45 p-5"><Sparkles className="size-5 text-brand" /><p className="mt-3 text-sm font-bold">Revisa cuidadosamente las condiciones antes de decidir.</p><p className="mt-1 text-xs leading-5 text-white/40">Recuerda que solo puedes mantener una oferta activa.</p><Link to="/ofertas" className="mt-5 inline-flex items-center rounded-full bg-brand px-5 py-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400">Explorar ofertas<ArrowRight className="ml-2 size-4" /></Link></div>
        </>}
      </section>
    </div>

    <section className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800">
      <div className="flex items-center gap-3 border-b border-white/10 p-5 sm:p-6"><span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><History className="size-5" /></span><div><h2 className="font-black">Historial de aplicaciones</h2><p className="mt-0.5 text-xs text-white/35">Registro de las ofertas que has elegido, recibido o retirado.</p></div></div>
      {history.length ? <div className="divide-y divide-white/[0.07]">{history.map((item) => <article key={item.id} className="flex gap-4 p-5 sm:p-6"><span className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-full ${item.eventType.startsWith('removed') ? 'bg-red-400/10 text-red-300' : 'bg-emerald-400/10 text-emerald-300'}`}>{item.eventType.startsWith('removed') ? <AlertTriangle className="size-4" /> : <BriefcaseBusiness className="size-4" />}</span><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><h3 className="text-sm font-black text-white/80">{historyLabels[item.eventType]}</h3><time className="text-xs text-white/30">{formatPanelDate(item.createdAt)}</time></div><p className="mt-2 text-sm text-white/55">{item.offer ? `${item.offer.title} · ${item.offer.employer}` : 'Oferta eliminada'}</p>{item.offer && <p className="mt-1 text-xs text-white/35">{item.offer.sponsor} · {item.offer.city}, {item.offer.state}</p>}{item.note && <p className="mt-3 rounded-xl bg-white/[0.035] p-3 text-xs italic leading-5 text-white/45">{item.note}</p>}</div></article>)}</div> : <div className="p-8 text-center sm:p-12"><span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/5 text-white/25"><History className="size-6" /></span><h3 className="mt-4 font-black">Aún no tienes movimientos</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">Cuando elijas una oferta o el equipo BBBSC realice un cambio, aparecerá aquí para que siempre puedas consultar tu historial.</p></div>}
    </section>
  </div>
}
