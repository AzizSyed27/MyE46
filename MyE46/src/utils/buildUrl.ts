import type { BuildConfig } from '../types'

/**
 * Short keys to minimize URL length.
 * Maps full config keys to 2-char abbreviations.
 */
const KEY_MAP: Record<string, string> = {
  paintColor: 'pc',
  secondaryColor: 'sc',
  rimColor: 'rc',
  caliperColor: 'cc',
  interiorColor: 'ic',
  frontBumper: 'fb',
  frontLip: 'fl',
  rearBumper: 'rb',
  wheels: 'wh',
  headlights: 'hl',
  sideVents: 'sv',
  mirrors: 'mi',
  spoiler: 'sp',
  roof: 'rf',
  badge: 'ba',
  windowTint: 'wt',
  rideHeight: 'rh',
}

/** Reverse map: short key → full key */
const REVERSE_KEY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(KEY_MAP).map(([full, short]) => [short, full])
)

/** Fields to include in the shareable URL */
const SHAREABLE_KEYS = Object.keys(KEY_MAP)

/**
 * Encode a build config into a URL-safe base64 string.
 * Only includes the customizable fields, using short keys.
 */
export function encodeBuild(
  config: Partial<BuildConfig>
): string {
  const compact: Record<string, string | number> = {}

  for (const key of SHAREABLE_KEYS) {
    const value = config[key as keyof BuildConfig]
    if (value !== undefined) {
      compact[KEY_MAP[key]] = value as string | number
    }
  }

  const json = JSON.stringify(compact)
  // btoa works on ASCII — encode UTF-8 first for safety
  const encoded = btoa(unescape(encodeURIComponent(json)))
  // Make URL-safe: replace + with -, / with _, remove trailing =
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decode a URL-safe base64 string back into a partial BuildConfig.
 * Returns null if the string is invalid.
 */
export function decodeBuild(
  encoded: string
): Partial<Omit<BuildConfig, 'id' | 'name' | 'notes' | 'createdAt' | 'updatedAt'>> | null {
  try {
    // Restore standard base64: replace - with +, _ with /
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    // Restore padding
    while (base64.length % 4) {
      base64 += '='
    }

    const json = decodeURIComponent(escape(atob(base64)))
    const compact = JSON.parse(json)

    if (typeof compact !== 'object' || compact === null) {
      return null
    }

    const config: Record<string, string | number> = {}

    for (const [shortKey, value] of Object.entries(compact)) {
      const fullKey = REVERSE_KEY_MAP[shortKey]
      if (fullKey && (typeof value === 'string' || typeof value === 'number')) {
        config[fullKey] = value
      }
    }

    return config as Partial<Omit<BuildConfig, 'id' | 'name' | 'notes' | 'createdAt' | 'updatedAt'>>
  } catch {
    return null
  }
}

/**
 * Build the full shareable URL for the current page.
 */
export function buildShareUrl(
  config: Partial<BuildConfig>
): string {
  const encoded = encodeBuild(config)
  const base = window.location.origin + '/configurator'
  return `${base}?build=${encoded}`
}