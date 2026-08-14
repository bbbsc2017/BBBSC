import { Navigate, useParams } from 'react-router-dom'
import { BookOpen, GraduationCap, MapPin, Sparkles, Star } from 'lucide-react'
import { Seo } from '../components/Seo'
import { ProgramHero } from '../components/ui/ProgramHero'
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

  const relatedUniversity = program.universitySlugs.map((s) => getUniversity(s)).find(Boolean)
  const otherDestinations = academicPrograms.filter((item) => item.slug !== program.slug)

  return (
    <>
      <Seo
        title={`${program.title} — Programa académico`}
        description={program.description}
        path={`/${program.slug}`}
        image={program.image.src}
        imageAlt={program.image.alt}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.description,
          image: program.image.src,
          url: `${SITE.url}/${program.slug}`,
          provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url },
        }}
      />
      <ProgramHero
        eyebrow="Programa académico"
        title={program.title}
        description={program.tagline}
        country={program.country}
        image={program.image}
        requirements={program.requirements}
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Programas académicos' },
          { label: program.country },
        ]}
      />

      <section id="contenido-programa" className="scroll-mt-24 py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
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

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                <Sparkles className="size-5 text-brand" />
                Beneficios del programa
              </h3>
              <InfoList items={program.benefits} />
            </div>

            <ProgramFAQ items={program.faq} />

            {relatedUniversity && (
              <section className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800">
                <div className="relative h-56 overflow-hidden sm:h-72">
                  <img
                    src={relatedUniversity.image.src}
                    alt={relatedUniversity.image.alt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
                      <MapPin className="size-4" /> {relatedUniversity.city}, {relatedUniversity.country}
                    </p>
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{relatedUniversity.name}</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-8 p-6 sm:p-8">
                  <p className="text-base leading-relaxed text-white/70">{relatedUniversity.description}</p>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                        <BookOpen className="size-5 text-brand" /> Pregrado
                      </h3>
                      <InfoList items={relatedUniversity.undergrad} />
                    </div>
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                        <GraduationCap className="size-5 text-brand" /> Posgrado
                      </h3>
                      <InfoList items={relatedUniversity.graduate} />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                      <Star className="size-5 text-brand" /> Datos clave de la universidad
                    </h3>
                    <InfoList items={relatedUniversity.keyFacts} tone="ink" />
                  </div>
                </div>
              </section>
            )}
          </div>

          <ContactCard
            programTitle={program.title}
            image={program.image}
            formKey={`academic_${program.slug}`}
            interestTag={`interesado_${program.slug.replaceAll('-', '_')}`}
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherDestinations.map((item) => (
              <ImageLinkCard
                key={item.slug}
                to={`/${item.slug}`}
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
