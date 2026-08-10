import { Check, MessageCircle } from 'lucide-react'
import { CTAButton } from './CTAButton'
import { whatsappLink } from '../../lib/site'

interface PriceCardProps {
  programTitle: string
  badge?: string
  headline?: string
  items?: string[]
  note?: string
  image: { src: string; alt: string }
}

export function PriceCard({ programTitle, badge, headline, items, note, image }: PriceCardProps) {
  const hasPricing = !!items && items.length > 0

  if (!hasPricing) {
    return (
      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800">
        <div className="relative h-48 w-full overflow-hidden">
          <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent" />
        </div>
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <h3 className="text-lg font-bold text-white">¿Cuánto cuesta {programTitle}?</h3>
          <p className="text-sm leading-relaxed text-white/70">
            El valor varía según tus fechas y perfil. Escríbenos y un asesor te cuenta el costo actualizado sin compromiso.
          </p>
          <CTAButton
            href={whatsappLink(`¡Hola! Quiero conocer el valor de ${programTitle}.`)}
            icon={false}
            className="mt-2 w-full"
          >
            <MessageCircle className="size-4" />
            Consultar valor
          </CTAButton>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand/40 bg-ink-800 p-6 shadow-[0_0_60px_-15px_rgba(249,176,0,0.35)] sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-brand/15 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        {badge && (
          <span className="w-fit rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-xs font-bold uppercase tracking-wide text-brand">
            {badge}
          </span>
        )}
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">{headline ?? `Inversión de ${programTitle}`}</h3>

        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-white/80 sm:text-base">
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

        {note && <p className="text-center text-xs text-white/50">{note}</p>}
      </div>
    </div>
  )
}
