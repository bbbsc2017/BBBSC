import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

interface ProgramCardProps {
  to: string
  eyebrow: string
  title: string
  description: string
  cta: string
  image: { src: string; alt: string }
}

export function ProgramCard({ to, eyebrow, title, description, cta, image }: ProgramCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/10 to-transparent" />
        <span className="absolute left-4 top-4 w-fit rounded-full bg-ink-800/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand backdrop-blur">
          {eyebrow}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col justify-between gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-white/70">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:text-brand">
          {cta}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  )
}
