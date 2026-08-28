import { useState, type TouchEvent } from 'react'
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react'

interface OfferGalleryProps {
  images: string[]
  alt: string
}

// Galería tipo WooCommerce: imagen grande arriba + tira de miniaturas
// debajo, cada una con sus propias 4 esquinas redondeadas (separadas por
// un espacio, no fundidas en un solo bloque). Con más de una foto se
// comporta como un carrusel (flechas + swipe en táctil) que desliza con
// animación entre fotos; con una sola foto (o ninguna) se ve igual que
// antes, sin controles ni tira de miniaturas.
export function OfferGallery({ images, alt }: OfferGalleryProps) {
  const [active, setActive] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const photos = images.filter(Boolean)
  const hasCarousel = photos.length > 1

  function goTo(index: number) {
    setActive((index + photos.length) % photos.length)
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (!hasCarousel) return
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (!hasCarousel || touchStartX === null) return
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
    // Umbral chico para que un swipe intencional navegue sin que un simple
    // tap o un scroll vertical accidental cambie la foto.
    if (Math.abs(deltaX) > 40) goTo(active + (deltaX < 0 ? 1 : -1))
    setTouchStartX(null)
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand/25 via-ink-700 to-ink"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {photos.length > 0 ? (
          // Pista con todas las fotos una al lado de la otra; cambiar de
          // foto solo mueve el transform, así el navegador anima el
          // deslizamiento en vez de reemplazar la imagen de golpe.
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ width: `${photos.length * 100}%`, transform: `translateX(-${(active * 100) / photos.length}%)` }}
          >
            {photos.map((src, index) => (
              <img
                key={src + index}
                src={src}
                alt={index === active ? alt : ''}
                style={{ width: `${100 / photos.length}%` }}
                className="h-full shrink-0 object-cover"
              />
            ))}
          </div>
        ) : (
          <Building2 className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/10" />
        )}
        {hasCarousel && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:bg-ink/80"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Siguiente foto"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:bg-ink/80"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/50 px-2.5 py-1.5 backdrop-blur">
              {photos.map((src, index) => (
                <span
                  key={src + index}
                  className={`size-1.5 rounded-full transition-colors ${index === active ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {hasCarousel && (
        <div className="flex gap-2 overflow-x-auto rounded-2xl bg-ink-900/60 p-3">
          {photos.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => goTo(index)}
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
