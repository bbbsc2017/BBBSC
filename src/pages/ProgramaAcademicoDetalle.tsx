import { Link, Navigate, useParams } from 'react-router-dom'
import { BadgeDollarSign, GraduationCap, ListChecks, Sparkles } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { InfoList } from '../components/ui/InfoList'
import { ContactCard } from '../components/ui/ContactCard'
import { academicPrograms, getAcademicProgram } from '../data/academicPrograms'
import { getUniversity } from '../data/universities'
import { SITE } from '../lib/site'

export default function ProgramaAcademicoDetalle() {
  const { slug = '' } = useParams()
  const program = getAcademicProgram(slug)

  if (!program) return <Navigate to="/programas-academicos" replace />

  const relatedUniversities = program.universitySlugs.map((s) => getUniversity(s)).filter(Boolean)
  const otherDestinations = academicPrograms.filter((item) => item.slug !== program.slug)

  return (
    <>
      <Seo
        title={`${program.title} — Programa académico`}
        description={program.description}
        path={`/programas-academicos/${program.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.description,
          provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url },
        }}
      />
      <DetailHero
        eyebrow={`Programa académico · ${program.country}`}
        title={program.title}
        description={program.tagline}
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Programas académicos', to: '/programas-academicos' },
          { label: program.country },
        ]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-xl font-bold text-ink">Sobre el destino</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-600">{program.description}</p>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
                <GraduationCap className="size-5 text-brand-700" />
                Tipos de programa
              </h3>
              <InfoList items={program.programTypes} />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
                  <ListChecks className="size-5 text-brand-700" />
                  Requisitos
                </h3>
                <InfoList items={program.requirements} />
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
                  <Sparkles className="size-5 text-brand-700" />
                  Beneficios
                </h3>
                <InfoList items={program.benefits} />
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-ink">
                <BadgeDollarSign className="size-5 text-brand-700" />
                Costos referenciales
              </h3>
              <InfoList items={program.costs} tone="ink" />
            </div>

            {relatedUniversities.length > 0 && (
              <div>
                <h3 className="mb-4 text-base font-bold text-ink">Universidad asociada</h3>
                <div className="flex flex-wrap gap-3">
                  {relatedUniversities.map((university) => (
                    <Link
                      key={university!.slug}
                      to={`/universidades/${university!.slug}`}
                      className="rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand-700"
                    >
                      {university!.name} — {university!.city}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ContactCard programTitle={program.title} />
        </Container>
      </section>

      <section className="border-t border-ink/10 bg-[#faf9f6] py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-ink">Otros destinos académicos</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {otherDestinations.map((item) => (
              <Link
                key={item.slug}
                to={`/programas-academicos/${item.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-brand-700">{item.country}</span>
                <h3 className="text-sm font-bold text-ink">{item.tagline}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
