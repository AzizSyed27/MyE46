import { Link } from 'react-router-dom'
import './Builds.css'

export default function Builds() {
  return (
    <div className="builds-page">
      <header className="builds-header">
        <Link to="/" className="builds-logo">MyE46</Link>
        <h1 className="builds-title">Saved Builds</h1>
      </header>
      <div className="builds-content">
        <p className="builds-empty">No saved builds yet. Start building in the configurator.</p>
        <Link to="/configurator" className="builds-cta">
          Open Configurator
        </Link>
      </div>
    </div>
  )
}