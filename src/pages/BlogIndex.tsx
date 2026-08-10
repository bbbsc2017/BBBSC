import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Newspaper, Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { GradientBlob } from '../components/ui/GradientBlob'
import { BlogPostCard } from '../components/ui/BlogPostCard'
import { blogPosts, type BlogPost } from '../data/blogPosts'
import { formatDate } from '../lib/site'

const categories: Array<BlogPost['category']> = ['Embajada', 'Programas', 'Consejos']

export default function BlogIndex() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'Todos los blogs' | BlogPost['category']>('Todos los blogs')

  const sorted = useMemo(() => [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [])
  const featured = sorted[0]

  const sameCategoryPosts = useMemo(
    () => sorted.filter((post) => post.slug !== featured.slug && post.category === featured.category).slice(0, 4),
    [sorted, featured],
  )

  const excludedSlugs = useMemo(
    () => new Set([featured.slug, ...sameCategoryPosts.map((post) => post.slug)]),
    [featured, sameCategoryPosts],
  )

  const searchTerm = search.trim().toLowerCase()

  const gridPosts = sorted.filter((post) => {
    if (excludedSlugs.has(post.slug)) return false
    if (activeCategory !== 'Todos los blogs' && post.category !== activeCategory) return false
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm) && !post.excerpt.toLowerCase().includes(searchTerm)) {
      return false
    }
    return true
  })

  const categoryCount = (category: 'Todos los blogs' | BlogPost['category']) =>
    category === 'Todos los blogs' ? blogPosts.length : blogPosts.filter((post) => post.category === category).length

  return (
    <>
      <Seo
        title="Blog — BBB News"
        description="Guías de visa, novedades de programas Work & Travel y consejos prácticos para tu próxima experiencia internacional."
        path="/blog"
      />

      <section className="relative overflow-hidden bg-ink-mesh py-14 sm:py-16">
        <GradientBlob tone="brand" className="left-[-15%] top-0 size-72 sm:size-96" />
        <Container className="relative flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand backdrop-blur">
            <Newspaper className="size-3.5" />
            BBB News
          </span>
          <h1 className="max-w-2xl text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Noticias, guías y consejos para tu próxima experiencia
          </h1>
          <p className="max-w-xl text-balance text-sm text-white/70 sm:text-base">
            Todo lo que necesitas saber sobre visas, programas de intercambio y vida en el exterior.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:h-fit">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar en el blog..."
                className="w-full rounded-xl border border-white/15 bg-ink-800 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand"
              />
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">Categorías</p>
              <ul className="flex flex-col gap-1">
                {(['Todos los blogs', ...categories] as const).map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                        activeCategory === category ? 'bg-brand/15 text-brand' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {category}
                      <span className="text-xs font-normal text-white/40">{categoryCount(category)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex flex-col gap-14">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Link
                to={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-ink-800 transition-all duration-300 hover:border-brand/40 sm:grid-cols-2"
              >
                <div className="relative h-48 w-full overflow-hidden sm:h-full">
                  <img
                    src={featured.image.src}
                    alt={featured.image.alt}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent sm:bg-gradient-to-r" />
                </div>
                <div className="flex flex-col justify-center gap-3 p-6">
                  <span className="w-fit rounded-full bg-brand/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                    Destacado · {featured.category}
                  </span>
                  <h2 className="text-balance text-lg font-extrabold leading-snug text-white">{featured.title}</h2>
                  <p className="text-balance text-sm leading-relaxed text-white/70">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{formatDate(featured.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </Link>

              <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-800 p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white/50">Más de {featured.category}</h3>
                <ul className="flex flex-col gap-4">
                  {sameCategoryPosts.map((post) => (
                    <li key={post.slug}>
                      <Link to={`/blog/${post.slug}`} className="group flex items-center gap-3">
                        <span className="size-14 shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={post.image.src}
                            alt={post.image.alt}
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brand">
                            {post.title}
                          </span>
                          <span className="text-xs text-white/50">{formatDate(post.date)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                  {sameCategoryPosts.length === 0 && <p className="text-sm text-white/50">Pronto más artículos de esta categoría.</p>}
                </ul>
                <Link
                  to="/blog"
                  onClick={() => setActiveCategory(featured.category)}
                  className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  Ver toda la categoría
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>

            {gridPosts.length === 0 && (
              <p className="text-center text-sm text-white/60">No encontramos artículos con esos filtros.</p>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
