import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Bold, CheckSquare2, Edit3, Eye, FilePlus2, Heading2, ImagePlus, Italic, List, Save, Trash2, Upload, X } from 'lucide-react'
import { fieldClass } from '../ui/FormField'
import { can, emptyPost, formatPanelDate, PANEL_PERMISSIONS, requestJson, type AdminPostSummary, type PostForm, type SessionUser } from './shared'

function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value }, [value])

  function command(name: string, commandValue?: string) {
    editorRef.current?.focus()
    document.execCommand(name, false, commandValue)
    onChange(editorRef.current?.innerHTML || '')
  }

  return <div className="overflow-hidden rounded-2xl border border-white/15 bg-ink/70 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
    <div className="flex flex-wrap gap-1 border-b border-white/10 bg-white/5 p-2">
      {[{ icon: Bold, title: 'Negrita', action: () => command('bold') }, { icon: Italic, title: 'Cursiva', action: () => command('italic') }, { icon: Heading2, title: 'Título', action: () => command('formatBlock', 'h2') }, { icon: List, title: 'Lista', action: () => command('insertUnorderedList') }].map(({ icon: Icon, title, action }) => <button key={title} type="button" onClick={action} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white" title={title}><Icon className="size-4" /></button>)}
    </div>
    <div ref={editorRef} contentEditable suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} className="blog-content min-h-64 p-5 text-sm outline-none" role="textbox" aria-multiline="true" aria-label="Contenido de la publicación" />
  </div>
}

