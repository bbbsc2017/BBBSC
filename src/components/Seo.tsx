import { useEffect } from 'react'
import { SITE } from '../lib/site'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function Seo({ title, description, path, type = 'website', noIndex = false, publishedTime, modifiedTime, jsonLd }: SeoProps) {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const fullTitle = `${title} | ${SITE.name}`
    const url = `${SITE.url}${path}`
    // La imagen de vista previa al compartir es siempre la portada de marca,
    // sin importar la foto propia de cada página — así cualquier link
    // (oferta, programa, blog...) se ve igual de reconocible al compartirse.
    // `image`/`imageAlt` se mantienen como props por si algún día se quiere
    // volver a una portada por página; hoy no se usan para esto.
    const ogImage = SITE.defaultSocialImage
    const socialImageAlt = `${SITE.name} — ${SITE.tagline}`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setLink('canonical', url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:image:alt', socialImageAlt)
    setMeta('property', 'og:site_name', SITE.name)
    setMeta('property', 'og:locale', 'es_CO')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)
    setMeta('name', 'twitter:image:alt', socialImageAlt)
    if (type === 'article' && publishedTime) setMeta('property', 'article:published_time', publishedTime)
    if (type === 'article' && modifiedTime) setMeta('property', 'article:modified_time', modifiedTime)

    let script = document.getElementById('page-jsonld') as HTMLScriptElement | null
    if (jsonLdText) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'page-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = jsonLdText
    } else if (script) {
      script.remove()
    }

    return () => {
      document.getElementById('page-jsonld')?.remove()
    }
  }, [title, description, path, type, noIndex, publishedTime, modifiedTime, jsonLdText])

  return null
}
