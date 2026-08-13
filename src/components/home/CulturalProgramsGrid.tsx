import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getCulturalProgram } from '../../data/culturalPrograms'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const FEATURED_SLUGS = ['work-and-travel-usa', 'trainee-and-internship', 'asia', 'teacher-exchange']

const featuredPrograms = FEATURED_SLUGS.map((slug) => getCulturalProgram(slug)).filter(
  (program): program is NonNullable<ReturnType<typeof getCulturalProgram>> => Boolean(program),
)

export function CulturalProgramsGrid() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative py-14 sm:py-20">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Programas culturales"
          title="Elige tu próxima experiencia de intercambio"
          description="Trabaja, enseña o haz prácticas profesionales mientras vives una inmersión cultural completa."
        />

        <div className="flex h-[650px] w-full flex-col gap-3 overflow-hidden rounded-3xl sm:h-[480px] sm:flex-row">
          {featuredPrograms.map((program, index) => {
            const isActive = index === active
            return (
              <article
                key={program.slug}
                className={`group relative flex min-h-16 w-full shrink-0 flex-col justify-end overflow-hidden rounded-2xl border border-white/10 transition-[flex-grow] duration-500 ease-out sm:min-h-0 sm:w-auto sm:min-w-20 sm:rounded-3xl ${
                  isActive ? 'flex-[6]' : 'flex-[1]'
                }`}
              >
                <img
                  src={program.image.src}
                  alt={program.image.alt}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${
                    isActive ? 'from-ink via-ink/50 to-transparent' : 'from-ink/95 via-ink/60 to-ink/20'
                  }`}
                />

                {!isActive && (
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Mostrar ${program.title}`}
                    className="absolute inset-0 z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                  />
                )}

                <span
                  className={`absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 ${
                    isActive ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                >
                  <span className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-white [writing-mode:horizontal-tb] sm:[writing-mode:vertical-rl]">
                    {program.title}
                  </span>
                </span>

                <div
                  className={`relative flex flex-col items-start gap-2.5 p-5 transition-opacity duration-300 sm:gap-3 sm:p-8 ${
                    isActive ? 'opacity-100 delay-150' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <span className="w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {program.country}
                  </span>
                  <h3 className="text-xl font-extrabold leading-tight text-white sm:text-3xl">{program.title}</h3>
                  <p className="line-clamp-3 max-w-md text-sm leading-relaxed text-white/80 sm:line-clamp-none sm:text-base">{program.tagline}</p>
                  <Link
                    to={`/${program.slug}`}
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-white/90"
                  >
                    {program.cta}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
