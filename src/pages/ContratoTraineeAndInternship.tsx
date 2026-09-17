import { ExternalLink, FileSignature, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'

const contractUrl =
  'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDOz6ETbFHZM7OOfQEfEVNEupg_3aCJhbupUJQcXxeTqmwyt1C6FzsP_biTu-5deJ4*&hosted=false'

export default function ContratoTraineeAndInternship() {
  return (
    <>
      <Seo
        title="Contrato Trainee & Internship"
        description="Revisa y completa de forma segura tu contrato del programa Trainee & Internship."
        path="/contrato-trainee-and-internship/"
        noIndex
      />
      <DetailHero
        eyebrow="Firma electrónica segura"
        title="Contrato Trainee & Internship"
        description="Lee cada sección con atención y completa la información solicitada."
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Contrato Trainee & Internship' }]}
      >
        <div className="flex flex-wrap gap-3 text-sm text-white/65">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <FileSignature className="size-4 text-brand" /> Firma mediante Adobe Acrobat Sign
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
              src={contractUrl}
              title="Formulario de firma del contrato Trainee & Internship"
              width="100%"
              className="block min-h-[760px] w-full border-0 sm:min-h-[920px]"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <p className="mt-5 text-center text-sm text-white/60">
            Si el documento no aparece,{' '}
            <a
              href={contractUrl}
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
