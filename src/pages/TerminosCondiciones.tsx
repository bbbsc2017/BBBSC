import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { SITE, breadcrumbJsonLd } from '../lib/site'

const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Términos y Condiciones' }]

const sections = [
  {
    title: '1. Objeto',
    body: `Estos términos y condiciones regulan el uso del sitio web ${SITE.url} y los servicios de asesoría e intermediación en programas de intercambio cultural y académico ofrecidos por ${SITE.name}.`,
  },
  {
    title: '2. Naturaleza del servicio',
    body: `${SITE.name} actúa como agencia asesora e intermediaria entre el aspirante y los organismos patrocinadores (sponsors), instituciones educativas y entidades de visado. La aprobación final de cualquier programa o visa depende de terceros ajenos a la agencia.`,
  },
  {
    title: '3. Inscripción y pagos',
    body: 'La inscripción a un programa se confirma con el pago del valor correspondiente. Los valores, plazos y condiciones de cada programa se informan de manera previa y personalizada durante el proceso de asesoría.',
  },
  {
    title: '4. Responsabilidad del aspirante',
    body: 'El aspirante es responsable de la veracidad de la información y documentación entregada, así como del cumplimiento de los requisitos de edad, idioma, formación y demás condiciones exigidas por cada programa.',
  },
  {
    title: '5. Protección de datos',
    body: `Los datos personales suministrados serán tratados conforme a la normatividad colombiana de protección de datos y utilizados exclusivamente para la gestión del proceso de intercambio. Puedes ejercer tus derechos escribiendo a ${SITE.email}.`,
  },
  {
    title: '6. Modificaciones',
    body: 'BBB Student Center podrá actualizar estos términos en cualquier momento. Los cambios se publicarán en esta misma página.',
  },
]

export default function TerminosCondiciones() {
  return (
    <>
      <Seo
        title="Términos y Condiciones"
        description="Términos y condiciones de uso del sitio web y los servicios de asesoría de BBB Student Center."
        path="/terminos-y-condiciones"
        jsonLd={breadcrumbJsonLd(breadcrumbs, '/terminos-y-condiciones')}
      />
      <DetailHero
        eyebrow="Legal"
        title="Términos y Condiciones"
        description="Conoce las condiciones de uso de nuestro sitio web y de nuestros servicios de asesoría en intercambios."
        breadcrumbs={breadcrumbs}
      />
      <section className="py-16 sm:py-20">
        <Container className="flex max-w-3xl flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{section.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
