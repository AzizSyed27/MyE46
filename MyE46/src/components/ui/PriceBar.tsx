import { useBuildStore } from '../../store/buildStore'
import './PriceBar.css'

export default function PriceBar() {
  const getTotalPrice = useBuildStore((s) => s.getTotalPrice)
  const total = getTotalPrice()

  return (
    <div className="price-bar">
      <span className="price-bar-label">Build Total</span>
      <span className="price-bar-value">
        ${total.toLocaleString('en-US')}
      </span>
    </div>
  )
}