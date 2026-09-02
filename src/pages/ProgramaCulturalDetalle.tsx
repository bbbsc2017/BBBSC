import type { ComponentType } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  Armchair,
  Briefcase,
  CalendarClock,
  Candy,
  Clock,
  Luggage,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Warehouse,
  Wrench,
} from 'lucide-react'

// Ícono por tipo de puesto en "Ejemplos actuales de trabajo". Briefcase es el
// respaldo genérico si algún programa agrega un puesto que no está en esta lista.
const jobExampleIcons: Record<string, ComponentType<{ className?: string }>> = {
  'Fábrica de chocolate': Candy,
  'Almacén y logística': Warehouse,
  'Producción y montaje': Wrench,
  'Manipulación de equipaje': Luggage,
  'Sala business': Armchair,
  'Catering aeroportuario': UtensilsCrossed,
  'Embalaje y control de calidad': PackageCheck,
  'Otras tareas estacionales': CalendarClock,
}
import { Seo } from '../components/Seo'
import { ProgramHero } from '../components/ui/ProgramHero'
import { Container } from '../components/ui/Container'
import { InfoList } from '../components/ui/InfoList'
import { ContactCard } from '../components/ui/ContactCard'
import { ProgramCard } from '../components/ui/ProgramCard'
import { ProgramFAQ } from '../components/ui/ProgramFAQ'
import { culturalPrograms, getCulturalProgram } from '../data/culturalPrograms'
import { SITE, breadcrumbJsonLd } from '../lib/site'

export default function ProgramaCulturalDetalle() {
  const { slug = '' } = useParams()
  const program = getCulturalProgram(slug)

  if (!program) return <Navigate to="/" replace />

  const related = culturalPrograms.filter((item) => item.slug !== program.slug).slice(0, 3)
  const registrationTo = program.slug === 'work-and-travel-usa' || program.slug === 'asia' ? `/${program.slug}/inscripcion` : undefined
  const breadcrumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Programas culturales' },
    { label: program.title },
  ]

  return (
    <>
      <Seo
        title={`${program.title} — ${program.country}`}
        description={program.description}
        path={`/${program.slug}`}
        image={program.image.src}
        imageAlt={program.image.alt}
        jsonLd={[
          breadcrumbJsonLd(breadcrumbs, `/${program.slug}`),
          {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: program.title,
            description: program.description,
            image: program.image.src,
            url: `${SITE.url}/${program.slug}`,
            provider: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url },
          },
          // FAQPage habilita que Google muestre estas preguntas como "rich
          // snippet" desplegable directo en el resultado de búsqueda — el
          // mecanismo real (no el meta "keywords", que Google ignora desde
          // 2009) para que las preguntas frecuentes ayuden a posicionar.
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: program.faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          },
        ]}
      />
      <ProgramHero
        eyebrow="Programa cultural"
        title={program.title}
        description={program.tagline}
        country={program.country}
        image={program.image}
        requirements={program.requirements}
        primaryTo={registrationTo}
        breadcrumbs={breadcrumbs}
      />

      <section id="contenido-programa" className="scroll-mt-24 py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-xl font-bold text-white">Sobre el programa</h2>
              <p className="mt-3 text-base leading-relaxed text-white/70">{program.description}</p>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                <Sparkles className="size-5 text-brand" />
                Beneficios del programa
              </h3>
              <div className="pl-7">
                <InfoList items={program.benefits} />
              </div>
            </div>

            {program.jobExamples && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <Briefcase className="size-5 text-brand" />
                  Ejemplos actuales de trabajo
                </h3>
                <div className="flex flex-wrap gap-3">
                  {program.jobExamples.map((job, index) => {
                    const Icon = jobExampleIcons[job] ?? Briefcase
                    return (
                      <span
                        key={job}
                        style={{ animationDelay: `${index * 70}ms` }}
                        className="group flex animate-[fadeInUp_0.5s_ease-out_both] items-center gap-2 rounded-full border border-white/10 bg-ink-800 px-4 py-2.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/10 hover:text-white"
                      >
                        <Icon className="size-4 text-brand transition-transform duration-300 group-hover:scale-110" />
                        {job}
                      </span>
                    )
                  })}
                </div>
                {program.jobExamplesNote && <p className="mt-4 text-xs leading-relaxed text-white/50">{program.jobExamplesNote}</p>}
              </div>
            )}

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

          <ContactCard
            programTitle={program.title}
            image={program.image}
            pricing={program.pricing}
            registrationTo={registrationTo}
            formKey={registrationTo ? undefined : `cultural_${program.slug}`}
            interestTag={registrationTo ? undefined : `interesado_${program.slug.replaceAll('-', '_')}`}
          />
        </Container>
      </section>

      <section className="border-t border-white/10 bg-black/15 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-white">Otros programas culturales</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <ProgramCard
                key={item.slug}
                to={`/${item.slug}`}
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
