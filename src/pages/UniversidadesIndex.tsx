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
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={university.image.src}
                    alt={university.image.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                    {university.country}
                  </span>
                  <h3 className="text-xl font-bold text-white">{university.name}</h3>
                  <p className="text-sm text-white/70">{university.city}</p>
                  <p className="text-sm leading-relaxed text-white/70">{university.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
