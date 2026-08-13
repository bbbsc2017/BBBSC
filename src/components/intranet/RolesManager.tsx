import { useEffect, useState } from 'react'
import { ChevronDown, Lock, Plus, Save, Shield, Trash2, X } from 'lucide-react'
import { fieldClass } from '../ui/FormField'
import { can, PANEL_PERMISSIONS, requestJson, type SessionUser } from './shared'

interface PanelRole {
  id: number
  name: string
  label: string
  description: string
  color: string
  isSystem: boolean
  permissions: Record<string, boolean>
  userCount: number
}

const groups = [
  { label: 'Dashboard y analítica', permissions: [{ key: PANEL_PERMISSIONS.dashboardView, label: 'Ver dashboard' }, { key: PANEL_PERMISSIONS.analyticsView, label: 'Ver métricas y visitas' }] },
  { label: 'Entradas', permissions: [{ key: PANEL_PERMISSIONS.postsView, label: 'Ver entradas publicadas' }, { key: PANEL_PERMISSIONS.postsViewAll, label: 'Ver borradores y retiradas' }, { key: PANEL_PERMISSIONS.postsCreate, label: 'Crear entradas' }, { key: PANEL_PERMISSIONS.postsEdit, label: 'Editar entradas' }, { key: PANEL_PERMISSIONS.postsPublish, label: 'Publicar y retirar' }, { key: PANEL_PERMISSIONS.postsDelete, label: 'Eliminar entradas' }] },
  { label: 'Ofertas de empleo', permissions: [{ key: PANEL_PERMISSIONS.offersView, label: 'Ver catálogo de ofertas' }, { key: PANEL_PERMISSIONS.offersManage, label: 'Crear, editar, cerrar y duplicar' }, { key: PANEL_PERMISSIONS.offersAssign, label: 'Asignar y retirar ofertas' }, { key: PANEL_PERMISSIONS.offersExport, label: 'Exportar participantes y ofertas' }] },
  { label: 'Medios y comentarios', permissions: [{ key: PANEL_PERMISSIONS.mediaView, label: 'Ver biblioteca de medios' }, { key: PANEL_PERMISSIONS.mediaManage, label: 'Subir y eliminar medios' }, { key: PANEL_PERMISSIONS.commentsView, label: 'Ver comentarios' }, { key: PANEL_PERMISSIONS.commentsManage, label: 'Moderar comentarios' }] },
  { label: 'Usuarios', permissions: [{ key: PANEL_PERMISSIONS.usersView, label: 'Ver personal y participantes' }, { key: PANEL_PERMISSIONS.usersManageAccess, label: 'Habilitar participantes' }, { key: PANEL_PERMISSIONS.usersAssignRoles, label: 'Asignar roles del panel' }] },
  { label: 'Sistema', permissions: [{ key: PANEL_PERMISSIONS.trackingManage, label: 'Configurar píxeles' }, { key: PANEL_PERMISSIONS.rolesView, label: 'Ver roles y permisos' }, { key: PANEL_PERMISSIONS.rolesManage, label: 'Crear y modificar roles' }] },
]

const colors: Record<string, string> = {
  purple: 'border-purple-400/25 bg-purple-400/[0.06] text-purple-300', blue: 'border-sky-400/25 bg-sky-400/[0.06] text-sky-300',
  orange: 'border-amber-300/25 bg-amber-300/[0.06] text-amber-200', green: 'border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-300',
  red: 'border-red-400/25 bg-red-400/[0.06] text-red-300', cyan: 'border-cyan-400/25 bg-cyan-400/[0.06] text-cyan-300',
  pink: 'border-pink-400/25 bg-pink-400/[0.06] text-pink-300', gray: 'border-white/10 bg-white/[0.03] text-white/55',
}

