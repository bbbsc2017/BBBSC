import { Check, MessageCircle, Phone } from 'lucide-react'
import { CTAButton } from './CTAButton'
import { whatsappLink, SITE } from '../../lib/site'
import { InterestForm } from './InterestForm'

interface ContactCardProps {
  programTitle: string
  image?: { src: string; alt: string }
  pricing?: {
    badge?: string
    headline?: string
    /** `originalAmount`, si viene, se muestra tachado (con animación de barrido
     *  en bucle) arriba del precio grande — para promociones tipo "antes/ahora". */
    price?: { amount: string; unit?: string; originalAmount?: string }
    items: string[]
    note?: string
  }
  registrationTo?: string
  formKey?: string
  interestTag?: string
}

export function ContactCard({ programTitle, image, pricing, registrationTo, formKey, interestTag }: ContactCardProps) {
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
              {pricing.price.originalAmount && (
                <span className="relative inline-block text-sm font-bold text-white/40">
                  {pricing.price.originalAmount}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 animate-[strike-sweep_4s_ease-in-out_infinite] bg-red-400/80"
                  />
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Desde</span>
              <div className="flex flex-wrap items-end justify-center gap-2">
                <span className="animate-[price-glow_2.6s_ease-in-out_infinite] text-6xl font-extrabold text-white sm:text-7xl">
                  {pricing.price.amount}
                </span>
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

          {registrationTo ? (
            <>
              <CTAButton to={registrationTo} icon={false} className="w-full">
                ¡Inscríbete ya!
              </CTAButton>
              <CTAButton
                href={whatsappLink(`¡Hola! Tengo dudas sobre ${programTitle}.`)}
                icon={false}
                variant="ghost"
                className="w-full"
              >
                Prefiero escribir por WhatsApp
              </CTAButton>
            </>
          ) : formKey && interestTag ? <>
            <div className="w-full border-t border-white/10 pt-5 text-left"><h4 className="mb-1 text-base font-bold text-white">¿Listo para aplicar?</h4><p className="mb-4 text-xs leading-5 text-white/55">Déjanos tus datos y un asesor te contará cómo iniciar.</p><InterestForm formKey={formKey} programTitle={programTitle} interestTag={interestTag} /></div>
            <CTAButton href={whatsappLink(`¡Hola! Quiero más información sobre ${programTitle}.`)} icon={false} variant="ghost" className="w-full">Prefiero escribir por WhatsApp</CTAButton>
          </> : <CTAButton href={whatsappLink(`¡Hola! Quiero inscribirme a ${programTitle}.`)} icon={false} className="w-full">¡Inscríbete ya!</CTAButton>}

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
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-white">
          <MessageCircle className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-white">¿Listo para aplicar?</h3>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            Un asesor te cuenta requisitos, costos y fechas de {programTitle} sin costo ni compromiso.
          </p>
        </div>
        {formKey && interestTag && <InterestForm formKey={formKey} programTitle={programTitle} interestTag={interestTag} />}
        <CTAButton href={whatsappLink(`¡Hola! Quiero más información sobre ${programTitle}.`)} icon={false} variant={formKey ? 'ghost' : 'primary'} className="w-full">Escríbenos por WhatsApp</CTAButton>
        <a href={`tel:${SITE.phones.ibague}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-white/70 hover:text-brand">
          <Phone className="size-4" />
          {SITE.whatsappDisplay}
        </a>
      </div>
    </div>
  )
}
