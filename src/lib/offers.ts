export const OFFER_PROGRAMS = [
  { slug: 'work-travel-usa', label: 'Work and Travel USA' },
  { slug: 'work-travel-asia', label: 'Work and Travel Asia' },
  { slug: 'trainee-internship', label: 'Trainee and Internship' },
  { slug: 'teacher-assistant', label: 'Teacher Assistant' },
  { slug: 'teacher-exchange', label: 'Teacher Exchange' },
] as const

export type OfferProgram = typeof OFFER_PROGRAMS[number]['slug']

export interface JobOffer {
  id: number
  slug: string
  title: string
  program: OfferProgram
  sponsor: string
  employer: string
  compensationType: 'salary' | 'stipend'
  compensationMin: number
  compensationMax: number | null
  compensationCurrency: string
  compensationPeriod: 'hour' | 'week' | 'month' | 'year' | 'program'
  hasTips: boolean
  englishLevel: string
  city: string
  state: string
  offerType: string
  airportPickup: boolean
  overtime: boolean
  bonuses: string
  vacanciesTotal: number
  vacanciesLost: number
  vacanciesAvailable: number
  availableUntil: string
  imageSrc: string
  images?: string[]
  description: string
  status: 'draft' | 'active' | 'closed'
  storedStatus?: 'draft' | 'active' | 'closed'
  hasPdf: boolean
  pdfViewUrl: string | null
  pdfSourceUrl?: string
  pdfFileName?: string
  pdfText?: string
  clientifyProductLinked: boolean
  clientifyProductId?: string | null
  clientifyProductName?: string
  clientifyProductSku?: string
  clientifySyncedAt?: string | null
  createdAt: string
  updatedAt: string
}

export function programLabel(program: string) {
  return OFFER_PROGRAMS.find((item) => item.slug === program)?.label || program
}

export function pathSlug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function offerPath(offer: Pick<JobOffer, 'program' | 'sponsor' | 'slug'>) {
  return `/ofertas/${offer.program}/${pathSlug(offer.sponsor)}/${offer.slug}`
}

const periodLabels: Record<JobOffer['compensationPeriod'], string> = { hour: 'hora', week: 'semana', month: 'mes', year: 'año', program: 'programa' }

export function compensationLabel(offer: JobOffer) {
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
  const range = offer.compensationMax && offer.compensationMax !== offer.compensationMin
    ? `${formatter.format(offer.compensationMin)}–${formatter.format(offer.compensationMax)}`
    : formatter.format(offer.compensationMin)
  return `${offer.compensationCurrency} ${range} / ${periodLabels[offer.compensationPeriod]}`
}

export function isOfferAvailable(offer: JobOffer, now = Date.now()) {
  return offer.status === 'active' && offer.vacanciesAvailable > 0 && new Date(offer.availableUntil).getTime() >= now
}
