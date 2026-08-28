import { useEffect, useMemo, useState } from 'react'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { OfferCard } from '../components/offers/OfferCard'
import { Seo } from '../components/Seo'
import { Container } from '../components/ui/Container'
import { fieldClass } from '../components/ui/FormField'
import { ShowcaseHero } from '../components/ui/ShowcaseHero'
import { getCulturalProgram } from '../data/culturalPrograms'
import { isOfferAvailable, OFFER_PROGRAMS, programLabel, type JobOffer, type OfferProgram } from '../lib/offers'
import { apiCredentials, apiUrl } from '../lib/apiBase'

const offerProgramImages: Record<OfferProgram, string> = {
  'work-travel-usa': 'work-and-travel-usa',
  'work-travel-asia': 'asia',
  'trainee-internship': 'trainee-and-internship',
  'teacher-assistant': 'teacher-assistant',
  'teacher-exchange': 'teacher-exchange',
}

function offerHeroImage(program?: OfferProgram) {
  return getCulturalProgram(program ? offerProgramImages[program] : 'work-and-travel-usa')!.image
}

function Filters({ offers, params, setValue, clear }: { offers: JobOffer[]; params: URLSearchParams; setValue: (key: string, value: string) => void; clear: () => void }) {
  const state = params.get('estado') || ''
  const states = [...new Set(offers.map((offer) => offer.state))].sort()
  // Las ciudades se acotan al estado elegido — hay ciudades con el mismo
  // nombre en distintos estados, así que mostrar todas sin filtrar por
  // estado invita a elegir la ciudad equivocada.
  const cities = [...new Set(offers.filter((offer) => !state || offer.state === state).map((offer) => offer.city))].sort()
  const sponsors = [...new Set(offers.map((offer) => offer.sponsor))].sort()
  const activeCount = ['buscar', 'ciudad', 'estado', 'sponsor', 'salario_min', 'salario_max', 'disponibilidad'].filter((key) => params.get(key)).length
  function setState(value: string) {
    // Si la ciudad ya elegida no existe en el nuevo estado, se limpia para
    // no dejar una combinación estado+ciudad inválida sin resultados.
    const city = params.get('ciudad') || ''
    const cityStillValid = !city || offers.some((offer) => offer.state === value && offer.city === city)
    setValue('estado', value)
    if (!cityStillValid) setValue('ciudad', '')
  }
  return <div className="space-y-5">
    <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-extrabold"><SlidersHorizontal className="size-4 text-brand" />Filtrar ofertas</h2>{activeCount > 0 && <button type="button" onClick={clear} className="text-xs font-bold text-brand hover:underline">Limpiar ({activeCount})</button>}</div>
    <label className="block text-xs font-bold text-white/65">Nombre o empleador<span className="relative mt-2 block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" /><input value={params.get('buscar') || ''} onChange={(event) => setValue('buscar', event.target.value)} className={`${fieldClass} pl-10`} placeholder="Buscar oferta" /></span></label>
    <label className="block text-xs font-bold text-white/65">Estado<select value={state} onChange={(event) => setState(event.target.value)} className={`${fieldClass} mt-2`}><option value="">Todos los estados</option>{states.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="block text-xs font-bold text-white/65">Ciudad<select value={params.get('ciudad') || ''} onChange={(event) => setValue('ciudad', event.target.value)} className={`${fieldClass} mt-2`}><option value="">Todas las ciudades</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
    <label className="block text-xs font-bold text-white/65">Sponsor<select value={params.get('sponsor') || ''} onChange={(event) => setValue('sponsor', event.target.value)} className={`${fieldClass} mt-2`}><option value="">Todos los sponsors</option>{sponsors.map((sponsor) => <option key={sponsor}>{sponsor}</option>)}</select></label>
    <label className="block text-xs font-bold text-white/65">Disponibilidad<select value={params.get('disponibilidad') || ''} onChange={(event) => setValue('disponibilidad', event.target.value)} className={`${fieldClass} mt-2`}><option value="">Todas las ofertas</option><option value="disponibles">Disponibles</option><option value="no-disponibles">No disponibles</option></select></label>
    <fieldset><legend className="text-xs font-bold text-white/65">Rango de salario o estipendio</legend><div className="mt-2 grid grid-cols-2 gap-2"><input type="number" min="0" value={params.get('salario_min') || ''} onChange={(event) => setValue('salario_min', event.target.value)} className={fieldClass} placeholder="Mínimo" aria-label="Salario mínimo" /><input type="number" min="0" value={params.get('salario_max') || ''} onChange={(event) => setValue('salario_max', event.target.value)} className={fieldClass} placeholder="Máximo" aria-label="Salario máximo" /></div></fieldset>
  </div>
}

export default function OffersIndex() {
  const { program } = useParams()
  const [params, setParams] = useSearchParams()
  const [offers, setOffers] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)
  const activeProgram = OFFER_PROGRAMS.some((item) => item.slug === program) ? program as OfferProgram : undefined

  useEffect(() => {
    if (program && !activeProgram) return
    setLoading(true); setError('')
    fetch(apiUrl(`/api/offers${activeProgram ? `?program=${encodeURIComponent(activeProgram)}` : ''}`), { credentials: apiCredentials })
      .then(async (response) => { const data = await response.json(); if (!response.ok || !data.ok) throw new Error(data.error); return data.offers })
      .then(setOffers).catch((err) => setError(err instanceof Error ? err.message : 'No pudimos cargar las ofertas.')).finally(() => setLoading(false))
  }, [activeProgram, program])

  const visibleOffers = useMemo(() => {
    const search = (params.get('buscar') || '').trim().toLocaleLowerCase('es')
    const state = params.get('estado') || ''
    const city = params.get('ciudad') || ''
    const sponsor = params.get('sponsor') || ''
    const minimum = Number(params.get('salario_min'))
    const maximum = Number(params.get('salario_max'))
    const availability = params.get('disponibilidad') || ''
    const filtered = offers.filter((offer) => {
      const isAvailable = isOfferAvailable(offer)
      const searchable = `${offer.title} ${offer.employer}`.toLocaleLowerCase('es')
      if (search && !searchable.includes(search)) return false
      if (state && offer.state !== state) return false
      if (city && offer.city !== city) return false
      if (sponsor && offer.sponsor !== sponsor) return false
      if (params.get('salario_min') && (offer.compensationMax ?? offer.compensationMin) < minimum) return false
      if (params.get('salario_max') && offer.compensationMin > maximum) return false
      if (availability === 'disponibles' && !isAvailable) return false
      if (availability === 'no-disponibles' && isAvailable) return false
      return true
    })
    // Con o sin filtros: primero las disponibles, luego las que no lo están.
    // Dentro de cada grupo, las agregadas más recientemente van primero —
    // pero la recencia nunca hace que una oferta no disponible adelante a
    // una disponible, la disponibilidad manda siempre.
    return [...filtered].sort((a, b) => {
      const availabilityDiff = Number(isOfferAvailable(b)) - Number(isOfferAvailable(a))
      if (availabilityDiff !== 0) return availabilityDiff
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [offers, params])

  if (program && !activeProgram) return <Navigate to="/ofertas" replace />
  function setValue(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  function clear() { setParams({}, { replace: true }) }
  const title = activeProgram ? `Ofertas de ${programLabel(activeProgram)}` : 'Ofertas de trabajo en el exterior'
  const selectedProgramLabel = activeProgram ? programLabel(activeProgram) : 'Todos los programas'

  return <>
    <Seo title={title} description={activeProgram ? `Compara empleadores, salarios, ciudades y vacantes de ${selectedProgramLabel} con BBB Student Center.` : 'Explora ofertas de trabajo en el exterior para Work and Travel, prácticas y programas de intercambio con BBB Student Center.'} path={activeProgram ? `/ofertas/${activeProgram}` : '/ofertas'} image={offerHeroImage(activeProgram).src} imageAlt={offerHeroImage(activeProgram).alt} />
    <ShowcaseHero
      eyebrow="Oportunidades BBBSC"
      title={activeProgram ? `Ofertas de ${selectedProgramLabel}` : 'Tu próximo trabajo puede estar al otro lado del mundo'}
      description={activeProgram ? `Explora empleadores, destinos, salarios y beneficios disponibles para ${selectedProgramLabel}.` : 'Compara empleadores, destinos, salarios y beneficios. Los participantes activos pueden reservar una sola oferta.'}
      image={offerHeroImage(activeProgram)}
      imageKey={activeProgram || 'todos-los-programas'}
      primaryAction={{ label: 'Explorar ofertas', to: '#listado-ofertas' }}
      breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Ofertas' }, ...(activeProgram ? [{ label: selectedProgramLabel }] : [])]}
    />
    <section id="listado-ofertas" className="bbb-grid-bg scroll-mt-24 py-6 sm:py-8"><Container>
      <nav className="mb-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filtrar por programa"><Link to="/ofertas" className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-extrabold transition ${!activeProgram ? 'border-brand bg-brand text-white' : 'border-white/10 text-white/55 hover:border-brand/40 hover:text-white'}`}>Todos los programas</Link>{OFFER_PROGRAMS.map((item) => <Link key={item.slug} to={`/ofertas/${item.slug}`} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-extrabold transition ${activeProgram === item.slug ? 'border-brand bg-brand text-white' : 'border-white/10 text-white/55 hover:border-brand/40 hover:text-white'}`}>{item.label}</Link>)}</nav>
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden"><p className="text-sm text-white/50"><strong className="text-white">{visibleOffers.length}</strong> ofertas</p><button type="button" onClick={() => setMobileFilters(true)} className="inline-flex items-center rounded-full border border-white/10 px-4 py-2.5 text-xs font-bold text-white"><Filter className="mr-2 size-4 text-brand" />Filtros</button></div>
      <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]"><aside className="sticky top-24 hidden rounded-3xl border border-white/10 bg-ink-800 p-5 lg:block"><Filters offers={offers} params={params} setValue={setValue} clear={clear} /></aside><section><div className="mb-5 hidden items-center justify-between lg:flex"><div><h2 className="text-2xl font-black text-white">{activeProgram ? programLabel(activeProgram) : 'Todas las ofertas'}</h2><p className="mt-1 text-sm text-white/45">{visibleOffers.length} ofertas para consultar</p></div></div>{error && <p className="rounded-2xl bg-red-400/10 p-5 text-red-300">{error}</p>}{loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map((item) => <div key={item} className="aspect-[3/4] animate-pulse rounded-3xl bg-white/5" />)}</div> : visibleOffers.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visibleOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div> : <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center"><Search className="mx-auto size-9 text-brand" /><h2 className="mt-4 text-xl font-extrabold">No encontramos coincidencias</h2><p className="mt-2 text-sm text-white/45">Prueba otro programa o limpia los filtros.</p><button type="button" onClick={clear} className="mt-5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white">Limpiar filtros</button></div>}</section></div>
    </Container></section>
    {mobileFilters && <div className="fixed inset-0 z-[70] lg:hidden"><button type="button" className="absolute inset-0 bg-[#1c1c1c]/80" onClick={() => setMobileFilters(false)} aria-label="Cerrar filtros" /><aside className="absolute inset-y-0 right-0 w-[min(90vw,360px)] overflow-y-auto bg-ink-800 p-6"><div className="mb-6 flex items-center justify-between"><strong>Filtros</strong><button type="button" onClick={() => setMobileFilters(false)} className="rounded-full border border-white/10 p-2"><X className="size-4" /></button></div><Filters offers={offers} params={params} setValue={setValue} clear={clear} /><button type="button" onClick={() => setMobileFilters(false)} className="mt-7 w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white">Ver {visibleOffers.length} ofertas</button></aside></div>}
  </>
}
