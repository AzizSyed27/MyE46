import { Link } from 'react-router-dom'
import './Compare.css'

export default function Compare() {
  return (
    <div className="compare-page">
      <header className="compare-header">
        <Link to="/" className="compare-logo">MyE46</Link>
        <h1 className="compare-title">Compare Builds</h1>
      </header>
      <div className="compare-content">
        <p className="compare-empty">Save at least two builds to compare them side by side.</p>
        <Link to="/configurator" className="compare-cta">
          Open Configurator
        </Link>
      </div>
    </div>
  )
}