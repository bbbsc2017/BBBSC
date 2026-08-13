import { Seo } from '../components/Seo'
import { Hero } from '../components/home/Hero'
import { LatestNewsSection } from '../components/home/LatestNewsSection'
import { AboutUs } from '../components/home/AboutUs'
import { CulturalProgramsGrid } from '../components/home/CulturalProgramsGrid'
import { AcademicProgramsGrid } from '../components/home/AcademicProgramsGrid'
import { UniversitiesTeaser } from '../components/home/UniversitiesTeaser'
import { TestimonialsSection } from '../components/home/TestimonialsSection'
import { FAQSection } from '../components/home/FAQSection'
import { SITE } from '../lib/site'

export default function Home() {
  return (
    <>
      <Seo
        title="Programas Work & Travel y experiencias internacionales"
        description="BBB Student Center: agencia experta en Work and Travel USA, prácticas profesionales, intercambio docente y programas académicos en Estados Unidos, España, Asia, Canadá, Polonia y Australia."
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
          },
        ]}
      />
      <Hero />
      <LatestNewsSection />
      <AboutUs />
      <CulturalProgramsGrid />
      <AcademicProgramsGrid />
      <UniversitiesTeaser />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
