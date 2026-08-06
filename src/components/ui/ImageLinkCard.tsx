import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

interface ImageLinkCardProps {
  to: string
  eyebrow: string
  title: string
  subtitle?: string
  image: { src: string; alt: string }
}

export function ImageLinkCard({ to, eyebrow, title, subtitle, image }: ImageLinkCardProps) {
  return (
    <Link
      to={to}
      className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40"
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative flex flex-col gap-1 p-4">
        <span className="text-xs font-bold uppercase tracking-wide text-brand">{eyebrow}</span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <span className="text-xs text-white/70">{subtitle}</span>}
        <ArrowUpRight className="absolute right-4 top-0 size-4 text-white/60 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  )
}
