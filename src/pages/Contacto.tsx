import { useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { SITE, breadcrumbJsonLd, whatsappLink } from '../lib/site'

export default function Contacto() {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const composedMessage = [
    `¡Hola! Soy ${name || '(tu nombre)'}.`,
    subject && `Asunto: ${subject}.`,
    message || '(Escribe aquí tu mensaje)',
  ]
    .filter(Boolean)
    .join(' ')

  const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Contáctanos' }]

  return (
    <>
      <Seo
        title="Contáctanos"
        description="Escríbenos por WhatsApp o visítanos en nuestras oficinas de Ibagué y Bucaramanga. Asesoría personalizada para tu próximo intercambio internacional."
        path="/contacto"
        jsonLd={[
          breadcrumbJsonLd(breadcrumbs, '/contacto'),
          ...SITE.offices.map((office) => ({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: office.googleBusinessName,
            image: `${SITE.url}/favicon.svg`,
            telephone: office.phoneDisplay ?? office.phone,
            email: SITE.email,
            url: `${SITE.url}/contacto`,
            address: { '@type': 'PostalAddress', streetAddress: office.address, addressLocality: office.city, addressCountry: 'CO' },
          })),
        ]}
      />
      <DetailHero
        eyebrow="Contáctanos"
        title="Hablemos de tu próxima experiencia"
        description="Cuéntanos qué programa te interesa y un asesor te contacta para resolver tus dudas."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-ink-800 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">Escríbenos</h2>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Nombre
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                required
                placeholder="Tu nombre completo"
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Asunto
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                type="text"
                placeholder="Ej: Work and Travel USA"
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Mensaje
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Cuéntanos qué te gustaría saber"
                className="resize-none rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand"
              />
            </label>
            <CTAButton href={whatsappLink(composedMessage)} icon={false}>
              <MessageCircle className="size-4" />
              Enviar por WhatsApp
            </CTAButton>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-brand">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white">
                  <Phone className="size-4" />
                </span>
                {SITE.whatsappDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-sm font-semibold text-white transition-colors hover:text-brand">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white">
                  <Mail className="size-4" />
                </span>
                {SITE.email}
              </a>
            </div>

            {SITE.offices.map((office) => (
              <div key={office.city} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-ink-800 p-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Oficina {office.city}</h3>
                    <p className="mt-1 text-sm text-white/70">{office.address}</p>
                    <a href={`tel:${office.phone}`} className="mt-1 inline-block text-sm text-white/70 hover:text-brand">
                      {office.phone}
                    </a>
                  </div>
                </div>
                <iframe
                  title={`Mapa oficina ${office.city}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${office.address}, ${office.city}, Colombia`)}&output=embed`}
                  loading="lazy"
                  className="h-48 w-full rounded-2xl border border-white/10 grayscale invert"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
