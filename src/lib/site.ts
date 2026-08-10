export const SITE = {
  name: 'BBB Student Center',
  shortName: 'BBBSC',
  url: 'https://bbbsc.com',
  tagline: 'Expertos en programas Work & Travel y experiencias internacionales',
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
    },
    {
      city: 'Bucaramanga',
      address: 'Cra. 36 #48-116, ColorWorking, Santander',
      phone: '3104735297',
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

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp.replace('+', '')}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
