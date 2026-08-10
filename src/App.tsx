import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import ProgramaCulturalDetalle from './pages/ProgramaCulturalDetalle'
import ProgramaAcademicoDetalle from './pages/ProgramaAcademicoDetalle'
import UniversidadesIndex from './pages/UniversidadesIndex'
import UniversidadDetalle from './pages/UniversidadDetalle'
import Contacto from './pages/Contacto'
import TerminosCondiciones from './pages/TerminosCondiciones'
import TrabajaConNosotros from './pages/TrabajaConNosotros'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="programas-culturales/:slug" element={<ProgramaCulturalDetalle />} />
        <Route path="programas-academicos/:slug" element={<ProgramaAcademicoDetalle />} />
        <Route path="universidades" element={<UniversidadesIndex />} />
        <Route path="universidades/:slug" element={<UniversidadDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="terminos-y-condiciones" element={<TerminosCondiciones />} />
        <Route path="trabaja-con-nosotros" element={<TrabajaConNosotros />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
