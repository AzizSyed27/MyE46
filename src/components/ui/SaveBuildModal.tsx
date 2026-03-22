import { useState, useEffect, useRef } from 'react'
import { useBuildStore } from '../../store/buildStore'
import { trackBuildSave } from '../../utils/analytics'
import './SaveBuildModal.css'

interface SaveBuildModalProps {
  onClose: () => void
}

export default function SaveBuildModal({ onClose }: SaveBuildModalProps) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const saveBuild = useBuildStore((s) => s.saveBuild)
  const getTotalPrice = useBuildStore((s) => s.getTotalPrice)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveBuild(trimmed, notes.trim())
    trackBuildSave(trimmed, getTotalPrice())
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSave()
    }
  }

  return (
    <div className="save-modal-backdrop" onClick={onClose}>
      <div className="save-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="save-modal-title">Save Build</h2>

        <div className="save-modal-field">
          <label className="save-modal-label" htmlFor="build-name">
            Build Name
          </label>
          <input
            ref={inputRef}
            id="build-name"
            type="text"
            className="save-modal-input"
            placeholder="e.g. Weekend Cruiser"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={50}
          />
        </div>

        <div className="save-modal-field">
          <label className="save-modal-label" htmlFor="build-notes">
            Notes (optional)
          </label>
          <textarea
            id="build-notes"
            className="save-modal-textarea"
            placeholder="Parts sourced, inspiration, next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="save-modal-actions">
          <button
            className="save-modal-btn save-modal-btn--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="save-modal-btn save-modal-btn--save"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}