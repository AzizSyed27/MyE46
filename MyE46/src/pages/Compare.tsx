import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import BuildSelector from '../components/ui/BuildSelector'
import CompareTable from '../components/ui/CompareTable'
import './Compare.css'

export default function Compare() {
  const savedBuilds = useBuildStore((s) => s.savedBuilds)
  const loadBuild = useBuildStore((s) => s.loadBuild)
  const navigate = useNavigate()

  const [idA, setIdA] = useState<string | null>(null)
  const [idB, setIdB] = useState<string | null>(null)

  const buildA = savedBuilds.find((b) => b.id === idA) ?? null
  const buildB = savedBuilds.find((b) => b.id === idB) ?? null

  const handleLoad = (id: string) => {
    loadBuild(id)
    navigate('/configurator')
  }

  if (savedBuilds.length < 2) {
    return (
      <div className="compare-page">
        <header className="compare-header">
          <div className="compare-header-left">
            <Link to="/" className="compare-logo">MyE46</Link>
            <span className="compare-header-divider" />
            <h1 className="compare-title">Compare Builds</h1>
          </div>
          <nav className="compare-header-actions">
            <Link to="/configurator" className="compare-header-link">
              Open Configurator
            </Link>
          </nav>
        </header>
        <div className="compare-empty-state">
          <p className="compare-empty-text">
            Save at least two builds to compare them side by side.
          </p>
          <p className="compare-empty-subtext">
            You have {savedBuilds.length} build{savedBuilds.length !== 1 ? 's' : ''} saved.
          </p>
          <Link to="/configurator" className="compare-empty-cta">
            Open Configurator
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <header className="compare-header">
        <div className="compare-header-left">
          <Link to="/" className="compare-logo">MyE46</Link>
          <span className="compare-header-divider" />
          <h1 className="compare-title">Compare Builds</h1>
        </div>
        <nav className="compare-header-actions">
          <Link to="/builds" className="compare-header-link-secondary">
            Builds
          </Link>
          <Link to="/configurator" className="compare-header-link">
            Open Configurator
          </Link>
        </nav>
      </header>

      <div className="compare-selectors">
        <BuildSelector
          label="Build A"
          selectedId={idA}
          excludeId={idB}
          onChange={setIdA}
        />
        <div className="compare-vs">vs</div>
        <BuildSelector
          label="Build B"
          selectedId={idB}
          excludeId={idA}
          onChange={setIdB}
        />
      </div>

      {buildA && buildB ? (
        <div className="compare-results">
          <div className="compare-load-actions">
            <button
              className="compare-load-btn"
              onClick={() => handleLoad(buildA.id)}
            >
              Load {buildA.name}
            </button>
            <button
              className="compare-load-btn"
              onClick={() => handleLoad(buildB.id)}
            >
              Load {buildB.name}
            </button>
          </div>
          <CompareTable buildA={buildA} buildB={buildB} />
        </div>
      ) : (
        <div className="compare-prompt">
          <p>Select two builds above to compare.</p>
        </div>
      )}
    </div>
  )
}