import { useBuildStore } from '../../store/buildStore'
import { STYLE_PRESETS } from '../../data/presets'
import { trackPresetApply } from '../../utils/analytics'
import './PresetBar.css'

export default function PresetBar() {
  const applyPreset = useBuildStore((s) => s.applyPreset)

  const handleApply = (preset: typeof STYLE_PRESETS[0]) => {
    applyPreset(preset.partialConfig)
    trackPresetApply(preset.name)
  }

  return (
    <div className="preset-bar">
      <span className="preset-bar-label">Style Presets</span>
      <div className="preset-bar-options">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="preset-button"
            onClick={() => handleApply(preset)}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}