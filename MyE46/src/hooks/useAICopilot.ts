import { useState, useRef, useCallback, useEffect } from 'react'
import { useBuildStore } from '../store/buildStore'
import { streamChat } from '../services/aiClient'
import type { ChatMessage } from '../components/ui/AIChatMessage'

/** Generate a simple unique ID for messages */
function msgId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/** Known config keys — used to validate extracted objects */
const KNOWN_CONFIG_KEYS = new Set([
  'paintColor', 'secondaryColor', 'rimColor', 'caliperColor', 'interiorColor',
  'frontBumper', 'frontLip', 'rearBumper', 'wheels', 'headlights',
  'sideVents', 'mirrors', 'spoiler', 'roof', 'badge',
  'windowTint', 'rideHeight',
])

/**
 * Validate that an object looks like a build config.
 * Returns the object filtered to only known keys, or null if no valid keys found.
 */
function validateConfig(obj: unknown): Record<string, string | number> | null {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null

  const filtered: Record<string, string | number> = {}
  let validCount = 0

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (KNOWN_CONFIG_KEYS.has(key) && (typeof value === 'string' || typeof value === 'number')) {
      filtered[key] = value
      validCount++
    }
  }

  return validCount > 0 ? filtered : null
}

/**
 * Try to extract a JSON object from a string using multiple strategies.
 */
function findJsonObject(text: string): unknown | null {
  // Strategy 1: ```json ... ``` code fence (flexible whitespace and backtick count)
  const fencePatterns = [
    /```json\s*([\s\S]*?)```/i,
    /```\s*([\s\S]*?)```/,
    /`{3,}json\s*([\s\S]*?)`{3,}/i,
  ]

  for (const pattern of fencePatterns) {
    const match = text.match(pattern)
    if (match) {
      try {
        return JSON.parse(match[1].trim())
      } catch {
        // Try to fix common JSON issues — incomplete closing
        const fixed = tryFixJson(match[1].trim())
        if (fixed) return fixed
      }
    }
  }

  // Strategy 2: Find the first { ... } block that parses as JSON
  const braceStart = text.indexOf('{')
  if (braceStart !== -1) {
    // Find the matching closing brace
    let depth = 0
    let end = -1
    for (let i = braceStart; i < text.length; i++) {
      if (text[i] === '{') depth++
      if (text[i] === '}') depth--
      if (depth === 0) {
        end = i
        break
      }
    }

    if (end !== -1) {
      try {
        return JSON.parse(text.slice(braceStart, end + 1))
      } catch {
        // Continue to next strategy
      }
    }

    // Strategy 3: Incomplete JSON — try to close it
    const remaining = text.slice(braceStart)
    const fixed = tryFixJson(remaining)
    if (fixed) return fixed
  }

  return null
}

/**
 * Attempt to fix incomplete JSON by closing open braces/brackets.
 */
