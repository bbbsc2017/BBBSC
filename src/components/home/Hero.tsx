import { Globe2, GraduationCap, Plane, Sparkles } from 'lucide-react'
import { CTAButton } from '../ui/CTAButton'
import { Container } from '../ui/Container'
import { GradientBlob } from '../ui/GradientBlob'
import { HeroBackgroundCarousel } from './HeroBackgroundCarousel'

const stats = [
  { label: 'Años de experiencia', value: '10+' },
  { label: 'Estudiantes conectados con el mundo', value: '3.000+' },
  { label: 'Programas y destinos', value: '15+' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-16 sm:pb-28 sm:pt-24">
      <HeroBackgroundCarousel />
      <GradientBlob tone="brand" className="left-[-10%] top-10 size-72 sm:size-96" />
      <GradientBlob tone="brand" className="bottom-[-10%] right-[-5%] size-64 sm:size-80" />

      <Container className="relative flex flex-col items-center gap-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
          <Sparkles className="size-3.5" />
          Expertos en Work &amp; Travel y experiencias internacionales
        </span>

        <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Impulsa tu vida <span className="text-brand">viajando</span> por el mundo
        </h1>

        <p className="max-w-2xl text-balance text-base text-white/70 sm:text-lg">
          Descubre nuevas culturas, desarrolla habilidades globales y vive experiencias inolvidables.
          Deja que el viaje transforme tu futuro.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <CTAButton to="/contacto">Viaja y Aprende</CTAButton>
          <CTAButton to="/contacto" variant="ghost" className="!border-white/20 !text-white hover:!border-brand hover:!text-brand">
            Habla con un asesor
          </CTAButton>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
              <p className="text-3xl font-extrabold text-brand">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2 text-xs font-semibold uppercase tracking-wide text-white/40">
          <span className="flex items-center gap-2">
            <Plane className="size-4 text-brand" /> Work &amp; Travel
          </span>
          <span className="flex items-center gap-2">
            <GraduationCap className="size-4 text-brand" /> Programas académicos
          </span>
          <span className="flex items-center gap-2">
            <Globe2 className="size-4 text-brand" /> Universidades aliadas
          </span>
        </div>
      </Container>
    </section>
  )
}
