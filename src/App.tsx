import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Configurator from './pages/Configurator'
import Builds from './pages/Builds'
import Compare from './pages/Compare'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/configurator" element={<Configurator />} />
      <Route path="/builds" element={<Builds />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  )
}