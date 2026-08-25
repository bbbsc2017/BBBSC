import { useState, type FormEvent } from 'react'
import { CheckCircle2, ExternalLink, Loader2, LockKeyhole, Send } from 'lucide-react'
import { fieldClass } from './FormField'
import { executeRecaptcha } from '../../lib/recaptcha'
import { RecaptchaNotice } from './RecaptchaNotice'
import { SubmittingOverlay } from './SubmittingOverlay'
import { apiCredentials, apiUrl } from '../../lib/apiBase'

interface InterestFormProps {
  formKey: string
  programTitle: string
  interestTag: string
}

const emptyForm = { firstName: '', lastName: '', email: '', phone: '' }

const paymentUrl = 'https://www.zonapagos.com/t_bbbacademiasas/pagos.asp'

export function InterestForm({ formKey, programTitle, interestTag }: InterestFormProps) {
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
    return <div role="status" className="rounded-2xl border border-brand/30 bg-brand/10 p-5 text-center">
      <CheckCircle2 className="mx-auto size-8 text-brand" />
      <p className="mt-3 text-base font-extrabold text-white">¡Recibimos tus datos!</p>
      <p className="mt-2 text-xs leading-5 text-white/60">Completa tu registro en {programTitle} pagando la inscripción.</p>
      <div className="my-4 flex items-end justify-between border-y border-white/10 py-3 text-left"><span className="text-xs text-white/55">Total a pagar</span><strong className="text-xl text-brand">$250.000 COP</strong></div>
      <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-extrabold text-white transition hover:bg-brand-400">Ir a Zona Pagos <ExternalLink className="size-4" /></a>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/45"><LockKeyhole className="size-3.5" /> Pago seguro en Zona Pagos</p>
    </div>
  }

  return <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
    <SubmittingOverlay show={status === 'submitting'} />
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
