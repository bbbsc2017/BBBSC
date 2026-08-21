import { ArrowDown, ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Container } from './Container'

interface ShowcaseItem {
  label: string
  value: string
  icon?: LucideIcon
}

interface ShowcaseAction {
  label: string
  to: string
}

interface ShowcaseHeroProps {
  eyebrow: string
  title: string
  description: string
  image: { src: string; alt: string }
  items?: ShowcaseItem[]
  itemHeading?: string
  breadcrumbs?: Crumb[]
  primaryAction?: ShowcaseAction
  secondaryAction?: ShowcaseAction
  imageKey?: string
}

function Action({ action, primary }: { action: ShowcaseAction; primary?: boolean }) {
  const className = primary
    ? 'inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-400'
    : 'inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-[#1c1c1c]/35 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:border-brand/50 hover:text-brand'
  const Icon = action.to.startsWith('#') ? ArrowDown : ArrowRight
  const content = <>{action.label}<Icon className="ml-2 size-4" /></>
  return action.to.startsWith('#') ? <a href={action.to} className={className}>{content}</a> : <Link to={action.to} className={className}>{content}</Link>
}

export function ShowcaseHero({ eyebrow, title, description, image, items = [], itemHeading = 'Información destacada', breadcrumbs, primaryAction, secondaryAction, imageKey }: ShowcaseHeroProps) {
  const hasItems = items.length > 0

  return <section className={`relative bg-transparent pt-6 sm:pt-8 ${hasItems ? 'pb-8 sm:pb-12' : 'pb-2 sm:pb-4'}`}>
    <Container>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#1c1c1c] shadow-2xl shadow-[#1c1c1c]/70 ${hasItems ? 'min-h-[600px] sm:min-h-[640px]' : 'min-h-[500px] sm:min-h-[540px]'} ${breadcrumbs ? 'mt-5' : ''}`}>
        <img key={imageKey || image.src} src={image.src} alt={image.alt} loading="eager" fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,28,28,.94)_0%,rgba(28,28,28,.7)_43%,rgba(28,28,28,.18)_75%,rgba(28,28,28,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,28,28,.12)_0%,rgba(28,28,28,.08)_42%,rgba(28,28,28,.86)_78%,#1c1c1c_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,transparent_0%,#1c1c1c_90%)]" />

        <div className={`relative z-10 flex flex-col px-5 py-7 sm:px-9 sm:py-9 lg:px-14 lg:py-12 ${hasItems ? 'min-h-[600px] sm:min-h-[640px]' : 'min-h-[500px] justify-center sm:min-h-[540px]'}`}>
          <div className={`max-w-2xl ${hasItems ? 'lg:my-auto lg:pb-28' : ''}`}>
            <span className="inline-flex rounded-full border border-brand/35 bg-brand/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-brand backdrop-blur-md sm:text-xs">{eyebrow}</span>
            <h1 className="mt-6 max-w-2xl text-balance text-[clamp(2.45rem,5.8vw,5rem)] font-black leading-[.94] tracking-[-.055em] text-white">{title}</h1>
            <p className="mt-5 max-w-xl text-balance text-sm font-medium leading-6 text-white/70 sm:text-base sm:leading-7">{description}</p>
            {(primaryAction || secondaryAction) && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{primaryAction && <Action action={primaryAction} primary />}{secondaryAction && <Action action={secondaryAction} />}</div>}
          </div>

          {hasItems && <div className="mt-auto border-t border-white/15 pt-5 sm:pt-6">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[.22em] text-brand">{itemHeading}</p>
            <div className={`grid gap-3 sm:grid-cols-2 ${items.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {items.slice(0, 4).map(({ label, value, icon: Icon }, index) => <div key={`${label}-${value}`} className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#1c1c1c]/45 p-4 backdrop-blur-md">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">{Icon ? <Icon className="size-4" /> : <CheckCircle2 className="size-4" />}</span>
                <div className="min-w-0"><span className="text-[9px] font-black uppercase tracking-[.18em] text-white/30">{label || `Punto ${String(index + 1).padStart(2, '0')}`}</span><p className="mt-1 text-xs font-semibold leading-5 text-white/80">{value}</p></div>
              </div>)}
            </div>
          </div>}
        </div>
      </div>
    </Container>
  </section>
}