export function PostsManager({ user }: { user: SessionUser }) {
  const mayCreate = can(user, PANEL_PERMISSIONS.postsCreate)
  const mayEdit = can(user, PANEL_PERMISSIONS.postsEdit)
  const mayPublish = can(user, PANEL_PERMISSIONS.postsPublish)
  const mayDelete = can(user, PANEL_PERMISSIONS.postsDelete)
  const mayManageMedia = can(user, PANEL_PERMISSIONS.mediaManage)
  const [posts, setPosts] = useState<AdminPostSummary[]>([])
  const [activeTab, setActiveTab] = useState<AdminPostSummary['status']>('published')
  const [editor, setEditor] = useState<Partial<PostForm> | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [bulkRunning, setBulkRunning] = useState(false)
  const [quickEditId, setQuickEditId] = useState<number | null>(null)
  const [quickForm, setQuickForm] = useState({ category: 'Programas', authorName: '', publishedAt: '' })
  const [quickSaving, setQuickSaving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadPosts() {
    try { const data = await requestJson('/api/admin/posts'); setPosts(data.posts) }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cargar las entradas.') }
  }
  useEffect(() => { loadPosts() }, [])

  async function openPost(id: number) {
    try { const data = await requestJson(`/api/admin/posts/${id}`); setQuickEditId(null); setEditor(data.post); setError(''); setMessage('') }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos abrir la entrada.') }
  }

  async function savePost(event: FormEvent) {
    event.preventDefault()
    if (!editor) return
    setSaving(true); setError(''); setMessage('')
    try {
      const data = await requestJson(editor.id ? `/api/admin/posts/${editor.id}` : '/api/admin/posts', { method: editor.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editor) })
      setEditor(data.post); setMessage(editor.status === 'published' ? 'Entrada publicada correctamente.' : editor.status === 'withdrawn' ? 'Entrada retirada correctamente.' : 'Borrador guardado correctamente.'); await loadPosts()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos guardar la entrada.') }
    finally { setSaving(false) }
  }

  async function toggle(post: AdminPostSummary) {
    const nextStatus = post.status === 'published' ? 'withdrawn' : 'published'
    try {
      await requestJson(`/api/admin/posts/${post.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) })
      setMessage(nextStatus === 'published' ? 'Entrada publicada correctamente.' : 'Entrada retirada del sitio público.')
      await loadPosts()
    }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos cambiar el estado.') }
  }

  async function remove(post: AdminPostSummary) {
    if (!window.confirm(`¿Eliminar definitivamente “${post.title}”?`)) return
    try { await requestJson(`/api/admin/posts/${post.id}`, { method: 'DELETE' }); if (editor?.id === post.id) setEditor(null); await loadPosts() }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos eliminar la entrada.') }
  }

  function openQuickEdit(post: AdminPostSummary) {
    if (quickEditId === post.id) {
      setQuickEditId(null)
      return
    }
    setQuickEditId(post.id)
    setQuickForm({
      category: post.category,
      authorName: post.authorName,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
    })
    setError('')
    setMessage('')
  }

  async function saveQuickEdit(event: FormEvent) {
    event.preventDefault()
    if (!quickEditId) return
    setQuickSaving(true); setError(''); setMessage('')
    try {
      await requestJson(`/api/admin/posts/${quickEditId}/quick`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quickForm,
          publishedAt: quickForm.publishedAt ? new Date(quickForm.publishedAt).toISOString() : null,
        }),
      })
      setQuickEditId(null)
      setMessage('Cambios rápidos guardados correctamente.')
      await loadPosts()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos guardar los cambios rápidos.') }
    finally { setQuickSaving(false) }
  }

  function toggleSelection(id: number) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function toggleAll(visiblePosts: AdminPostSummary[]) {
    const visibleIds = visiblePosts.map((post) => post.id)
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
    setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }

  async function runBulkAction() {
    if (!bulkAction || selectedIds.length === 0) return
    if (bulkAction === 'delete' && !window.confirm(`¿Eliminar definitivamente ${selectedIds.length} entrada(s)?`)) return
    setBulkRunning(true); setError(''); setMessage('')
    try {
      const data = await requestJson('/api/admin/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: bulkAction }),
      })
      const actionMessage: Record<string, string> = {
        draft: 'movidas a borrador', publish: 'publicadas', withdraw: 'retiradas', delete: 'eliminadas', duplicate: 'duplicadas como borrador',
      }
      setMessage(`${data.affected} entrada(s) ${actionMessage[bulkAction]}.`)
      setSelectedIds([]); setBulkAction(''); setQuickEditId(null)
      await loadPosts()
    } catch (err) { setError(err instanceof Error ? err.message : 'No pudimos completar la acción masiva.') }
    finally { setBulkRunning(false) }
  }

  async function upload(file?: File) {
    if (!file || !editor) return
    setUploading(true)
    const form = new FormData(); form.append('file', file)
    try { const data = await requestJson('/api/admin/uploads', { method: 'POST', body: form }); setEditor({ ...editor, imageSrc: data.url }) }
    catch (err) { setError(err instanceof Error ? err.message : 'No pudimos subir la imagen.') }
    finally { setUploading(false) }
  }

  const update = (patch: Partial<PostForm>) => setEditor((current) => ({ ...current, ...patch }))

  if (editor) return <form onSubmit={savePost} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
    <section className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-7">
      <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-brand">Editor de entradas</p><h2 className="mt-1 text-xl font-bold">{editor.id ? 'Editar entrada' : 'Nueva entrada'}</h2></div><button type="button" onClick={() => setEditor(null)} className="rounded-full p-2 text-white/50 hover:bg-white/10" aria-label="Cerrar editor"><X className="size-5" /></button></div>
      {error && <p className="rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}{message && <p className="rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">{message}</p>}
      <label className="flex flex-col gap-2 text-sm font-semibold">Título<input required value={editor.title || ''} onChange={(e) => update({ title: e.target.value })} className={fieldClass} /></label>
      <label className="flex flex-col gap-2 text-sm font-semibold">Resumen<textarea required maxLength={320} value={editor.excerpt || ''} onChange={(e) => update({ excerpt: e.target.value })} className={`${fieldClass} min-h-28 resize-y`} /></label>
      <label className="flex flex-col gap-2 text-sm font-semibold">Contenido<RichTextEditor value={editor.contentHtml || ''} onChange={(contentHtml) => update({ contentHtml })} /></label>
    </section>
    <aside className="flex flex-col gap-5 xl:sticky xl:top-6 xl:h-fit">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-800 p-5"><h3 className="font-bold">Publicación</h3>
        <label className="text-xs font-semibold text-white/70">Estado<select disabled={!mayPublish} value={editor.status} onChange={(e) => update({ status: e.target.value as PostForm['status'] })} className={`${fieldClass} mt-2 disabled:opacity-55`}><option value="published">Publicada</option><option value="draft">Borrador</option><option value="withdrawn">Retirada</option></select></label>
        <label className="text-xs font-semibold text-white/70">Categoría<select value={editor.category} onChange={(e) => update({ category: e.target.value as PostForm['category'] })} className={`${fieldClass} mt-2`}><option>Embajada</option><option>Programas</option><option>Consejos</option></select></label>
        <label className="text-xs font-semibold text-white/70">Tiempo de lectura<input value={editor.readTime || ''} onChange={(e) => update({ readTime: e.target.value })} className={`${fieldClass} mt-2`} /></label>
        <button disabled={saving} className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-ink disabled:opacity-50"><Save className="mr-2 size-4" />{saving ? 'Guardando...' : 'Guardar'}</button>
      </section>
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-ink-800 p-5"><h3 className="font-bold">Imagen destacada</h3>{editor.imageSrc ? <img src={editor.imageSrc} alt="Vista previa" className="aspect-video rounded-2xl object-cover" /> : <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/15"><ImagePlus className="size-8 text-white/25" /></div>}
        {mayManageMedia && <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/15 p-3 text-xs font-semibold"><Upload className="mr-2 size-4" />{uploading ? 'Subiendo...' : 'Subir imagen'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => upload(e.target.files?.[0])} /></label>}
        <input required value={editor.imageSrc || ''} onChange={(e) => update({ imageSrc: e.target.value })} className={fieldClass} placeholder="URL de imagen" /><input value={editor.imageAlt || ''} onChange={(e) => update({ imageAlt: e.target.value })} className={fieldClass} placeholder="Texto alternativo" />
      </section>
      <section className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-ink-800 p-5"><h3 className="font-bold">Autor</h3><input required value={editor.authorName || ''} onChange={(e) => update({ authorName: e.target.value })} className={fieldClass} /><input required value={editor.authorRole || ''} onChange={(e) => update({ authorRole: e.target.value })} className={fieldClass} /></section>
    </aside>
  </form>

  const visiblePosts = posts.filter((post) => post.status === activeTab)
  const allSelected = visiblePosts.length > 0 && visiblePosts.every((post) => selectedIds.includes(post.id))
  const tabs: Array<{ id: AdminPostSummary['status']; label: string; activeClass: string }> = [
    { id: 'published', label: 'Publicadas', activeClass: 'bg-emerald-400/15 text-emerald-300' },
    { id: 'draft', label: 'Borradores', activeClass: 'bg-amber-300/15 text-amber-200' },
    { id: 'withdrawn', label: 'Retiradas', activeClass: 'bg-red-400/15 text-red-300' },
  ]

  return <section className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800">
    <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:p-6"><div><h2 className="text-lg font-bold">Entradas</h2><p className="mt-1 text-sm text-white/45">Administra borradores y publicaciones de BBB News.</p></div>{mayCreate && <button onClick={() => setEditor(emptyPost(user))} className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-ink"><FilePlus2 className="mr-2 size-4" />Añadir nueva</button>}</div>
    <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 pt-4 sm:px-6" role="tablist" aria-label="Estado de las entradas">
      {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => { setActiveTab(tab.id); setSelectedIds([]); setQuickEditId(null) }} className={`relative min-w-max rounded-t-xl px-4 py-3 text-xs font-bold transition-all duration-200 active:scale-95 ${activeTab === tab.id ? tab.activeClass : 'text-white/40 hover:bg-white/5 hover:text-white/70'}`}>{tab.label}<span className="ml-2 rounded-full bg-black/20 px-2 py-0.5 text-[10px]">{posts.filter((post) => post.status === tab.id).length}</span>{activeTab === tab.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-current" />}</button>)}
    </div>
    <div className="flex flex-col gap-3 border-b border-white/10 bg-black/10 p-4 sm:flex-row sm:items-center sm:px-6">
      <label className="inline-flex items-center gap-2 text-xs font-semibold text-white/65"><input type="checkbox" checked={allSelected} onChange={() => toggleAll(visiblePosts)} className="size-4 accent-brand" />Seleccionar visibles</label>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <select aria-label="Acción masiva" value={bulkAction} onChange={(event) => setBulkAction(event.target.value)} className={`${fieldClass} py-2.5 sm:max-w-56`}>
          <option value="">Acciones masivas</option>{mayEdit && <option value="draft">Mover a borrador</option>}{mayPublish && <option value="publish">Publicar</option>}{mayPublish && <option value="withdraw">Retirar</option>}{mayCreate && <option value="duplicate">Duplicar</option>}{mayDelete && <option value="delete">Eliminar</option>}
        </select>
        <button type="button" disabled={!bulkAction || selectedIds.length === 0 || bulkRunning} onClick={runBulkAction} className="inline-flex items-center justify-center rounded-xl border border-brand/35 px-4 py-2.5 text-xs font-bold text-brand disabled:cursor-not-allowed disabled:opacity-40"><CheckSquare2 className="mr-2 size-4" />{bulkRunning ? 'Aplicando...' : 'Aplicar'}</button>
      </div>
      <span className="text-xs text-white/40">{selectedIds.length} seleccionada(s)</span>
    </div>
    {error && <p className="m-5 rounded-xl bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
    {message && <p className="m-5 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-300">{message}</p>}
    <div className="divide-y divide-white/10">{visiblePosts.map((post) => <div key={post.id}>
      <article className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${selectedIds.includes(post.id) ? 'bg-brand/5' : ''}`}>
        <input type="checkbox" checked={selectedIds.includes(post.id)} onChange={() => toggleSelection(post.id)} className="size-4 shrink-0 accent-brand" aria-label={`Seleccionar ${post.title}`} />
        <img src={post.imageSrc} alt="" className="aspect-video w-full rounded-xl object-cover sm:w-28" />
        <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-emerald-400/15 text-emerald-300' : post.status === 'withdrawn' ? 'bg-red-400/15 text-red-300' : 'bg-amber-300/15 text-amber-200'}`}>{post.status === 'published' ? 'Publicada' : post.status === 'withdrawn' ? 'Retirada' : 'Borrador'}</span><span className="text-xs text-white/35">{post.category}</span></div><h3 className="truncate font-bold">{post.title}</h3><p className="mt-1 text-xs text-white/40">{formatPanelDate(post.updatedAt)} · {post.authorName}</p></div>
        <div className="flex flex-wrap gap-2">
          {mayEdit && <button type="button" onClick={() => openQuickEdit(post)} className={`inline-flex items-center rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${quickEditId === post.id ? 'border-brand bg-brand text-ink shadow-[0_0_0_4px_rgba(255,191,0,.12)]' : 'border-white/10 text-white/60 hover:border-brand/50 hover:text-brand'}`}><Edit3 className="mr-1.5 size-3.5" />{quickEditId === post.id ? 'Editando' : 'Edición rápida'}</button>}
          {mayEdit && <button type="button" onClick={() => openPost(post.id)} className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-200 active:scale-95">Editar completa</button>}
          {mayPublish && <button type="button" onClick={() => toggle(post)} className={`group inline-flex items-center rounded-full border px-3 py-2 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${post.status === 'published' ? 'border-emerald-400/30 bg-emerald-400/15 text-emerald-300 hover:border-red-400/40 hover:bg-red-400/15 hover:text-red-300' : 'border-amber-300/35 bg-amber-300/15 text-amber-200 hover:bg-amber-300/25'}`}><Eye className="mr-1.5 size-3.5" />{post.status === 'published' ? <><span className="group-hover:hidden">Publicado</span><span className="hidden group-hover:inline">Retirar</span></> : 'Publicar'}</button>}
          {mayDelete && <button type="button" onClick={() => remove(post)} className="rounded-full border border-white/10 p-2 text-white/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/35 hover:bg-red-400/10 hover:text-red-300 active:scale-90" aria-label="Eliminar"><Trash2 className="size-4" /></button>}
        </div>
      </article>
      {quickEditId === post.id && <form onSubmit={saveQuickEdit} className="grid gap-4 border-t border-brand/15 bg-brand/[0.04] p-5 sm:grid-cols-3 sm:px-10">
        <label className="flex flex-col gap-2 text-xs font-semibold text-white/65">Fecha de publicación<input type="datetime-local" value={quickForm.publishedAt} onChange={(event) => setQuickForm({ ...quickForm, publishedAt: event.target.value })} className={fieldClass} /></label>
        <label className="flex flex-col gap-2 text-xs font-semibold text-white/65">Categoría<select value={quickForm.category} onChange={(event) => setQuickForm({ ...quickForm, category: event.target.value })} className={fieldClass}><option>Embajada</option><option>Programas</option><option>Consejos</option></select></label>
        <label className="flex flex-col gap-2 text-xs font-semibold text-white/65">Autor<input required value={quickForm.authorName} onChange={(event) => setQuickForm({ ...quickForm, authorName: event.target.value })} className={fieldClass} /></label>
        <div className="flex flex-wrap gap-2 sm:col-span-3"><button disabled={quickSaving} className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-ink disabled:opacity-50">{quickSaving ? 'Guardando...' : 'Guardar cambios'}</button><button type="button" onClick={() => setQuickEditId(null)} className="rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-white/60">Cancelar</button></div>
      </form>}
    </div>)}{visiblePosts.length === 0 && <p className="p-10 text-center text-sm text-white/45">No hay entradas en esta sección.</p>}</div>
  </section>
}
