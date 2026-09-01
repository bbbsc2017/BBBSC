export const SITE = {
  name: 'BBB Student Center',
  shortName: 'BBBSC',
  url: 'https://bbbsc.com',
  tagline: 'Expertos en programas Work & Travel y experiencias internacionales',
  defaultSocialImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
  email: 'info@bbbsc.com',
  whatsapp: '+573123808387',
  whatsappDisplay: '+57 312 380 8387',
  phones: {
    ibague: '3245961316',
    bucaramanga: '3104735297',
  },
  offices: [
    {
      city: 'Ibagué',
      address: 'Cll 11 #4-24 Oficina 401, Tolima',
      phone: '3245961316',
      phoneDisplay: undefined as string | undefined,
      googleBusinessName: 'BBB Student Centers',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BBB%20Student%20Centers%20Ibagu%C3%A9',
    },
    {
      city: 'Bucaramanga',
      address: 'Cra. 36 #48-20, Santander',
      phone: '3104735297',
      phoneDisplay: '+57 310 473 5297',
      googleBusinessName: 'BBB Student Center Sede Bucaramanga',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BBB%20Student%20Center%20Sede%20Bucaramanga',
    },
  ],
  social: {
    facebook: 'https://www.facebook.com/bbbstudentcenter',
    instagram: 'https://www.instagram.com/bbbsc_world/',
    youtube: 'https://www.youtube.com/@BBBStudentCenter',
    linkedin: 'https://www.linkedin.com/company/81942496/',
    tiktok: 'https://www.tiktok.com/@bbbsc_world',
    spotify: 'https://open.spotify.com/show/2cc0yNVMG5VcGBNQ30GFdj?si=fUi8QRw8REeBauhV--zJDA',
  },
} as const

export function whatsappLink(message?: string, phone?: string) {
  const digits = (phone ?? SITE.whatsapp).replace(/\D/g, '')
  const full = phone && !digits.startsWith('57') ? `57${digits}` : digits
  const base = `https://wa.me/${full}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Convierte el mismo array `{ label, to? }` que ya usan todas las páginas
 * para pintar <Breadcrumbs> en un schema.org BreadcrumbList — así Google
 * puede mostrar la ruta de navegación en el resultado de búsqueda sin
 * duplicar esa lista a mano en cada página. El último item (sin `to`, la
 * página actual) usa `currentPath` como su URL; un item intermedio sin `to`
 * (ej. "Programas culturales", que no tiene página propia) omite `item` en
 * vez de apuntar por error a la misma URL que otro nivel del breadcrumb.
 */
export function breadcrumbJsonLd(items: { label: string; to?: string }[], currentPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1
      const url = item.to ?? (isLast ? currentPath : undefined)
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(url ? { item: `${SITE.url}${url}` } : {}),
      }
    }),
  }
}
