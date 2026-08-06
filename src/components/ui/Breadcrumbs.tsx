import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="size-3.5 text-white/40" aria-hidden="true" />}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-brand">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-white" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
