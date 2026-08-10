import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLatestBlogPosts } from '../../data/blogPosts'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { BlogPostCard } from '../ui/BlogPostCard'

const latestPosts = getLatestBlogPosts(6)

export function LatestNewsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStateRef = useRef({ startX: 0, startScrollLeft: 0, moved: false })

  useEffect(() => {
    if (paused || dragging) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % latestPosts.length)
    }, 4500)
    return () => clearInterval(id)
  }, [paused, dragging])

  useEffect(() => {
    if (dragging) return
    const container = scrollerRef.current
    const card = container?.children[index] as HTMLElement | undefined
    if (!container || !card) return
    // Se calcula manualmente en vez de usar scrollIntoView: ese método puede mover el scroll
    // vertical de toda la página para "asegurar" visibilidad, aunque el usuario esté leyendo
    // otra sección. scrollTo aquí solo afecta el scroll horizontal de este carrusel.
    const delta = card.getBoundingClientRect().left - container.getBoundingClientRect().left
    container.scrollTo({ left: container.scrollLeft + delta, behavior: 'smooth' })
  }, [index, dragging])

  function snapToClosestCard() {
    const container = scrollerRef.current
    if (!container) return
    let closest = 0
    let minDistance = Infinity
    Array.from(container.children).forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - container.scrollLeft)
      if (distance < minDistance) {
        minDistance = distance
        closest = i
      }
    })
    setIndex(Math.min(closest, latestPosts.length - 1))
  }

  function handleMouseDown(event: React.MouseEvent) {
    const container = scrollerRef.current
    if (!container) return
    dragStateRef.current = { startX: event.pageX, startScrollLeft: container.scrollLeft, moved: false }
    setDragging(true)

    function handleMouseMove(moveEvent: MouseEvent) {
      if (!container) return
      const delta = moveEvent.pageX - dragStateRef.current.startX
      if (Math.abs(delta) > 3) dragStateRef.current.moved = true
      container.scrollLeft = dragStateRef.current.startScrollLeft - delta
    }

    function handleMouseUp() {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      setDragging(false)
      snapToClosestCard()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  function handleClickCapture(event: React.MouseEvent) {
    // Evita que un arrastre termine navegando accidentalmente al link de la tarjeta.
    if (dragStateRef.current.moved) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <section className="relative py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="BBB News"
          title="Últimas noticias del blog"
          description="Guías de visa, novedades de programas y consejos prácticos, directo de nuestro equipo de asesores."
        />

        <div
          ref={scrollerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onMouseDown={handleMouseDown}
          onClickCapture={handleClickCapture}
          className={`flex w-full items-stretch gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-6 ${
            dragging ? 'cursor-grabbing select-none snap-none' : 'cursor-grab snap-x snap-mandatory'
          }`}
        >
          {latestPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} className="w-[85%] shrink-0 snap-center sm:w-[45%] lg:w-[31%]" />
          ))}

          <Link
            to="/blog"
            draggable={false}
            className="group flex w-[85%] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/10 sm:w-[45%] lg:w-[31%]"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-brand/15 text-brand transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="size-5" />
            </span>
            <span className="text-base font-bold text-white">Ver todo el blog</span>
            <span className="text-sm text-white/60">Todas las guías y noticias en un solo lugar</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {latestPosts.map((post, i) => (
            <button
              key={post.slug}
              type="button"
              aria-label={`Ir a la publicación ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
