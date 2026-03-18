import { useBuildStore } from '../../store/buildStore'
import { STYLE_PRESETS } from '../../data/presets'
import './PresetBar.css'

export default function PresetBar() {
  const applyPreset = useBuildStore((s) => s.applyPreset)

  return (
    <div className="preset-bar">
      <span className="preset-bar-label">Style Presets</span>
      <div className="preset-bar-options">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="preset-button"
            onClick={() => applyPreset(preset.partialConfig)}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}