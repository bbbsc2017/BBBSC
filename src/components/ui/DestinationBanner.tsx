import { Container } from './Container'

interface DestinationBannerProps {
  image: { src: string; alt: string }
  caption: string
}

export function DestinationBanner({ image, caption }: DestinationBannerProps) {
  return (
    <div className="relative -mt-10 sm:-mt-14">
      <Container>
        <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 sm:h-80">
          <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
          <p className="absolute bottom-4 left-5 text-sm font-medium text-white/80 sm:bottom-6 sm:left-8 sm:text-base">{caption}</p>
        </div>
      </Container>
    </div>
  )
}
