import { academicPrograms } from '../../data/academicPrograms'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { CTAButton } from '../ui/CTAButton'
import { GradientBlob } from '../ui/GradientBlob'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

export function AcademicProgramsGrid() {
  return (
    <section className="relative overflow-hidden bg-ink-mesh py-20 sm:py-28">
      <GradientBlob tone="brand" className="right-[-10%] top-0 size-80" />
      <Container className="relative flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Programas académicos"
          title="Despierta tu espíritu aventurero"
          description="Embárcate en un viaje inolvidable: estudia una carrera vocacional o mejora tu inglés en cuatro destinos internacionales."
          light
        />

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {academicPrograms.map((program) => (
            <Link
              key={program.slug}
              to={`/programas-academicos/${program.slug}`}
              className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/10"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-brand">{program.country}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{program.tagline}</h3>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors group-hover:text-brand">
                Explorar
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <CTAButton to="/programas-academicos">Ver programas académicos</CTAButton>
      </Container>
    </section>
  )
}
