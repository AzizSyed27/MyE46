import { useBuildStore } from '../../store/buildStore'
import './ColorPicker.css'

interface ColorPickerProps {
  slot: 'paintColor' | 'rimColor' | 'interiorColor' | 'secondaryColor' | 'caliperColor'
  label: string
  swatches: { name: string; hex: string }[]
}

export default function ColorPicker({ slot, label, swatches }: ColorPickerProps) {
  const currentValue = useBuildStore((s) => s[slot])
  const setSlot = useBuildStore((s) => s.setSlot)

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
              onClick={() => setSlot(slot, swatch.hex)}
              title={swatch.name}
            />
          ))}
        </div>
        <label className="color-picker-custom">
          <input
            type="color"
            value={currentValue}
            onChange={(e) => setSlot(slot, e.target.value)}
            className="color-picker-input"
          />
          <span className="color-picker-hex">{currentValue}</span>
        </label>
      </div>
    </div>
  )
}