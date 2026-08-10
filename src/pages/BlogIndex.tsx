import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { GradientBlob } from '../components/ui/GradientBlob'
import { BlogPostCard } from '../components/ui/BlogPostCard'
import { blogPosts, type BlogPost } from '../data/blogPosts'
import { formatDate } from '../lib/site'

const categories: Array<BlogPost['category'] | 'Todos'> = ['Todos', 'Embajada', 'Programas', 'Consejos']

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Todos')

  const sorted = useMemo(() => [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [])
  const [featured, ...rest] = sorted
  const filtered = activeCategory === 'Todos' ? rest : rest.filter((post) => post.category === activeCategory)

  return (
    <>
      <Seo
        title="Blog — BBB News"
        description="Guías de visa, novedades de programas Work & Travel y consejos prácticos para tu próxima experiencia internacional."
        path="/blog"
      />

      <section className="relative overflow-hidden bg-ink-mesh py-16 sm:py-20">
        <GradientBlob tone="brand" className="left-[-15%] top-0 size-72 sm:size-96" />
        <Container className="relative flex flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
            <Newspaper className="size-3.5" />
            BBB News
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Noticias, guías y consejos para tu próxima experiencia
          </h1>
          <p className="max-w-xl text-balance text-base text-white/70 sm:text-lg">
            Todo lo que necesitas saber sobre visas, programas de intercambio y vida en el exterior, escrito por
            nuestro equipo de asesores.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-14">
          {featured && (
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition-all duration-300 hover:border-brand/40 lg:grid-cols-2"
            >
              <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-full">
                <img
                  src={featured.image.src}
                  alt={featured.image.alt}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent lg:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
                <span className="w-fit rounded-full bg-brand/15 px-4 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                  Publicación destacada · {featured.category}
                </span>
                <h2 className="text-balance text-2xl font-extrabold leading-tight text-white sm:text-3xl">{featured.title}</h2>
                <p className="text-balance text-base leading-relaxed text-white/70">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-xs font-medium text-white/50">
                  <span>{formatDate(featured.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featured.readTime}</span>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-bold text-brand">
                  Leer artículo completo
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  activeCategory === category
                    ? 'border-brand/40 bg-brand/15 text-brand'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-white/60">Todavía no hay publicaciones en esta categoría.</p>
          )}
        </Container>
      </section>
    </>
  )
}
