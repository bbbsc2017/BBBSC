import { Seo } from '../components/Seo'
import { Hero } from '../components/home/Hero'
import { PromoBanners } from '../components/home/PromoBanners'
import { AboutUs } from '../components/home/AboutUs'
import { CulturalProgramsGrid } from '../components/home/CulturalProgramsGrid'
import { AcademicProgramsGrid } from '../components/home/AcademicProgramsGrid'
import { UniversitiesTeaser } from '../components/home/UniversitiesTeaser'
import { BobbyAdvice } from '../components/home/BobbyAdvice'
import { FAQSection } from '../components/home/FAQSection'
import { SITE } from '../lib/site'

export default function Home() {
  return (
    <>
      <Seo
        title="Programas Work & Travel y experiencias internacionales"
        description="BBB Student Center: agencia experta en Work and Travel USA, prácticas profesionales, intercambio docente y programas académicos en Estados Unidos, España, Asia, Canadá, Polonia y Australia."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE.name,
          url: SITE.url,
          logo: `${SITE.url}/favicon.svg`,
          description: SITE.tagline,
          email: SITE.email,
          sameAs: Object.values(SITE.social),
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: SITE.whatsapp,
              contactType: 'customer service',
              areaServed: 'CO',
              availableLanguage: ['Spanish'],
            },
          ],
        }}
      />
      <Hero />
      <PromoBanners />
      <AboutUs />
      <CulturalProgramsGrid />
      <AcademicProgramsGrid />
      <UniversitiesTeaser />
      <BobbyAdvice />
      <FAQSection />
    </>
  )
}
