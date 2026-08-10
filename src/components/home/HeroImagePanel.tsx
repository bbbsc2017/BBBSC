import { useEffect, useState } from 'react'

const slides = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
    alt: 'Nueva York, Estados Unidos',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
    alt: 'Sagrada Família, Barcelona, España',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1280px-Sydney_Australia._%2821339175489%29.jpg',
    alt: 'Ópera de Sídney, Australia',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/1280px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg',
    alt: 'Toronto, Canadá',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/St_Sebastian_Curtain_%28cropped%29.jpg/1280px-St_Sebastian_Curtain_%28cropped%29.jpg',
    alt: 'La Valeta, Malta',
  },
]

export function HeroImagePanel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand/25 blur-3xl sm:-inset-10"
      />
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 sm:aspect-[4/5] lg:aspect-[3/4]">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[1800ms] ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2 sm:inset-x-5 sm:bottom-5">
          <div className="flex gap-1.5">
            {slides.map((slide, i) => (
              <span
                key={slide.src}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
          <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            {slides[index].alt.split(',')[0]}
          </span>
        </div>
      </div>
    </div>
  )
}
