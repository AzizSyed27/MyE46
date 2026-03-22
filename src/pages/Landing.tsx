import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import { usePerformanceTier } from '../hooks/usePerformanceTier'
import './Landing.css'

// Lazy load the 3D experience — don't block initial paint
const LandingExperience = lazy(() => import('../components/scene/LandingExperience'))

export default function Landing() {
  const navigate = useNavigate()
  const savedBuilds = useBuildStore((s) => s.savedBuilds)
  const performanceTier = usePerformanceTier()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [show3D, setShow3D] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Delay 3D loading to let content paint first
  useEffect(() => {
    if (performanceTier === 'low') return // Never load 3D on low-end devices
    const timer = setTimeout(() => setShow3D(true), 150)
    return () => clearTimeout(timer)
  }, [performanceTier])

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
    <div className={`landing ${!show3D ? 'landing--static' : ''}`}>
      {/* 3D background — lazy loaded, skipped on low-end devices */}
      {show3D && (
        <Suspense fallback={null}>
          <LandingExperience
            scrollProgress={scrollProgress}
            performanceTier={performanceTier}
          />
        </Suspense>
      )}

      {/* Scrollable content layer */}
      <div className="landing-content" ref={contentRef}>
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

        <section className="landing-section landing-section--hero">
          <div className="landing-split landing-split--left">
            <div className="landing-hero-card">
              <h1 className="landing-title">
                <span className="landing-title-line">Build Your</span>
                <span className="landing-title-line landing-title-accent">Dream E46</span>
              </h1>
              <p className="landing-subtitle">
                Plan every detail of your BMW E46 build in an interactive 3D configurator.
                Choose parts, match colors, set your stance, build around a budget, all before you spend a dime.
                Want some input? Describe your vibe and let the AI Garage suggest a build for you.
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
          </div>
          <div className="landing-scroll-hint">
            <span className="landing-scroll-hint-text">Scroll to explore</span>
            <span className="landing-scroll-hint-arrow">↓</span>
          </div>
        </section>

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
                Front bumpers, wheels, spoilers, mirrors, side vents - every popular E46 modification at your fingertips.
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
                Start from curated presets — OEM+, Clean Daily, Aggressive Street, or Track-Inspired - then make it yours.
              </p>
            </div>
          </div>
        </section>

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
            <span className="landing-footer-logo">MyE46</span>
            <span className="landing-footer-divider" />
            <a
              href="https://YOUR_PORTFOLIO_URL.com"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer-link"
            >
              Made by Aziz Syed
            </a>
            <span className="landing-footer-divider" />
            <span className="landing-footer-text">3D model by Merc_TV (@szymonpasterczyk) - CC Attribution</span>
            <span className="landing-footer-divider" />
            <a
              href="https://github.com/YOUR_USERNAME/mye46"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer-github"
              title="View on GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </footer>
        </section>
      </div>
    </div>
  )
}