import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">MyE46</h1>
        <p className="landing-subtitle">
          Plan your dream E46 build in 3D.
        </p>
        <button
          className="landing-cta"
          onClick={() => navigate('/configurator')}
        >
          Start Building
        </button>
      </div>
      <footer className="landing-footer">
        <p className="landing-credit">
          3D model by Merc_TV (@szymonpasterczyk) — CC Attribution
        </p>
      </footer>
    </div>
  )
}