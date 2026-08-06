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
                className="group flex flex-col justify-between gap-6 rounded-3xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-700">{program.country}</span>
                  <h3 className="mt-2 text-lg font-bold text-ink">{program.tagline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{program.description}</p>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand-700">
                  Explorar
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
