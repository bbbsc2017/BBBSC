import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, GraduationCap, Plane, Sparkles } from 'lucide-react'
import { CTAButton } from '../ui/CTAButton'
import { Container } from '../ui/Container'

const stats = [
  { label: 'Años de experiencia', value: '10+' },
  { label: 'Estudiantes conectados con el mundo', value: '3.000+' },
  { label: 'Programas y destinos', value: '15+' },
]

const destinations = [
  {
    to: '/work-and-travel-usa',
    country: 'Estados Unidos',
    label: 'Work and Travel USA',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
      alt: 'Nueva York, Estados Unidos',
    },
  },
  {
    to: '/espana-ti',
    country: 'España',
    label: 'Trainee & Internship',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/SF_maig_2_cropped.jpg',
      alt: 'Sagrada Família, Barcelona, España',
    },
  },
  {
    to: '/asia',
    country: 'Asia',
    label: 'Trainee & Internship',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mal%C3%A9.jpg/1280px-Mal%C3%A9.jpg',
      alt: 'Malé, Islas Maldivas',
    },
  },
  {
    to: '/canada',
    country: 'Canadá',
    label: 'Estudia en Canadá',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/1280px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg',
      alt: 'Toronto, Canadá',
    },
  },
  {
    to: '/australia',
    country: 'Australia',
    label: 'Estudia en Australia',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/1280px-Sydney_Australia._%2821339175489%29.jpg',
      alt: 'Ópera de Sídney, Australia',
    },
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % destinations.length)
    }, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const nextImage = new Image()
    nextImage.src = destinations[(index + 1) % destinations.length].image.src
  }, [index])

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <img key={destinations[index].image.src} src={destinations[index].image.src} alt="" fetchPriority="high" className="absolute inset-0 size-full animate-[fadeIn_1.2s_ease-in-out] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[#1c1c1c] via-[#1c1c1c]/65 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#1c1c1c]/20 to-transparent" />
      </div>

      <Container className="relative flex flex-col gap-12 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-28">
        <div className="flex flex-col items-start gap-7 text-left lg:max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
            <Sparkles className="size-3.5" />
            Expertos en Work &amp; Travel y experiencias internacionales
          </span>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Trabaja, estudia y <span className="text-brand">vive el mundo</span>
          </h1>

          <p className="max-w-xl text-balance text-base text-white/70 sm:text-lg">
            Encuentra programas Work and Travel, prácticas y estudios en el exterior con acompañamiento antes, durante y después de tu viaje.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <CTAButton to="/work-and-travel-usa">Explora los programas</CTAButton>
            <CTAButton to="/contacto" variant="ghost">
              Cuéntanos tu plan
            </CTAButton>
          </div>

          <div className="grid w-full grid-cols-3 gap-3 pt-4 sm:max-w-lg sm:gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur sm:px-6 sm:py-5">
                <p className="text-xl font-extrabold text-brand sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium text-white/60 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-xs font-semibold uppercase tracking-wide text-white/40">
            <span className="flex items-center gap-2">
              <Plane className="size-4 text-brand" /> Work &amp; Travel
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="size-4 text-brand" /> Programas académicos
            </span>
            <span className="flex items-center gap-2">
              <Globe2 className="size-4 text-brand" /> Universidades y destinos
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-72">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">Destinos destacados</p>
          <ul className="flex flex-col gap-2">
            {destinations.map((dest, i) => {
              const active = i === index
              return (
                <li key={dest.to}>
                  <Link
                    to={dest.to}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 backdrop-blur transition-all duration-500 ${
                      active
                        ? 'border-brand/40 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className={`text-[11px] font-bold uppercase tracking-wide ${active ? 'text-brand' : 'text-white/40'}`}>
                        {dest.country}
                      </span>
                      <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-white/70'}`}>{dest.label}</span>
                    </span>
                    <ArrowRight
                      className={`size-4 shrink-0 transition-all duration-300 ${
                        active ? 'translate-x-0 text-brand opacity-100' : '-translate-x-1 text-white/30 opacity-0'
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}
