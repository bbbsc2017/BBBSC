import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const destinations = [
  {
    to: '/programas-culturales/work-and-travel-usa',
    country: 'Estados Unidos',
    label: 'Work and Travel USA',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
      alt: 'Nueva York, Estados Unidos',
    },
  },
  {
    to: '/programas-culturales/espana-ti',
    country: 'España',
    label: 'Trainee & Internship',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
      alt: 'Sagrada Família, Barcelona, España',
    },
  },
  {
    to: '/programas-culturales/asia',
    country: 'Asia',
    label: 'Trainee & Internship',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mal%C3%A9.jpg/1280px-Mal%C3%A9.jpg',
      alt: 'Malé, Islas Maldivas',
    },
  },
  {
    to: '/programas-academicos/canada',
    country: 'Canadá',
    label: 'Estudia en Canadá',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/1280px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg',
      alt: 'Toronto, Canadá',
    },
  },
  {
    to: '/programas-academicos/australia',
    country: 'Australia',
    label: 'Estudia en Australia',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1280px-Sydney_Australia._%2821339175489%29.jpg',
      alt: 'Ópera de Sídney, Australia',
    },
  },
]

export function HeroDestinationsGallery() {
  return (
    <div className="flex h-[340px] gap-3 overflow-x-auto pb-2 [scrollbar-width:none] snap-x snap-mandatory sm:h-[400px] md:h-[440px] md:gap-4 md:overflow-visible md:pb-0 lg:h-[480px]">
      {destinations.map((dest) => (
        <Link
          key={dest.to}
          to={dest.to}
          className="group relative h-full shrink-0 basis-[78%] snap-center overflow-hidden rounded-3xl border border-white/10 transition-[flex-grow] duration-500 ease-in-out sm:basis-[55%] md:shrink md:basis-0 md:flex-1 md:hover:flex-[2.6]"
        >
          <img
            src={dest.image.src}
            alt={dest.image.alt}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 sm:inset-x-5 sm:bottom-5">
            <span className="text-xs font-bold uppercase tracking-wide text-brand">{dest.country}</span>
            <span className="text-base font-extrabold leading-tight text-white sm:text-lg">{dest.label}</span>
            <span className="flex max-h-0 items-center gap-1 overflow-hidden text-xs font-semibold text-white/80 opacity-0 transition-all duration-300 group-hover:max-h-6 group-hover:opacity-100">
              Ver programa
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
