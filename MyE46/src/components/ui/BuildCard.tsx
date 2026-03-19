import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuildStore } from '../../store/buildStore'
import mods from '../../data/mods.json'
import type { BuildConfig } from '../../types'
import './BuildCard.css'

interface BuildCardProps {
  build: BuildConfig
}

/** Look up part display name */
function getPartName(slot: string, id: string): string {
  const catalog = (mods as Record<string, Array<{ id: string; name: string }>>)[slot]
  if (!catalog) return id
  const part = catalog.find((p) => p.id === id)
  return part?.name ?? id
}

/** Look up part price */
function getPartPrice(slot: string, id: string): number {
  const catalog = (mods as Record<string, Array<{ id: string; price: number }>>)[slot]
  if (!catalog) return 0
  const part = catalog.find((p) => p.id === id)
  return part?.price ?? 0
}

/** Calculate total price for a build */
function calcTotal(build: BuildConfig): number {
  return (
    getPartPrice('frontBumper', build.frontBumper) +
    getPartPrice('frontLip', build.frontLip) +
    getPartPrice('rearBumper', build.rearBumper) +
    getPartPrice('wheels', build.wheels) +
    getPartPrice('sideVents', build.sideVents) +
    getPartPrice('headlights', build.headlights) +
    getPartPrice('mirrors', build.mirrors) +
    getPartPrice('spoiler', build.spoiler) +
    getPartPrice('roof', build.roof) +
    getPartPrice('badge', build.badge) +
    getPartPrice('windowTint', build.windowTint)
  )
}

export default function BuildCard({ build }: BuildCardProps) {
  const navigate = useNavigate()
  const loadBuild = useBuildStore((s) => s.loadBuild)
  const deleteBuild = useBuildStore((s) => s.deleteBuild)
  const updateBuild = useBuildStore((s) => s.updateBuild)

  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(build.name)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const total = calcTotal(build)

  const handleLoad = () => {
    loadBuild(build.id)
    navigate('/configurator')
  }

  const handleRename = () => {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== build.name) {
      updateBuild(build.id, { name: trimmed })
    }
    setIsRenaming(false)
  }

  const handleRenameKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename()
    if (e.key === 'Escape') {
      setRenameValue(build.name)
      setIsRenaming(false)
    }
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    deleteBuild(build.id)
  }

  const formattedDate = new Date(build.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="build-card">
      <div className="build-card-header">
        {isRenaming ? (
          <input
            className="build-card-rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleRenameKey}
            autoFocus
            maxLength={50}
          />
        ) : (
          <h3 className="build-card-name">{build.name}</h3>
        )}
        <span className="build-card-date">{formattedDate}</span>
      </div>

      <div className="build-card-color-row">
        <span
          className="build-card-color-swatch"
          style={{ backgroundColor: build.paintColor }}
          title={`Primary: ${build.paintColor}`}
        />
        <span
          className="build-card-color-swatch"
          style={{ backgroundColor: build.secondaryColor }}
          title={`Secondary: ${build.secondaryColor}`}
        />
        <span
          className="build-card-color-swatch"
          style={{ backgroundColor: build.rimColor }}
          title={`Rims: ${build.rimColor}`}
        />
        <span
          className="build-card-color-swatch"
          style={{ backgroundColor: build.caliperColor }}
          title={`Calipers: ${build.caliperColor}`}
        />
        <span
          className="build-card-color-swatch"
          style={{ backgroundColor: build.interiorColor }}
          title={`Interior: ${build.interiorColor}`}
        />
      </div>

      <div className="build-card-parts">
        <span className="build-card-part">{getPartName('frontBumper', build.frontBumper)}</span>
        <span className="build-card-part">{getPartName('rearBumper', build.rearBumper)}</span>
        <span className="build-card-part">{getPartName('wheels', build.wheels)}</span>
        <span className="build-card-part">{getPartName('spoiler', build.spoiler)}</span>
        {build.windowTint !== 'none' && (
          <span className="build-card-part">{getPartName('windowTint', build.windowTint)}</span>
        )}
      </div>

      {build.notes && (
        <p className="build-card-notes">{build.notes}</p>
      )}

      <div className="build-card-footer">
        <span className="build-card-total">${total.toLocaleString('en-US')}</span>
        <div className="build-card-actions">
          <button
            className="build-card-action"
            onClick={() => {
              setRenameValue(build.name)
              setIsRenaming(true)
            }}
          >
            Rename
          </button>
          <button
            className={`build-card-action build-card-action--danger ${confirmDelete ? 'build-card-action--confirm' : ''}`}
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
          >
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </button>
          <button
            className="build-card-action build-card-action--primary"
            onClick={handleLoad}
          >
            Load
          </button>
        </div>
      </div>
    </div>
  )
}