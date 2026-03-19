import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBuildStore } from '../../store/buildStore'
import SaveBuildModal from './SaveBuildModal'
import './ConfiguratorHeader.css'

export default function ConfiguratorHeader() {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const resetBuild = useBuildStore((s) => s.resetBuild)
  const total = useBuildStore((s) => s.getTotalPrice())

  return (
    <>
      <header className="configurator-header">
        <div className="configurator-header-left">
          <Link to="/" className="configurator-header-logo">MyE46</Link>
          <span className="configurator-header-divider" />
          <span className="configurator-header-total">
            ${total.toLocaleString('en-US')}
          </span>
        </div>

        <nav className="configurator-header-actions">
          <Link to="/builds" className="configurator-header-link">
            Builds
          </Link>
          <Link to="/compare" className="configurator-header-link">
            Compare
          </Link>
          <button
            className="configurator-header-btn configurator-header-btn--secondary"
            onClick={resetBuild}
          >
            Reset
          </button>
          <button
            className="configurator-header-btn configurator-header-btn--primary"
            onClick={() => setShowSaveModal(true)}
          >
            Save Build
          </button>
        </nav>
      </header>

      {showSaveModal && (
        <SaveBuildModal onClose={() => setShowSaveModal(false)} />
      )}
    </>
  )
}