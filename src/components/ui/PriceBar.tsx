import { useBuildStore } from '../../store/buildStore'
import './PriceBar.css'

export default function PriceBar() {
  const total = useBuildStore((s) => s.getTotalPrice())

  return (
    <div className="price-bar">
      <span className="price-bar-label">Build Total</span>
      <span className="price-bar-value">
        ${total.toLocaleString('en-US')}
      </span>
    </div>
  )
}