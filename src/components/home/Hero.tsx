import { Globe2, GraduationCap, Plane, Sparkles } from 'lucide-react'
import { CTAButton } from '../ui/CTAButton'
import { Container } from '../ui/Container'
import { GradientBlob } from '../ui/GradientBlob'
import { HeroImagePanel } from './HeroImagePanel'

const stats = [
  { label: 'Años de experiencia', value: '10+' },
  { label: 'Estudiantes conectados con el mundo', value: '3.000+' },
  { label: 'Programas y destinos', value: '15+' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-mesh py-16 sm:py-20 lg:py-28">
      <GradientBlob tone="brand" className="left-[-15%] top-0 size-72 sm:size-96" />

      <Container className="relative flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col items-start gap-7 text-left lg:w-1/2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
            <Sparkles className="size-3.5" />
            Expertos en Work &amp; Travel y experiencias internacionales
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Impulsa tu vida <span className="text-brand">viajando</span> por el mundo
          </h1>

          <p className="max-w-xl text-balance text-base text-white/70 sm:text-lg">
            Descubre nuevas culturas, desarrolla habilidades globales y vive experiencias inolvidables.
            Deja que el viaje transforme tu futuro.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <CTAButton to="/contacto">Viaja y Aprende</CTAButton>
            <CTAButton to="/contacto" variant="ghost">
              Habla con un asesor
            </CTAButton>
          </div>

          <div className="grid w-full grid-cols-3 gap-3 pt-4 sm:max-w-lg sm:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur sm:px-6 sm:py-5">
                <p className="text-xl font-extrabold text-brand sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium text-white/60 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-xs font-semibold uppercase tracking-wide text-white/40">
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
        </div>

        <div className="lg:w-1/2">
          <HeroImagePanel />
        </div>
      </Container>
    </section>
  )
}
