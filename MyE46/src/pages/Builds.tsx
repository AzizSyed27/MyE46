import { Link } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import BuildCard from '../components/ui/BuildCard'
import './Builds.css'

export default function Builds() {
  const savedBuilds = useBuildStore((s) => s.savedBuilds)

  return (
    <div className="builds-page">
      <header className="builds-header">
        <div className="builds-header-left">
          <Link to="/" className="builds-logo">MyE46</Link>
          <span className="builds-header-divider" />
          <h1 className="builds-title">Saved Builds</h1>
        </div>
        <nav className="builds-header-actions">
          <Link to="/configurator" className="builds-header-link">
            Open Configurator
          </Link>
        </nav>
      </header>

      {savedBuilds.length === 0 ? (
        <div className="builds-empty-state">
          <p className="builds-empty-text">No saved builds yet.</p>
          <p className="builds-empty-subtext">
            Configure your dream E46 and save it here.
          </p>
          <Link to="/configurator" className="builds-empty-cta">
            Start Building
          </Link>
        </div>
      ) : (
        <>
          <p className="builds-count">
            {savedBuilds.length} build{savedBuilds.length !== 1 ? 's' : ''} saved
          </p>
          <div className="builds-grid">
            {savedBuilds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}