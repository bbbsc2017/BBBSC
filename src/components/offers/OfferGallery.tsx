import { useState } from 'react'
import { Building2 } from 'lucide-react'

interface OfferGalleryProps {
  images: string[]
  alt: string
}

// Galería tipo WooCommerce: imagen grande arriba + tira de miniaturas
// scrolleable abajo. Si solo hay una foto (o ninguna), se ve igual que antes.
export function OfferGallery({ images, alt }: OfferGalleryProps) {
  const [active, setActive] = useState(0)
  const photos = images.filter(Boolean)
  const current = photos[active] ?? photos[0]

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative min-h-72 flex-1 overflow-hidden bg-gradient-to-br from-brand/25 via-ink-700 to-ink sm:min-h-[400px]">
        {current ? (
          <img src={current} alt={alt} className="absolute inset-0 size-full object-cover" />
        ) : (
          <Building2 className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-ink-900/60 p-3">
          {photos.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === active ? 'border-brand' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
