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
    title: '5. Promoción exclusiva Journey Begins',
    body: 'La promoción consiste en un descuento de USD 50 para el participante que invite a una persona al evento y cumpla integralmente las condiciones indicadas en la sede o modalidad correspondiente.',
  },
  {
    title: '6. Journey Begins Bucaramanga',
    body: 'Aplica exclusivamente durante el evento de bienvenida Journey Begins realizado en Bucaramanga. El participante recibirá el descuento únicamente si su invitado se inscribe al programa Summer Work & Travel USA durante el evento, cumple los requisitos vigentes del programa y es un contacto nuevo, es decir, no cuenta con un registro previo en las bases de datos de BBB Student Center.',
  },
  {
    title: '7. Journey Begins Ibagué',
    body: 'Aplica exclusivamente durante el evento de bienvenida Journey Begins realizado en Ibagué. El participante recibirá el descuento únicamente si su invitado se inscribe al programa Summer Work & Travel USA durante el evento, cumple los requisitos vigentes del programa y es un contacto nuevo, es decir, no cuenta con un registro previo en las bases de datos de BBB Student Center.',
  },
  {
    title: '8. Journey Begins modalidad virtual',
    body: 'Aplica únicamente durante la sesión virtual de bienvenida anunciada por BBB Student Center. El participante recibirá el descuento únicamente si su invitado se inscribe al programa Summer Work & Travel USA durante la sesión, cumple los requisitos vigentes del programa y es un contacto nuevo, es decir, no cuenta con un registro previo en las bases de datos de BBB Student Center.',
  },
  {
    title: '9. Condiciones comunes de la promoción',
    body: 'El descuento no es acumulable con otras promociones, descuentos, bonos ni beneficios comerciales. No es transferible, no es canjeable por dinero y está sujeto a validación por BBB Student Center. La asistencia al evento o el registro de intención no constituye inscripción al programa ni garantiza una vacante, visa, sponsor o aprobación. BBB Student Center podrá verificar la condición de contacto nuevo, la inscripción y el cumplimiento de requisitos antes de aplicar el beneficio.',
  },
  {
    title: '10. Tratamiento y protección de datos personales',
    body: `BBB Student Center actúa como responsable del tratamiento de los datos suministrados a través de este sitio, formularios, eventos y canales de contacto. Los datos podrán utilizarse para gestionar registros e inscripciones, contactar a los interesados, prestar asesoría, atender solicitudes, enviar información relacionada con programas y eventos, y cumplir obligaciones legales o contractuales. El tratamiento se realiza conforme a la Ley 1581 de 2012, sus normas reglamentarias y demás disposiciones colombianas aplicables.`,
  },
  {
    title: '11. Autorización y derechos del titular',
    body: `Al marcar las casillas de autorización o enviar un formulario, el titular otorga una autorización previa, expresa e informada para las finalidades comunicadas. El titular puede conocer, actualizar, rectificar o solicitar la supresión de sus datos; solicitar prueba de la autorización; revocar su consentimiento cuando sea procedente; y presentar consultas o reclamos. Para ejercer estos derechos puede escribir a ${SITE.email}. La revocatoria no afecta los tratamientos realizados válidamente antes de su recepción ni aquellos necesarios para cumplir obligaciones legales o contractuales.`,
  },
  {
    title: '12. Comunicaciones y terceros encargados',
    body: 'Para cumplir las finalidades informadas, BBB Student Center podrá apoyarse en proveedores tecnológicos, plataformas de formularios, CRM, mensajería, analítica, patrocinadores y entidades vinculadas al proceso del programa, bajo medidas razonables de seguridad y obligaciones de confidencialidad. Cuando un programa lo requiera, los datos podrán compartirse con sponsors, instituciones educativas u otras entidades necesarias para el proceso, previa información o autorización cuando corresponda.',
  },
  {
    title: '13. GDPR y transferencias internacionales',
    body: 'Cuando el Reglamento General de Protección de Datos de la Unión Europea (GDPR/RGPD) resulte aplicable, BBB Student Center tratará los datos sobre una base jurídica válida, incluyendo el consentimiento o la ejecución de medidas solicitadas por el titular. Los titulares que estén amparados por el RGPD podrán solicitar acceso, rectificación, supresión, limitación, oposición, portabilidad y retiro del consentimiento. Algunos proveedores, sponsors o instituciones pueden estar ubicados fuera de Colombia; cualquier transferencia o transmisión se realizará únicamente cuando sea necesaria para las finalidades informadas y con las salvaguardas aplicables.',
  },
  {
    title: '14. Seguridad y conservación',
    body: 'BBB Student Center adopta medidas técnicas, humanas y administrativas razonables para proteger la información contra acceso, pérdida, alteración, uso o divulgación no autorizados. Los datos se conservarán durante el tiempo necesario para las finalidades informadas, para atender obligaciones legales, contractuales o probatorias, o hasta que el titular solicite su supresión cuando ello sea procedente.',
  },
  {
    title: '15. Modificaciones',
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
          <div className="rounded-[1.75rem] border border-[#f9b000]/30 bg-[#f9b000]/[.07] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#f9b000]">Journey Begins</p>
            <h2 className="mt-3 text-2xl font-black text-white">Promoción de bienvenida</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">El beneficio de USD 50 se aplica únicamente bajo las condiciones específicas de Bucaramanga, Ibagué o modalidad virtual descritas a continuación. Lee estas condiciones antes de registrar invitados.</p>
          </div>
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
