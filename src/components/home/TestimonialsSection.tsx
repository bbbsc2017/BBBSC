import { Quote, Star } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { GradientBlob } from '../ui/GradientBlob'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <GradientBlob tone="brand" className="right-[-10%] top-10 size-72 sm:size-96" />
      <Container className="relative flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Testimonios"
          title="Nuestros Bravers"
          description="Historias reales de quienes ya vivieron su experiencia de intercambio con nosotros."
        />

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  src={testimonial.image.src}
                  alt={testimonial.image.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800 to-ink-800/10" />
                <Quote className="absolute right-4 top-4 size-6 text-brand" />
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-brand text-brand" />
                  ))}
                </div>

                <p className="flex-1 text-sm leading-relaxed text-white/80">&ldquo;{testimonial.quote}&rdquo;</p>

                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                    {initials(testimonial.name)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-bold text-white">{testimonial.name}</span>
                    <span className="text-xs text-white/50">{testimonial.program}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
