import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpenText, Layers3, Newspaper, Search } from 'lucide-react'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { BlogPostCard } from '../components/ui/BlogPostCard'
import { ShowcaseHero } from '../components/ui/ShowcaseHero'
import { fetchPosts, sortByDateDesc, type PublicPost } from '../lib/api'
import { SITE, breadcrumbJsonLd, formatDate } from '../lib/site'

const categories: Array<PublicPost['category']> = ['Embajada', 'Programas', 'Consejos']

export default function BlogIndex() {
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<'Todos los blogs' | PublicPost['category']>('Todos los blogs')

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  const sorted = useMemo(() => sortByDateDesc(posts), [posts])
  const featured = sorted[0]

  const sameCategoryPosts = useMemo(
    () => (featured ? sorted.filter((post) => post.slug !== featured.slug && post.category === featured.category).slice(0, 4) : []),
    [sorted, featured],
  )

  const searchTerm = search.trim().toLowerCase()

  // El destacado y los de "Más de <categoría>" también aparecen aquí: al subir una entrada
  // nueva pasa a ser el destacado, pero sigue viéndose junto con el resto más abajo.
  const gridPosts = sorted.filter((post) => {
    if (activeCategory !== 'Todos los blogs' && post.category !== activeCategory) return false
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm) && !post.excerpt.toLowerCase().includes(searchTerm)) {
      return false
    }
    return true
  })

  const categoryCount = (category: 'Todos los blogs' | PublicPost['category']) =>
    category === 'Todos los blogs' ? posts.length : posts.filter((post) => post.category === category).length

  if (loading) {
    return (
      <section className="py-24 text-center text-sm text-white/50">
        <Container>Cargando publicaciones...</Container>
      </section>
    )
  }

  if (!featured) {
    return (
      <section className="py-24 text-center text-sm text-white/50">
        <Container>Todavía no hay publicaciones en el blog.</Container>
      </section>
    )
  }

  const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Blog' }]

  return (
    <>
      <Seo
        title="Blog — BBB News"
        description="Guías de visa, novedades de programas Work & Travel y consejos prácticos para tu próxima experiencia internacional."
        path="/blog"
        image={featured.image.src}
        imageAlt={featured.image.alt}
        jsonLd={[
          breadcrumbJsonLd(breadcrumbs, '/blog'),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Blog — BBB News',
            url: `${SITE.url}/blog`,
            isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
          },
        ]}
      />

      <ShowcaseHero
        eyebrow="BBB News"
        title="Noticias, guías y consejos para tu próxima experiencia"
        description="Todo lo que necesitas saber sobre visas, programas de intercambio y vida en el exterior."
        image={featured.image}
        imageKey={featured.slug}
        items={[
          { label: 'Publicaciones', value: `${posts.length} artículos disponibles`, icon: Newspaper },
          { label: 'Embajada', value: `${categoryCount('Embajada')} publicaciones`, icon: BookOpenText },
          { label: 'Programas', value: `${categoryCount('Programas')} publicaciones`, icon: Layers3 },
          { label: 'Consejos', value: `${categoryCount('Consejos')} publicaciones`, icon: BookOpenText },
        ]}
        itemHeading="Explora BBB News"
        primaryAction={{ label: 'Leer noticia destacada', to: `/blog/${featured.slug}` }}
        secondaryAction={{ label: 'Ver publicaciones', to: '#publicaciones' }}
        breadcrumbs={breadcrumbs}
      />

      <section id="publicaciones" className="scroll-mt-24 py-16 sm:py-20">
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
                    loading="lazy"
                    decoding="async"
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
                            decoding="async"
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

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Todas las publicaciones</span>
              <span className="h-px flex-1 bg-white/10" />
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
