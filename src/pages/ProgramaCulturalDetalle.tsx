import { Navigate, useParams } from 'react-router-dom'
import { Clock, ListChecks, ShieldCheck, Sparkles } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { DestinationBanner } from '../components/ui/DestinationBanner'
import { Container } from '../components/ui/Container'
import { InfoList } from '../components/ui/InfoList'
import { ContactCard } from '../components/ui/ContactCard'
import { ProgramCard } from '../components/ui/ProgramCard'
import { ProgramFAQ } from '../components/ui/ProgramFAQ'
import { culturalPrograms, getCulturalProgram } from '../data/culturalPrograms'
import { SITE } from '../lib/site'

export default function ProgramaCulturalDetalle() {
  const { slug = '' } = useParams()
  const program = getCulturalProgram(slug)

  if (!program) return <Navigate to="/" replace />

  const related = culturalPrograms.filter((item) => item.slug !== program.slug).slice(0, 3)

  return (
    <>
      <Seo
        title={`${program.title} — ${program.country}`}
        description={program.description}
        path={`/programas-culturales/${program.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.description,
          provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url },
        }}
      />
      <DetailHero
        eyebrow={`Programa cultural · ${program.country}`}
        title={program.title}
        description={program.tagline}
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Programas culturales' },
          { label: program.title },
        ]}
      />

      <DestinationBanner image={program.image} caption={`${program.title} · ${program.country}`} />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-xl font-bold text-white">Sobre el programa</h2>
              <p className="mt-3 text-base leading-relaxed text-white/70">{program.description}</p>
            </div>

            <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-ink-800 p-5">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <h4 className="text-sm font-bold text-white">Duración</h4>
                  <p className="mt-1 text-sm text-white/70">{program.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-ink-800 p-5">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand" />
                <div>
                  <h4 className="text-sm font-bold text-white">Datos clave</h4>
                  <ul className="mt-1 flex flex-col gap-1 text-sm text-white/70">
                    {program.keyFacts.map((fact) => (
                      <li key={fact}>• {fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <ProgramFAQ items={program.faq} />
          </div>

          <ContactCard programTitle={program.title} image={program.image} pricing={program.pricing} />
        </Container>
      </section>

      <section className="border-t border-white/10 bg-black/15 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-white">Otros programas culturales</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <ProgramCard
                key={item.slug}
                to={`/programas-culturales/${item.slug}`}
                eyebrow={item.country}
                title={item.title}
                description={item.tagline}
                cta={item.cta}
                image={item.image}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
