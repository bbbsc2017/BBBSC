import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { ProgramCard } from '../components/ui/ProgramCard'
import { culturalPrograms } from '../data/culturalPrograms'

export default function ProgramasCulturalesIndex() {
  return (
    <>
      <Seo
        title="Programas Culturales"
        description="Work and Travel USA, Trainee & Internship, Teacher Exchange, Teacher Assistant, Au Pair y más programas de intercambio cultural con BBB Student Center."
        path="/programas-culturales"
      />
      <DetailHero
        eyebrow="Programas culturales"
        title="Vive un intercambio que transforma tu futuro"
        description="Trabaja, enseña o realiza prácticas profesionales en el exterior mientras vives una inmersión cultural completa."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Programas culturales' }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </section>
    </>
  )
}
