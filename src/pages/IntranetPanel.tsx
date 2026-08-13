import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BriefcaseBusiness, ChevronDown, ClipboardList, FileText, GraduationCap, Images, LayoutDashboard, LogOut, Menu, MessageSquare, Newspaper, Settings, Shield, UserCog, Users, X } from 'lucide-react'
import { Seo } from '../components/Seo'
import { CommentsManager } from '../components/intranet/CommentsManager'
import { DashboardPanel } from '../components/intranet/DashboardPanel'
import { MediaManager } from '../components/intranet/MediaManager'
import { OffersManager } from '../components/intranet/OffersManager'
import { PostsManager } from '../components/intranet/PostsManager'
import { ReaderPosts } from '../components/intranet/ReaderPosts'
import { RolesManager } from '../components/intranet/RolesManager'
import { TrackingSettings } from '../components/intranet/TrackingSettings'
import { UsersManager } from '../components/intranet/UsersManager'
import { ClientifyFormsSettings } from '../components/intranet/ClientifyFormsSettings'
import { can, PANEL_PERMISSIONS, requestJson, type SessionUser } from '../components/intranet/shared'

type SectionId = 'dashboard' | 'posts' | 'offers' | 'media' | 'comments' | 'users' | 'roles' | 'tracking' | 'forms'

const contentNavigation = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, permission: PANEL_PERMISSIONS.dashboardView },
  { id: 'posts' as const, label: 'Entradas', icon: FileText, permission: PANEL_PERMISSIONS.postsView },
  { id: 'offers' as const, label: 'Ofertas', icon: BriefcaseBusiness, permission: PANEL_PERMISSIONS.offersView },
  { id: 'media' as const, label: 'Medios', icon: Images, permission: PANEL_PERMISSIONS.mediaView },
  { id: 'comments' as const, label: 'Comentarios', icon: MessageSquare, permission: PANEL_PERMISSIONS.commentsView },
  { id: 'users' as const, label: 'Usuarios', icon: Users, permission: PANEL_PERMISSIONS.usersView },
]

const sectionTitles: Record<SectionId, { title: string; description: string }> = {
  dashboard: { title: 'Dashboard', description: 'Resumen general de la actividad de BBBSC.' },
  posts: { title: 'Entradas', description: 'Contenido editorial publicado en BBB News.' },
  offers: { title: 'Ofertas', description: 'Oportunidades laborales por programa, empleador y destino.' },
  media: { title: 'Medios', description: 'Biblioteca central de imágenes del sitio.' },
  comments: { title: 'Comentarios', description: 'Mensajes recibidos en las entradas del blog.' },
  users: { title: 'Usuarios', description: 'Acceso del personal y los participantes a esta intranet.' },
  roles: { title: 'Roles y permisos', description: 'Permisos propios del panel de bbbsc.com.' },
  tracking: { title: 'Píxeles y analítica', description: 'Configuración de Meta Pixel, Google tag y seguimiento de Clientify.' },
  forms: { title: 'Formularios y Clientify', description: 'Conexión y emparejamiento de los campos enviados desde la web.' },
}

