import { useBuildStore } from '../../store/buildStore'
import { trackPartChange, trackPaintFinishChange, trackWindowTintChange } from '../../utils/analytics'
import mods from '../../data/mods.json'
import './SlotSelector.css'

interface SlotSelectorProps {
  slot: string
  label: string
}

interface PartOption {
  id: string
  name: string
  price: number
  styleTags: string[]
}

export default function SlotSelector({ slot, label }: SlotSelectorProps) {
  const currentValue = useBuildStore((s) => s[slot as keyof typeof s] as string)
  const setSlot = useBuildStore((s) => s.setSlot)
  const options = (mods as Record<string, PartOption[]>)[slot] ?? []

  const handleSelect = (optionId: string) => {
    setSlot(slot as any, optionId)

    if (slot === 'paintFinish') {
      trackPaintFinishChange(optionId)
    } else if (slot === 'windowTint') {
      trackWindowTintChange(optionId)
    } else {
      trackPartChange(slot, optionId)
    }
  }

  return (
    <div className="slot-selector">
      <span className="slot-selector-label">{label}</span>
      <div className="slot-selector-options">
        {options.map((option) => (
          <button
            key={option.id}
            className={`slot-option ${currentValue === option.id ? 'slot-option--active' : ''}`}
            onClick={() => handleSelect(option.id)}
          >
            <span className="slot-option-name">{option.name}</span>
            {option.price > 0 && (
              <span className="slot-option-price">
                ${option.price.toLocaleString('en-US')}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}