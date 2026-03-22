/**
 * Send a GA4 event. Fails silently if gtag isn't loaded.
 */
function sendEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, params)
  }
}

// ─── Modification Events ───────────────────────────────────

export function trackPartChange(slot: string, value: string) {
  sendEvent('part_change', { slot, value })
}

export function trackColorChange(slot: string, value: string) {
  sendEvent('color_change', { slot, value })
}

export function trackRideHeightChange(value: number) {
  sendEvent('ride_height_change', { value_mm: Math.round(value * 1000) })
}

export function trackPresetApply(presetName: string) {
  sendEvent('preset_apply', { preset: presetName })
}

export function trackPaintFinishChange(finish: string) {
  sendEvent('paint_finish_change', { finish })
}

export function trackWindowTintChange(tint: string) {
  sendEvent('window_tint_change', { tint })
}

export function trackEnvironmentChange(environment: string) {
  sendEvent('environment_change', { environment })
}

// ─── Build Events ──────────────────────────────────────────

export function trackBuildSave(buildName: string, totalPrice: number) {
  sendEvent('build_save', { build_name: buildName, total_price: totalPrice })
}

export function trackBuildLoad(buildName: string) {
  sendEvent('build_load', { build_name: buildName })
}

export function trackBuildDelete(buildName: string) {
  sendEvent('build_delete', { build_name: buildName })
}

// ─── Share Events ──────────────────────────────────────────

export function trackBuildShare(method: 'copy_link') {
  sendEvent('build_share', { method })
}

// ─── AI Events ─────────────────────────────────────────────

export function trackAIPrompt(prompt: string) {
  sendEvent('ai_prompt', { prompt: prompt.slice(0, 100) }) // Truncate for GA limits
}

export function trackAIApply() {
  sendEvent('ai_apply')
}

export function trackAIRevert() {
  sendEvent('ai_revert')
}