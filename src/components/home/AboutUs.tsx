import { Compass, HeartHandshake, MapPinned, Users } from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const pillars = [
  {
    Icon: Compass,
    title: 'Lo hemos vivido',
    description: 'Nuestro equipo también vivió experiencias internacionales y conoce las dudas que aparecen antes de dar el primer paso.',
  },
  {
    Icon: MapPinned,
    title: 'Sin límites geográficos',
    description: 'Explora oportunidades en Estados Unidos, España, Asia, Canadá, Polonia y Australia según tus metas.',
  },
  {
    Icon: HeartHandshake,
    title: 'Acompañamiento real',
    description: 'Te guiamos con requisitos, documentos, entrevistas y preparación para que avances con claridad.',
  },
  {
    Icon: Users,
    title: 'Comunidad global',
    description: 'Conecta con jóvenes colombianos que ya estudiaron, trabajaron y crecieron fuera del país.',
  },
]

export function AboutUs() {
  return (
    <section className="relative py-14 sm:py-20">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Quiénes somos"
          title="Tu experiencia empieza con un plan que sí entiendes"
          description="En BBB Student Center te ayudamos a convertir tus ganas de viajar, estudiar o trabajar en el exterior en un proceso claro, acompañado y pensado para tus metas."
        />

        <div className="relative w-full overflow-hidden rounded-3xl border border-white/10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/96/El-dorado-from-air.jpg"
            alt="Vista aérea de un aeropuerto internacional"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink/85 to-ink/95" />

          <div className="relative grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
            {pillars.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col items-start gap-4 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/15"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
