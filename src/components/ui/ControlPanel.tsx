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

    const SECONDARY_SWATCHES = [
    { name: 'Gloss Black', hex: '#0d0d0d' },
    { name: 'Satin Black', hex: '#1a1a1a' },
    { name: 'Dark Grey', hex: '#2a2a2a' },
    { name: 'Graphite', hex: '#4a4a4a' },
    { name: 'Silver', hex: '#a8a8a8' },
    { name: 'Carbon Fibre', hex: '#333333' },
    { name: 'Body Match', hex: '#a8a8a8' },
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

    const CALIPER_SWATCHES = [
        { name: 'Stock Black', hex: '#1a1a1a' },
        { name: 'Brembo Red', hex: '#cc0000' },
        { name: 'Racing Yellow', hex: '#d4a017' },
        { name: 'BMW Blue', hex: '#1c3f6e' },
        { name: 'Lime Green', hex: '#6fbf40' },
        { name: 'Orange', hex: '#d45500' },
        { name: 'Silver', hex: '#a8a8a8' },
        { name: 'White', hex: '#e8e8e8' },
    ]

    const INTERIOR_SWATCHES = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'Dark Grey', hex: '#3a3a3a' },
    { name: 'Cognac', hex: '#8b5e3c' },
    { name: 'Saddle Brown', hex: '#6b4226' },
    { name: 'Sand Beige', hex: '#c2a878' },
    { name: 'Dove Grey', hex: '#7a7a7a' },
    { name: 'Imola Red', hex: '#8b1a1a' },
    { name: 'Cinnamon', hex: '#7b3f00' },
    ]

    export default function ControlPanel() {
    return (
        <div className="control-panel">
            <PriceBar />
            <PresetBar />

            <div className="control-panel-scroll">
                <ColorPicker
                    slot="paintColor"
                    label="Primary Body Color"
                    swatches={PAINT_SWATCHES}
                />
                <ColorPicker
                    slot="secondaryColor"
                    label="Secondary Body Color"
                    swatches={SECONDARY_SWATCHES}
                />
                <ColorPicker
                    slot="rimColor"
                    label="Rim Color"
                    swatches={RIM_SWATCHES}
                />
                <ColorPicker
                    slot="caliperColor"
                    label="Caliper Color"
                    swatches={CALIPER_SWATCHES}
                />
                <ColorPicker
                    slot="interiorColor"
                    label="Interior Color"
                    swatches={INTERIOR_SWATCHES}
                />
                <SlotSelector slot="frontBumper" label="Front Bumper" />
                <SlotSelector slot="frontLip" label="Front Lip" />
                <SlotSelector slot="rearBumper" label="Rear Bumper" />
                <SlotSelector slot="wheels" label="Wheels" />
                <SlotSelector slot="mirrors" label="Mirrors" />
                <SlotSelector slot="sideVents" label="Side Vents" />
                <SlotSelector slot="windowTint" label="Window Tint" />
                <SlotSelector slot="spoiler" label="Spoiler" />
                <SlotSelector slot="roof" label="Roof" />
                <SlotSelector slot="badge" label="Badge" />
                <RideHeightSlider />
            </div>
        </div>
    )
}