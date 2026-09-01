import { Link } from 'react-router-dom'
import { BookOpenText, Globe2, GraduationCap, Landmark } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { ShowcaseHero } from '../components/ui/ShowcaseHero'
import { academicPrograms } from '../data/academicPrograms'
import { getUniversity } from '../data/universities'
import { breadcrumbJsonLd } from '../lib/site'

const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Programas académicos' }]

export default function UniversidadesIndex() {
  const featuredProgram = academicPrograms.find((program) => program.slug === 'corea-del-sur') ?? academicPrograms[0]
  const universityCount = academicPrograms.filter((program) => program.universitySlugs.length > 0).length
  const academicOptions = academicPrograms.reduce((total, program) => {
    const university = program.universitySlugs.map(getUniversity).find(Boolean)
    return total + (university ? university.undergrad.length + university.graduate.length : program.programTypes.length)
  }, 0)

  return (
    <>
      <Seo
        title="Programas académicos y universidades internacionales"
        description="Estudia en GISMA University, Vistula University, Cape Breton University, Woosong University, Troy University o vive una experiencia académica en Australia."
        path="/programas-academicos"
        image={featuredProgram.image.src}
        imageAlt={featuredProgram.image.alt}
        jsonLd={breadcrumbJsonLd(breadcrumbs, '/programas-academicos')}
      />
      <ShowcaseHero
        eyebrow="Programas académicos"
        title="Un destino, una universidad y un camino claro para estudiar afuera"
        description="Reunimos la información del país y de su universidad en una sola página para que compares programas, requisitos y beneficios sin duplicaciones."
        image={featuredProgram.image}
        imageKey={featuredProgram.slug}
        items={[
          { label: 'Destinos', value: `${academicPrograms.length} países para elegir`, icon: Globe2 },
          { label: 'Universidades', value: `${universityCount} instituciones aliadas`, icon: Landmark },
          { label: 'Oferta académica', value: `${academicOptions}+ áreas y programas`, icon: BookOpenText },
          { label: 'Acompañamiento', value: 'Admisión, visa y adaptación', icon: GraduationCap },
        ]}
        itemHeading="Tu futuro académico sin fronteras"
        primaryAction={{ label: 'Explorar destinos', to: '#destinos-academicos' }}
        secondaryAction={{ label: 'Hablar con un asesor', to: '/contacto' }}
        breadcrumbs={breadcrumbs}
      />
      <section id="destinos-academicos" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {academicPrograms.map((program) => {
              const university = program.universitySlugs.map(getUniversity).find(Boolean)

              return (
                <Link
                  key={program.slug}
                  to={`/${program.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={program.image.src}
                      alt={program.image.alt}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                      {program.country}
                    </span>
                    <h2 className="text-xl font-bold text-white">{university?.name ?? program.title}</h2>
                    {university && <p className="text-sm font-medium text-white/55">{university.city}</p>}
                    <p className="text-sm leading-relaxed text-white/70">{program.tagline}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
