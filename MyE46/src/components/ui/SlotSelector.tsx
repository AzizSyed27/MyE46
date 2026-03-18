import { useBuildStore } from '../../store/buildStore'
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

  return (
    <div className="slot-selector">
      <span className="slot-selector-label">{label}</span>
      <div className="slot-selector-options">
        {options.map((option) => (
          <button
            key={option.id}
            className={`slot-option ${currentValue === option.id ? 'slot-option--active' : ''}`}
            onClick={() => setSlot(slot as any, option.id)}
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