function tryFixJson(text: string): unknown | null {
  let attempt = text.trim()

  // Remove trailing comma
  attempt = attempt.replace(/,\s*$/, '')

  // Count open vs close braces
  const openBraces = (attempt.match(/{/g) || []).length
  const closeBraces = (attempt.match(/}/g) || []).length

  // Add missing closing braces
  for (let i = 0; i < openBraces - closeBraces; i++) {
    attempt += '}'
  }

  // Try to close any unclosed strings
  const quoteCount = (attempt.match(/"/g) || []).length
  if (quoteCount % 2 !== 0) {
    attempt = attempt + '"'
  }

  try {
    return JSON.parse(attempt)
  } catch {
    return null
  }
}

/**
 * Extract the JSON config block from the AI response text.
 * Tries multiple strategies and formats.
 * Returns the config object or null if not found/invalid.
 */
function extractConfig(text: string): Record<string, string | number> | null {
  const jsonObj = findJsonObject(text)
  if (!jsonObj || typeof jsonObj !== 'object') return null

  const obj = jsonObj as Record<string, unknown>

  // Format A: { "config": { ... } }
  if (obj.config && typeof obj.config === 'object') {
    return validateConfig(obj.config)
  }

  // Format B: Config keys directly at top level { "paintColor": "...", "wheels": "..." }
  return validateConfig(obj)
}

/**
 * Remove the JSON code fence and any raw JSON from the text to get the clean explanation.
 */
function extractExplanation(text: string): string {
  let cleaned = text

  // Remove ```json ... ``` blocks
  cleaned = cleaned.replace(/`{3,}json?\s*[\s\S]*?`{3,}/gi, '')

  // Remove any remaining standalone JSON objects at the start of the text
  cleaned = cleaned.replace(/^\s*\{[\s\S]*?\}\s*/m, '')

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()

  return cleaned
}

/** Snapshot type — stores the build state before an AI suggestion is applied */
interface Snapshot {
  messageId: string
  state: Record<string, string | number>
}

/** Get current build state as a plain object (excluding non-config fields) */
function getCurrentBuildState(): Record<string, string | number> {
  const s = useBuildStore.getState()
  return {
    paintColor: s.paintColor,
    secondaryColor: s.secondaryColor,
    rimColor: s.rimColor,
    caliperColor: s.caliperColor,
    interiorColor: s.interiorColor,
    frontBumper: s.frontBumper,
    frontLip: s.frontLip,
    rearBumper: s.rearBumper,
    wheels: s.wheels,
    headlights: s.headlights,
    sideVents: s.sideVents,
    mirrors: s.mirrors,
    spoiler: s.spoiler,
    roof: s.roof,
    badge: s.badge,
    windowTint: s.windowTint,
    rideHeight: s.rideHeight,
  }
}

export function useAICopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const snapshotsRef = useRef<Map<string, Snapshot>>(new Map())
  const applyPreset = useBuildStore((s) => s.applyPreset)

  // Cleanup on unmount — abort any in-flight stream
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  /**
   * Send a message to the AI.
   */
  const send = useCallback((userText: string) => {
    if (isLoading) return

    const userMsg: ChatMessage = {
      id: msgId(),
      role: 'user',
      content: userText,
    }

    const assistantMsg: ChatMessage = {
      id: msgId(),
      role: 'assistant',
      content: '',
      config: null,
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setIsLoading(true)

    // Build the message history for the API (exclude streaming metadata)
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const currentBuild = getCurrentBuildState()

    // Snapshot current state before the AI changes anything
    const snapshot: Snapshot = {
      messageId: assistantMsg.id,
      state: { ...currentBuild },
    }
    snapshotsRef.current.set(assistantMsg.id, snapshot)

    const controller = streamChat(
      { messages: apiMessages, currentBuild },
      {
        onChunk: (text) => {
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.id === assistantMsg.id) {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + text,
              }
            }
            return updated
          })
        },

        onError: (error) => {
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.id === assistantMsg.id) {
              updated[updated.length - 1] = {
                ...last,
                content: `Sorry, something went wrong: ${error}`,
                isStreaming: false,
                config: null,
              }
            }
            return updated
          })
          setIsLoading(false)
        },

        onDone: (fullText) => {
          const config = extractConfig(fullText)
          const explanation = extractExplanation(fullText)

          // Auto-apply the config if found
          if (config && Object.keys(config).length > 0) {
            applyPreset(config)
          }

          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last && last.id === assistantMsg.id) {
              updated[updated.length - 1] = {
                ...last,
                content: explanation || 'Configuration applied.',
                config: config && Object.keys(config).length > 0 ? config : null,
                isStreaming: false,
              }
            }
            return updated
          })
          setIsLoading(false)
        },
      }
    )

    abortRef.current = controller
  }, [isLoading, messages, applyPreset])

  /**
   * Revert a specific AI suggestion — restores the snapshot taken before it was applied.
   */
  const revert = useCallback((messageId: string) => {
    const snapshot = snapshotsRef.current.get(messageId)
    if (!snapshot) return

    applyPreset(snapshot.state)

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, isReverted: true, isApplied: false }
          : m
      )
    )
  }, [applyPreset])

  /**
   * Re-apply a previously reverted AI suggestion.
   */
  const apply = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId)
    if (!msg?.config) return

    // Snapshot current state before re-applying
    snapshotsRef.current.set(messageId, {
      messageId,
      state: getCurrentBuildState(),
    })

    applyPreset(msg.config)

    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, isApplied: true, isReverted: false }
          : m
      )
    )
  }, [messages, applyPreset])

  /**
   * Reset the chat — clears all messages and snapshots.
   */
  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setIsLoading(false)
    snapshotsRef.current.clear()
  }, [])

  return {
    messages,
    isLoading,
    send,
    apply,
    revert,
    reset,
  }
}