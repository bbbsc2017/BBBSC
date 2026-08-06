import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import logoMark from '../../assets/logo/bbb-icon.svg'
import { culturalPrograms } from '../../data/culturalPrograms'
import { academicPrograms } from '../../data/academicPrograms'
import { CTAButton } from '../ui/CTAButton'

interface NavGroup {
  label: string
  indexTo: string
  items: { label: string; to: string }[]
}

const groups: NavGroup[] = [
  {
    label: 'Programas Culturales',
    indexTo: '/programas-culturales',
    items: culturalPrograms.map((program) => ({ label: program.title, to: `/programas-culturales/${program.slug}` })),
  },
  {
    label: 'Programas Académicos',
    indexTo: '/programas-academicos',
    items: academicPrograms.map((program) => ({ label: program.title, to: `/programas-academicos/${program.slug}` })),
  },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? 'border-ink/10 bg-white/90 backdrop-blur-lg' : 'border-transparent bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="BBB Student Center — Inicio">
          <span className="flex size-10 items-center justify-center rounded-xl bg-ink p-2">
            <img src={logoMark} alt="" className="size-full" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight text-ink">BBB Student Center</span>
            <span className="text-[11px] font-medium text-ink-600">Work & Travel · Experiencias internacionales</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand-700' : 'text-ink-700 hover:text-brand-700'}`
            }
          >
            Inicio
          </NavLink>

          {groups.map((group) => (
            <div key={group.label} className="group relative">
              <Link
                to={group.indexTo}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700"
              >
                {group.label}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full w-72 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-xl shadow-ink/10">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-brand/10 hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <NavLink
            to="/universidades"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand-700' : 'text-ink-700 hover:text-brand-700'}`
            }
          >
            Universidades
          </NavLink>
          <NavLink
            to="/contacto"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-brand-700' : 'text-ink-700 hover:text-brand-700'}`
            }
          >
            Contáctanos
          </NavLink>
        </nav>

        <div className="hidden lg:block">
          <CTAButton to="/contacto" icon={false} className="!px-5 !py-2.5 !text-sm">
            Viaja y Aprende
          </CTAButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 text-ink lg:hidden"
          aria-expanded={open}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Principal móvil">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700">
              Inicio
            </Link>
            {groups.map((group) => (
              <div key={group.label} className="py-1">
                <Link
                  to={group.indexTo}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-bold text-ink"
                >
                  {group.label}
                </Link>
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-6 py-2 text-sm text-ink-600"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/universidades" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700">
              Universidades
            </Link>
            <Link to="/contacto" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700">
              Contáctanos
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
