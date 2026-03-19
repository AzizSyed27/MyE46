import Experience from '../components/scene/Experience'
import ControlPanel from '../components/ui/ControlPanel'
import ConfiguratorHeader from '../components/ui/ConfiguratorHeader'
import './Configurator.css'

export default function Configurator() {
  return (
    <div className="configurator">
      <ConfiguratorHeader />

      {/* AI_COPILOT_PANEL — reserved for future AI chat panel */}

      <div className="configurator-viewport">
        <Experience />
      </div>

      <aside className="configurator-panel">
        <ControlPanel />
      </aside>
    </div>
  )
}