import type { ComponentType } from 'react'
import { Check } from 'lucide-react'

interface InfoListProps {
  items: string[]
  icon?: ComponentType<{ className?: string }>
  tone?: 'brand' | 'ink'
}

export function InfoList({ items, icon: Icon = Check, tone = 'brand' }: InfoListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
          <span
            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
              tone === 'brand' ? 'bg-brand/15 text-brand' : 'bg-white/10 text-white'
            }`}
          >
            <Icon className="size-3" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}
