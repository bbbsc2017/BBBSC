import { useEffect } from 'react'

interface PublicTrackingSettings {
  metaPixelId: string | null
  googleGtagId: string | null
  clientifySiteId: string | null
}

const META_PIXEL_PATTERN = /^\d{5,30}$/
const GOOGLE_GTAG_PATTERN = /^(G|GT|AW)-[A-Z0-9-]{4,30}$/i
const CLIENTIFY_PATTERN = /^[A-Za-z0-9_-]{4,80}$/

function injectMetaPixel(pixelId: string) {
  if (document.getElementById('meta-pixel-script')) return

  const script = document.createElement('script')
  script.id = 'meta-pixel-script'
  script.textContent = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)
}

function injectGtag(gtagId: string) {
  if (document.getElementById('gtag-script')) return

  const loader = document.createElement('script')
  loader.id = 'gtag-script'
  loader.async = true
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`
  document.head.appendChild(loader)

  const inline = document.createElement('script')
  inline.id = 'gtag-inline-script'
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gtagId}');
  `
  document.head.appendChild(inline)
}

function injectClientify(siteId: string) {
  if (document.getElementById('clientify-script')) return

  const script = document.createElement('script')
  script.id = 'clientify-script'
  script.async = true
  script.src = `https://app.clientify.net/api/v1/tracking/${encodeURIComponent(siteId)}.js`
  document.head.appendChild(script)
}

export function TrackingScripts({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return
    fetch('/api/settings/public')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ok: boolean } & PublicTrackingSettings | null) => {
        if (!data?.ok) return
        if (data.metaPixelId && META_PIXEL_PATTERN.test(data.metaPixelId)) injectMetaPixel(data.metaPixelId)
        if (data.googleGtagId && GOOGLE_GTAG_PATTERN.test(data.googleGtagId)) injectGtag(data.googleGtagId)
        if (data.clientifySiteId && CLIENTIFY_PATTERN.test(data.clientifySiteId)) injectClientify(data.clientifySiteId)
      })
      .catch(() => {})
  }, [enabled])

  return null
}
