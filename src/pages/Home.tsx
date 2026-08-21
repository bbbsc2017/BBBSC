import { Seo } from '../components/Seo'
import { Hero } from '../components/home/Hero'
import { LatestNewsSection } from '../components/home/LatestNewsSection'
import { AboutUs } from '../components/home/AboutUs'
import { CulturalProgramsGrid } from '../components/home/CulturalProgramsGrid'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { FAQSection } from '../components/home/FAQSection'
import { SITE } from '../lib/site'

export default function Home() {
  return (
    <>
      <Seo
        title="Programas Work and Travel y al exterior"
        description="BBB Student Center: Work and Travel, prácticas profesionales y estudios en universidades de Alemania, Polonia, Canadá, Corea del Sur y Estados Unidos."
        path="/"
        image={SITE.defaultSocialImage}
        imageAlt="Nueva York, uno de los destinos de los programas internacionales de BBB Student Center"
        jsonLd={[
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, alternateName: SITE.shortName, url: SITE.url, inLanguage: 'es-CO' },
          {
            '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: SITE.name, alternateName: SITE.shortName,
            url: SITE.url, logo: `${SITE.url}/favicon.svg`, image: SITE.defaultSocialImage, description: SITE.tagline, email: SITE.email,
            sameAs: Object.values(SITE.social), areaServed: 'Colombia',
            contactPoint: [{ '@type': 'ContactPoint', telephone: SITE.whatsapp, contactType: 'customer service', areaServed: 'CO', availableLanguage: ['Spanish'] }],
            // Esquema de negocio local (dirección/teléfono de la sede principal) —
            // ayuda a búsquedas locales, además del EducationalOrganization general.
            address: {
              '@type': 'PostalAddress', streetAddress: SITE.offices[0].address, addressLocality: SITE.offices[0].city,
              addressCountry: 'CO',
            },
          },
        ]}
      />
      <Hero />
      <LatestNewsSection />
      <AboutUs />
      <CulturalProgramsGrid />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
