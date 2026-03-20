import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import LandingExperience from '../components/scene/LandingExperience'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const savedBuilds = useBuildStore((s) => s.savedBuilds)
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0
    setScrollProgress(Math.max(0, Math.min(1, progress)))
  }, [])

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="landing">
      {/* 3D background — fixed behind everything */}
      <LandingExperience scrollProgress={scrollProgress} />

      {/* Scrollable content layer on top */}
      <div className="landing-content" ref={contentRef}>
        {/* Nav — sticky to top */}
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
            <Link to="https://github.com/AzizSyed27/MyE46" className="landing-nav-link" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>

          </nav>
        </header>

        {/* Section 1: Hero — card LEFT, car RIGHT */}
        <section className="landing-section landing-section--hero">
          <div className="landing-split landing-split--left">
            <div className="landing-hero-card">
              <h1 className="landing-title">
                <span className="landing-title-line">Build Your</span>
                <span className="landing-title-line landing-title-accent">Dream E46</span>
              </h1>
              <p className="landing-subtitle">
                Plan every detail of your BMW E46 build in an interactive 3D configurator.
                Build around a budget with our Agentic AI Advisor.
                Choose parts, match colors, set your stance, all before you spend a dime.
                
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
                    Saved Builds
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="landing-scroll-hint">
            <span className="landing-scroll-hint-text">Scroll to explore</span>
            <span className="landing-scroll-hint-arrow">↓</span>
          </div>
        </section>

        {/* Section 2: Features top — centered cards, car behind */}
        <section className="landing-section landing-section--features">
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <span className="landing-feature-number">01</span>
              <h3 className="landing-feature-title">Real-Time 3D Preview</h3>
              <p className="landing-feature-text">
                See every modification instantly on a detailed 3D model. Orbit, zoom, and inspect from every angle.
              </p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-number">02</span>
              <h3 className="landing-feature-title">Full Part Catalog</h3>
              <p className="landing-feature-text">
                Front bumpers, wheels, spoilers, mirrors, side vents — every popular E46 modification at your fingertips.
              </p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-number">03</span>
              <h3 className="landing-feature-title">Color Everything</h3>
              <p className="landing-feature-text">
                Primary and secondary body colors, rim and caliper finishes, interior trim, and window tint levels.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Features bottom — centered cards, car behind */}
        <section className="landing-section landing-section--features-bottom">
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <span className="landing-feature-number">04</span>
              <h3 className="landing-feature-title">AI Build Advisor</h3>
              <p className="landing-feature-text">
                Describe the vibe you want and the AI Garage configures your car in real time. Budget-aware and opinionated.
              </p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-number">05</span>
              <h3 className="landing-feature-title">Save & Compare</h3>
              <p className="landing-feature-text">
                Save multiple build configurations, compare them side by side, and share your favorites with a link.
              </p>
            </div>
            <div className="landing-feature-card">
              <span className="landing-feature-number">06</span>
              <h3 className="landing-feature-title">Style Presets</h3>
              <p className="landing-feature-text">
                Start from curated presets — OEM+, Clean Daily, Aggressive Street, or Track-Inspired — then make it yours.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Final CTA — car LEFT, card RIGHT */}
        <section className="landing-section landing-section--final">
          <div className="landing-split landing-split--right">
            <div className="landing-final-card">
              <h2 className="landing-final-title">Ready to build?</h2>
              <p className="landing-final-subtitle">
                Your dream E46 is waiting.
              </p>
              <button
                className="landing-cta landing-cta--large"
                onClick={() => navigate('/configurator')}
              >
                Launch Configurator
              </button>
            </div>
          </div>
          <footer className="landing-footer">
            <p className="landing-credit">
              Built by Aziz Syed
            </p>
            <p className="landing-credit">
              3D model by Merc_TV (@szymonpasterczyk) — CC Attribution
            </p>
            <p className="landing-credit">
              Built for E46 enthusiasts.
            </p>
          </footer>
        </section>
      </div>
    </div>
  )
}