import { useMemo } from 'react'

export type PerformanceTier = 'high' | 'medium' | 'low'

/**
 * Detect device performance tier.
 * Used to decide whether to show 3D on landing, reduce quality, etc.
 */
export function usePerformanceTier(): PerformanceTier {
  return useMemo(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2
    
    // Check device memory (GB, Chrome only)
    const memory = (navigator as any).deviceMemory || 4

    // Check if mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    // Check screen size — small screens are likely weaker devices
    const isSmallScreen = window.innerWidth < 768

    // Try to detect GPU
    let gpuTier: 'high' | 'medium' | 'low' = 'medium'
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
          
          // Known weak GPUs
          if (
            renderer.includes('intel hd') ||
            renderer.includes('intel uhd') ||
            renderer.includes('mali-4') ||
            renderer.includes('adreno 3') ||
            renderer.includes('adreno 4') ||
            renderer.includes('swiftshader') ||
            renderer.includes('llvmpipe')
          ) {
            gpuTier = 'low'
          }
          // Known strong GPUs
          else if (
            renderer.includes('nvidia') ||
            renderer.includes('radeon rx') ||
            renderer.includes('apple m') ||
            renderer.includes('apple gpu')
          ) {
            gpuTier = 'high'
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

    if (isMobile) score -= 2
    if (isSmallScreen) score -= 1

    if (score >= 8) return 'high'
    if (score >= 5) return 'medium'
    return 'low'
  }, [])
}