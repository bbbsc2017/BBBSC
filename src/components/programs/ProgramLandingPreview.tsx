import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, BriefcaseBusiness, CalendarDays, CircleDollarSign, Clock3, FileCheck2, FileText, GraduationCap, Languages, Plane, Sparkles, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CulturalProgram } from '../../data/culturalPrograms'
import { Container } from '../ui/Container'
import { InterestForm } from '../ui/InterestForm'
import { ProgramFAQ } from '../ui/ProgramFAQ'
import { whatsappLink } from '../../lib/site'

const reasonIcons = [BriefcaseBusiness, Languages, Plane]
const requirementIcons = { Edad: CalendarDays, Idiomas: Languages, 'Nivel académico': GraduationCap, Duración: Clock3 }
const detailIcons = [FileCheck2, Sparkles, CircleDollarSign, WalletCards]
const topicVisuals = {
  'Cómo funciona': { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80', alt: 'Estudiantes conversando y planificando juntos' },
  Documentos: { src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80', alt: 'Documentos preparados sobre un escritorio' },
  'Datos clave': { src: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&q=80', alt: 'Personas revisando información importante' },
  'Planea tu viaje': { src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80', alt: 'Avión en vuelo visto desde una ventana' },
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`${className} transition-[opacity,transform] duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>{children}</div>
}

export function ProgramRequirementsStrip({ requirements }: { requirements: CulturalProgram['requirements'] }) {
  return (
    <Reveal><section className="pb-4 sm:pb-6">
      <Container>
        <div className="rounded-[1.75rem] bg-white/[.035] px-5 py-6 shadow-[0_16px_50px_-32px_rgba(0,0,0,0.75)] backdrop-blur-lg sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-brand">Requisitos principales</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {requirements.slice(0, 4).map((requirement) => {
              const Icon = requirementIcons[requirement.label as keyof typeof requirementIcons] ?? FileCheck2
              return <div key={requirement.label + requirement.value} className="flex gap-3 rounded-2xl bg-white/[.025] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[.065]">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand"><Icon className="size-4" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/45">{requirement.label}</p><p className="mt-1 text-sm font-semibold leading-snug text-white/85">{requirement.value}</p></div>
              </div>
            })}
          </div>
        </div>
      </Container>
    </section></Reveal>
  )
}

export function ProgramLandingPreview({ program, registrationTo }: { program: CulturalProgram; registrationTo?: string }) {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [rotationKey, setRotationKey] = useState(0)
  const isWinterGermany = program.slug === 'work-and-travel-alemania'
  const coreFeatureItems = [
    { title: 'Cómo funciona', eyebrow: 'Duración y requisitos', Icon: FileCheck2, copy: `La experiencia dura ${program.duration.charAt(0).toLowerCase() + program.duration.slice(1)} y se realiza durante el receso oficial de tu universidad.`, details: program.requirements.filter((item) => item.label !== 'Duración').map((item) => `${item.label}: ${item.value}.`), note: undefined },
    { title: 'Tu experiencia', eyebrow: 'Beneficios y acompañamiento', Icon: Sparkles, copy: `Conoce los beneficios y el acompañamiento que hacen parte de tu experiencia en ${program.country}.`, details: program.benefits, note: program.jobExamplesNote },
    { title: 'Datos clave', eyebrow: 'Información importante', Icon: CircleDollarSign, copy: isWinterGermany ? 'Estas son las referencias económicas y de jornada del programa. Los valores de salario son brutos, antes de impuestos y gastos personales.' : 'Aquí encuentras las condiciones más importantes para entender cómo funciona el programa.', details: program.keyFacts, note: isWinterGermany ? 'Las 173 horas mensuales corresponden al promedio registrado en invierno de 2026; no son una cantidad garantizada. Las horas adicionales dependen de la demanda y los turnos disponibles.' : undefined },
    { title: 'Planea tu viaje', eyebrow: 'Antes de empezar', Icon: WalletCards, copy: 'Organiza tu presupuesto y confirma con tu asesor los costos y pasos que aplican a tu perfil.', details: program.planningCosts?.map((cost) => `${cost.label}: ${cost.amount}${cost.detail ? ` · ${cost.detail}` : ''}.`) ?? ['Recibe orientación personalizada sobre la inversión y los documentos de tu proceso.'], note: isWinterGermany ? 'Los tiquetes son un valor aproximado y el dinero de bolsillo es una recomendación. Reserva los vuelos cuando BBBSC y la empresa confirmen tu asignación. Consulta con tu asesor cómo se aplica el seguro a la tarifa del programa.' : 'Los valores y requisitos pueden variar según tu perfil, la fecha de viaje y la disponibilidad.' },
  ]
  const germanyDocuments = { title: 'Documentos', eyebrow: 'Lo que debes preparar', Icon: FileText, copy: 'Ten estos documentos listos para avanzar en tu postulación. Verifica que estén legibles y vigentes antes de enviarlos.', details: ['Foto del participante, profesional y con fondo de color plano.', 'Términos y condiciones del sponsor debidamente firmados.', 'Pasaporte vigente escaneado.', 'Certificado académico original y su traducción al inglés.'], note: undefined }
  const featureItems = isWinterGermany ? [coreFeatureItems[0], germanyDocuments, ...coreFeatureItems.slice(1)] : coreFeatureItems
  const activeFeature = featureItems[selectedFeature]
  const ActiveFeatureIcon = activeFeature.Icon
  const activeVisual = activeFeature.title === 'Tu experiencia'
    ? { src: program.image.src, alt: program.image.alt }
    : topicVisuals[activeFeature.title as keyof typeof topicVisuals] ?? { src: program.image.src, alt: program.image.alt }
  const reasons = [
    ['Experiencia internacional real', 'Conecta tu perfil académico con un entorno laboral y cultural diferente.'],
    ['Acompañamiento en tu proceso', 'Prepárate con orientación antes de viajar y durante tus primeros pasos.'],
    ['Un programa pensado para ti', 'Conoce las condiciones, tiempos y requisitos antes de tomar tu decisión.'],
  ]
  const price = program.pricing?.price

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setSelectedFeature((current) => (current + 1) % featureItems.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [featureItems.length, rotationKey])

  return (
    <div id="contenido-programa" className="scroll-mt-24 pb-20 pt-16 sm:pt-20">
      <Container className="flex flex-col gap-24 sm:gap-36 lg:gap-44">
        <Reveal className="mx-auto max-w-3xl text-center">
          <section>
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-brand">Conoce la experiencia</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">Más que un viaje: una oportunidad para crecer.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65">{program.description}</p>
          </section>
        </Reveal>

        <section>
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[.24em] text-brand">Lo más importante</p><h2 className="mt-3 text-3xl font-black text-white">Todo lo que necesitas saber.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-white/65">Consulta los requisitos, las condiciones de trabajo y el presupuesto para tu viaje.</p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-[58px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <div className="flex flex-col gap-1 py-2 sm:py-4" role="tablist" aria-label="Temas del programa">
              {featureItems.map((feature, index) => {
                const Icon = feature.Icon
                const isActive = selectedFeature === index
                return <button key={feature.title} id={`program-topic-${index}`} type="button" role="tab" aria-selected={isActive} aria-controls="program-topic-content" onClick={() => { setSelectedFeature(index); setRotationKey((key) => key + 1) }} className={`group flex min-h-14 items-center justify-center gap-2 bg-transparent py-3 text-left transition-all duration-300 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:min-h-16 sm:justify-start sm:gap-3 ${isActive ? 'text-brand' : 'text-white/55 hover:text-white'}`}>
                  <span className="hidden text-xs font-semibold tabular-nums opacity-65 sm:inline">0{index + 1}</span><span className="text-[10px] font-semibold tabular-nums opacity-65 sm:hidden">0{index + 1}</span><Icon aria-hidden="true" className="size-4 shrink-0 sm:size-5" /><span className="hidden text-sm font-bold leading-tight sm:inline">{feature.title}</span><span className="sr-only sm:hidden">{feature.title}</span><ArrowRight aria-hidden="true" className={`ml-auto hidden size-4 shrink-0 transition-opacity lg:block ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              })}
            </div>
            <article id="program-topic-content" role="tabpanel" aria-labelledby={`program-topic-${selectedFeature}`} className="relative min-w-0 overflow-hidden rounded-[1.5rem] bg-white/[.035] p-5 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:min-h-[360px] sm:rounded-[1.75rem] sm:p-8 lg:p-9">
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-52 rounded-full bg-brand/18 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-20 left-1/4 size-40 rounded-full bg-white/5 blur-3xl" />
              <div key={activeFeature.title} className="relative grid gap-6 animate-[fadeInUp_0.35s_ease-out] xl:grid-cols-[minmax(0,1fr)_130px]">
                <div><span className="text-[10px] font-black uppercase tracking-[.18em] text-brand">{activeFeature.eyebrow}</span><h3 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">{activeFeature.title}</h3><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">{activeFeature.copy}</p>
                  <ul className="mt-7 grid gap-4 lg:grid-cols-2">{activeFeature.details.map((detail, index) => { const DetailIcon = detailIcons[index % detailIcons.length]; return <li key={detail} className="flex gap-3 text-sm leading-relaxed text-white/80"><span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand"><DetailIcon className="size-3.5" /></span>{detail}</li> })}</ul>
                  {activeFeature.note && <p className="mt-6 text-sm leading-relaxed text-white/65">{activeFeature.note}</p>}
                </div>
                <div className="relative hidden pt-2 xl:block"><div className="animate-float overflow-hidden rounded-[1.25rem] opacity-75 shadow-xl shadow-black/25 -rotate-3"><img src={activeVisual.src} alt={activeVisual.alt} loading="lazy" className="aspect-[3/4] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" /><span className="absolute inset-x-3 bottom-3 text-[9px] font-black uppercase tracking-[.16em] text-white">{program.country}</span></div><span aria-hidden="true" className="absolute -right-3 -top-2 flex size-9 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20"><ActiveFeatureIcon className="size-4" /></span></div>
              </div>
            </article>
            </div>
          </div>
        </section>

        <Reveal><section>
          <div className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-black uppercase tracking-[.24em] text-brand">Por qué elegirlo</p><h2 className="mt-3 text-3xl font-black text-white">Una experiencia que suma a tu historia.</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reasons.map(([title, copy], index) => { const Icon = reasonIcons[index]; return <article key={title} className="group rounded-[1.5rem] bg-white/[.035] p-6 transition duration-300 hover:-translate-y-1.5 hover:bg-white/[.075] hover:shadow-xl hover:shadow-black/15"><span className="flex size-11 items-center justify-center rounded-2xl bg-brand/12 text-brand transition-transform duration-300 group-hover:scale-110"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p></article> })}
          </div>
          {program.jobExamples && <div className="mt-10 flex flex-wrap justify-center gap-2">{program.jobExamples.map((job) => <span key={job} className="rounded-full bg-white/[.055] px-3 py-2 text-xs font-semibold text-white/65 transition duration-300 hover:-translate-y-0.5 hover:bg-brand/15 hover:text-white">{job}</span>)}</div>}
        </section></Reveal>

        <Reveal><section id="inscripcion" className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[.82fr_1.18fr] lg:gap-16">
            <div className="self-center"><Sparkles className="size-7 text-brand" /><p className="mt-6 text-[10px] font-black uppercase tracking-[.24em] text-brand">Tu siguiente paso</p><h2 className="mt-3 text-4xl font-black leading-[.95] text-white">Tu próxima experiencia puede empezar hoy.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">Conoce la inversión, recibe orientación y empieza tu proceso con un asesor.</p>
              {price && <div className="mt-8 inline-flex items-end gap-3"><div><p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Inversión desde</p><p className="mt-1 text-5xl font-black text-brand">{price.amount}</p></div>{price.originalAmount && <p className="mb-1 text-sm font-bold text-white/40 line-through">{price.originalAmount}</p>}</div>}
              {program.pricing?.items && <ul className="mt-6 space-y-2">{program.pricing.items.map((item) => <li key={item} className="flex gap-2 text-sm text-white/70"><span className="text-brand">✓</span>{item}</li>)}</ul>}
              {program.pricing?.note && <p className="mt-5 max-w-md text-xs leading-relaxed text-white/60">{program.pricing.note}</p>}
            </div>
            <div className="rounded-[1.75rem] bg-white/[.035] p-6 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-8"><p className="text-lg font-black text-white">¿Listo para recibir información?</p><p className="mt-2 text-sm leading-relaxed text-white/60">{registrationTo ? 'Inicia tu inscripción en el formulario completo del programa.' : 'Déjanos tus datos y un asesor te contará cómo iniciar.'}</p>{registrationTo ? <div className="mt-6"><Link to={registrationTo} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400">Iniciar inscripción <ArrowRight className="ml-2 size-4" /></Link></div> : <div className="mt-6"><InterestForm formKey={`cultural_${program.slug}`} programTitle={program.title} interestTag={`interesado_${program.slug.replaceAll('-', '_')}`} /></div>}<a className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-white" href={whatsappLink(`¡Hola! Quiero más información sobre ${program.title}.`)}>Prefiero escribir por WhatsApp <ArrowRight className="size-4" /></a></div>
          </div>
        </section></Reveal>

        <Reveal><section className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-brand">Preguntas frecuentes</p><h2 className="mt-4 text-3xl font-black leading-tight text-white">Resuelve tus dudas antes de empezar.</h2><p className="mt-4 text-sm leading-relaxed text-white/60">Aquí encuentras las respuestas más importantes del programa.</p></div><ProgramFAQ items={program.faq} minimal /></section></Reveal>
      </Container>
    </div>
  )
}
