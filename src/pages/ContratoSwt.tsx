import { ExternalLink, FileSignature, ShieldCheck } from 'lucide-react'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { Container } from '../components/ui/Container'

type ContractVariant = 'a' | 'acc'

const contracts: Record<ContractVariant, { code: string; path: string; src: string }> = {
  a: {
    code: 'SWT-A',
    path: '/contrato-swt-a/',
    src: 'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhBctRiUVro_opuwTexy_0MJ31OuBOJYYhZrgOwC-PQJNxFtx2KLnAaJIeDY0lHkM5k*&hosted=false',
  },
  acc: {
    code: 'SWT-ACC',
    path: '/contrato-swt-acc/',
    src: 'https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhBACQ74ndJaW6Q72ibk9i07CAcm4NniTKS4v2SB15LI5ryTAQbDM3RTX2x1Zv797ME*&hosted=false',
  },
}

export default function ContratoSwt({ variant }: { variant: ContractVariant }) {
  const contract = contracts[variant]

  return (
    <>
      <Seo
        title={`Contrato Work and Travel USA ${contract.code}`}
        description="Revisa y completa de forma segura tu contrato del programa Work and Travel USA."
        path={contract.path}
        noIndex
      />
      <DetailHero
        eyebrow="Firma electrónica segura"
        title="Contrato Work and Travel USA"
        description={`Documento ${contract.code}. Lee cada sección con atención y completa la información solicitada.`}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: `Contrato ${contract.code}` }]}
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
              src={contract.src}
              title={`Formulario de firma del contrato ${contract.code}`}
              width="100%"
              className="block min-h-[760px] w-full border-0 sm:min-h-[920px]"
              allow="clipboard-read; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <p className="mt-5 text-center text-sm text-white/60">
            Si el documento no aparece,{' '}
            <a
              href={contract.src}
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
