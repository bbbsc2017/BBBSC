import { useEffect, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { fetchPostComments, type PublicComment } from '../../lib/api'
import { formatDate } from '../../lib/site'
import { executeRecaptcha } from '../../lib/recaptcha'
import { RecaptchaNotice } from '../ui/RecaptchaNotice'
import { apiCredentials, apiUrl } from '../../lib/apiBase'

interface CommentsSectionProps {
  postSlug: string
  postTitle: string
}

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', comment: '' }

export function CommentsSection({ postSlug }: CommentsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [comments, setComments] = useState<PublicComment[]>([])

  useEffect(() => {
    fetchPostComments(postSlug).then(setComments)
  }, [postSlug])

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const recaptchaToken = await executeRecaptcha('blog_comment')
      const response = await fetch(apiUrl(`/api/web/posts/${encodeURIComponent(postSlug)}/comments`), {
        method: 'POST',
        credentials: apiCredentials,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          body: form.comment,
          recaptchaToken,
        }),
      })

      const data = await response.json().catch(() => ({ ok: false }))

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'No pudimos enviar tu comentario. Intenta de nuevo.')
      }

      if (data.comment) {
        setComments((prev) => [data.comment, ...prev])
      }
      setForm(emptyForm)
      setShowForm(false)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos enviar tu comentario. Intenta de nuevo.')
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-6 border-t border-white/10 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <MessageCircle className="size-5 text-brand" />
          Comentarios {comments.length > 0 && <span className="text-white/40">({comments.length})</span>}
        </h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => {
              setShowForm(true)
              setStatus('idle')
            }}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-400"
          >
            Comentar
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-800 p-6">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
            Comentario
            <textarea
              required
              rows={3}
              value={form.comment}
              onChange={(event) => updateField('comment', event.target.value)}
              placeholder="Escribe tu comentario o pregunta"
              className="resize-none rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors placeholder:text-white/40 focus:border-brand"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Nombre
              <input
                required
                type="text"
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Apellidos
              <input
                required
                type="text"
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Teléfono
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-white">
              Correo
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm font-normal text-white outline-none transition-colors focus:border-brand"
              />
            </label>
          </div>

          {status === 'error' && <p className="text-sm font-medium text-red-400">{errorMessage}</p>}
          <RecaptchaNotice />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="size-4" />
              {status === 'submitting' ? 'Enviando…' : 'Enviar comentario'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setStatus('idle')
              }}
              className="text-sm font-semibold text-white/60 hover:text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {status === 'success' && (
        <p className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
          ¡Gracias por tu comentario! Un asesor puede contactarte si dejaste una pregunta.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {comments.map((item) => (
            <li key={item.id} className="rounded-2xl border border-white/10 bg-ink-800 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white">{item.name}</span>
                <span className="text-xs text-white/40">{formatDate(item.date.slice(0, 10))}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{item.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        !showForm && <p className="text-sm text-white/50">Sé el primero en comentar este artículo.</p>
      )}
    </div>
  )
}
