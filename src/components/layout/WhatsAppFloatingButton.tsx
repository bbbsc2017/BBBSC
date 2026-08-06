import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../../lib/site'

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappLink('¡Hola! Quiero más información sobre los programas de BBB Student Center.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-7" fill="currentColor" strokeWidth={0} />
    </a>
  )
}
