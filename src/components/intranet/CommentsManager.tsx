import { useEffect, useState } from 'react'
import { Mail, MessageSquare, Phone, Trash2 } from 'lucide-react'
import { can, formatPanelDate, PANEL_PERMISSIONS, requestJson, type SessionUser } from './shared'

interface Comment { id: number; postSlug: string | null; postTitle: string | null; firstName: string; lastName: string; email: string; phone: string; comment: string; createdAt: string }

export function CommentsManager({ user }: { user: SessionUser }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [error, setError] = useState('')
  const mayManage = can(user, PANEL_PERMISSIONS.commentsManage)
  async function load() { try { const data = await requestJson('/api/admin/comments'); setComments(data.comments) } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar los comentarios.') } }
  useEffect(() => { load() }, [])
  async function remove(comment: Comment) { if (!window.confirm('¿Eliminar este comentario?')) return; try { await requestJson(`/api/admin/comments/${comment.id}`, { method: 'DELETE' }); await load() } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos eliminar el comentario.') } }
  return <section className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800"><div className="border-b border-white/10 p-6"><h2 className="text-lg font-bold">Comentarios</h2><p className="mt-1 text-sm text-white/45">Consulta y modera los mensajes enviados en el blog.</p></div>{error && <p className="m-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}<div className="divide-y divide-white/10">{comments.map((comment) => <article key={comment.id} className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><MessageSquare className="size-4 text-brand" /><h3 className="font-bold">{comment.firstName} {comment.lastName}</h3></div><p className="mt-1 text-xs text-white/40">En: {comment.postTitle || comment.postSlug || 'Entrada del blog'} · {formatPanelDate(comment.createdAt)}</p></div>{mayManage && <button onClick={() => remove(comment)} className="rounded-full p-2 text-white/35 hover:bg-red-400/10 hover:text-red-300" aria-label="Eliminar comentario"><Trash2 className="size-4" /></button>}</div><p className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/70">{comment.comment}</p><div className="mt-3 flex flex-wrap gap-4 text-xs text-white/45"><a href={`mailto:${comment.email}`} className="inline-flex items-center hover:text-brand"><Mail className="mr-1.5 size-3.5" />{comment.email}</a><a href={`tel:${comment.phone}`} className="inline-flex items-center hover:text-brand"><Phone className="mr-1.5 size-3.5" />{comment.phone}</a></div></article>)}{comments.length === 0 && <p className="p-10 text-center text-sm text-white/45">No hay comentarios todavía.</p>}</div></section>
}
