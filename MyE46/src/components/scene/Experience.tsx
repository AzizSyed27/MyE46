import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Color } from 'three'
import E46Model from './E46Model'
import Loader from '../ui/Loader'
import { useCinematicCamera } from '../../hooks/useCinematicCamera'
import { useBuildStore } from '../../store/buildStore'
import { ENVIRONMENT_PRESETS } from '../../data/environments'
import type { LightConfig, EnvironmentPreset } from '../../data/environments'

export default function Experience() {
  const [loaded, setLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowLoader(false), 600)
      return () => clearTimeout(timer)
    }
  }, [loaded])

  const handleLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {showLoader && (
        <div className={`loader ${loaded ? 'loader--hidden' : ''}`}>
          <div className="loader-content">
            <h1 className="loader-logo">MyE46</h1>
            <div className="loader-bar-track">
               <Loader />
            </div>
            <p className="loader-status">
              {loaded ? 'Preparing scene…' : 'Loading model…'}
            </p>
          </div>
        </div>
      )}

      <Canvas
        camera={{
          position: [4, 2, 5],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        <Suspense fallback={null}>
          <SceneContent onLoaded={handleLoaded} />
        </Suspense>
      </Canvas>
    </div>
  )
}

/** Renders a single light from a LightConfig definition */
function SceneLight({ config, index }: { config: LightConfig; index: number }) {
  switch (config.type) {
    case 'ambient':
      return (
        <ambientLight
          key={`ambient-${index}`}
          intensity={config.intensity}
          color={config.color}
        />
      )
    case 'directional':
      return (
        <directionalLight
          key={`dir-${index}`}
          position={config.position}
          intensity={config.intensity}
          color={config.color}
          castShadow={config.castShadow ?? false}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )
    case 'spot':
      return (
        <spotLight
          key={`spot-${index}`}
          position={config.position}
          intensity={config.intensity}
          color={config.color}
          castShadow={config.castShadow ?? false}
          angle={config.angle ?? 0.5}
          penumbra={config.penumbra ?? 0.5}
          distance={config.distance ?? 20}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      )
    case 'point':
      return (
        <pointLight
          key={`point-${index}`}
          position={config.position}
          intensity={config.intensity}
          color={config.color}
          distance={config.distance ?? 10}
        />
      )
    default:
      return null
  }
}

/** Smoothly transitions the scene background color */
function AnimatedBackground({ targetColor }: { targetColor: string }) {
  const { scene } = useThree()
  const currentColor = useRef(new Color(targetColor))
  const target = useMemo(() => new Color(targetColor), [targetColor])

  useEffect(() => {
    scene.background = currentColor.current
  }, [scene])

  useFrame(() => {
    currentColor.current.lerp(target, 0.05)
    scene.background = currentColor.current
  })

  return null
}

/** Inner component — renders inside Canvas so Three.js hooks work */
function SceneContent({ onLoaded }: { onLoaded: () => void }) {
  const controlsRef = useRef<any>(null)

  // Wire up cinematic camera transitions
  useCinematicCamera(controlsRef)

  // Read environment from store
  const environmentId = useBuildStore((s) => s.environment)
  const envPreset: EnvironmentPreset = ENVIRONMENT_PRESETS[environmentId] ?? ENVIRONMENT_PRESETS.studio

  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  // Configure smooth transition timing after controls mount
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    controls.smoothTime = 0.8
    controls.draggingSmoothTime = 0.15
  }, [])

  return (
    <>
      {/* Animated background color */}
      <AnimatedBackground targetColor={envPreset.backgroundColor} />

      {/* Environment map for reflections */}
      <Environment
        preset={envPreset.hdri}
        environmentIntensity={envPreset.hdriIntensity}
      />

      {/* Dynamic lights from preset */}
      {envPreset.lights.map((light, i) => (
        <SceneLight key={`${envPreset.id}-light-${i}`} config={light} index={i} />
      ))}

      {/* The car model */}
      <E46Model />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
      />

      {/* Camera controls */}
      <CameraControls
        ref={controlsRef}
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2}
        maxDistance={12}
      />
    </>
  )
}