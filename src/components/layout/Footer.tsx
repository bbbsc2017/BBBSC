import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, LinkedinIcon, SpotifyIcon, YoutubeIcon } from '../icons/SocialIcons'
import logoMark from '../../assets/logo/bbb-mark-white.svg'
import { culturalPrograms } from '../../data/culturalPrograms'
import { academicPrograms } from '../../data/academicPrograms'
import { universities } from '../../data/universities'
import { SITE, whatsappLink } from '../../lib/site'

const socialLinks = [
  { label: 'Facebook', href: SITE.social.facebook, Icon: FacebookIcon },
  { label: 'Instagram', href: SITE.social.instagram, Icon: InstagramIcon },
  { label: 'YouTube', href: SITE.social.youtube, Icon: YoutubeIcon },
  { label: 'LinkedIn', href: SITE.social.linkedin, Icon: LinkedinIcon },
  { label: 'Spotify', href: SITE.social.spotify, Icon: SpotifyIcon },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/20 blur-3xl"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoMark} alt="BBB Student Center" className="h-9 w-auto" />
            <span className="text-lg font-extrabold tracking-tight">BBB Student Center</span>
          </Link>
          <p className="max-w-xs text-sm text-white/60">{SITE.tagline}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-brand hover:text-ink"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Programas Culturales">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">Programas Culturales</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {culturalPrograms.map((program) => (
              <li key={program.slug}>
                <Link to={`/programas-culturales/${program.slug}`} className="transition-colors hover:text-white">
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Programas Académicos">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">Programas Académicos</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {academicPrograms.map((program) => (
              <li key={program.slug}>
                <Link to={`/programas-academicos/${program.slug}`} className="transition-colors hover:text-white">
                  {program.country}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mb-4 mt-8 text-sm font-bold uppercase tracking-wide text-brand">Universidades</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            {universities.map((university) => (
              <li key={university.slug}>
                <Link to={`/universidades/${university.slug}`} className="transition-colors hover:text-white">
                  {university.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Enlaces">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">Enlaces</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-white/70">
            <li>
              <Link to="/contacto" className="transition-colors hover:text-white">
                Contáctanos
              </Link>
            </li>
            <li>
              <Link to="/terminos-y-condiciones" className="transition-colors hover:text-white">
                Términos y Condiciones
              </Link>
            </li>
            <li>
              <Link to="/trabaja-con-nosotros" className="transition-colors hover:text-white">
                Trabaja con Nosotros
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-brand">Contacto</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/70">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 transition-colors hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-start gap-2.5 transition-colors hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                {SITE.email}
              </a>
            </li>
            {SITE.offices.map((office) => (
              <li key={office.city} className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  <strong className="text-white">{office.city}:</strong> {office.address}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {year} BBB Student Center — Todos los derechos reservados</p>
          <p>Ibagué · Bucaramanga · Colombia</p>
        </div>
      </div>
    </footer>
  )
}
