export function RecaptchaNotice({ className = '' }: { className?: string }) {
  return <p className={`text-[10px] leading-4 text-white/30 ${className}`}>Este formulario está protegido por reCAPTCHA. Aplican la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/55">Política de Privacidad</a> y los <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/55">Términos de Servicio</a> de Google.</p>
}
