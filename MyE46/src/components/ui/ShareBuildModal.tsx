import { useState, useRef, useEffect } from 'react'
import { useBuildStore } from '../../store/buildStore'
import { buildShareUrl } from '../../utils/buildUrl'
import './ShareBuildModal.css'

interface ShareBuildModalProps {
  onClose: () => void
}

export default function ShareBuildModal({ onClose }: ShareBuildModalProps) {
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const state = useBuildStore.getState()
  const url = buildShareUrl(state)

  useEffect(() => {
    inputRef.current?.select()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the input text
      inputRef.current?.select()
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="share-modal-backdrop" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="share-modal-title">Share Build</h2>
        <p className="share-modal-description">
          Anyone with this link will see your exact build configuration.
        </p>

        <div className="share-modal-url-row">
          <input
            ref={inputRef}
            className="share-modal-url-input"
            value={url}
            readOnly
            onClick={() => inputRef.current?.select()}
          />
          <button
            className={`share-modal-copy-btn ${copied ? 'share-modal-copy-btn--copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="share-modal-actions">
          <button className="share-modal-close-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}