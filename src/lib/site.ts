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
      googleBusinessName: 'BBB Student Centers',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BBB%20Student%20Centers%20Ibagu%C3%A9',
    },
    {
      city: 'Bucaramanga',
      address: 'Cra. 36 #48-20, Santander',
      phone: '3104735297',
      googleBusinessName: 'BBB Student Center Sede Bucaramanga',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=BBB%20Student%20Center%20Sede%20Bucaramanga',
    },
  ],
  social: {
    facebook: 'https://www.facebook.com/bbbstudentcenter',
    instagram: 'https://www.instagram.com/bbbstudentcenter',
    youtube: 'https://www.youtube.com/@bbbstudentcenter',
    linkedin: 'https://www.linkedin.com/company/bbb-student-center',
    tiktok: 'https://www.tiktok.com/@bbbstudentcenter',
    spotify: 'https://open.spotify.com/show/bbbstudentcenter',
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
