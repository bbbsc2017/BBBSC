import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { universities } from '../data/universities'

export default function UniversidadesIndex() {
  return (
    <>
      <Seo
        title="Universidades Aliadas"
        description="Troy University, GISMA, Woosong University, Vistula y Cape Breton: universidades internacionales aliadas de BBB Student Center."
        path="/universidades"
      />
      <DetailHero
        eyebrow="Universidades aliadas"
        title="Instituciones con reconocimiento internacional"
        description="Convenios directos que facilitan tu proceso de admisión, visa y adaptación al nuevo país."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Universidades' }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => (
              <Link
                key={university.slug}
                to={`/universidades/${university.slug}`}
                className="group flex flex-col gap-3 rounded-3xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              >
                <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                  {university.country}
                </span>
                <h3 className="text-xl font-bold text-ink">{university.name}</h3>
                <p className="text-sm text-ink-600">{university.city}</p>
                <p className="text-sm leading-relaxed text-ink-600">{university.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
