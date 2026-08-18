import { createPortal } from 'react-dom'
import { Loader2 } from 'lucide-react'

/**
 * Cuadro flotante en la esquina inferior mientras un formulario envía datos
 * a Clientify — el envío puede tardar unos segundos, esto le confirma al
 * usuario que sí está pasando algo en vez de dejarlo mirando un botón fijo.
 *
 * Portal a document.body: si el componente se monta bajo un ancestro con
 * backdrop-filter/transform (como el <header>, ver LoginModal), el overlay
 * position:fixed quedaría encerrado ahí en vez de cubrir la pantalla.
 */
export function SubmittingOverlay({ show, label = 'Enviando…' }: { show: boolean; label?: string }) {
  if (!show) return null
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[110] flex items-center gap-3 rounded-2xl border border-white/15 bg-[#1c1c1c] px-5 py-4 shadow-2xl"
    >
      <Loader2 className="size-5 shrink-0 animate-spin text-brand" />
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-xs text-white/50">No cierres esta ventana</p>
      </div>
    </div>,
    document.body,
  )
}
