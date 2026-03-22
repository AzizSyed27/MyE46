import { useBuildStore } from '../../store/buildStore'
import { trackRideHeightChange } from '../../utils/analytics'
import './RideHeightSlider.css'

export default function RideHeightSlider() {
  const rideHeight = useBuildStore((s) => s.rideHeight)
  const setSlot = useBuildStore((s) => s.setSlot)

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
        onMouseUp={() => trackRideHeightChange(rideHeight)}
        onTouchEnd={() => trackRideHeightChange(rideHeight)}
      />
      <div className="ride-height-range-labels">
        <span>Slammed</span>
        <span>Stock</span>
      </div>
    </div>
  )
}