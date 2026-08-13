import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BriefcaseBusiness, CalendarDays, Copy, Edit3, FileText, Link2, Loader2, MapPin, Plus, Save, Search, Upload, Users, X } from 'lucide-react'
import { OFFER_PROGRAMS, compensationLabel, programLabel, type JobOffer } from '../../lib/offers'
import { fieldClass } from '../ui/FormField'
import { can, PANEL_PERMISSIONS, requestJson, type SessionUser } from './shared'

type OfferForm = Omit<JobOffer, 'id' | 'slug' | 'vacanciesLost' | 'vacanciesAvailable' | 'createdAt' | 'updatedAt' | 'hasPdf' | 'pdfViewUrl' | 'storedStatus'> & { id?: number; slug?: string; pdfExtractedData?: Record<string, unknown> }
const initialForm: OfferForm = { title: '', program: 'work-travel-usa', sponsor: '', employer: '', compensationType: 'salary', compensationMin: 0, compensationMax: null, compensationCurrency: 'USD', compensationPeriod: 'hour', hasTips: false, englishLevel: 'Intermedio', city: '', state: '', offerType: '', airportPickup: false, overtime: false, bonuses: '', vacanciesTotal: 1, availableUntil: '', imageSrc: '', description: '', status: 'draft', pdfSourceUrl: '', pdfFileName: '', pdfText: '' }
type OfferTab = JobOffer['status'] | 'all'
const labels: Record<OfferTab, string> = { all: 'Todas', active: 'Publicadas', draft: 'Borradores', closed: 'Cerradas' }

