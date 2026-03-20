import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Vector3 } from 'three'
import LandingModel from './LandingModel'

/**
 * Scroll keyframes — camera positions at different scroll percentages.
 *
 * Hero (0%):     Car framed RIGHT, camera pulled back (smaller car)
 * Transition (20%): Camera starts centering
 * Center (35%):  Car centered, side profile (features top)
 * Center (60%):  Car centered, rear 3/4 (features bottom)
 * Transition (80%): Camera starts framing left
 * Final (90-100%): Car framed LEFT, low dramatic angle
 */
const SCROLL_KEYFRAMES = [
  // Hero — car on right half, further back = appears smaller
  {
    at: 0.0,
    position: [6.0, 2.0, 6.0],
    target: [-1.8, 0.3, 0],
  },
  // Begin centering transition
  {
    at: 0.2,
    position: [5.5, 1.5, 3.0],
    target: [-0.5, 0.4, 0],
  },
  // Centered — side profile for features top
  {
    at: 0.35,
    position: [5.0, 1.2, 1.0],
    target: [0, 0.4, 0],
  },
  // Centered — rear 3/4 for features bottom
  {
    at: 0.6,
    position: [-4.0, 1.5, -3.5],
    target: [0, 0.3, 0],
  },
  // Begin framing left transition
  {
    at: 0.8,
    position: [-5.0, 1.2, 2.0],
    target: [0.5, 0.3, 0],
  },
  // Final — car on left half, low dramatic angle
  {
    at: 0.9,
    position: [-5.5, 1.0, 4.5],
    target: [1.8, 0.2, 0],
  },
  // Hold final position
  {
    at: 1.0,
    position: [-5.5, 1.0, 4.5],
    target: [1.8, 0.2, 0],
  },
]

/** Lerp between two 3-element arrays */
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

/** Find the two keyframes surrounding the current scroll progress and interpolate */
function getInterpolatedCamera(scrollProgress: number): {
  position: [number, number, number]
  target: [number, number, number]
} {
  const p = Math.max(0, Math.min(1, scrollProgress))

  let lower = SCROLL_KEYFRAMES[0]
  let upper = SCROLL_KEYFRAMES[SCROLL_KEYFRAMES.length - 1]

  for (let i = 0; i < SCROLL_KEYFRAMES.length - 1; i++) {
    if (p >= SCROLL_KEYFRAMES[i].at && p <= SCROLL_KEYFRAMES[i + 1].at) {
      lower = SCROLL_KEYFRAMES[i]
      upper = SCROLL_KEYFRAMES[i + 1]
      break
    }
  }

  const range = upper.at - lower.at
  const t = range > 0 ? (p - lower.at) / range : 0

  // Smooth easing
  const eased = t * t * (3 - 2 * t)

  return {
    position: lerpArray(lower.position, upper.position, eased),
    target: lerpArray(lower.target, upper.target, eased),
  }
}

/** Inner component that drives the scroll-based camera */
function ScrollCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const targetPos = useRef(new Vector3(6.0, 2.0, 6.0))
  const targetLook = useRef(new Vector3(-1.8, 0.3, 0))
  const currentLook = useRef(new Vector3(-1.8, 0.3, 0))

  useFrame(() => {
    const { position, target } = getInterpolatedCamera(scrollProgress)

    targetPos.current.set(position[0], position[1], position[2])
    targetLook.current.set(target[0], target[1], target[2])

    camera.position.lerp(targetPos.current, 0.04)
    currentLook.current.lerp(targetLook.current, 0.04)
    camera.lookAt(currentLook.current)
  })

  return null
}

/** Turntable pauses when camera is in the centered zone (30-80% scroll) */
function shouldPauseTurntable(scrollProgress: number): boolean {
  return scrollProgress > 0.25 && scrollProgress < 0.85
}

interface LandingExperienceProps {
  scrollProgress: number
}

export default function LandingExperience({ scrollProgress }: LandingExperienceProps) {
  const paused = shouldPauseTurntable(scrollProgress)

  return (
    <Canvas
      camera={{
        position: [6.0, 2.0, 6.0],
        fov: 40,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
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
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-3, 4, -4]}
          intensity={0.3}
        />
        <directionalLight
          position={[0, 3, -5]}
          intensity={0.2}
        />

        <Environment preset="city" />

        <LandingModel paused={paused} rotationSpeed={0.12} />

        <ContactShadows
          position={[0, -0.49, 0]}
          opacity={0.5}
          scale={12}
          blur={2.5}
          far={4}
        />

        <ScrollCamera scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  )
}