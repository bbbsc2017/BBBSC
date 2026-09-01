import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { DestinationBanner } from '../components/ui/DestinationBanner'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { BlogPostCard } from '../components/ui/BlogPostCard'
import { CommentsSection } from '../components/blog/CommentsSection'
import { fetchPost, fetchPosts, type PublicPost, type PublicPostDetail } from '../lib/api'
import { SITE, breadcrumbJsonLd, formatDate, whatsappLink } from '../lib/site'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<PublicPostDetail | null | undefined>(undefined)
  const [allPosts, setAllPosts] = useState<PublicPost[]>([])

  useEffect(() => {
    setPost(undefined)
    fetchPost(slug).then(setPost)
    fetchPosts().then(setAllPosts)
  }, [slug])

  if (post === null) return <Navigate to="/blog" replace />
  if (!post) {
    return (
      <section className="py-24 text-center text-sm text-white/50">
        <Container>Cargando artículo...</Container>
      </section>
    )
  }

  const related = allPosts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3)
  const relatedPosts = related.length > 0 ? related : allPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const breadcrumbs = [{ label: 'Inicio', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.image.src}
        imageAlt={post.image.alt}
        publishedTime={post.date}
        jsonLd={[
          breadcrumbJsonLd(breadcrumbs, `/blog/${post.slug}`),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            image: post.image.src,
            mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
            author: { '@type': 'Person', name: post.author.name, jobTitle: post.author.role },
            publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          },
        ]}
      />

      <DetailHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={breadcrumbs}
      />

      <DestinationBanner image={post.image} caption={`${formatDate(post.date)} · ${post.readTime}`} />

      <section className="pt-16 sm:pt-20">
        <Container className="mx-auto flex max-w-3xl items-center gap-3 border-b border-white/10 pb-8">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
            {post.author.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold text-white">{post.author.name}</span>
            <span className="text-xs text-white/50">
              {post.author.role} · {formatDate(post.date)} · {post.readTime}
            </span>
          </span>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

          <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-brand/30 bg-ink-800 p-8 text-center">
            <h3 className="text-lg font-bold text-white">¿Tienes dudas sobre tu proceso?</h3>
            <p className="max-w-sm text-sm text-white/70">
              Escríbenos por WhatsApp y un asesor te ayuda sin costo ni compromiso.
            </p>
            <CTAButton href={whatsappLink(`¡Hola! Tengo una pregunta sobre el artículo "${post.title}".`)} icon={false}>
              Escríbenos por WhatsApp
            </CTAButton>
          </div>

          <CommentsSection postSlug={post.slug} postTitle={post.title} />
        </Container>
      </section>

      <section className="border-t border-white/10 bg-black/15 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold text-white">Sigue leyendo</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {relatedPosts.map((item) => (
              <BlogPostCard key={item.slug} post={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
