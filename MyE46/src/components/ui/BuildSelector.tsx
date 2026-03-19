import { useBuildStore } from '../../store/buildStore'
import './BuildSelector.css'

interface BuildSelectorProps {
  label: string
  selectedId: string | null
  excludeId: string | null
  onChange: (id: string | null) => void
}

export default function BuildSelector({ label, selectedId, excludeId, onChange }: BuildSelectorProps) {
  const savedBuilds = useBuildStore((s) => s.savedBuilds)

  const availableBuilds = savedBuilds.filter((b) => b.id !== excludeId)

  return (
    <div className="build-selector">
      <label className="build-selector-label">{label}</label>
      <select
        className="build-selector-select"
        value={selectedId ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Select a build…</option>
        {availableBuilds.map((build) => {
          const date = new Date(build.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
          return (
            <option key={build.id} value={build.id}>
              {build.name} — {date}
            </option>
          )
        })}
      </select>
    </div>
  )
}