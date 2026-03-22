import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Vector3 } from 'three'
import LandingModel from './LandingModel'
import type { PerformanceTier } from '../../hooks/usePerformanceTier'

/** Desktop keyframes — car framed right for hero, left for final */
const DESKTOP_KEYFRAMES = [
  { at: 0.0,  position: [7.0, 2.0, 6.0],    target: [-3.0, 0.1, 0] },
  { at: 0.2,  position: [5.5, 1.5, 3.0],    target: [-0.5, 0.4, 0] },
  { at: 0.35, position: [5.0, 1.2, 1.0],    target: [0, 0.4, 0] },
  { at: 0.6,  position: [-4.0, 1.5, -3.5],  target: [0, 0.3, 0] },
  { at: 0.8,  position: [-5.0, 1.2, 2.0],   target: [0.5, 0.3, 0] },
  { at: 0.9,  position: [-5.5, 1.0, 4.5],   target: [1.8, 0.2, 0] },
  { at: 1.0,  position: [-6.5, 1.0, 4.5],   target: [3.0, 0.8, 0] },
]

/** Mobile keyframes — car always centered, framed in upper portion */
const MOBILE_KEYFRAMES = [
  // Hero — car centered, pulled back, slightly above center
  { at: 0.0,  position: [11.5, 2.2, 5.5],    target: [0, -0.5, 0] },
  // Transition to side
  { at: 0.2,  position: [5.0, 1.5, 3.0],    target: [0, 0.5, 0] },
  // Features — side profile centered
  { at: 0.35, position: [5.0, 1.2, 1.0],    target: [0, 0.4, 0] },
  // Features — rear 3/4 centered
  { at: 0.6,  position: [-4.0, 1.5, -3.5],  target: [0, 0.3, 0] },
  // Transition to final
  { at: 0.8,  position: [-4.5, 1.8, 3.0],   target: [0, 0.5, 0] },
  // Final — car centered, slightly above center, dramatic angle
  { at: 0.9,  position: [4.5, 1.5, 5.0],    target: [0, 0.5, 0] },
  { at: 1.0,  position: [12.5, 1.5, 5.0],    target: [0, 0.5, 0] },
]


function lerpArray(
  a: number[],
  b: number[],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function getInterpolatedCamera(
  scrollProgress: number,
  keyframes: typeof DESKTOP_KEYFRAMES
): {
  position: [number, number, number]
  target: [number, number, number]
} {
  const p = Math.max(0, Math.min(1, scrollProgress))

  let lower = keyframes[0]
  let upper = keyframes[keyframes.length - 1]

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].at && p <= keyframes[i + 1].at) {
      lower = keyframes[i]
      upper = keyframes[i + 1]
      break
    }
  }

  const range = upper.at - lower.at
  const t = range > 0 ? (p - lower.at) / range : 0
  const eased = t * t * (3 - 2 * t)

  return {
    position: lerpArray(lower.position, upper.position, eased),
    target: lerpArray(lower.target, upper.target, eased),
  }
}

function ScrollCamera({
  scrollProgress,
  keyframes,
}: {
  scrollProgress: number
  keyframes: typeof DESKTOP_KEYFRAMES
}) {
  const { camera } = useThree()
  const targetPos = useRef(new Vector3())
  const targetLook = useRef(new Vector3())
  const currentLook = useRef(new Vector3(0, 0.5, 0))
  const lastProgress = useRef(scrollProgress)

  useFrame(() => {
    const { position, target } = getInterpolatedCamera(scrollProgress, keyframes)

    targetPos.current.set(position[0], position[1], position[2])
    targetLook.current.set(target[0], target[1], target[2])

    camera.position.lerp(targetPos.current, 0.04)
    currentLook.current.lerp(targetLook.current, 0.04)
    camera.lookAt(currentLook.current)

    // Keep invalidating while camera is still settling
    const posDiff = camera.position.distanceTo(targetPos.current)
    if (posDiff > 0.001 || Math.abs(scrollProgress - lastProgress.current) > 0.0001) {
      invalidate()
    }
    lastProgress.current = scrollProgress
  })

  return null
}

function shouldPauseTurntable(scrollProgress: number): boolean {
  return scrollProgress > 0.25 && scrollProgress < 0.85
}

/** Continuous invalidation for turntable rotation */
function TurntableInvalidator({ paused }: { paused: boolean }) {
  useFrame(() => {
    if (!paused) {
      invalidate()
    }
  })
  return null
}

interface LandingExperienceProps {
  scrollProgress: number
  performanceTier: PerformanceTier
}

export default function LandingExperience({
  scrollProgress,
  performanceTier,
}: LandingExperienceProps) {
  const paused = shouldPauseTurntable(scrollProgress)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const keyframes = isMobile ? MOBILE_KEYFRAMES : DESKTOP_KEYFRAMES
  const initialPos: [number, number, number] = isMobile
    ? [4.5, 2.2, 5.5]
    : [6.0, 2.0, 6.0]

  // DPR based on performance tier
  const dpr: [number, number] = performanceTier === 'high'
    ? [1, 2]
    : performanceTier === 'medium'
      ? [1, 1.5]
      : [1, 1]

  const showShadows = performanceTier !== 'low'
  const simplified = performanceTier === 'low'

  return (
    <Canvas
      camera={{
        position: initialPos,
        fov: 40,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: performanceTier !== 'low',
        alpha: true,
        powerPreference: 'default',
      }}
      dpr={dpr}
      frameloop="demand"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow={showShadows}
          shadow-mapSize-width={showShadows ? 512 : 0}
          shadow-mapSize-height={showShadows ? 512 : 0}
        />
        <directionalLight position={[-3, 4, -4]} intensity={0.3} />
        {performanceTier === 'high' && (
          <directionalLight position={[0, 3, -5]} intensity={0.2} />
        )}

        <Environment preset="city" />

        <LandingModel
          paused={paused}
          rotationSpeed={0.15}
          simplified={simplified}
        />

        {showShadows && (
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={12}
            blur={2.5}
            far={4}
            frames={1}
          />
        )}

        <ScrollCamera scrollProgress={scrollProgress} keyframes={keyframes} />
        <TurntableInvalidator paused={paused} />
      </Suspense>
    </Canvas>
  )
}