import { CalendarCheck, MessageCircleHeart, PawPrint, Rocket } from 'lucide-react'
import { Container } from '../ui/Container'
import { CTAButton } from '../ui/CTAButton'

const steps = [
  {
    Icon: Rocket,
    title: 'Escoge la aventura',
    description: 'Explora nuestros programas culturales y académicos y elige el que más se ajuste a ti.',
  },
  {
    Icon: CalendarCheck,
    title: 'Agrégalo al calendario',
    description: 'Define fechas clave: inscripción, documentación y proceso de visa con nuestro acompañamiento.',
  },
  {
    Icon: MessageCircleHeart,
    title: 'Escríbenos y haz realidad el sueño',
    description: 'Un asesor te contacta por WhatsApp para guiarte en cada paso del proceso.',
  },
]

export function BobbyAdvice() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-gradient px-6 py-14 sm:px-14 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full bg-white/30 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-ink/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-ink text-brand">
              <PawPrint className="size-7" />
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/70">El consejo de Bobby</span>
              <h2 className="text-balance text-3xl font-extrabold text-ink sm:text-4xl">Los 3 pasos para tu viaje cultural</h2>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
              {steps.map(({ Icon, title, description }, index) => (
                <div key={title} className="flex flex-col items-center gap-3 rounded-3xl bg-ink/10 p-6 text-left backdrop-blur">
                  <span className="flex size-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-brand">
                    {index + 1}
                  </span>
                  <Icon className="size-6 text-ink" />
                  <h3 className="text-base font-bold text-ink">{title}</h3>
                  <p className="text-sm leading-relaxed text-ink/70">{description}</p>
                </div>
              ))}
            </div>

            <CTAButton to="/contacto" variant="secondary">
              Viaja y Aprende
            </CTAButton>
          </div>
        </div>
      </Container>
    </section>
  )
}
