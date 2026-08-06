import { ClipboardCheck, GraduationCap, Sparkle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'

const promos = [
  {
    Icon: ClipboardCheck,
    eyebrow: 'Test de aptitud',
    title: '¿Aún no sabes si aplicas?',
    description: 'Responde nuestro test rápido y descubre si calificas para Work and Travel USA.',
    cta: 'Hacer el test',
    to: '/programas-culturales/work-and-travel-usa',
    tone: 'brand',
  },
  {
    Icon: GraduationCap,
    eyebrow: 'Corea del Sur',
    title: '¡Corea busca colombianos!',
    description: 'Conoce Woosong University: programas 100% en inglés y becas de hasta el 100%.',
    cta: 'Conocer Woosong',
    to: '/universidades/woosong-university',
    tone: 'ink',
  },
  {
    Icon: Sparkle,
    eyebrow: 'Oferta especial',
    title: 'Programa casi gratis en Estados Unidos',
    description: 'Teacher Assistant: asignación laboral garantizada y acompañamiento completo de visa.',
    cta: 'Ver el programa',
    to: '/programas-culturales/teacher-assistant',
    tone: 'brand',
  },
]

export function PromoBanners() {
  return (
    <section className="py-4 sm:py-6">
      <Container>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map(({ Icon, eyebrow, title, description, cta, to, tone }) => (
            <Link
              key={title}
              to={to}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 ${
                tone === 'ink' ? 'bg-ink text-white' : 'bg-brand-gradient text-ink'
              }`}
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-8 -top-8 size-32 rounded-full blur-2xl ${
                  tone === 'ink' ? 'bg-brand/30' : 'bg-white/40'
                }`}
              />
              <div className="relative flex flex-col gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${
                    tone === 'ink' ? 'bg-brand text-ink' : 'bg-ink text-brand'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide opacity-70">{eyebrow}</span>
                <h3 className="text-xl font-extrabold leading-snug">{title}</h3>
                <p className={`text-sm leading-relaxed ${tone === 'ink' ? 'text-white/70' : 'text-ink/70'}`}>{description}</p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 group-hover:underline">
                {cta} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
