import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { fieldClass } from './FormField'
import { executeRecaptcha } from '../../lib/recaptcha'
import { RecaptchaNotice } from './RecaptchaNotice'
import { apiCredentials, apiUrl } from '../../lib/apiBase'

interface InterestFormProps {
  formKey: string
  programTitle: string
  interestTag: string
}

const emptyForm = { firstName: '', lastName: '', email: '', phone: '' }

export function InterestForm({ formKey, interestTag }: InterestFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  function update(key: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      // El mensaje y la etiqueta de interés ya los calcula la API central (plantillas
      // configurables en admin.bbbsc.com); enviarlos aquí los rechaza porque el DTO
      // solo acepta los campos del formulario visible.
      const recaptchaToken = await executeRecaptcha('interest_form')
      const response = await fetch(apiUrl('/api/web/forms/interest'), {
        method: 'POST',
        credentials: apiCredentials,
        headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
        body: JSON.stringify({ formKey, ...form }),
      })
      const data = await response.json().catch(() => ({ ok: false }))
      if (!response.ok || !data.ok) throw new Error(data.error || 'No pudimos enviar tus datos.')
      setStatus('success')
      setForm(emptyForm)
    } catch (cause) {
      setStatus('error')
      setError(cause instanceof Error ? cause.message : 'No pudimos enviar tus datos.')
    }
  }

  if (status === 'success') {
    return <div role="status" className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center"><CheckCircle2 className="mx-auto size-7 text-emerald-300" /><p className="mt-2 text-sm font-bold text-white">Recibimos tus datos</p><p className="mt-1 text-xs leading-5 text-white/55">Un asesor se pondrá en contacto contigo.</p></div>
  }

  return <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    <input type="hidden" name="formKey" value={formKey} />
    <input type="hidden" name="interestTag" value={interestTag} />
    <label className="sr-only" htmlFor={`${formKey}-firstName`}>Nombre</label>
    <input id={`${formKey}-firstName`} required autoComplete="given-name" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} className={fieldClass} placeholder="Nombre" />
    <label className="sr-only" htmlFor={`${formKey}-lastName`}>Apellidos</label>
    <input id={`${formKey}-lastName`} required autoComplete="family-name" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} className={fieldClass} placeholder="Apellidos" />
    <label className="sr-only" htmlFor={`${formKey}-email`}>Correo electrónico</label>
    <input id={`${formKey}-email`} required type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={fieldClass} placeholder="Correo electrónico" />
    <label className="sr-only" htmlFor={`${formKey}-phone`}>Teléfono</label>
    <input id={`${formKey}-phone`} required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} className={fieldClass} placeholder="Teléfono" />
    {status === 'error' && <p role="alert" className="text-xs leading-5 text-red-300 sm:col-span-2 lg:col-span-1 xl:col-span-2">{error}</p>}
    <RecaptchaNotice className="sm:col-span-2 lg:col-span-1 xl:col-span-2" />
    <button disabled={status === 'submitting'} className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-extrabold text-white transition hover:bg-brand-400 disabled:cursor-wait disabled:opacity-60 sm:col-span-2 lg:col-span-1 xl:col-span-2">
      {status === 'submitting' ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}{status === 'submitting' ? 'Enviando…' : 'Quiero más información'}
    </button>
  </form>
}
