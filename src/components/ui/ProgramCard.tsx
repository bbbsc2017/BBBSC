import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

interface ProgramCardProps {
  to: string
  eyebrow: string
  title: string
  description: string
  cta: string
}

export function ProgramCard({ to, eyebrow, title, description, cta }: ProgramCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-brand/10 blur-2xl transition-all duration-300 group-hover:bg-brand/20"
      />
      <div className="relative flex flex-col gap-3">
        <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          {eyebrow}
        </span>
        <h3 className="text-xl font-bold text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-600">{description}</p>
      </div>
      <div className="relative mt-6 flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand-700">
        {cta}
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
