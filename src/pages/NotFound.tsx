import { Compass } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'

export default function NotFound() {
  return (
    <>
      <Seo title="Página no encontrada" description="La página que buscas no existe o fue movida." path="/404" noIndex />
      <section className="relative overflow-hidden bg-ink-mesh py-28">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-white">
            <Compass className="size-8" />
          </span>
          <h1 className="text-4xl font-extrabold text-white">404</h1>
          <p className="max-w-md text-balance text-white/70">
            Parece que te perdiste en el camino. Esta página no existe, pero tu próximo destino sí.
          </p>
          <CTAButton to="/">Volver al inicio</CTAButton>
        </Container>
      </section>
    </>
  )
}
