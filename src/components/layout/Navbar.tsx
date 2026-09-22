import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LogIn, Menu, X } from 'lucide-react'
import logoMark from '../../assets/logo/bbb-mark-white.svg'
import { culturalPrograms } from '../../data/culturalPrograms'
import { academicPrograms } from '../../data/academicPrograms'
import { useSession } from '../../lib/session'
import { LoginModal } from './LoginModal'
import { UserMenu } from './UserMenu'

interface NavGroup {
  label: string
  items: { label: string; to: string }[]
}

const groups: NavGroup[] = [
  { label: 'Programas Culturales', items: culturalPrograms.map(program => ({ label: program.title, to: `/${program.slug}` })) },
  { label: 'Programas Académicos', items: academicPrograms.map(program => ({ label: program.title, to: `/${program.slug}` })) },
]

export function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { user, photoUrl, loading, refresh, logout } = useSession()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); setOpenGroup(null) }, [location.pathname])

  // El menú móvil flota sobre la página (no empuja el contenido), así que se
  // cierra al tocar fuera de él o con Escape — igual que cualquier dropdown.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled ? 'border-white/10 bg-ink/95 backdrop-blur-lg' : 'border-transparent bg-ink/70 backdrop-blur-md'}`}>
    <div ref={panelRef} className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
      <Link to="/" className="flex items-center gap-2.5" aria-label="BBB Student Center — Inicio">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#f9b000] p-2"><img src={logoMark} alt="BBB Student Center" className="size-full" /></span>
        <span className="text-base font-extrabold tracking-tight text-white">BBB Student Center</span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
        {groups.map(group => <div key={group.label} className="group relative">
          <span className="flex cursor-default items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors group-hover:text-brand">{group.label}<ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" /></span>
          <div className="invisible absolute left-0 top-full w-72 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"><div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 p-2 shadow-xl shadow-black/40">{group.items.map(item => <Link key={item.to} to={item.to} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-brand/10 hover:text-brand">{item.label}</Link>)}</div></div>
        </div>)}
        <NavLink to="/ofertas" className={({isActive}) => `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand' : 'text-white/70 hover:text-brand'}`}>Ofertas</NavLink>
        <NavLink to="/hunters" className={({isActive}) => `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand' : 'text-white/70 hover:text-brand'}`}>Hunters</NavLink>
        <NavLink to="/blog" className={({isActive}) => `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand' : 'text-white/70 hover:text-brand'}`}>Blog</NavLink>
      </nav>

      {!loading && (
        <div className="hidden lg:flex">
          {user ? (
            <UserMenu user={user} photoUrl={photoUrl} onLogout={logout} />
          ) : (
            <button type="button" onClick={() => setLoginOpen(true)} className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-brand-400">
              <LogIn className="mr-2 size-4" />Iniciar sesión
            </button>
          )}
        </div>
      )}
      <button type="button" onClick={() => setOpen(value => !value)} className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'}>{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>

      {/* Panel flotante: position:absolute anclado a este contenedor (que ya es
          "positioned" por estar dentro del <header> sticky), no empuja el
          contenido de la página como un dropdown normal. */}
      {open && (
        <div className="absolute inset-x-3 top-full z-50 mt-2 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-3xl border border-white/10 bg-ink-800 p-3 shadow-2xl shadow-black/50 lg:hidden">
          <nav className="flex flex-col gap-1.5" aria-label="Principal móvil">
            {groups.map(group => {
              const isGroupOpen = openGroup === group.label
              return (
                <div key={group.label} className="overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(isGroupOpen ? null : group.label)}
                    aria-expanded={isGroupOpen}
                    className="flex min-h-12 w-full items-center justify-between rounded-2xl px-3.5 text-base font-bold text-white transition-colors hover:bg-white/5"
                  >
                    {group.label}
                    <ChevronDown className={`size-4.5 shrink-0 text-white/50 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isGroupOpen && (
                    <div className="flex flex-col gap-0.5 px-1.5 pb-2 pt-1">
                      {group.items.map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex min-h-11 items-center rounded-xl px-4 text-base text-white/65 transition-colors hover:bg-white/5 hover:text-white">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="my-1 border-t border-white/10" />

            <Link to="/ofertas" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-3.5 text-base font-bold text-white/85 hover:bg-white/5">Ofertas</Link>
            <Link to="/hunters" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-3.5 text-base font-bold text-white/85 hover:bg-white/5">Hunters</Link>
            <Link to="/blog" onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-2xl px-3.5 text-base font-bold text-white/85 hover:bg-white/5">Blog</Link>

            <div className="mt-2 border-t border-white/10 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <a href="/perfil" className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand text-base font-extrabold text-white">Panel de Control</a>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 text-base font-bold text-white/70">Cerrar sesión</button>
                </div>
              ) : (
                <button type="button" onClick={() => { setLoginOpen(true); setOpen(false) }} className="flex min-h-12 w-full items-center justify-center rounded-full bg-brand text-base font-extrabold text-white"><LogIn className="mr-2 size-4" />Iniciar sesión</button>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>

    {loginOpen && (
      <LoginModal
        onClose={() => setLoginOpen(false)}
        onSuccess={() => { setLoginOpen(false); refresh() }}
      />
    )}
  </header>
}
