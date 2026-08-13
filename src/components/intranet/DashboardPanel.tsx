import { useEffect, useState } from 'react'
import { Eye, FileText, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { can, PANEL_PERMISSIONS, requestJson, type AdminPostSummary, type SessionUser } from './shared'
import { ParticipantDashboard } from './ParticipantDashboard'

interface DashboardData {
  posts: AdminPostSummary[]
  comments: unknown[]
  totalVisits: number
  uniqueVisitors: number
  topPaths: Array<{ path: string; visits: number }>
}

export function DashboardPanel({ user }: { user: SessionUser }) {
  const [data, setData] = useState<DashboardData>({ posts: [], comments: [], totalVisits: 0, uniqueVisitors: 0, topPaths: [] })
  const [error, setError] = useState('')
  const canSeeAllPosts = can(user, PANEL_PERMISSIONS.postsViewAll)
  const canSeeComments = can(user, PANEL_PERMISSIONS.commentsView)
  const canSeeAnalytics = can(user, PANEL_PERMISSIONS.analyticsView)
  const hasManagementSummary = canSeeAllPosts || canSeeComments || canSeeAnalytics

  useEffect(() => {
    if (!hasManagementSummary) return
    Promise.allSettled([
      canSeeAllPosts ? requestJson('/api/admin/posts') : Promise.resolve({ posts: [] }),
      canSeeComments ? requestJson('/api/admin/comments') : Promise.resolve({ comments: [] }),
      canSeeAnalytics ? requestJson('/api/admin/visits/summary?range=30d') : Promise.resolve({ totalVisits: 0, uniqueVisitors: 0, topPaths: [] }),
    ]).then(([postsResult, commentsResult, visitsResult]) => {
      const failed = [postsResult, commentsResult, visitsResult].some((result) => result.status === 'rejected')
      if (failed) setError('Algunos indicadores no se pudieron cargar.')
      const posts = postsResult.status === 'fulfilled' ? postsResult.value : { posts: [] }
      const comments = commentsResult.status === 'fulfilled' ? commentsResult.value : { comments: [] }
      const visits = visitsResult.status === 'fulfilled' ? visitsResult.value : { totalVisits: 0, uniqueVisitors: 0, topPaths: [] }
      setData({ posts: posts.posts || [], comments: comments.comments || [], totalVisits: visits.totalVisits || 0, uniqueVisitors: visits.uniqueVisitors || 0, topPaths: visits.topPaths || [] })
    })
  }, [canSeeAllPosts, canSeeAnalytics, canSeeComments, hasManagementSummary])

  if (user.role === 'STUDENT') return <ParticipantDashboard user={user} />

  if (!hasManagementSummary) return <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
    <section className="rounded-3xl border border-brand/20 bg-brand/10 p-7"><Users className="mb-5 size-7 text-brand" /><h2 className="text-xl font-bold">Bienvenido, {user.firstName}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">Tu rol en esta intranet es “{user.localRole?.label || 'Lector'}”. Puedes consultar las entradas publicadas disponibles para tu cuenta.</p></section>
    <section className="rounded-3xl border border-white/10 bg-ink-800 p-7"><Eye className="mb-5 size-7 text-brand" /><h2 className="font-bold">Acceso de lectura</h2><p className="mt-3 text-sm leading-relaxed text-white/55">Las opciones visibles en la barra lateral corresponden a los permisos asignados a tu rol.</p></section>
  </div>

  const cards = [
    ...(canSeeAllPosts ? [{ label: 'Entradas', value: data.posts.length, icon: FileText }] : []),
    ...(canSeeComments ? [{ label: 'Comentarios', value: data.comments.length, icon: MessageSquare }] : []),
    ...(canSeeAnalytics ? [{ label: 'Visitas (30 días)', value: data.totalVisits, icon: TrendingUp }, { label: 'Visitantes únicos', value: data.uniqueVisitors, icon: Users }] : []),
  ]
  return <div className="flex flex-col gap-6">
    {error && <p className="rounded-xl bg-amber-300/10 p-3 text-sm text-amber-200">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-3xl border border-white/10 bg-ink-800 p-5"><Icon className="mb-5 size-5 text-brand" /><p className="text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm text-white/45">{label}</p></div>)}</section>
    <div className="grid gap-6 xl:grid-cols-2">
      {canSeeAllPosts && <section className="rounded-3xl border border-white/10 bg-ink-800 p-6"><h2 className="font-bold">Estado editorial</h2><div className="mt-5 space-y-3"><div className="flex justify-between rounded-2xl bg-white/5 p-4 text-sm"><span>Publicadas</span><strong className="text-emerald-300">{data.posts.filter((post) => post.status === 'published').length}</strong></div><div className="flex justify-between rounded-2xl bg-white/5 p-4 text-sm"><span>Borradores</span><strong className="text-amber-200">{data.posts.filter((post) => post.status === 'draft').length}</strong></div><div className="flex justify-between rounded-2xl bg-white/5 p-4 text-sm"><span>Retiradas</span><strong className="text-red-300">{data.posts.filter((post) => post.status === 'withdrawn').length}</strong></div></div></section>}
      {canSeeAnalytics && <section className="rounded-3xl border border-white/10 bg-ink-800 p-6"><h2 className="font-bold">Páginas más visitadas</h2><div className="mt-5 space-y-2">{data.topPaths.slice(0, 5).map((item) => <div key={item.path} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 text-sm hover:bg-white/5"><span className="truncate text-white/65">{item.path}</span><strong>{item.visits}</strong></div>)}{!data.topPaths.length && <p className="text-sm text-white/40">Aún no hay datos suficientes.</p>}</div></section>}
    </div>
  </div>
}
