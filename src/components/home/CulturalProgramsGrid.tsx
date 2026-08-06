import { culturalPrograms } from '../../data/culturalPrograms'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { ProgramCard } from '../ui/ProgramCard'
import { CTAButton } from '../ui/CTAButton'

export function CulturalProgramsGrid() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Programas culturales"
          title="Elige tu próxima experiencia de intercambio"
          description="Trabaja, enseña o haz prácticas profesionales mientras vives una inmersión cultural completa."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {culturalPrograms.map((program) => (
            <ProgramCard
              key={program.slug}
              to={`/programas-culturales/${program.slug}`}
              eyebrow={program.country}
              title={program.title}
              description={program.tagline}
              cta={program.cta}
              image={program.image}
            />
          ))}
        </div>

        <CTAButton to="/programas-culturales" variant="secondary">
          Ver todos los programas culturales
        </CTAButton>
      </Container>
    </section>
  )
}
