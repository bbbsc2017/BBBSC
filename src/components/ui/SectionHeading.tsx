interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="text-balance text-base text-white/70 sm:text-lg">{description}</p>}
    </div>
  )
}
