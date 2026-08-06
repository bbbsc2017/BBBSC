import { MessageCircle, Phone } from 'lucide-react'
import { CTAButton } from './CTAButton'
import { whatsappLink } from '../../lib/site'
import { SITE } from '../../lib/site'

export function ContactCard({ programTitle }: { programTitle: string }) {
  return (
    <div className="sticky top-24 flex flex-col gap-5 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-ink text-brand">
        <MessageCircle className="size-5" />
      </span>
      <div>
        <h3 className="text-lg font-bold text-ink">¿Listo para aplicar?</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Un asesor te cuenta requisitos, costos y fechas de {programTitle} sin costo ni compromiso.
        </p>
      </div>
      <CTAButton href={whatsappLink(`¡Hola! Quiero más información sobre ${programTitle}.`)} icon={false} className="w-full">
        Escríbenos por WhatsApp
      </CTAButton>
      <a href={`tel:${SITE.phones.ibague}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-600 hover:text-brand-700">
        <Phone className="size-4" />
        {SITE.whatsappDisplay}
      </a>
    </div>
  )
}
