import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { academicPrograms } from '../data/academicPrograms'

export default function ProgramasAcademicosIndex() {
  return (
    <>
      <Seo
        title="Programas Académicos"
        description="Estudia en Canadá, Polonia, Australia o Malta: carreras vocacionales, cursos de inglés y programas académicos con BBB Student Center."
        path="/programas-academicos"
      />
      <DetailHero
        eyebrow="Programas académicos"
        title="Despierta tu espíritu aventurero"
        description="Embárcate en un viaje inolvidable y estudia en instituciones internacionales reconocidas."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Programas académicos' }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {academicPrograms.map((program) => (
              <Link
                key={program.slug}
                to={`/programas-academicos/${program.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={program.image.src}
                    alt={program.image.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-brand">{program.country}</span>
                    <h3 className="mt-2 text-lg font-bold text-white">{program.tagline}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{program.description}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:text-brand">
                    Explorar
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
