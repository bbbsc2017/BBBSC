import { ExternalLink, FileUser, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'

const documentUrl =
  'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDyOCzs9tv3SKENg2eMpxxPKU4_qzGcADrC8ggDIkMdV0KAjhWAybaRT2-f-QSHgLU*&hosted=false'

export default function HojaDeVidaTraineeAndInternship() {
  return (
    <>
      <Seo
        title="Hoja de vida Trainee and Internship"
        description="Completa de forma segura tu hoja de vida para el programa Trainee and Internship."
        path="/hoja-de-vida-trainee-and-internship/"
        noIndex
      />

      <DetailHero
        eyebrow="Documento electrónico seguro"
        title="Hoja de vida Trainee and Internship"
        description="Completa la información solicitada con atención. Estos datos nos ayudarán a presentar tu perfil durante el proceso del programa."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Hoja de vida Trainee and Internship' }]}
      >
        <div className="flex flex-wrap gap-3 text-sm text-white/65">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <FileUser className="size-4 text-brand" /> Formulario mediante Adobe Acrobat Sign
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <ShieldCheck className="size-4 text-brand" /> Conexión cifrada
          </span>
        </div>
      </DetailHero>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30 sm:rounded-3xl">
            <iframe
              src={documentUrl}
              title="Formulario de hoja de vida Trainee and Internship"
              width="100%"
              className="block min-h-[760px] w-full border-0 sm:min-h-[920px]"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <p className="mt-5 text-center text-sm text-white/60">
            Si el documento no aparece,{' '}
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-brand underline-offset-4 hover:underline"
            >
              ábrelo directamente en Adobe Acrobat Sign <ExternalLink className="size-3.5" />
            </a>
          </p>
        </Container>
      </section>
    </>
  )
}
