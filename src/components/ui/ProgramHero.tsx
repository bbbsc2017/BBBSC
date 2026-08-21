import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Container } from './Container'

interface ProgramHeroProps {
  eyebrow: string
  title: string
  description: string
  country: string
  image: { src: string; alt: string }
  requirements: string[]
  breadcrumbs: Crumb[]
  primaryTo?: string
  primaryLabel?: string
  secondaryTo?: string
  secondaryLabel?: string
  requirementsLabel?: string
}

export function ProgramHero({ eyebrow, title, description, country, image, requirements, breadcrumbs, primaryTo, primaryLabel, secondaryTo = '#contenido-programa', secondaryLabel = 'Conoce el programa', requirementsLabel = 'Requisitos principales' }: ProgramHeroProps) {
  return <section className="relative bg-[#1c1c1c] pb-8 pt-6 sm:pb-12 sm:pt-8">
    <Container>
      <Breadcrumbs items={breadcrumbs} />
      <div className="relative mt-5 min-h-[660px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1c1c] shadow-2xl shadow-[#1c1c1c]/70 sm:min-h-[720px] lg:min-h-[680px]">
        <img src={image.src} alt={image.alt} loading="eager" fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,.94)_0%,rgba(28,28,28,.72)_40%,rgba(28,28,28,.2)_72%,rgba(28,28,28,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,.16)_0%,rgba(28,28,28,.12)_42%,rgba(28,28,28,.88)_78%,#1c1c1c_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,transparent_0%,#1c1c1c_88%)]" />

        <div className="relative z-10 flex min-h-[660px] flex-col px-5 py-7 sm:min-h-[720px] sm:px-9 sm:py-9 lg:min-h-[680px] lg:px-14 lg:py-12">
          <div className="max-w-2xl lg:my-auto lg:pb-32">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-brand/35 bg-brand/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-brand backdrop-blur-md sm:text-xs">{eyebrow}</span><span className="rounded-full border border-white/15 bg-[#1c1c1c]/45 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/70 backdrop-blur-md sm:text-xs">{country}</span></div>
            <h1 className="mt-6 max-w-xl text-balance text-[clamp(2.5rem,6vw,5.25rem)] font-black leading-[.94] tracking-[-.055em] text-white">{title}</h1>
            <p className="mt-5 max-w-xl text-balance text-sm font-medium leading-6 text-white/70 sm:text-base sm:leading-7">{description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryTo || '/contacto'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400">{primaryLabel || (primaryTo ? 'Inscríbete ahora' : 'Habla con un asesor')}<ArrowRight className="ml-2 size-4" /></Link>
              <a href={secondaryTo} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-[#1c1c1c]/30 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:border-brand/50 hover:text-brand">{secondaryLabel}<ArrowDown className="ml-2 size-4" /></a>
            </div>
          </div>

          <div className="mt-auto border-t border-white/15 pt-5 sm:pt-6">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[.22em] text-brand">{requirementsLabel}</p>
            <div className={`grid gap-3 ${requirements.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
              {requirements.slice(0, 4).map((requirement, index) => <div key={requirement} className="group flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#1c1c1c]/45 p-4 backdrop-blur-md transition hover:border-brand/25 hover:bg-[#1c1c1c]/70">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white"><CheckCircle2 className="size-4" /></span>
                <div><span className="text-[9px] font-black uppercase tracking-[.18em] text-white/30">Requisito {String(index + 1).padStart(2, '0')}</span><p className="mt-1 text-xs font-semibold leading-5 text-white/80">{requirement}</p></div>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </Container>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#1c1c1c]" />
  </section>
}
