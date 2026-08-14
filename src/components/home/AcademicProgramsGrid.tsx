import { academicPrograms } from '../../data/academicPrograms'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { GradientBlob } from '../ui/GradientBlob'
import { ImageLinkCard } from '../ui/ImageLinkCard'

export function AcademicProgramsGrid() {
  return (
    <section className="relative overflow-hidden bg-ink-mesh py-14 sm:py-20">
      <GradientBlob tone="brand" className="right-[-10%] top-0 size-80" />
      <Container className="relative flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Programas académicos"
          title="Estudia en universidades que conectan tu talento con el mundo"
          description="Compara cada destino junto con su universidad, programas, requisitos y beneficios en un solo lugar."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academicPrograms.map((program) => (
            <ImageLinkCard
              key={program.slug}
              to={`/${program.slug}`}
              eyebrow={program.country}
              title={program.title}
              subtitle={program.tagline}
              image={program.image}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
