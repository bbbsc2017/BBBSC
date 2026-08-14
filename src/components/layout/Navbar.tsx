import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react'
import logoMark from '../../assets/logo/bbb-mark-white.svg'
import { culturalPrograms } from '../../data/culturalPrograms'
import { academicPrograms } from '../../data/academicPrograms'

interface NavGroup {
  label: string
  items: { label: string; to: string }[]
}

const groups: NavGroup[] = [
  {
    label: 'Programas Culturales',
    items: culturalPrograms.map((program) => ({ label: program.title, to: `/${program.slug}` })),
  },
  {
    label: 'Programas Académicos',
    items: academicPrograms.map((program) => ({ label: program.title, to: `/${program.slug}` })),
  },
]

export function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const returnPath = `${location.pathname}${location.search}${location.hash}`
  const loginPath = `/intranet/login?next=${encodeURIComponent(returnPath)}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let active = true
    fetch('/api/auth/me')
      .then((response) => { if (active) setAuthenticated(response.ok) })
      .catch(() => { if (active) setAuthenticated(false) })
    return () => { active = false }
  }, [location.pathname])

  async function logout() {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (response.ok) setAuthenticated(false)
    } finally {
      setOpen(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-white/10 bg-ink/95 backdrop-blur-lg' : 'border-transparent bg-ink/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="BBB Student Center — Inicio">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#f9b000] p-2">
            <img src={logoMark} alt="" className="size-full" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-white">BBB Student Center</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {groups.map((group) => (
            <div key={group.label} className="group relative">
              <span className="flex cursor-default items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors group-hover:text-brand">
                {group.label}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </span>
              <div className="invisible absolute left-0 top-full w-72 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 p-2 shadow-xl shadow-black/40">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-brand/10 hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <NavLink
            to="/ofertas"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand' : 'text-white/70 hover:text-brand'}`
            }
          >
            Ofertas
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand' : 'text-white/70 hover:text-brand'}`
            }
          >
            Blog
          </NavLink>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {authenticated === null ? <span className="h-10 w-32 animate-pulse rounded-full bg-white/5" aria-label="Comprobando sesión" /> : authenticated ? <>
            <Link to="/intranet" className="inline-flex items-center rounded-full bg-brand px-4 py-2.5 text-xs font-extrabold text-ink transition hover:-translate-y-0.5"><LayoutDashboard className="mr-2 size-4" />Ver panel</Link>
            <button type="button" onClick={logout} className="inline-flex items-center rounded-full border border-white/15 px-4 py-2.5 text-xs font-bold text-white/65 transition hover:border-red-400/40 hover:text-red-300"><LogOut className="mr-2 size-4" />Cerrar sesión</button>
          </> : <Link to={loginPath} className="inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-brand-400"><LogIn className="mr-2 size-4" />Iniciar sesión</Link>}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Principal móvil">
            {groups.map((group) => (
              <div key={group.label} className="py-1">
                <span className="block rounded-lg px-3 py-2.5 text-sm font-bold text-white">{group.label}</span>
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-6 py-2 text-sm text-white/60"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/ofertas" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80">
              Ofertas
            </Link>
            <Link to="/blog" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80">
              Blog
            </Link>
            <div className="mt-3 border-t border-white/10 pt-4">{authenticated === null ? <span className="block h-11 animate-pulse rounded-full bg-white/5" /> : authenticated ? <div className="grid grid-cols-2 gap-2"><Link to="/intranet" onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-3 text-xs font-extrabold text-ink"><LayoutDashboard className="mr-2 size-4" />Ver panel</Link><button type="button" onClick={logout} className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-3 text-xs font-bold text-white/65"><LogOut className="mr-2 size-4" />Cerrar sesión</button></div> : <Link to={loginPath} onClick={() => setOpen(false)} className="flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-ink"><LogIn className="mr-2 size-4" />Iniciar sesión</Link>}</div>
          </nav>
        </div>
      )}
    </header>
  )
}
