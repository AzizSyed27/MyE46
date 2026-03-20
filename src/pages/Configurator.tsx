import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import { decodeBuild } from '../utils/buildUrl'
import { useAICopilot } from '../hooks/useAICopilot'
import Experience from '../components/scene/Experience'
import ControlPanel from '../components/ui/ControlPanel'
import ConfiguratorHeader from '../components/ui/ConfiguratorHeader'
import AICopilotPanel from '../components/ui/AICopilotPanel'
import EnvironmentSwitcher from '../components/ui/EnvironmentSwitcher'
import './Configurator.css'

export default function Configurator() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const applyPreset = useBuildStore((s) => s.applyPreset)
  const [isSharedBuild, setIsSharedBuild] = useState(false)

  // Panel states
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const { messages, isLoading, send, apply, revert, reset } = useAICopilot()

  // Check for shared build in URL on mount
  useEffect(() => {
    const buildParam = searchParams.get('build')
    if (!buildParam) return

    const decoded = decodeBuild(buildParam)
    if (decoded) {
      applyPreset(decoded)
      setIsSharedBuild(true)
    }

    navigate('/configurator', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset AI chat when leaving the configurator
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // Close mobile panels when switching to the other
  const handleToggleControls = () => {
    setControlsOpen(!controlsOpen)
    if (!controlsOpen) setAiPanelOpen(false)
  }

  const handleToggleAi = () => {
    setAiPanelOpen(!aiPanelOpen)
    if (!aiPanelOpen) setControlsOpen(false)
  }

  return (
    <div className={`configurator ${aiPanelOpen ? 'configurator--ai-open' : ''}`}>
      <ConfiguratorHeader isSharedBuild={isSharedBuild} />

      <AICopilotPanel
        isOpen={aiPanelOpen}
        onToggle={handleToggleAi}
        messages={messages}
        isLoading={isLoading}
        onSend={send}
        onApply={apply}
        onRevert={revert}
      />

      <div className="configurator-viewport">
        <Experience />
        <EnvironmentSwitcher />
      </div>

      <aside className={`configurator-panel ${controlsOpen ? 'configurator-panel--open' : ''}`}>
        <ControlPanel />
      </aside>

      {/* Mobile bottom toolbar */}
      <div className="configurator-mobile-toolbar">
        <button
          className={`configurator-mobile-btn ${aiPanelOpen ? 'configurator-mobile-btn--active' : ''}`}
          onClick={handleToggleAi}
        >
          <span className="configurator-mobile-btn-icon">AI</span>
          <span className="configurator-mobile-btn-label">AI Garage</span>
        </button>
        <button
          className={`configurator-mobile-btn ${controlsOpen ? 'configurator-mobile-btn--active' : ''}`}
          onClick={handleToggleControls}
        >
          <span className="configurator-mobile-btn-icon">⚙</span>
          <span className="configurator-mobile-btn-label">Controls</span>
        </button>
      </div>

      {/* Mobile backdrop */}
      {(controlsOpen || aiPanelOpen) && (
        <div
          className="configurator-mobile-backdrop"
          onClick={() => {
            setControlsOpen(false)
            setAiPanelOpen(false)
          }}
        />
      )}
    </div>
  )
}