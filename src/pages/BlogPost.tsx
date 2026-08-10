import { Navigate, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { DetailHero } from '../components/ui/DetailHero'
import { DestinationBanner } from '../components/ui/DestinationBanner'
import { Container } from '../components/ui/Container'
import { CTAButton } from '../components/ui/CTAButton'
import { BlogPostCard } from '../components/ui/BlogPostCard'
import { blogPosts, getBlogPost } from '../data/blogPosts'
import { SITE, formatDate, whatsappLink } from '../lib/site'

export default function BlogPost() {
  const { slug = '' } = useParams()
  const post = getBlogPost(slug)

  if (!post) return <Navigate to="/blog" replace />

  const related = blogPosts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3)
  const relatedPosts = related.length > 0 ? related : blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          image: post.image.src,
          author: { '@type': 'Organization', name: SITE.name },
          publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        }}
      />

      <DetailHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]}
      />

      <DestinationBanner image={post.image} caption={`${formatDate(post.date)} · ${post.readTime}`} />

      <section className="py-16 sm:py-20">
        <Container className="mx-auto flex max-w-3xl flex-col gap-6">
          {post.content.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-base leading-relaxed text-white/80">
              {paragraph}
            </p>
          ))}

          <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-brand/30 bg-ink-800 p-8 text-center">
            <h3 className="text-lg font-bold text-white">¿Tienes dudas sobre tu proceso?</h3>
            <p className="max-w-sm text-sm text-white/70">
              Escríbenos por WhatsApp y un asesor te ayuda sin costo ni compromiso.
            </p>
            <CTAButton href={whatsappLink(`¡Hola! Tengo una pregunta sobre el artículo "${post.title}".`)} icon={false}>
              Escríbenos por WhatsApp
            </CTAButton>
          </div>
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
