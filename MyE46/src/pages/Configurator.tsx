import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useBuildStore } from '../store/buildStore'
import { decodeBuild } from '../utils/buildUrl'
import { useAICopilot } from '../hooks/useAICopilot'
import Experience from '../components/scene/Experience'
import ControlPanel from '../components/ui/ControlPanel'
import ConfiguratorHeader from '../components/ui/ConfiguratorHeader'
import AICopilotPanel from '../components/ui/AICopilotPanel'
import './Configurator.css'

export default function Configurator() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const applyPreset = useBuildStore((s) => s.applyPreset)
    const [isSharedBuild, setIsSharedBuild] = useState(false)

    // AI panel state
    const [aiPanelOpen, setAiPanelOpen] = useState(false)
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

    return (
      <div className={`configurator ${aiPanelOpen ? 'configurator--ai-open' : ''}`}>
        <ConfiguratorHeader isSharedBuild={isSharedBuild} />

        <AICopilotPanel
          isOpen={aiPanelOpen}
          onToggle={() => setAiPanelOpen(!aiPanelOpen)}
          messages={messages}
          isLoading={isLoading}
          onSend={send}
          onApply={apply}
          onRevert={revert}
        />

        <div className="configurator-viewport">
          <Experience />
        </div>

        <aside className="configurator-panel">
          <ControlPanel />
        </aside>
      </div>
    )
}