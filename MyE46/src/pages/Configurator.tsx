import Experience from '../components/scene/Experience'
import './Configurator.css'

export default function Configurator() {
  return (
    <div className="configurator">
      {/* AI_COPILOT_PANEL — reserved for future AI chat panel */}

      <div className="configurator-viewport">
        <Experience />
      </div>

      <aside className="configurator-panel">
        {/* UI control panels will be built in a later step */}
        <div className="configurator-panel-placeholder">
          <p>Controls Panel</p>
        </div>
      </aside>
    </div>
  )
}