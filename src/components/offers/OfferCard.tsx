import { ArrowUpRight, Building2, CircleX, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { compensationLabel, isOfferAvailable, offerPath, programLabel, type JobOffer } from '../../lib/offers'
import { OfferCountdown } from './OfferCountdown'

export function OfferCard({ offer }: { offer: JobOffer }) {
  const available = isOfferAvailable(offer)
  return <article className="group flex min-h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-2xl hover:shadow-black/25">
    <Link to={offerPath(offer)} className="relative block aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand/20 via-ink-700 to-ink">
      {offer.imageSrc ? <img src={offer.imageSrc} alt={`${offer.title} con ${offer.employer} en ${offer.city}, ${offer.state}`} className="size-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" /> : <Building2 className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-white/15" />}
      <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand backdrop-blur">{programLabel(offer.program)}</span>
      <span className={`absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${available ? 'bg-emerald-400 text-ink' : 'bg-red-400 text-white'}`}>{available ? <><Users className="mr-1 inline size-3" />{offer.vacanciesAvailable} vacantes</> : <><CircleX className="mr-1 inline size-3" />No disponible</>}</span>
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-brand">{offer.sponsor}</p>
      <h2 className="mt-2 text-xl font-extrabold leading-tight text-white"><Link to={offerPath(offer)}>{offer.title}</Link></h2>
      <p className="mt-2 text-sm font-semibold text-white/65">{offer.employer}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/45"><span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5"><MapPin className="mr-1.5 size-3.5 text-brand" />{offer.city}, {offer.state}</span><span className="rounded-full bg-white/5 px-3 py-1.5">{offer.offerType}</span></div>
      <div className={`mt-4 rounded-xl border px-3 py-2.5 text-xs ${available ? 'border-emerald-400/20 bg-emerald-400/[0.07]' : 'border-red-400/15 bg-red-400/[0.06]'}`} aria-live="off"><OfferCountdown availableUntil={offer.availableUntil} available={available} /></div>
      <div className="mt-auto flex items-end justify-between gap-4 pt-6"><div><p className="text-[10px] uppercase tracking-wider text-white/35">{offer.compensationType === 'stipend' ? 'Estipendio' : 'Salario'}</p><p className="mt-1 font-extrabold text-white">{compensationLabel(offer)}</p></div><Link to={offerPath(offer)} aria-label={`Revisar ${offer.title}`} className="inline-flex shrink-0 items-center rounded-full bg-brand px-4 py-2.5 text-xs font-extrabold text-white transition group-hover:-translate-y-0.5">Revisar oferta<ArrowUpRight className="ml-2 size-4" /></Link></div>
    </div>
  </article>
}
