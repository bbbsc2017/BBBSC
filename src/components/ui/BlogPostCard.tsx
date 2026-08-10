import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '../../data/blogPosts'
import { formatDate } from '../../lib/site'

const categoryTone: Record<BlogPost['category'], string> = {
  Embajada: 'bg-blue-500/15 text-blue-300',
  Programas: 'bg-brand/15 text-brand',
  Consejos: 'bg-emerald-500/15 text-emerald-300',
}

export function BlogPostCard({ post, className = '' }: { post: BlogPost; className?: string }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10 ${className}`}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={post.image.src}
          alt={post.image.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur ${categoryTone[post.category]}`}>
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold leading-snug text-white">{post.title}</h3>
          <p className="text-sm leading-relaxed text-white/70">{post.excerpt}</p>
        </div>
        <div className="flex flex-col gap-2 text-xs text-white/50">
          <span>
            Por <span className="text-white/70">{post.author.name}</span> · {formatDate(post.date)}
          </span>
          <div className="flex items-center justify-between gap-2">
            <span>{post.readTime}</span>
            <span className="flex items-center gap-1 font-semibold text-white transition-colors group-hover:text-brand">
              Leer más
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
