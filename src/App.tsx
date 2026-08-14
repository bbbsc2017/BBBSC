import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import { getCulturalProgram } from './data/culturalPrograms'
import { getAcademicProgram } from './data/academicPrograms'
import { getUniversity } from './data/universities'

const ProgramaCulturalDetalle = lazy(() => import('./pages/ProgramaCulturalDetalle'))
const InscripcionWorkAndTravel = lazy(() => import('./pages/InscripcionWorkAndTravel'))
const InscripcionAsia = lazy(() => import('./pages/InscripcionAsia'))
const ProgramaAcademicoDetalle = lazy(() => import('./pages/ProgramaAcademicoDetalle'))
const UniversidadesIndex = lazy(() => import('./pages/UniversidadesIndex'))
const ContratoSwt = lazy(() => import('./pages/ContratoSwt'))
const HojaDeVidaSwt = lazy(() => import('./pages/HojaDeVidaSwt'))
const Contacto = lazy(() => import('./pages/Contacto'))
const BlogIndex = lazy(() => import('./pages/BlogIndex'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const TerminosCondiciones = lazy(() => import('./pages/TerminosCondiciones'))
const TrabajaConNosotros = lazy(() => import('./pages/TrabajaConNosotros'))
const OffersIndex = lazy(() => import('./pages/OffersIndex'))
const OfferDetail = lazy(() => import('./pages/OfferDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function LegacyDetailRedirect() {
  const { slug = '' } = useParams()
  return <Navigate to={`/${slug}`} replace />
}

function RootDetailRoute() {
  const { slug = '' } = useParams()
  const universityDestinations: Record<string, string> = {
    'gisma-university': 'alemania',
    vistula: 'polonia',
    'cape-breton': 'canada',
    'woosong-university': 'corea-del-sur',
    'troy-university': 'usa',
  }

  if (getCulturalProgram(slug)) return <ProgramaCulturalDetalle />
  if (getAcademicProgram(slug)) return <ProgramaAcademicoDetalle />
  if (getUniversity(slug)) return <Navigate to={`/${universityDestinations[slug]}`} replace />
  return <NotFound />
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" aria-busy="true" aria-label="Cargando página" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work-and-travel" element={<Navigate to="/work-and-travel-usa" replace />} />
          <Route path="work-and-travel-usa/inscripcion" element={<InscripcionWorkAndTravel />} />
          <Route path="asia/inscripcion" element={<InscripcionAsia />} />
          <Route path="programas-academicos" element={<UniversidadesIndex />} />
          <Route path="universidades" element={<Navigate to="/programas-academicos" replace />} />
          <Route path="programas-culturales/work-and-travel-usa/inscripcion" element={<Navigate to="/work-and-travel-usa/inscripcion" replace />} />
          <Route path="programas-culturales/asia/inscripcion" element={<Navigate to="/asia/inscripcion" replace />} />
          <Route path="programas-culturales/:slug" element={<LegacyDetailRedirect />} />
          <Route path="programas-academicos/:slug" element={<LegacyDetailRedirect />} />
          <Route path="universidades/:slug" element={<LegacyDetailRedirect />} />
          <Route path="contrato-swt-a" element={<ContratoSwt variant="a" />} />
          <Route path="contrato-swt-acc" element={<ContratoSwt variant="acc" />} />
          <Route path="hoja-de-vida-swt" element={<HojaDeVidaSwt />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="ofertas/:program/:sponsor/:slug" element={<OfferDetail />} />
          <Route path="ofertas/:program" element={<OffersIndex />} />
          <Route path="ofertas" element={<OffersIndex />} />
          <Route path="terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="trabaja-con-nosotros" element={<TrabajaConNosotros />} />
          <Route path=":slug" element={<RootDetailRoute />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
