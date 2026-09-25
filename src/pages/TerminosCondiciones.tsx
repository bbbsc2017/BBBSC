import { useState, type ReactNode } from 'react'
import { ChevronRight, FileText, Gift, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'
import { SITE, breadcrumbJsonLd } from '../lib/site'

const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Términos y Condiciones' }]
type LegalTab = 'general' | 'bucaramanga' | 'ibague' | 'virtual' | 'privacy'

const tabs: { id: LegalTab; title: string; subtitle: string; Icon: typeof FileText }[] = [
  { id: 'general', title: 'Términos de BBB', subtitle: 'Uso del sitio y programas', Icon: FileText },
  { id: 'bucaramanga', title: 'Journey Begins Bucaramanga', subtitle: 'Promoción presencial', Icon: Gift },
  { id: 'ibague', title: 'Journey Begins Ibagué', subtitle: 'Promoción presencial', Icon: Gift },
  { id: 'virtual', title: 'Journey Begins virtual', subtitle: 'Promoción en línea', Icon: Gift },
  { id: 'privacy', title: 'Datos y privacidad', subtitle: 'Ley 1581 y GDPR', Icon: ShieldCheck },
]

function Prose({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return <article>
    <p className="text-xs font-black uppercase tracking-[.22em] text-[#f9b000]">{eyebrow}</p>
    <h2 className="mt-3 text-balance text-3xl font-black tracking-[-.045em] text-white sm:text-4xl">{title}</h2>
    <div className="mt-8 space-y-5 text-sm leading-7 text-white/70 sm:text-[15px]">{children}</div>
  </article>
}

function GeneralTerms() {
  return <Prose eyebrow="BBB Student Center" title="Términos generales de la marca">
    <p>Estos términos regulan el uso de {SITE.url} y los servicios de asesoría e intermediación en programas de intercambio cultural y académico ofrecidos por {SITE.name}. Al navegar en el sitio, enviar un formulario o iniciar un proceso de asesoría, aceptas estas condiciones.</p>
    <p>{SITE.name} acompaña al aspirante como agencia asesora e intermediaria frente a sponsors, instituciones educativas, empleadores y entidades de visado. Las decisiones de admisión, asignación de vacante, aprobación de visa o condiciones de terceros corresponden exclusivamente a dichas entidades.</p>
    <p>La inscripción a un programa se confirma en los términos, pagos y plazos informados durante la asesoría. El aspirante es responsable de entregar información y documentos veraces, así como de cumplir las condiciones de edad, idioma, estudios, salud, disponibilidad y demás requisitos aplicables a su programa.</p>
    <p>BBB Student Center podrá actualizar estos términos cuando sea necesario. La versión vigente será la publicada en esta página.</p>
  </Prose>
}

function PromotionTerms({ mode }: { mode: 'bucaramanga' | 'ibague' | 'virtual' }) {
  const details = {
    bucaramanga: { title: 'Términos de Journey Begins Bucaramanga', place: 'el evento presencial Journey Begins Bucaramanga', label: 'Bucaramanga · presencial' },
    ibague: { title: 'Términos de Journey Begins Ibagué', place: 'el evento presencial Journey Begins Ibagué', label: 'Ibagué · presencial' },
    virtual: { title: 'Términos de Journey Begins virtual', place: 'la sesión virtual Journey Begins anunciada por BBB Student Center', label: 'Modalidad virtual' },
  }[mode]
  return <Prose eyebrow={details.label} title={details.title}>
    <p>Esta promoción reconoce al participante que comparte la oportunidad con una persona nueva. El beneficio corresponde a un descuento de USD 50 sobre su programa Summer Work &amp; Travel USA y solo se aplica después de validar las condiciones aquí descritas.</p>
    <p>El descuento es válido únicamente durante {details.place}. El participante debe registrar a su invitado y este debe completar su inscripción al programa durante la actividad correspondiente.</p>
    <p>El invitado debe ser una persona nueva para BBB Student Center, sin registro previo en sus bases de datos, y debe cumplir los requisitos vigentes del programa. La asistencia al evento o la manifestación de interés no equivalen a una inscripción ni garantizan una vacante, visa, sponsor o aprobación.</p>
    <p>El beneficio no es acumulable con otras promociones, descuentos, bonos o beneficios comerciales. No es transferible, no es canjeable por dinero y está sujeto a la verificación de BBB Student Center antes de aplicarse.</p>
    <p>BBB Student Center podrá negar o retirar el beneficio si se detecta información inexacta, duplicidad de contactos o incumplimiento de requisitos. Esta promoción es independiente de las condiciones comerciales propias del programa.</p>
  </Prose>
}

function PrivacyTerms() {
  return <Prose eyebrow="Privacidad y datos" title="Tratamiento de tu información">
    <p>BBB Student Center es responsable del tratamiento de los datos suministrados a través de este sitio, formularios, eventos y canales de contacto. Los usamos para gestionar registros e inscripciones, brindar asesoría, atender solicitudes, comunicar información sobre programas y eventos, y cumplir obligaciones legales o contractuales.</p>
    <p>Al marcar una casilla de autorización o enviar un formulario, otorgas una autorización previa, expresa e informada para las finalidades que se te comunican. El tratamiento se realiza conforme a la Ley 1581 de 2012, sus normas reglamentarias y demás disposiciones colombianas aplicables.</p>
    <p>Puedes conocer, actualizar, rectificar o solicitar la supresión de tus datos; pedir prueba de tu autorización; revocar el consentimiento cuando proceda; y presentar consultas o reclamos escribiendo a <a href={`mailto:${SITE.email}`} className="font-bold text-[#f9b000] underline underline-offset-2">{SITE.email}</a>. La revocatoria no afecta los tratamientos válidos previos ni los necesarios para cumplir obligaciones legales o contractuales.</p>
    <p>Podemos utilizar proveedores tecnológicos, CRM, mensajería, analítica y plataformas de formularios. Cuando un proceso lo requiera, la información podrá compartirse con sponsors, instituciones educativas u otras entidades necesarias, con las autorizaciones y salvaguardas aplicables.</p>
    <p>Cuando el GDPR/RGPD de la Unión Europea sea aplicable, trataremos los datos sobre una base jurídica válida. Las personas amparadas por el RGPD pueden solicitar acceso, rectificación, supresión, limitación, oposición, portabilidad y retiro del consentimiento. Conservamos los datos solo durante el tiempo necesario para las finalidades informadas y las obligaciones aplicables.</p>
  </Prose>
}

export default function TerminosCondiciones() {
  const [activeTab, setActiveTab] = useState<LegalTab>('general')
  return <>
    <Seo title="Términos y Condiciones" description="Términos, promociones Journey Begins y tratamiento de datos de BBB Student Center." path="/terminos-y-condiciones" jsonLd={breadcrumbJsonLd(breadcrumbs, '/terminos-y-condiciones')} />
    <DetailHero eyebrow="Legal" title="Términos y condiciones" description="Consulta las condiciones generales, las promociones Journey Begins y el tratamiento de tus datos." breadcrumbs={breadcrumbs} />
    <section className="py-16 sm:py-20">
      <Container className="max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[.2em] text-white/45">Navega por sección</p>
            <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Secciones legales">
              {tabs.map(({ id, title, subtitle, Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`group flex min-w-[14rem] items-center gap-3 rounded-2xl px-4 py-3 text-left transition lg:min-w-0 ${activeTab === id ? 'bg-[#f9b000] text-white shadow-lg shadow-[#f9b000]/15' : 'text-white/55 hover:bg-white/[.06] hover:text-white'}`}>
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${activeTab === id ? 'bg-white/15' : 'bg-white/[.07] text-[#f9b000]'}`}><Icon className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-black leading-5">{title}</span><span className={`mt-0.5 block text-xs ${activeTab === id ? 'text-white/75' : 'text-white/40'}`}>{subtitle}</span></span>
                <ChevronRight className={`size-4 shrink-0 transition ${activeTab === id ? 'translate-x-0.5' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>)}
            </nav>
          </aside>
          <div className="rounded-[2rem] border border-white/10 bg-white/[.035] p-6 backdrop-blur-sm sm:p-10">
            {activeTab === 'general' && <GeneralTerms />}
            {activeTab === 'bucaramanga' && <PromotionTerms mode="bucaramanga" />}
            {activeTab === 'ibague' && <PromotionTerms mode="ibague" />}
            {activeTab === 'virtual' && <PromotionTerms mode="virtual" />}
            {activeTab === 'privacy' && <PrivacyTerms />}
          </div>
        </div>
      </Container>
    </section>
  </>
}
