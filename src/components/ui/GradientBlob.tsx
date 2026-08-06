interface GradientBlobProps {
  className?: string
  tone?: 'brand' | 'ink'
}

export function GradientBlob({ className = '', tone = 'brand' }: GradientBlobProps) {
  const color = tone === 'brand' ? 'bg-brand' : 'bg-ink'
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full opacity-30 blur-3xl animate-blob ${color} ${className}`}
    />
  )
}
