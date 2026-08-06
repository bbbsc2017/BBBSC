import { Link } from 'react-router-dom'
import { universities } from '../../data/universities'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { CTAButton } from '../ui/CTAButton'

export function UniversitiesTeaser() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Universidades aliadas"
          title="Estudia en instituciones con reconocimiento internacional"
          description="Convenios directos que facilitan tu proceso de admisión, visa y adaptación."
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {universities.map((university) => (
            <Link
              key={university.slug}
              to={`/universidades/${university.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-brand-700">{university.country}</span>
              <h3 className="text-sm font-bold text-ink">{university.name}</h3>
              <span className="text-xs text-ink-600">{university.city}</span>
            </Link>
          ))}
        </div>

        <CTAButton to="/universidades" variant="ghost">
          Ver todas las universidades
        </CTAButton>
      </Container>
    </section>
  )
}