export function RolesManager({ user }: { user: SessionUser }) {
  const [roles, setRoles] = useState<PanelRole[]>([])
  const [drafts, setDrafts] = useState<Record<number, Record<string, boolean>>>({})
  const [expanded, setExpanded] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ label: '', name: '', description: '', color: 'blue', copyFrom: '' })
  const mayManage = can(user, PANEL_PERMISSIONS.rolesManage)

  async function loadRoles() {
    try { const data = await requestJson('/api/admin/roles'); setRoles(data.roles) }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar los roles.') }
  }
  useEffect(() => { loadRoles() }, [])

  function rolePermissions(role: PanelRole) { return { ...role.permissions, ...(drafts[role.id] || {}) } }

  async function saveRole(role: PanelRole) {
    setSaving(role.id); setError(''); setMessage('')
    try {
      await requestJson(`/api/admin/roles/${role.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label: role.label, description: role.description, color: role.color, permissions: rolePermissions(role) }) })
      setDrafts((current) => { const next = { ...current }; delete next[role.id]; return next })
      setMessage(`Permisos de “${role.label}” guardados.`); await loadRoles()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos guardar el rol.') }
    finally { setSaving(null) }
  }

  async function createRole() {
    setError(''); setMessage('')
    try {
      await requestJson('/api/admin/roles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, copyFrom: form.copyFrom || null }) })
      setForm({ label: '', name: '', description: '', color: 'blue', copyFrom: '' }); setCreating(false); setMessage('Rol creado correctamente.'); await loadRoles()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos crear el rol.') }
  }

  async function removeRole(role: PanelRole) {
    if (!window.confirm(`¿Eliminar el rol “${role.label}”?`)) return
    try { await requestJson(`/api/admin/roles/${role.id}`, { method: 'DELETE' }); setMessage('Rol eliminado.'); await loadRoles() }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos eliminar el rol.') }
  }

  return <div className="flex flex-col gap-5">
    <section className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-ink-800 p-5 sm:flex-row sm:items-center sm:p-6">
      <div><h2 className="text-lg font-bold">Roles y permisos</h2><p className="mt-1 max-w-2xl text-sm text-white/45">Define qué puede ver y modificar cada usuario dentro del panel de bbbsc.com. Estos roles no alteran los de Admin ni BBB Academia.</p></div>
      {mayManage && <button type="button" onClick={() => setCreating(!creating)} className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-ink"><Plus className="mr-2 size-4" />Nuevo rol</button>}
    </section>

    {creating && <section className="grid gap-4 rounded-3xl border border-brand/20 bg-brand/[0.04] p-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center justify-between sm:col-span-2 lg:col-span-3"><h3 className="font-bold">Crear rol personalizado</h3><button type="button" onClick={() => setCreating(false)} className="p-2 text-white/45"><X className="size-4" /></button></div>
      <label className="text-xs font-semibold text-white/60">Nombre visible<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={`${fieldClass} mt-2`} placeholder="Ej. Editor regional" /></label>
      <label className="text-xs font-semibold text-white/60">Identificador<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${fieldClass} mt-2`} placeholder="editor_regional" /></label>
      <label className="text-xs font-semibold text-white/60">Color<select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={`${fieldClass} mt-2`}>{Object.keys(colors).map((color) => <option key={color}>{color}</option>)}</select></label>
      <label className="text-xs font-semibold text-white/60 sm:col-span-2">Descripción<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${fieldClass} mt-2`} /></label>
      <label className="text-xs font-semibold text-white/60">Copiar permisos de<select value={form.copyFrom} onChange={(e) => setForm({ ...form, copyFrom: e.target.value })} className={`${fieldClass} mt-2`}><option value="">Sin permisos</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}</select></label>
      <button type="button" disabled={!form.label.trim()} onClick={createRole} className="rounded-full bg-brand px-5 py-3 text-sm font-bold text-ink disabled:opacity-40 sm:col-span-2 lg:col-span-3 lg:justify-self-start">Crear rol</button>
    </section>}

    {error && <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}{message && <p className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">{message}</p>}

    <section className="grid items-start gap-4 lg:grid-cols-2">
      {roles.map((role) => {
        const permissions = rolePermissions(role)
        const enabled = Object.values(permissions).filter(Boolean).length
        const locked = role.name === 'administrator'
        return <article key={role.id} className={`overflow-hidden rounded-3xl border ${colors[role.color] || colors.gray}`}>
          <button type="button" onClick={() => setExpanded(expanded === role.id ? null : role.id)} className="flex w-full items-center gap-4 p-5 text-left">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-current/10"><Shield className="size-5" /></span>
            <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-bold">{role.label}{locked && <Lock className="size-3.5" />}</span><span className="mt-1 block text-xs opacity-60">{role.description}</span><span className="mt-2 block text-[10px] font-bold uppercase tracking-wider opacity-55">{enabled} permisos · {role.userCount} asignación(es) explícitas · {role.isSystem ? 'Rol base' : 'Personalizado'}</span></span>
            <ChevronDown className={`size-5 transition-transform ${expanded === role.id ? 'rotate-180' : ''}`} />
          </button>
          {expanded === role.id && <div className="border-t border-current/10 bg-black/10 p-5">
            <div className="grid gap-5 sm:grid-cols-2">{groups.map((group) => <fieldset key={group.label}><legend className="mb-3 text-xs font-extrabold uppercase tracking-wider opacity-70">{group.label}</legend><div className="space-y-2">{group.permissions.map((permission) => <label key={permission.key} className={`flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/10 p-3 text-xs ${!mayManage || locked ? 'opacity-60' : 'cursor-pointer hover:bg-white/5'}`}><span>{permission.label}</span><input type="checkbox" disabled={!mayManage || locked} checked={permissions[permission.key] || false} onChange={(e) => setDrafts((current) => ({ ...current, [role.id]: { ...(current[role.id] || {}), [permission.key]: e.target.checked } }))} className="size-4 accent-brand" /></label>)}</div></fieldset>)}</div>
            {mayManage && !locked && <div className="mt-5 flex flex-wrap gap-2"><button type="button" disabled={!drafts[role.id] || saving === role.id} onClick={() => saveRole(role)} className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-ink disabled:opacity-40"><Save className="mr-2 size-4" />{saving === role.id ? 'Guardando...' : 'Guardar permisos'}</button>{!role.isSystem && <button type="button" onClick={() => removeRole(role)} className="inline-flex items-center rounded-full border border-red-400/25 px-5 py-2.5 text-xs font-bold text-red-300"><Trash2 className="mr-2 size-4" />Eliminar rol</button>}</div>}
          </div>}
        </article>
      })}
    </section>
  </div>
}
