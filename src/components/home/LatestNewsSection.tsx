import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLatestBlogPosts } from '../../data/blogPosts'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { BlogPostCard } from '../ui/BlogPostCard'

const latestPosts = getLatestBlogPosts(6)

export function LatestNewsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="BBB News"
          title="Últimas noticias del blog"
          description="Guías de visa, novedades de programas y consejos prácticos, directo de nuestro equipo de asesores."
        />

        <div className="flex w-full gap-5 overflow-x-auto pb-2 [scrollbar-width:none] snap-x snap-mandatory sm:gap-6">
          {latestPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} className="w-[85%] shrink-0 snap-center sm:w-[45%] lg:w-[31%]" />
          ))}

          <Link
            to="/blog"
            className="group flex w-[85%] shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/10 sm:w-[45%] lg:w-[31%]"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-brand/15 text-brand transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="size-5" />
            </span>
            <span className="text-base font-bold text-white">Ver todo el blog</span>
            <span className="text-sm text-white/60">Todas las guías y noticias en un solo lugar</span>
          </Link>
        </div>
      </Container>
    </section>
  )
}
