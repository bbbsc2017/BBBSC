import { useEffect, useState } from 'react'

const slides = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1600px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
    alt: 'Nueva York, Estados Unidos',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
    alt: 'Sagrada Família, Barcelona, España',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1600px-Sydney_Australia._%2821339175489%29.jpg',
    alt: 'Ópera de Sídney, Australia',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/1600px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg',
    alt: 'Toronto, Canadá',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/St_Sebastian_Curtain_%28cropped%29.jpg/1600px-St_Sebastian_Curtain_%28cropped%29.jpg',
    alt: 'La Valeta, Malta',
  },
]

export function HeroBackgroundCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          className={`absolute inset-0 size-full object-cover transition-all duration-[1800ms] ease-in-out ${
            i === index ? 'scale-100 opacity-100 blur-none' : 'scale-105 opacity-0 blur-lg'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/75 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
    </div>
  )
}