export function OffersManager({ user }: { user: SessionUser }) {
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [status, setStatus] = useState<OfferTab>('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<OfferForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [readingPdf, setReadingPdf] = useState(false)
  const mayManage = can(user, PANEL_PERMISSIONS.offersManage)

  async function loadOffers() { setLoading(true); try { const data = await requestJson('/api/admin/offers'); setOffers(data.offers) } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar las ofertas.') } finally { setLoading(false) } }
  useEffect(() => { loadOffers() }, [])

  const visible = useMemo(() => { const query = search.trim().toLocaleLowerCase('es'); return offers.filter((offer) => (status === 'all' || offer.status === status) && (!query || `${offer.title} ${offer.employer} ${offer.sponsor} ${offer.city}`.toLocaleLowerCase('es').includes(query))) }, [offers, search, status])
  function edit(offer: JobOffer) { setError(''); setMessage(''); setForm({ ...offer, status: offer.storedStatus || offer.status, availableUntil: offer.availableUntil.slice(0, 16) }) }
  function update<K extends keyof OfferForm>(key: K, value: OfferForm[K]) { setForm((current) => current ? { ...current, [key]: value } : current) }

  async function save(event: FormEvent) {
    event.preventDefault(); if (!form) return
    setSaving(true); setError(''); setMessage('')
    try {
      const path = form.id ? `/api/admin/offers/${form.id}` : '/api/admin/offers'
      await requestJson(path, { method: form.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setMessage(form.id ? 'Oferta actualizada correctamente.' : 'Oferta creada como parte del catálogo.'); setForm(null); await loadOffers()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos guardar la oferta.') } finally { setSaving(false) }
  }
  async function duplicate(offer: JobOffer) { setError(''); setMessage(''); try { await requestJson(`/api/admin/offers/${offer.id}/duplicate`, { method: 'POST' }); setStatus('draft'); setMessage('Se creó una copia en Borradores.'); await loadOffers() } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos duplicar la oferta.') } }

  function applyPdfAnalysis(analysis: { fields: Partial<OfferForm>; pdfSourceUrl: string; pdfFileName: string; pdfText: string; confidence: number; warnings: string[] }) {
    setForm({ ...initialForm, ...analysis.fields, pdfSourceUrl: analysis.pdfSourceUrl, pdfFileName: analysis.pdfFileName, pdfText: analysis.pdfText, pdfExtractedData: analysis.fields, status: 'draft' })
    setMessage(`PDF leído: se detectó aproximadamente el ${analysis.confidence}% de los campos. Revisa la información antes de guardar.`)
    if (analysis.warnings?.length) setError(analysis.warnings.join(' '))
  }

  async function importPdfUrl() {
    if (!pdfUrl.trim()) return
    setReadingPdf(true); setError(''); setMessage('')
    try {
      const data = await requestJson('/api/admin/offers/extract-pdf-url', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: pdfUrl.trim() }) })
      applyPdfAnalysis(data.analysis); setPdfUrl('')
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos leer el PDF.') } finally { setReadingPdf(false) }
  }

  async function importPdfFile(file: File) {
    setReadingPdf(true); setError(''); setMessage('')
    try {
      const body = new FormData(); body.append('file', file)
      const response = await fetch('/api/admin/offers/extract-pdf', { method: 'POST', body })
      const data = await response.json()
      if (!response.ok || !data.ok) throw new Error(data.error)
      applyPdfAnalysis(data.analysis)
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos leer el PDF.') } finally { setReadingPdf(false) }
  }

  return <div className="flex flex-col gap-5">
    <section className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-ink-800 p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="flex items-center text-lg font-black"><BriefcaseBusiness className="mr-2 size-5 text-brand" />Ofertas de empleo</h2><p className="mt-1 text-sm text-white/45">Publica, modifica, duplica o genera borradores leyendo un PDF.</p></div>{mayManage && <button type="button" onClick={() => { setForm({ ...initialForm }); setError(''); setMessage('') }} className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-ink"><Plus className="mr-2 size-4" />Nueva oferta</button>}</section>
    {mayManage && <section className="rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-6"><div className="flex items-center gap-2"><FileText className="size-5 text-brand" /><h3 className="font-black">Crear borrador desde un PDF</h3></div><p className="mt-2 text-xs leading-5 text-white/45">Carga un archivo o pega su enlace. El sistema extrae la información y abre el formulario para que la revises; nunca publica automáticamente.</p><div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="relative"><Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" /><input type="url" value={pdfUrl} onChange={(event) => setPdfUrl(event.target.value)} className={`${fieldClass} pl-10`} placeholder="https://sitio.com/oferta.pdf" /></label><button type="button" disabled={readingPdf || !pdfUrl.trim()} onClick={importPdfUrl} className="inline-flex items-center justify-center rounded-full border border-brand/30 px-5 py-3 text-xs font-black text-brand disabled:opacity-40">{readingPdf ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Link2 className="mr-2 size-4" />}Leer enlace</button><label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-brand px-5 py-3 text-xs font-black text-ink"><Upload className="mr-2 size-4" />Subir PDF<input type="file" accept="application/pdf,.pdf" disabled={readingPdf} onChange={(event) => { const file = event.target.files?.[0]; if (file) importPdfFile(file); event.target.value = '' }} className="sr-only" /></label></div></section>}
    {error && <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}{message && <p className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">{message}</p>}
    {form && <form onSubmit={save} className="rounded-3xl border border-brand/25 bg-ink-800 p-5 sm:p-7"><div className="mb-6 flex items-center justify-between"><div><h3 className="text-xl font-black">{form.id ? 'Editar oferta' : 'Crear oferta'}</h3><p className="mt-1 text-xs text-white/40">Los campos marcados son necesarios para publicar.</p></div><button type="button" onClick={() => setForm(null)} className="rounded-full border border-white/10 p-2.5 text-white/50"><X className="size-4" /></button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <label className="text-xs font-bold text-white/60 xl:col-span-2">Nombre de la oferta *<input required value={form.title} onChange={(e) => update('title', e.target.value)} className={`${fieldClass} mt-2`} placeholder="Ej. Lifeguard" /></label>
      <label className="text-xs font-bold text-white/60">Programa *<select required value={form.program} onChange={(e) => update('program', e.target.value as JobOffer['program'])} className={`${fieldClass} mt-2`}>{OFFER_PROGRAMS.map((program) => <option key={program.slug} value={program.slug}>{program.label}</option>)}</select></label>
      <label className="text-xs font-bold text-white/60">Sponsor *<input required value={form.sponsor} onChange={(e) => update('sponsor', e.target.value)} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Empleador *<input required value={form.employer} onChange={(e) => update('employer', e.target.value)} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Tipo de establecimiento *<input required value={form.offerType} onChange={(e) => update('offerType', e.target.value)} className={`${fieldClass} mt-2`} placeholder="Hotel, restaurante, parque..." /></label>
      <label className="text-xs font-bold text-white/60">Ciudad *<input required value={form.city} onChange={(e) => update('city', e.target.value)} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Estado / región *<input required value={form.state} onChange={(e) => update('state', e.target.value)} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Nivel de inglés *<select value={form.englishLevel} onChange={(e) => update('englishLevel', e.target.value)} className={`${fieldClass} mt-2`}><option>Básico</option><option>Intermedio</option><option>Intermedio alto</option><option>Avanzado</option></select></label>
      <label className="text-xs font-bold text-white/60">Compensación *<select value={form.compensationType} onChange={(e) => update('compensationType', e.target.value as JobOffer['compensationType'])} className={`${fieldClass} mt-2`}><option value="salary">Salario</option><option value="stipend">Estipendio</option></select></label>
      <label className="text-xs font-bold text-white/60">Valor mínimo *<input required type="number" min="0" step="0.01" value={form.compensationMin} onChange={(e) => update('compensationMin', Number(e.target.value))} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Valor máximo<input type="number" min="0" step="0.01" value={form.compensationMax ?? ''} onChange={(e) => update('compensationMax', e.target.value === '' ? null : Number(e.target.value))} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Moneda *<input required maxLength={3} value={form.compensationCurrency} onChange={(e) => update('compensationCurrency', e.target.value.toUpperCase())} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Periodo *<select value={form.compensationPeriod} onChange={(e) => update('compensationPeriod', e.target.value as JobOffer['compensationPeriod'])} className={`${fieldClass} mt-2`}><option value="hour">Por hora</option><option value="week">Por semana</option><option value="month">Por mes</option><option value="year">Por año</option><option value="program">Por programa</option></select></label>
      <label className="text-xs font-bold text-white/60">Vacantes totales *<input required type="number" min="0" step="1" value={form.vacanciesTotal} onChange={(e) => update('vacanciesTotal', Number(e.target.value))} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-bold text-white/60">Fecha límite para postular *<input required type="datetime-local" value={form.availableUntil} onChange={(e) => { update('availableUntil', e.target.value); if (form.status === 'closed' && new Date(e.target.value) > new Date()) update('status', 'active') }} className={`${fieldClass} mt-2`} /><span className="mt-1 block font-normal text-white/35">Si la fecha es futura y hay vacantes, la oferta puede recibir postulaciones.</span></label>
      <label className="text-xs font-bold text-white/60">Estado<select value={form.status} onChange={(e) => update('status', e.target.value as JobOffer['status'])} className={`${fieldClass} mt-2`}><option value="draft">Borrador</option><option value="active">Publicada</option><option value="closed">Cerrada voluntariamente</option></select></label>
      <label className="text-xs font-bold text-white/60 md:col-span-2 xl:col-span-3">URL de imagen<input type="url" value={form.imageSrc} onChange={(e) => update('imageSrc', e.target.value)} className={`${fieldClass} mt-2`} placeholder="https://..." /></label>
      <label className="text-xs font-bold text-white/60 md:col-span-2 xl:col-span-3">Descripción<textarea value={form.description} onChange={(e) => update('description', e.target.value)} className={`${fieldClass} mt-2 min-h-32 resize-y`} /></label>
      <label className="text-xs font-bold text-white/60 md:col-span-2 xl:col-span-3">Bonos e incentivos<textarea value={form.bonuses} onChange={(e) => update('bonuses', e.target.value)} className={`${fieldClass} mt-2 min-h-20 resize-y`} /></label>
      <div className="flex flex-wrap gap-3 md:col-span-2 xl:col-span-3">{([['hasTips', 'Recibe propinas'], ['airportPickup', 'Incluye airport pickup'], ['overtime', 'Ofrece horas extra']] as const).map(([key, label]) => <label key={key} className="flex cursor-pointer items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-white/60"><input type="checkbox" checked={form[key]} onChange={(e) => update(key, e.target.checked)} className="mr-2 size-4 accent-brand" />{label}</label>)}</div>
      <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-black text-ink disabled:opacity-50 md:col-span-2 md:justify-self-start xl:col-span-3"><Save className="mr-2 size-4" />{saving ? 'Guardando...' : 'Guardar oferta'}</button>
    </div></form>}
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800"><div className="border-b border-white/10 p-5 sm:p-6"><div className="flex gap-2 overflow-x-auto">{(['all', 'active', 'draft', 'closed'] as const).map((item) => <button key={item} type="button" onClick={() => setStatus(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${status === item ? 'bg-brand text-ink' : 'bg-white/5 text-white/45 hover:text-white'}`}>{labels[item]} <span className="ml-1 opacity-60">{item === 'all' ? offers.length : offers.filter((offer) => offer.status === item).length}</span></button>)}</div><label className="relative mt-4 block max-w-lg"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" /><input value={search} onChange={(e) => setSearch(e.target.value)} className={`${fieldClass} pl-10`} placeholder="Buscar por oferta, empleador, sponsor o ciudad" /></label></div>
      {loading ? <p className="p-10 text-center text-sm text-white/40">Cargando ofertas...</p> : <div className="divide-y divide-white/10">{visible.map((offer) => <article key={offer.id} className="grid gap-4 p-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:items-center"><div className="min-w-0"><p className="text-[10px] font-extrabold uppercase tracking-wider text-brand">{programLabel(offer.program)}</p><h3 className="mt-1 truncate font-black">{offer.title}</h3><p className="mt-1 truncate text-xs text-white/45">{offer.employer} · {offer.sponsor}</p></div><div className="grid grid-cols-2 gap-2 text-xs text-white/50"><span className="flex items-center"><MapPin className="mr-1.5 size-3.5 text-brand" />{offer.city}</span><span className="flex items-center"><Users className="mr-1.5 size-3.5 text-brand" />{offer.vacanciesAvailable}/{offer.vacanciesTotal}</span><span className="font-bold text-white/75">{compensationLabel(offer)}</span><span className="flex items-center"><CalendarDays className="mr-1.5 size-3.5 text-brand" />{new Intl.DateTimeFormat('es-CO').format(new Date(offer.availableUntil))}</span></div>{mayManage && <div className="flex gap-2 md:justify-end"><button type="button" onClick={() => edit(offer)} className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/55 hover:border-brand/40 hover:text-brand"><Edit3 className="mr-1.5 size-3.5" />Editar</button><button type="button" onClick={() => duplicate(offer)} className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/55 hover:border-brand/40 hover:text-brand"><Copy className="mr-1.5 size-3.5" />Duplicar</button></div>}</article>)}{!visible.length && <p className="p-10 text-center text-sm text-white/40">No hay ofertas en esta sección.</p>}</div>}
    </section>
  </div>
}
