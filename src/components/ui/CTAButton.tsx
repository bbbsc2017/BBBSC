import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface CTAButtonProps {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: boolean
  className?: string
}

export function CTAButton({ to, href, children, variant = 'primary', icon = true, className = '' }: CTAButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

  const variants: Record<string, string> = {
    primary: 'bg-brand text-ink shadow-brand hover:-translate-y-0.5 hover:bg-brand-400',
    secondary: 'bg-white text-ink hover:-translate-y-0.5 hover:bg-white/90',
    ghost: 'border border-white/20 text-white hover:border-brand hover:text-brand',
  }

  const content = (
    <>
      {children}
      {icon && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
    </>
  )

  const classes = `group ${base} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  )
}
