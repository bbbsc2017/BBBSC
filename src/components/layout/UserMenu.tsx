import { useEffect, useRef, useState } from 'react'
import { LayoutDashboard, LifeBuoy, LogOut } from 'lucide-react'
import { initials, type SessionUser } from '../../lib/session'
import { whatsappLink } from '../../lib/site'

export function UserMenu({ user, photoUrl, onLogout }: { user: SessionUser; photoUrl: string | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de tu cuenta"
        className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#f9b000] text-sm font-black text-ink transition hover:-translate-y-0.5"
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="size-full object-cover" />
        ) : (
          initials(user)
        )}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-ink-800 py-2 shadow-xl shadow-black/40">
          <p className="truncate px-4 py-2 text-xs font-semibold text-white/40">{user.firstName} {user.lastName}</p>
          <a href="/perfil" role="menuitem" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-brand/10 hover:text-brand">
            <LayoutDashboard className="size-4" />
            Panel de Control
          </a>
          <a href={whatsappLink('¡Hola! Necesito soporte con mi cuenta de BBB Student Center.')} target="_blank" rel="noopener noreferrer" role="menuitem" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-brand/10 hover:text-brand">
            <LifeBuoy className="size-4" />
            Soporte
          </a>
          <button type="button" onClick={onLogout} role="menuitem" className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-white/80 transition-colors hover:bg-red-400/10 hover:text-red-300">
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
