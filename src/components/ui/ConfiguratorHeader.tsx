import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBuildStore } from '../../store/buildStore'
import SaveBuildModal from './SaveBuildModal'
import ShareBuildModal from './ShareBuildModal'
import './ConfiguratorHeader.css'

interface ConfiguratorHeaderProps {
  isSharedBuild?: boolean
}

export default function ConfiguratorHeader({ isSharedBuild = false }: ConfiguratorHeaderProps) {
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
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
          {isSharedBuild && (
            <span className="configurator-header-shared-badge">
              Shared Build
            </span>
          )}
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
            className="configurator-header-btn configurator-header-btn--secondary"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
          <button
            className="configurator-header-btn configurator-header-btn--primary"
            onClick={() => setShowSaveModal(true)}
          >
            {isSharedBuild ? 'Clone to My Builds' : 'Save Build'}
          </button>
        </nav>
      </header>

      {showSaveModal && (
        <SaveBuildModal onClose={() => setShowSaveModal(false)} />
      )}
      {showShareModal && (
        <ShareBuildModal onClose={() => setShowShareModal(false)} />
      )}
    </>
  )
}