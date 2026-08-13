import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Link2, Loader2, RefreshCw, Save, Unplug } from 'lucide-react'
import { fieldClass } from '../ui/FormField'
import { requestJson } from './shared'

interface FormField { key: string; label: string }
interface ManagedForm { key: string; label: string; fields: FormField[]; mappings: Record<string, string> }
interface CustomField { id: string; name: string; type: string }

const standardFields = [
  ['standard:first_name', 'Nombre (Clientify)'],
  ['standard:last_name', 'Apellidos (Clientify)'],
  ['standard:email', 'Correo electrónico (Clientify)'],
  ['standard:phone', 'Teléfono (Clientify)'],
  ['standard:birthday', 'Fecha de nacimiento (Clientify)'],
  ['standard:company', 'Empresa / Universidad (Clientify)'],
  ['standard:contact_source', 'Origen del contacto (Clientify)'],
  ['standard:tags', 'Etiquetas (Clientify)'],
  ['standard:message', 'Mensaje (Clientify)'],
] as const

export function ClientifyFormsSettings() {
  const [forms, setForms] = useState<ManagedForm[]>([])
  const [selectedKey, setSelectedKey] = useState('')
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [customFields, setCustomFields] = useState<CustomField[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [connection, setConnection] = useState<'unknown' | 'connected' | 'error'>('unknown')
  const [connectionMessage, setConnectionMessage] = useState('')
  const [connectionError, setConnectionError] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selected = useMemo(() => forms.find((form) => form.key === selectedKey), [forms, selectedKey])

  useEffect(() => {
    requestJson('/api/admin/clientify/forms')
      .then((data) => {
        setForms(data.forms)
        const first = data.forms[0]
        if (first) { setSelectedKey(first.key); setMappings(first.mappings) }
      })
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'No pudimos cargar los formularios.'))
      .finally(() => setLoading(false))
  }, [])

  function selectForm(key: string) {
    const form = forms.find((item) => item.key === key)
    setSelectedKey(key)
    setMappings(form?.mappings || {})
    setMessage('')
    setError('')
  }

  async function testConnection() {
    setChecking(true); setMessage(''); setError(''); setConnectionError('')
    try {
      const test = await requestJson('/api/admin/clientify/test', { method: 'POST' })
      const fields = await requestJson('/api/admin/clientify/fields')
      setCustomFields(fields.customFields || [])
      setConnection('connected')
      setConnectionMessage(`Conexión correcta. Clientify devolvió ${test.customFieldCount} campos personalizados.`)
    } catch (cause) {
      setConnection('error')
      setConnectionError(cause instanceof Error ? cause.message : 'No fue posible conectar con Clientify.')
    } finally { setChecking(false) }
  }

  async function save() {
    if (!selected) return
    setSaving(true); setMessage(''); setError('')
    try {
      const data = await requestJson(`/api/admin/clientify/forms/${encodeURIComponent(selected.key)}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mappings }),
      })
      setMappings(data.mappings)
      setForms((current) => current.map((form) => form.key === selected.key ? { ...form, mappings: data.mappings } : form))
      setMessage('Emparejamiento guardado. Los próximos registros usarán esta configuración.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos guardar el emparejamiento.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="rounded-3xl border border-white/10 bg-ink-800 p-8 text-sm text-white/45">Cargando formularios…</div>

  return <div className="space-y-6">
    <section className="rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div><div className="flex items-center gap-2"><Link2 className="size-5 text-brand" /><h2 className="text-lg font-extrabold">Conexión con Clientify</h2></div><p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Comprueba la API y carga los campos personalizados disponibles. La clave privada permanece únicamente en el servidor.</p></div>
        <button type="button" onClick={testConnection} disabled={checking} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-brand/35 px-5 text-sm font-bold text-brand transition hover:bg-brand/10 disabled:opacity-50">{checking ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}Comprobar conexión</button>
      </div>
      {connection !== 'unknown' && <div className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 text-sm ${connection === 'connected' ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-red-400/20 bg-red-400/10 text-red-200'}`}>{connection === 'connected' ? <CheckCircle2 className="size-5 shrink-0" /> : <Unplug className="size-5 shrink-0" />}{connection === 'connected' ? connectionMessage : connectionError}</div>}
    </section>

    <section className="rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
        <div><label className="text-sm font-bold text-white">Formulario<select value={selectedKey} onChange={(event) => selectForm(event.target.value)} className={`${fieldClass} mt-2`}>{forms.map((form) => <option key={form.key} value={form.key}>{form.label}</option>)}</select></label><p className="mt-3 text-xs leading-5 text-white/40">Selecciona a qué campo de Clientify debe enviarse cada dato de la página web. Los campos ocultos de etiqueta, mensaje y origen también son configurables.</p></div>
        <div className="rounded-2xl border border-white/10 bg-[#1c1c1c]/55 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-extrabold">Emparejamiento de campos</h3><p className="mt-1 text-xs text-white/40">{selected?.fields.length || 0} campos en este formulario</p></div><button type="button" onClick={save} disabled={saving || !selected} className="inline-flex min-h-10 items-center rounded-full bg-brand px-4 text-xs font-extrabold text-white disabled:opacity-50">{saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}{saving ? 'Guardando…' : 'Guardar'}</button></div>
          <div className="space-y-3">{selected?.fields.map((field) => {
            const currentTarget = mappings[field.key] || 'ignore'
            const missingCustom = currentTarget.startsWith('custom:') && !customFields.some((item) => `custom:${item.name}` === currentTarget)
            return <div key={field.key} className="grid items-center gap-2 border-t border-white/[0.07] pt-3 sm:grid-cols-[minmax(150px,.8fr)_minmax(220px,1.2fr)]"><label htmlFor={`mapping-${field.key}`} className="text-xs font-semibold text-white/65">{field.label}<span className="mt-0.5 block font-mono text-[9px] font-normal text-white/25">{field.key}</span></label><select id={`mapping-${field.key}`} value={currentTarget} onChange={(event) => setMappings((current) => ({ ...current, [field.key]: event.target.value }))} className={fieldClass}><option value="ignore">No enviar</option><optgroup label="Campos estándar">{standardFields.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</optgroup>{missingCustom && <optgroup label="Configurado anteriormente"><option value={currentTarget}>{currentTarget.slice(7)}</option></optgroup>}<optgroup label={customFields.length ? 'Campos personalizados de Clientify' : 'Comprueba la conexión para cargar campos'}>{customFields.map((item) => <option key={item.id} value={`custom:${item.name}`}>{item.name}</option>)}</optgroup></select></div>
          })}</div>
        </div>
      </div>
      {message && <p role="status" className="mt-5 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200">{message}</p>}
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    </section>
  </div>
}
