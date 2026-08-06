interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export function SectionHeading({ eyebrow, title, description, align = 'center', light = false }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider ${
            light ? 'border-white/20 bg-white/10 text-brand' : 'border-brand/30 bg-brand/10 text-brand-700'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-balance text-3xl font-bold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-balance text-base sm:text-lg ${light ? 'text-white/70' : 'text-ink-600'}`}>{description}</p>
      )}
    </div>
  )
}
