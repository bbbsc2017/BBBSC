import { academicPrograms } from '../../data/academicPrograms'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { CTAButton } from '../ui/CTAButton'
import { GradientBlob } from '../ui/GradientBlob'
import { ImageLinkCard } from '../ui/ImageLinkCard'

export function AcademicProgramsGrid() {
  return (
    <section className="relative overflow-hidden bg-ink-mesh py-20 sm:py-28">
      <GradientBlob tone="brand" className="right-[-10%] top-0 size-80" />
      <Container className="relative flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Programas académicos"
          title="Despierta tu espíritu aventurero"
          description="Embárcate en un viaje inolvidable: estudia una carrera vocacional o mejora tu inglés en cuatro destinos internacionales."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {academicPrograms.map((program) => (
            <ImageLinkCard
              key={program.slug}
              to={`/programas-academicos/${program.slug}`}
              eyebrow={program.country}
              title={program.tagline}
              image={program.image}
            />
          ))}
        </div>

        <CTAButton to="/programas-academicos">Ver programas académicos</CTAButton>
      </Container>
    </section>
  )
}
