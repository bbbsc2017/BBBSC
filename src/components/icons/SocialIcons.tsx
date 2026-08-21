import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h2.6l.4-4h-3V8a1 1 0 0 1 1-1h2z" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7.5" y1="10.5" x2="7.5" y2="16.5" />
      <circle cx="7.5" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11 16.5v-4a2 2 0 0 1 4 0v4" />
      <line x1="11" y1="10.5" x2="11" y2="16.5" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.1 2.5v10.6a4.6 4.6 0 1 1-3.5-4.5V12a1.6 1.6 0 1 0 .6 1.2V2.5h2.9c.3 2.2 1.7 3.6 4.1 3.9v3.1a8 8 0 0 1-4.1-1.6V2.5Z" />
    </svg>
  )
}

export function SpotifyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 10.2c3-1 6.6-.7 9 .8" />
      <path d="M8 13.2c2.4-.8 5.2-.6 7.2.6" />
      <path d="M8.5 16c1.8-.6 3.8-.4 5.2.5" />
    </svg>
  )
}
