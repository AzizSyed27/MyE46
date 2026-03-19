import { useBuildStore } from '../../store/buildStore'
import './RideHeightSlider.css'

export default function RideHeightSlider() {
  const rideHeight = useBuildStore((s) => s.rideHeight)
  const setSlot = useBuildStore((s) => s.setSlot)

  // Convert world units to display mm (1 unit ≈ 1m, so 0.01 = 10mm)
  const displayMm = Math.round(rideHeight * 1000)

  return (
    <div className="ride-height">
      <div className="ride-height-header">
        <span className="ride-height-label">Ride Height</span>
        <span className="ride-height-value">{displayMm} mm</span>
      </div>
      <input
        type="range"
        className="ride-height-slider"
        min={-0.098}
        max={0}
        step={0.005}
        value={rideHeight}
        onChange={(e) => setSlot('rideHeight', parseFloat(e.target.value))}
      />
      <div className="ride-height-range-labels">
        <span>Slammed</span>
        <span>Stock</span>
      </div>
    </div>
  )
}