import { useEffect } from 'react'
import { SITE } from '../lib/site'

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
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

export function Seo({ title, description, path, image, type = 'website', jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE.name}`
    const url = `${SITE.url}${path}`
    const ogImage = image ?? `${SITE.url}/og-image.jpg`

    document.title = fullTitle
    setMeta('name', 'description', description)
    setLink('canonical', url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:site_name', SITE.name)
    setMeta('property', 'og:locale', 'es_CO')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)

    let script = document.getElementById('page-jsonld') as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.id = 'page-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    return () => {
      document.getElementById('page-jsonld')?.remove()
    }
  }, [title, description, path, image, type, jsonLd])

  return null
}
