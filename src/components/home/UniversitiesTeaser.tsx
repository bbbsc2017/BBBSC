import { universities } from '../../data/universities'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { CTAButton } from '../ui/CTAButton'
import { ImageLinkCard } from '../ui/ImageLinkCard'

export function UniversitiesTeaser() {
  return (
    <section className="relative py-14 sm:py-20">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Universidades aliadas"
          title="Estudia en instituciones con reconocimiento internacional"
          description="Convenios directos que facilitan tu proceso de admisión, visa y adaptación."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {universities.map((university) => (
            <ImageLinkCard
              key={university.slug}
              to={`/${university.slug}`}
              eyebrow={university.country}
              title={university.name}
              subtitle={university.city}
              image={university.image}
            />
          ))}
        </div>

        <CTAButton to="/universidades" variant="ghost">
          Ver todas las universidades
        </CTAButton>
      </Container>
    </section>
  )
}
