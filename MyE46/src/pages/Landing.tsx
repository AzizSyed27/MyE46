import { useNavigate, Link } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const savedBuilds = useBuildStore((s) => s.savedBuilds)

  return (
    <div className="landing">
      <header className="landing-nav">
        <span className="landing-nav-logo">MyE46</span>
        <nav className="landing-nav-links">
          {savedBuilds.length > 0 && (
            <>
              <Link to="/builds" className="landing-nav-link">
                Builds ({savedBuilds.length})
              </Link>
              {savedBuilds.length >= 2 && (
                <Link to="/compare" className="landing-nav-link">
                  Compare
                </Link>
              )}
            </>
          )}
          <button
            className="landing-nav-cta"
            onClick={() => navigate('/configurator')}
          >
            Open Configurator
          </button>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-title">
            <span className="landing-title-line">Build Your</span>
            <span className="landing-title-line landing-title-accent">Dream E46</span>
          </h1>
          <p className="landing-subtitle">
            Plan every detail of your BMW E46 build in an interactive 3D configurator.
            Choose parts, match colors, set your stance, and see your vision come to life — before you spend a dime.
          </p>
          <div className="landing-hero-actions">
            <button
              className="landing-cta"
              onClick={() => navigate('/configurator')}
            >
              Start Building
            </button>
            {savedBuilds.length > 0 && (
              <button
                className="landing-cta-secondary"
                onClick={() => navigate('/builds')}
              >
                View Saved Builds
              </button>
            )}
          </div>
        </div>
      </main>

      <section className="landing-features">
        <div className="landing-feature">
          <span className="landing-feature-number">01</span>
          <h3 className="landing-feature-title">Real-Time 3D Preview</h3>
          <p className="landing-feature-text">
            See every modification instantly on a detailed 3D model. Orbit, zoom, and inspect your build from every angle.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-number">02</span>
          <h3 className="landing-feature-title">Full Part Catalog</h3>
          <p className="landing-feature-text">
            Front bumpers, wheels, spoilers, mirrors, side vents, and more. Every popular E46 modification at your fingertips.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-number">03</span>
          <h3 className="landing-feature-title">Color Everything</h3>
          <p className="landing-feature-text">
            Primary and secondary body colors, rim and caliper finishes, interior trim, and window tint levels — dial in your exact look.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-number">04</span>
          <h3 className="landing-feature-title">Budget Tracking</h3>
          <p className="landing-feature-text">
            Live cost totals update as you configure. Know exactly what your dream build will cost before sourcing parts.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-number">05</span>
          <h3 className="landing-feature-title">Save & Compare</h3>
          <p className="landing-feature-text">
            Save multiple build configurations, compare them side by side, and share your favorites with a single link.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-number">06</span>
          <h3 className="landing-feature-title">Style Presets</h3>
          <p className="landing-feature-text">
            Start from curated presets — OEM+, Clean Daily, Aggressive Street, or Track-Inspired — then make it yours.
          </p>
        </div>
      </section>

      <footer className="landing-footer">
        <p className="landing-credit">
          3D model by Merc_TV (@szymonpasterczyk) — CC Attribution
        </p>
        <p className="landing-credit">
          Built for E46 enthusiasts.
        </p>
      </footer>
    </div>
  )
}