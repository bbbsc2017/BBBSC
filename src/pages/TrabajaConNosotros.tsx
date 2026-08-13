import { Briefcase, HeartHandshake, TrendingUp } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { whatsappLink } from '../lib/site'

const reasons = [
  {
    Icon: TrendingUp,
    title: 'Crecimiento constante',
    description: 'Formamos parte de una industria en expansión, con nuevos destinos y programas cada año.',
  },
  {
    Icon: HeartHandshake,
    title: 'Propósito real',
    description: 'Cada día ayudamos a estudiantes colombianos a vivir experiencias que transforman su futuro.',
  },
  {
    Icon: Briefcase,
    title: 'Equipo cercano',
    description: 'Un ambiente colaborativo entre las sedes de Ibagué y Bucaramanga.',
  },
]

export default function TrabajaConNosotros() {
  return (
    <>
      <Seo
        title="Trabaja con Nosotros"
        description="Únete al equipo de BBB Student Center y ayuda a más estudiantes colombianos a vivir experiencias internacionales."
        path="/trabaja-con-nosotros"
      />
      <DetailHero
        eyebrow="Bolsa de empleo"
        title="Trabaja con nosotros"
        description="Buscamos personas apasionadas por conectar a los colombianos con el mundo."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Trabaja con Nosotros' }]}
      />
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-12">
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            {reasons.map(({ Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <p className="max-w-xl text-sm text-white/70">
              ¿Quieres formar parte del equipo? Escríbenos por WhatsApp contándonos tu perfil y en qué área te gustaría aportar.
            </p>
            <CTAButton href={whatsappLink('¡Hola! Quiero enviar mi hoja de vida para trabajar en BBB Student Center.')} icon={false}>
              Enviar mi hoja de vida
            </CTAButton>
          </div>
        </Container>
      </section>
    </>
  )
}
