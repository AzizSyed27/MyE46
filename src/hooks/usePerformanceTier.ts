import { useMemo } from 'react'

export type PerformanceTier = 'high' | 'medium' | 'low'

/**
 * Detect device performance tier.
 * - high: full quality, all effects
 * - medium: reduced DPR, baked shadows, fewer lights
 * - low: minimal quality, no shadows — but still shows 3D
 *
 * 3D is only skipped entirely if WebGL is not available.
 */
export function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    const cores = navigator.hardwareConcurrency || 2
    const memory = (navigator as any).deviceMemory || 4
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    // Check GPU capability
    let gpuTier: 'high' | 'medium' | 'low' = 'medium'
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) return 'low' // No WebGL at all

      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext)
          .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          .toLowerCase()

        // Software renderers — genuinely can't do 3D
        if (renderer.includes('swiftshader') || renderer.includes('llvmpipe')) {
          return 'low'
        }

        // Known weak desktop GPUs
        if (
          renderer.includes('intel hd') ||
          renderer.includes('intel uhd')
        ) {
          gpuTier = 'low'
        }
        // Strong GPUs
        else if (
          renderer.includes('nvidia') ||
          renderer.includes('radeon rx') ||
          renderer.includes('apple m') ||
          renderer.includes('apple gpu')
        ) {
          gpuTier = 'high'
        }

        // Mobile GPUs — most modern ones are fine at medium
        if (isMobile) {
          if (
            renderer.includes('adreno 6') ||
            renderer.includes('adreno 7') ||
            renderer.includes('mali-g') ||
            renderer.includes('apple gpu')
          ) {
            gpuTier = 'medium'
          } else if (
            renderer.includes('adreno 3') ||
            renderer.includes('adreno 4') ||
            renderer.includes('mali-4') ||
            renderer.includes('mali-t')
          ) {
            gpuTier = 'low'
          } else {
            // Unknown mobile GPU — assume medium, not low
            gpuTier = 'medium'
          }
        }
      }
    } catch {
      // WebGL detection failed — assume medium
    }

    // Score the device
    let score = 0

    if (cores >= 8) score += 3
    else if (cores >= 4) score += 2
    else score += 1

    if (memory >= 8) score += 3
    else if (memory >= 4) score += 2
    else score += 1

    if (gpuTier === 'high') score += 3
    else if (gpuTier === 'medium') score += 2
    else score += 1

    // Mobile penalty is small — just enough to avoid "high" on phones
    // but not enough to push them to "low"
    if (isMobile) score -= 1

    if (score >= 8) return 'high'
    if (score >= 4) return 'medium'
    return 'low'
  }, [])
}

/**
 * Check if WebGL is available at all.
 * Use this to decide whether to attempt 3D rendering.
 */
export function canRender3D(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const renderer = (gl as WebGLRenderingContext)
        .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        .toLowerCase()
      // Software renderers can technically render but will freeze the browser
      if (renderer.includes('swiftshader') || renderer.includes('llvmpipe')) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}