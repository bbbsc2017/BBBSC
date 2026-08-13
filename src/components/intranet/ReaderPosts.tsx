import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { fetchPosts, type PublicPost } from '../../lib/api'

export function ReaderPosts() {
  const [posts, setPosts] = useState<PublicPost[]>([])
  useEffect(() => { fetchPosts().then(setPosts) }, [])
  return <section><div className="mb-6"><h2 className="text-xl font-bold">Entradas publicadas</h2><p className="mt-1 text-sm text-white/45">Biblioteca de BBB News en modo lectura.</p></div><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{posts.map((post) => <Link key={post.slug} to={`/blog/${post.slug}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-ink-800 hover:border-brand/40"><div className="aspect-video overflow-hidden"><img src={post.image.src} alt={post.image.alt} className="size-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-5"><span className="text-xs font-bold uppercase text-brand">{post.category}</span><h3 className="mt-2 font-bold">{post.title}</h3><p className="mt-2 line-clamp-2 text-sm text-white/55">{post.excerpt}</p><span className="mt-4 inline-flex items-center text-xs font-semibold text-brand">Leer entrada<Eye className="ml-2 size-3.5" /></span></div></Link>)}{posts.length === 0 && <p className="text-sm text-white/45">No hay publicaciones disponibles.</p>}</div></section>
}
