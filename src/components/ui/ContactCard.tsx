import { Check, MessageCircle, Phone } from 'lucide-react'
import { CTAButton } from './CTAButton'
import { whatsappLink, SITE } from '../../lib/site'

interface ContactCardProps {
  programTitle: string
  image?: { src: string; alt: string }
  pricing?: {
    badge?: string
    headline?: string
    price?: { amount: string; unit?: string }
    items: string[]
    note?: string
  }
}

export function ContactCard({ programTitle, image, pricing }: ContactCardProps) {
  const hasPricing = !!pricing?.items?.length

  if (hasPricing) {
    return (
      <div className="sticky top-24 relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-brand/40 bg-ink-800 p-6 shadow-[0_0_60px_-15px_rgba(249,176,0,0.35)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand/15 blur-3xl" />

        <div className="relative flex flex-col items-center gap-5 text-center">
          {pricing.badge && (
            <span className="w-fit rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              {pricing.badge}
            </span>
          )}
          <h3 className="text-xl font-extrabold text-white">{pricing.headline ?? `Inversión de ${programTitle}`}</h3>

          {pricing.price && (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Desde</span>
              <div className="flex flex-wrap items-end justify-center gap-2">
                <span className="text-6xl font-extrabold text-white sm:text-7xl">{pricing.price.amount}</span>
                {pricing.price.unit && <span className="pb-2 text-sm font-semibold text-white/60">{pricing.price.unit}</span>}
              </div>
            </div>
          )}

          <ul className="flex w-full flex-col gap-5 text-left">
            {pricing.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <CTAButton href={whatsappLink(`¡Hola! Quiero inscribirme a ${programTitle}.`)} icon={false} className="w-full">
            ¡Inscríbete ya!
          </CTAButton>

          {pricing.note && <p className="text-center text-xs text-white/50">{pricing.note}</p>}

          <a
            href={`tel:${SITE.phones.ibague}`}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-white/70 hover:text-brand"
          >
            <Phone className="size-4" />
            {SITE.whatsappDisplay}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-24 flex flex-col gap-5 overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-sm">
      {image && (
        <div className="relative h-32 w-full overflow-hidden">
          <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
        </div>
      )}
      <div className={`flex flex-col gap-5 px-6 pb-6 ${image ? 'pt-0' : 'pt-6'}`}>
        <span className="flex size-11 items-center justify-center rounded-2xl bg-ink text-brand">
          <MessageCircle className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">¿Listo para aplicar?</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            Un asesor te cuenta requisitos, costos y fechas de {programTitle} sin costo ni compromiso.
          </p>
        </div>
        <CTAButton href={whatsappLink(`¡Hola! Quiero más información sobre ${programTitle}.`)} icon={false} className="w-full">
          Escríbenos por WhatsApp
        </CTAButton>
        <a href={`tel:${SITE.phones.ibague}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-white/70 hover:text-brand">
          <Phone className="size-4" />
          {SITE.whatsappDisplay}
        </a>
      </div>
    </div>
  )
}
