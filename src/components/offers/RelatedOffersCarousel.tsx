import { OfferCard } from './OfferCard'
import type { JobOffer } from '../../lib/offers'

export function RelatedOffersCarousel({ title, offers }: { title: string; offers: JobOffer[] }) {
  if (offers.length === 0) return null
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-black text-white sm:text-3xl">{title}</h2>
      <div className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
        {offers.map((item) => (
          <div key={item.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
            <OfferCard offer={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
