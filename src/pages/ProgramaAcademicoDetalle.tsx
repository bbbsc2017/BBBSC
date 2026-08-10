import { Link, Navigate, useParams } from 'react-router-dom'
import { GraduationCap, ListChecks, Sparkles } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { DestinationBanner } from '../components/ui/DestinationBanner'
import { Container } from '../components/ui/Container'
import { InfoList } from '../components/ui/InfoList'
import { ContactCard } from '../components/ui/ContactCard'
import { ImageLinkCard } from '../components/ui/ImageLinkCard'
import { ProgramFAQ } from '../components/ui/ProgramFAQ'
import { academicPrograms, getAcademicProgram } from '../data/academicPrograms'
import { getUniversity } from '../data/universities'
import { SITE } from '../lib/site'

export default function ProgramaAcademicoDetalle() {
  const { slug = '' } = useParams()
  const program = getAcademicProgram(slug)

  if (!program) return <Navigate to="/" replace />

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
          { label: 'Programas académicos' },
          { label: program.country },
        ]}
      />

      <DestinationBanner image={program.image} caption={`${program.title} · ${program.country}`} />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-xl font-bold text-white">Sobre el destino</h2>
              <p className="mt-3 text-base leading-relaxed text-white/70">{program.description}</p>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                <GraduationCap className="size-5 text-brand" />
                Tipos de programa
              </h3>
              <InfoList items={program.programTypes} />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <ListChecks className="size-5 text-brand" />
                  Requisitos
                </h3>
                <InfoList items={program.requirements} />
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <Sparkles className="size-5 text-brand" />
                  Beneficios
                </h3>
                <InfoList items={program.benefits} />
              </div>
            </div>

            <ProgramFAQ items={program.faq} />

            {relatedUniversities.length > 0 && (
              <div>
                <h3 className="mb-4 text-base font-bold text-white">Universidad asociada</h3>
                <div className="flex flex-wrap gap-3">
                  {relatedUniversities.map((university) => (
                    <Link
                      key={university!.slug}
                      to={`/universidades/${university!.slug}`}
                      className="rounded-2xl border border-white/10 bg-ink-800 px-5 py-4 text-sm font-semibold text-white transition-colors hover:border-brand/40 hover:text-brand"
                    >
                      {university!.name} — {university!.city}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ContactCard
            programTitle={program.title}
            image={program.image}
            pricing={{
              badge: 'Costos referenciales',
              headline: `Inversión en ${program.title}`,
              items: program.costs,
              note: 'Valores de referencia; tu asesor te confirma el costo total actualizado.',
            }}
          />
        </Container>
      </section>

      <section className="border-t border-white/10 bg-black/15 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-white">Otros destinos académicos</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {otherDestinations.map((item) => (
              <ImageLinkCard
                key={item.slug}
                to={`/programas-academicos/${item.slug}`}
                eyebrow={item.country}
                title={item.tagline}
                image={item.image}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
