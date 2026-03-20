import mods from '../../data/mods.json'
import type { BuildConfig } from '../../types'
import './CompareTable.css'

interface CompareTableProps {
  buildA: BuildConfig
  buildB: BuildConfig
}

interface PartInfo {
  name: string
  price: number
}

function getPartInfo(slot: string, id: string): PartInfo {
  const catalog = (mods as Record<string, Array<{ id: string; name: string; price: number }>>)[slot]
  if (!catalog) return { name: id, price: 0 }
  const part = catalog.find((p) => p.id === id)
  return part ? { name: part.name, price: part.price } : { name: id, price: 0 }
}

function calcTotal(build: BuildConfig): number {
  const slots = [
    'frontBumper', 'frontLip', 'rearBumper', 'wheels', 'sideVents',
    'headlights', 'mirrors', 'spoiler', 'roof', 'badge', 'windowTint',
  ]
  return slots.reduce((sum, slot) => {
    return sum + getPartInfo(slot, build[slot as keyof BuildConfig] as string).price
  }, 0)
}

type RowDef =
  | { type: 'color'; label: string; key: keyof BuildConfig }
  | { type: 'part'; label: string; slot: string; key: keyof BuildConfig }
  | { type: 'number'; label: string; key: keyof BuildConfig; format: (v: number) => string }

const ROWS: RowDef[] = [
  { type: 'color', label: 'Primary Body Color', key: 'paintColor' },
  { type: 'color', label: 'Secondary Body Color', key: 'secondaryColor' },
  { type: 'color', label: 'Rim Color', key: 'rimColor' },
  { type: 'color', label: 'Caliper Color', key: 'caliperColor' },
  { type: 'color', label: 'Interior Color', key: 'interiorColor' },
  { type: 'part', label: 'Front Bumper', slot: 'frontBumper', key: 'frontBumper' },
  { type: 'part', label: 'Front Lip', slot: 'frontLip', key: 'frontLip' },
  { type: 'part', label: 'Rear Bumper', slot: 'rearBumper', key: 'rearBumper' },
  { type: 'part', label: 'Wheels', slot: 'wheels', key: 'wheels' },
  { type: 'part', label: 'Mirrors', slot: 'mirrors', key: 'mirrors' },
  { type: 'part', label: 'Side Vents', slot: 'sideVents', key: 'sideVents' },
  { type: 'part', label: 'Headlights', slot: 'headlights', key: 'headlights' },
  { type: 'part', label: 'Window Tint', slot: 'windowTint', key: 'windowTint' },
  { type: 'part', label: 'Spoiler', slot: 'spoiler', key: 'spoiler' },
  { type: 'part', label: 'Roof', slot: 'roof', key: 'roof' },
  { type: 'part', label: 'Badge', slot: 'badge', key: 'badge' },
  { type: 'number', label: 'Ride Height', key: 'rideHeight', format: (v: number) => `${Math.round(v * 1000)} mm` },
]

export default function CompareTable({ buildA, buildB }: CompareTableProps) {
  const totalA = calcTotal(buildA)
  const totalB = calcTotal(buildB)
  const diff = totalB - totalA

  return (
    <div className="compare-table-wrapper">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-table-th compare-table-th--label" />
            <th className="compare-table-th">{buildA.name}</th>
            <th className="compare-table-th">{buildB.name}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            const valA = buildA[row.key]
            const valB = buildB[row.key]
            const isDiff = valA !== valB

            return (
              <tr key={row.key} className={isDiff ? 'compare-table-row--diff' : ''}>
                <td className="compare-table-label">{row.label}</td>

                {row.type === 'color' && (
                  <>
                    <td className="compare-table-cell">
                      <div className="compare-table-color-cell">
                        <span
                          className="compare-table-swatch"
                          style={{ backgroundColor: valA as string }}
                        />
                        <span className="compare-table-hex">{valA as string}</span>
                      </div>
                    </td>
                    <td className="compare-table-cell">
                      <div className="compare-table-color-cell">
                        <span
                          className="compare-table-swatch"
                          style={{ backgroundColor: valB as string }}
                        />
                        <span className="compare-table-hex">{valB as string}</span>
                      </div>
                    </td>
                  </>
                )}

                {row.type === 'part' && (() => {
                  const infoA = getPartInfo(row.slot, valA as string)
                  const infoB = getPartInfo(row.slot, valB as string)
                  return (
                    <>
                      <td className="compare-table-cell">
                        <span className="compare-table-part-name">{infoA.name}</span>
                        {infoA.price > 0 && (
                          <span className="compare-table-part-price">
                            ${infoA.price.toLocaleString('en-US')}
                          </span>
                        )}
                      </td>
                      <td className="compare-table-cell">
                        <span className="compare-table-part-name">{infoB.name}</span>
                        {infoB.price > 0 && (
                          <span className="compare-table-part-price">
                            ${infoB.price.toLocaleString('en-US')}
                          </span>
                        )}
                      </td>
                    </>
                  )
                })()}

                {row.type === 'number' && (
                  <>
                    <td className="compare-table-cell">
                      <span className="compare-table-part-name">
                        {row.format(valA as number)}
                      </span>
                    </td>
                    <td className="compare-table-cell">
                      <span className="compare-table-part-name">
                        {row.format(valB as number)}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="compare-table-total-row">
            <td className="compare-table-label">Total</td>
            <td className="compare-table-cell compare-table-total">
              ${totalA.toLocaleString('en-US')}
            </td>
            <td className="compare-table-cell compare-table-total">
              ${totalB.toLocaleString('en-US')}
              {diff !== 0 && (
                <span className={`compare-table-diff ${diff > 0 ? 'compare-table-diff--more' : 'compare-table-diff--less'}`}>
                  {diff > 0 ? '+' : ''}${diff.toLocaleString('en-US')}
                </span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}