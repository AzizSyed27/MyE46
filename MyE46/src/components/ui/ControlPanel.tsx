import PriceBar from './PriceBar'
import PresetBar from './PresetBar'
import ColorPicker from './ColorPicker'
import SlotSelector from './SlotSelector'
import RideHeightSlider from './RideHeightSlider'
import './ControlPanel.css'

const PAINT_SWATCHES = [
  { name: 'Silver', hex: '#a8a8a8' },
  { name: 'Alpine White', hex: '#ffffff' },
  { name: 'Jet Black', hex: '#0d0d0d' },
  { name: 'Carbon Black', hex: '#1a1a1a' },
  { name: 'Mystic Blue', hex: '#1c3f6e' },
  { name: 'Steel Blue', hex: '#3b5f78' },
  { name: 'Topaz Blue', hex: '#2a4b7c' },
  { name: 'Oxford Green', hex: '#1e3a2b' },
  { name: 'Imola Red', hex: '#8b1a1a' },
  { name: 'Phoenix Yellow', hex: '#d4a017' },
]

const RIM_SWATCHES = [
  { name: 'Silver', hex: '#a8a8a8' },
  { name: 'Gunmetal', hex: '#4a4a4a' },
  { name: 'Gloss Black', hex: '#1a1a1a' },
  { name: 'Satin Black', hex: '#2c2c2c' },
  { name: 'Bronze', hex: '#8b7355' },
  { name: 'Gold', hex: '#c8a96e' },
  { name: 'Hyper Silver', hex: '#c0c0c0' },
  { name: 'White', hex: '#e8e8e8' },
]

export default function ControlPanel() {
  return (
    <div className="control-panel">
      <PriceBar />
      <PresetBar />

      <div className="control-panel-scroll">
        <ColorPicker
          slot="paintColor"
          label="Body Color"
          swatches={PAINT_SWATCHES}
        />
        <ColorPicker
          slot="rimColor"
          label="Rim Color"
          swatches={RIM_SWATCHES}
        />
        <SlotSelector slot="frontBumper" label="Front Bumper" />
        <SlotSelector slot="frontLip" label="Front Lip" />
        <SlotSelector slot="rearBumper" label="Rear Bumper" />
        <SlotSelector slot="wheels" label="Wheels" />
        <SlotSelector slot="mirrors" label="Mirrors" />
        <SlotSelector slot="sideVents" label="Side Vents" />
        <SlotSelector slot="headlights" label="Headlights" />
        <SlotSelector slot="spoiler" label="Spoiler" />
        <SlotSelector slot="roof" label="Roof" />
        <SlotSelector slot="badge" label="Badge" />
        <RideHeightSlider />
      </div>
    </div>
  )
}