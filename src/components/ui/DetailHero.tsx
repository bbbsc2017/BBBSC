import type { ReactNode } from 'react'
import { Container } from './Container'
import { GradientBlob } from './GradientBlob'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

interface DetailHeroProps {
  eyebrow: string
  title: string
  description: string
  breadcrumbs: Crumb[]
  children?: ReactNode
}

export function DetailHero({ eyebrow, title, description, breadcrumbs, children }: DetailHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink-mesh pb-16 pt-10 sm:pb-20 sm:pt-14">
      <GradientBlob tone="brand" className="left-[-10%] top-0 size-72" />
      <Container className="relative flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand backdrop-blur">
            {eyebrow}
          </span>
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-balance text-base text-white/70 sm:text-lg">{description}</p>
        </div>
        {children}
      </Container>
    </section>
  )
}
