import { useBuildStore } from '../../store/buildStore'
import { trackColorChange } from '../../utils/analytics'
import './ColorPicker.css'

interface ColorPickerProps {
  slot: 'paintColor' | 'secondaryColor' | 'rimColor' | 'caliperColor' | 'interiorColor'
  label: string
  swatches: { name: string; hex: string }[]
}

export default function ColorPicker({ slot, label, swatches }: ColorPickerProps) {
  const currentValue = useBuildStore((s) => s[slot])
  const setSlot = useBuildStore((s) => s.setSlot)

  const handleChange = (value: string) => {
    setSlot(slot, value)
    trackColorChange(slot, value)
  }

  return (
    <div className="color-picker">
      <span className="color-picker-label">{label}</span>
      <div className="color-picker-row">
        <div className="color-picker-swatches">
          {swatches.map((swatch) => (
            <button
              key={swatch.hex}
              className={`color-swatch ${currentValue === swatch.hex ? 'color-swatch--active' : ''}`}
              style={{ backgroundColor: swatch.hex }}
              onClick={() => handleChange(swatch.hex)}
              title={swatch.name}
            />
          ))}
        </div>
        <label className="color-picker-custom">
          <input
            type="color"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            className="color-picker-input"
          />
          <span className="color-picker-hex">{currentValue}</span>
        </label>
      </div>
    </div>
  )
}