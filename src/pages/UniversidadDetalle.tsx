import { Navigate, useParams } from 'react-router-dom'
import { BookOpen, GraduationCap, MapPin, Star } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { DestinationBanner } from '../components/ui/DestinationBanner'
import { Container } from '../components/ui/Container'
import { InfoList } from '../components/ui/InfoList'
import { ContactCard } from '../components/ui/ContactCard'
import { ImageLinkCard } from '../components/ui/ImageLinkCard'
import { universities, getUniversity } from '../data/universities'

export default function UniversidadDetalle() {
  const { slug = '' } = useParams()
  const university = getUniversity(slug)

  if (!university) return <Navigate to="/universidades" replace />

  const others = universities.filter((item) => item.slug !== university.slug).slice(0, 4)

  return (
    <>
      <Seo
        title={`${university.name} — ${university.country}`}
        description={university.description}
        path={`/universidades/${university.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollegeOrUniversity',
          name: university.name,
          description: university.description,
          address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: university.country },
        }}
      />
      <DetailHero
        eyebrow="Universidad aliada"
        title={university.name}
        description={university.description}
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Universidades', to: '/universidades' },
          { label: university.name },
        ]}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-white/70">
          <MapPin className="size-4 text-brand" />
          {university.city}, {university.country}
        </div>
      </DetailHero>

      <DestinationBanner image={university.image} caption={`${university.name} · ${university.city}`} />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <BookOpen className="size-5 text-brand" />
                  Pregrado
                </h3>
                <InfoList items={university.undergrad} />
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                  <GraduationCap className="size-5 text-brand" />
                  Posgrado
                </h3>
                <InfoList items={university.graduate} />
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                <Star className="size-5 text-brand" />
                Datos clave
              </h3>
              <InfoList items={university.keyFacts} tone="ink" />
            </div>
          </div>

          <ContactCard programTitle={university.name} image={university.image} />
        </Container>
      </section>

      <section className="border-t border-white/10 bg-black/15 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-white">Otras universidades aliadas</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <ImageLinkCard
                key={item.slug}
                to={`/universidades/${item.slug}`}
                eyebrow={item.country}
                title={item.name}
                subtitle={item.city}
                image={item.image}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
