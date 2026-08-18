import { blogPosts, getBlogPost, type BlogPost } from '../data/blogPosts'
import { apiCredentials, apiUrl } from './apiBase'

export interface PublicPost {
  slug: string
  title: string
  excerpt: string
  category: 'Embajada' | 'Programas' | 'Consejos'
  date: string
  readTime: string
  image: { src: string; alt: string }
  author: { name: string; role: string }
}

export interface PublicPostDetail extends PublicPost {
  contentHtml: string
}

export interface PublicComment {
  id: number
  name: string
  comment: string
  date: string
}

function toPublicPost(post: BlogPost): PublicPost {
  const { content: _content, ...summary } = post
  return summary
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]!)
}

function toPublicPostDetail(post: BlogPost): PublicPostDetail {
  return {
    ...toPublicPost(post),
    contentHtml: post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(''),
  }
}

const localPosts = blogPosts.map(toPublicPost)

export async function fetchPosts(): Promise<PublicPost[]> {
  try {
    const response = await fetch(apiUrl('/api/web/posts'), { credentials: apiCredentials })
    if (!response.ok) return localPosts
    const data = await response.json().catch(() => null)
    return data?.ok && Array.isArray(data.posts) && data.posts.length > 0 ? data.posts : localPosts
  } catch {
    return localPosts
  }
}

export async function fetchPost(slug: string): Promise<PublicPostDetail | null> {
  const localPost = getBlogPost(slug)
  try {
    const response = await fetch(apiUrl(`/api/web/posts/${encodeURIComponent(slug)}`), { credentials: apiCredentials })
    if (!response.ok) return localPost ? toPublicPostDetail(localPost) : null
    const data = await response.json().catch(() => null)
    return data?.ok ? data.post : localPost ? toPublicPostDetail(localPost) : null
  } catch {
    return localPost ? toPublicPostDetail(localPost) : null
  }
}

export async function fetchPostComments(slug: string): Promise<PublicComment[]> {
  try {
    const response = await fetch(apiUrl(`/api/web/posts/${encodeURIComponent(slug)}/comments`), { credentials: apiCredentials })
    if (!response.ok) return []
    const data = await response.json().catch(() => null)
    return data?.ok ? data.comments : []
  } catch {
    return []
  }
}

export function sortByDateDesc(posts: PublicPost[]): PublicPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getLatestPosts(posts: PublicPost[], count: number): PublicPost[] {
  return sortByDateDesc(posts).slice(0, count)
}
