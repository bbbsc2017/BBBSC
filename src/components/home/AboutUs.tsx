import { Compass, HeartHandshake, MapPinned, Users } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const pillars = [
  {
    Icon: Compass,
    title: 'Lo hemos vivido',
    description: 'Nuestro equipo ha vivido intercambios internacionales y sabe exactamente qué necesitas para el tuyo.',
  },
  {
    Icon: MapPinned,
    title: 'Sin límites geográficos',
    description: 'Estados Unidos, España, Asia, Canadá, Polonia y Australia: acompañamiento en cada destino.',
  },
  {
    Icon: HeartHandshake,
    title: 'Acompañamiento real',
    description: 'Seguimiento personalizado desde la inscripción hasta tu regreso a casa.',
  },
  {
    Icon: Users,
    title: 'Comunidad global',
    description: 'Miles de estudiantes colombianos ya ampliaron su red de contactos internacional con nosotros.',
  },
]

export function AboutUs() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Quiénes somos"
          title="¡Sabemos lo que hacemos porque lo hemos vivido!"
          description="En BBB Student Center somos la agencia de intercambios que convierte tus sueños en experiencias reales: viajes, descubrimiento cultural y desarrollo personal, sin límites geográficos."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-4 rounded-3xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-ink text-brand">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-bold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-600">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
