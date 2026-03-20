import { useEffect, useRef, useCallback } from 'react'
import { useBuildStore } from '../store/buildStore'
import { CAMERA_ANGLES } from '../data/cameraPositions'

/**
 * Hook that triggers cinematic camera transitions when slots change.
 * Uses Zustand's subscribe API to avoid React effect cleanup issues.
 *
 * Pass the CameraControls ref from Experience.
 */
export function useCinematicCamera(
  controlsRef: React.RefObject<any>
) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const animateToSlot = useCallback(
    (slot: string) => {
      const controls = controlsRef.current
      if (!controls) return

      const angle = CAMERA_ANGLES[slot] ?? CAMERA_ANGLES['default']

      controls.setLookAt(
        angle.position[0],
        angle.position[1],
        angle.position[2],
        angle.target[0],
        angle.target[1],
        angle.target[2],
        true // enable smooth transition
      )
    },
    [controlsRef]
  )

  useEffect(() => {
    // Subscribe directly to store changes — fires outside React render cycle
    const unsub = useBuildStore.subscribe((state, prevState) => {
      const slot = state.lastChangedSlot

      // Skip if null or unchanged
      if (!slot) return
      if (slot === prevState.lastChangedSlot) return

      // Clear immediately so it doesn't fire again
      useBuildStore.getState().clearLastChangedSlot()

      // Debounce: rapid clicks only trigger one animation for the last change
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        animateToSlot(slot)
        debounceRef.current = null
      }, 0)
    })

    return () => {
      unsub()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [animateToSlot])
}