export default function IntranetPanel() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const requestedSection = (searchParams.get('section') || 'dashboard') as SectionId
  const navigation = contentNavigation.filter((item) => can(user, item.permission))
  const allowedSections: SectionId[] = [
    ...navigation.map((item) => item.id),
    ...(can(user, PANEL_PERMISSIONS.rolesView) ? ['roles' as const] : []),
    ...(can(user, PANEL_PERMISSIONS.trackingManage) ? ['tracking' as const] : []),
    ...(can(user, PANEL_PERMISSIONS.trackingManage) ? ['forms' as const] : []),
  ]
  const section = allowedSections.includes(requestedSection) ? requestedSection : (allowedSections[0] || 'dashboard')
  const userGroup = searchParams.get('group') === 'participants' ? 'participant' : 'staff'
  const canEditPosts = can(user, PANEL_PERMISSIONS.postsCreate) || can(user, PANEL_PERMISSIONS.postsEdit) || can(user, PANEL_PERMISSIONS.postsPublish) || can(user, PANEL_PERMISSIONS.postsDelete)

  useEffect(() => {
    requestJson('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => navigate('/intranet/login', { replace: true }))
      .finally(() => setLoading(false))
  }, [navigate])

  function selectSection(id: SectionId) {
    setSearchParams(id === 'dashboard' ? {} : id === 'users' ? { section: 'users', group: 'staff' } : { section: id })
    setMobileOpen(false)
  }

  function selectUserGroup(group: 'staff' | 'participant') {
    setSearchParams({ section: 'users', group: group === 'staff' ? 'staff' : 'participants' })
    setMobileOpen(false)
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
    navigate('/intranet/login', { replace: true })
  }

  if (loading || !user) return <div className="bbb-grid-bg min-h-screen p-10 text-center text-sm text-white/50">Cargando intranet...</div>

  const meta = section === 'dashboard' && user.role === 'STUDENT'
    ? { title: 'Mi perfil', description: 'Tu información personal, oferta e historial de aplicaciones.' }
    : section === 'users'
    ? userGroup === 'staff'
      ? { title: 'Personal', description: 'Personal y roles asignados en esta intranet.' }
      : { title: 'Participantes', description: 'Participantes, acceso y rol asignado en esta intranet.' }
    : sectionTitles[section]
  const showSystem = can(user, PANEL_PERMISSIONS.rolesView) || can(user, PANEL_PERMISSIONS.trackingManage)

  return <>
    <Seo title={`${meta.title} - Intranet`} description="Panel interno de BBB Student Center." path="/intranet" noIndex />
    <div className="bbb-grid-bg min-h-screen text-white lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      {mobileOpen && <button type="button" className="fixed inset-0 z-40 bg-[#1c1c1c]/80 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" />}

      <aside className={`bbb-grid-bg fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <Link to="/" className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white"><Newspaper className="size-5" /></span><span><strong className="block text-sm">BBBSC</strong><small className="text-[11px] uppercase tracking-[.2em] text-white/35">Intranet</small></span></Link>
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-white/50 lg:hidden" aria-label="Cerrar menú"><X className="size-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4" aria-label="Navegación de intranet">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-white/25">Contenido</p>
          <ul className="space-y-1">{navigation.map(({ id, label, icon: Icon }) => <li key={id}>
            <button type="button" onClick={() => selectSection(id)} aria-expanded={id === 'users' ? true : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === id ? 'bg-brand text-white shadow-brand' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Icon className="size-4.5" />{label}{id === 'users' && <ChevronDown className="ml-auto size-4" />}</button>
            {id === 'users' && <ul className="ml-5 mt-1 space-y-1 border-l border-white/10 pl-3">
              <li><button type="button" onClick={() => selectUserGroup('staff')} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${section === 'users' && userGroup === 'staff' ? 'bg-white/10 text-brand' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}><UserCog className="size-4" />Personal</button></li>
              <li><button type="button" onClick={() => selectUserGroup('participant')} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${section === 'users' && userGroup === 'participant' ? 'bg-white/10 text-brand' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}><GraduationCap className="size-4" />Participantes</button></li>
            </ul>}
          </li>)}</ul>

          {showSystem && <><div className="my-5 h-px bg-white/10" /><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-white/25">Sistema</p>
            {can(user, PANEL_PERMISSIONS.rolesView) && <button type="button" onClick={() => selectSection('roles')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === 'roles' ? 'bg-brand text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Shield className="size-4.5" />Roles y permisos</button>}
            {can(user, PANEL_PERMISSIONS.trackingManage) && <button type="button" onClick={() => selectSection('tracking')} className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === 'tracking' ? 'bg-brand text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><Settings className="size-4.5" />Configuración</button>}
            {can(user, PANEL_PERMISSIONS.trackingManage) && <button type="button" onClick={() => selectSection('forms')} className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${section === 'forms' ? 'bg-brand text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}><ClipboardList className="size-4.5" />Formularios</button>}
          </>}
        </nav>

        <div className="border-t border-white/10 p-4"><div className="mb-3 rounded-2xl bg-white/5 p-3"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">{(user.firstName?.[0] || user.email[0]).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-xs font-bold">{user.firstName} {user.lastName}</p><p className="truncate text-[10px] text-white/35">{user.localRole?.label || user.role}</p></div></div></div><button type="button" onClick={logout} className="flex w-full items-center justify-center rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-white/50 hover:border-red-400/30 hover:text-red-300"><LogOut className="mr-2 size-3.5" />Cerrar sesión</button></div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-4 border-b border-white/10 bg-ink/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl border border-white/10 p-2.5 text-white/60 lg:hidden" aria-label="Abrir menú"><Menu className="size-5" /></button><div className="min-w-0"><h1 className="truncate text-lg font-extrabold sm:text-xl">{meta.title}</h1><p className="mt-0.5 hidden truncate text-xs text-white/40 sm:block">{meta.description}</p></div><Link to="/" className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/55 hover:text-white">Ver sitio</Link></header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {section === 'dashboard' && <DashboardPanel user={user} />}
          {section === 'posts' && (canEditPosts ? <PostsManager user={user} /> : <ReaderPosts />)}
          {section === 'offers' && can(user, PANEL_PERMISSIONS.offersView) && <OffersManager user={user} />}
          {section === 'media' && can(user, PANEL_PERMISSIONS.mediaView) && <MediaManager user={user} />}
          {section === 'comments' && can(user, PANEL_PERMISSIONS.commentsView) && <CommentsManager user={user} />}
          {section === 'users' && can(user, PANEL_PERMISSIONS.usersView) && <UsersManager group={userGroup} currentUser={user} />}
          {section === 'roles' && can(user, PANEL_PERMISSIONS.rolesView) && <RolesManager user={user} />}
          {section === 'tracking' && can(user, PANEL_PERMISSIONS.trackingManage) && <TrackingSettings />}
          {section === 'forms' && can(user, PANEL_PERMISSIONS.trackingManage) && <ClientifyFormsSettings />}
        </main>
      </div>
    </div>
  </>
}
