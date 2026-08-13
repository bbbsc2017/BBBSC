import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import { getCulturalProgram } from './data/culturalPrograms'
import { getAcademicProgram } from './data/academicPrograms'
import { getUniversity } from './data/universities'

const ProgramaCulturalDetalle = lazy(() => import('./pages/ProgramaCulturalDetalle'))
const InscripcionWorkAndTravel = lazy(() => import('./pages/InscripcionWorkAndTravel'))
const ProgramaAcademicoDetalle = lazy(() => import('./pages/ProgramaAcademicoDetalle'))
const UniversidadesIndex = lazy(() => import('./pages/UniversidadesIndex'))
const UniversidadDetalle = lazy(() => import('./pages/UniversidadDetalle'))
const Contacto = lazy(() => import('./pages/Contacto'))
const BlogIndex = lazy(() => import('./pages/BlogIndex'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const TerminosCondiciones = lazy(() => import('./pages/TerminosCondiciones'))
const TrabajaConNosotros = lazy(() => import('./pages/TrabajaConNosotros'))
const IntranetLogin = lazy(() => import('./pages/IntranetLogin'))
const IntranetPanel = lazy(() => import('./pages/IntranetPanel'))
const OffersIndex = lazy(() => import('./pages/OffersIndex'))
const OfferDetail = lazy(() => import('./pages/OfferDetail'))
const NotFound = lazy(() => import('./pages/NotFound'))

function LegacyDetailRedirect() {
  const { slug = '' } = useParams()
  return <Navigate to={`/${slug}`} replace />
}

function RootDetailRoute() {
  const { slug = '' } = useParams()

  if (getCulturalProgram(slug)) return <ProgramaCulturalDetalle />
  if (getAcademicProgram(slug)) return <ProgramaAcademicoDetalle />
  if (getUniversity(slug)) return <UniversidadDetalle />
  return <NotFound />
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" aria-busy="true" aria-label="Cargando página" />}>
      <Routes>
        <Route path="intranet/login" element={<IntranetLogin />} />
        <Route path="intranet" element={<IntranetPanel />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work-and-travel-usa/inscripcion" element={<InscripcionWorkAndTravel />} />
          <Route path="universidades" element={<UniversidadesIndex />} />
          <Route path="programas-culturales/work-and-travel-usa/inscripcion" element={<Navigate to="/work-and-travel-usa/inscripcion" replace />} />
          <Route path="programas-culturales/:slug" element={<LegacyDetailRedirect />} />
          <Route path="programas-academicos/:slug" element={<LegacyDetailRedirect />} />
          <Route path="universidades/:slug" element={<LegacyDetailRedirect />} />
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
