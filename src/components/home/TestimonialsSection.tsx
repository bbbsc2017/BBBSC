import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { GradientBlob } from '../ui/GradientBlob'
import { whatsappLink } from '../../lib/site'
import { CTAButton } from '../ui/CTAButton'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(id)
  }, [paused])

  function goTo(next: number) {
    setIndex((next + testimonials.length) % testimonials.length)
  }

  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <GradientBlob tone="brand" className="right-[-10%] top-10 size-72 sm:size-96" />
      <Container className="relative flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Testimonios"
          title="Nuestros Bravers"
          description="Historias reales de quienes ya vivieron su experiencia de intercambio con nosotros."
        />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="grid w-full max-w-4xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]"
        >
          <div className="relative mx-auto h-80 w-80 sm:h-[26rem] sm:w-[26rem]">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              >
                <div className="absolute left-0 top-2 h-56 w-56 -rotate-6 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40 sm:h-72 sm:w-72">
                  <img src={testimonial.images[0].src} alt={testimonial.images[0].alt} loading="lazy" decoding="async" className="size-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-0 h-56 w-56 rotate-6 overflow-hidden rounded-[2rem] border-4 border-ink shadow-2xl shadow-black/40 sm:h-72 sm:w-72">
                  <img src={testimonial.images[1].src} alt={testimonial.images[1].alt} loading="lazy" decoding="async" className="size-full object-cover" />
                </div>
              </div>
            ))}
          </div>

          <div className="relative min-h-[300px] sm:min-h-[280px]">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                className={`absolute inset-0 flex flex-col gap-5 rounded-3xl border border-white/10 bg-ink-800 p-7 transition-opacity duration-700 sm:p-8 ${
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                      {initials(testimonial.name)}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-bold text-white">{testimonial.name}</span>
                      <span className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                          <Star key={starIndex} className="size-3 fill-brand text-brand" />
                        ))}
                      </span>
                    </span>
                  </div>
                  <Quote className="size-6 shrink-0 text-brand/60" />
                </div>

                <p className="flex-1 text-sm leading-relaxed text-white/80 sm:text-base">&ldquo;{testimonial.quote}&rdquo;</p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/40">{testimonial.program}</span>
                  <CTAButton
                    href={whatsappLink(`¡Hola! Vi el testimonio de ${testimonial.name} sobre ${testimonial.program} y quiero saber más.`)}
                    icon={false}
                    variant="ghost"
                    className="!px-4 !py-1.5 !text-xs"
                  >
                    Ver más
                  </CTAButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Testimonio anterior"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {testimonials.map((testimonial, i) => (
              <button
                key={testimonial.name}
                type="button"
                aria-label={`Ir al testimonio de ${testimonial.name}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente testimonio"
            className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand hover:text-brand"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </Container>
    </section>
  )
}
