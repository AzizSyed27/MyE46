import { Canvas } from '@react-three/fiber'
import { CameraControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback, useRef } from 'react'
import E46Model from './E46Model'
import { useCinematicCamera } from '../../hooks/useCinematicCamera'

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
              <div className="loader-bar-fill loader-bar-fill--indeterminate" />
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
        style={{ background: '#f5f0e8' }}
      >
        <Suspense fallback={null}>
          <SceneContent onLoaded={handleLoaded} />
        </Suspense>
      </Canvas>
    </div>
  )
}

/** Inner component — renders inside Canvas so Three.js hooks work */
function SceneContent({ onLoaded }: { onLoaded: () => void }) {
  // Use any for ref type to avoid version conflicts between drei and camera-controls types
  const controlsRef = useRef<any>(null)

  // Wire up cinematic camera transitions
  useCinematicCamera(controlsRef)

  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  // Configure smooth transition timing after controls mount
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    // smoothTime controls how quickly the camera settles after setLookAt
    controls.smoothTime = 0.8

    // Damping for manual orbit feel
    controls.draggingSmoothTime = 0.15
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, 4, -4]}
        intensity={0.4}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset="city" />

      {/* The car model */}
      <E46Model />

      {/* Ground shadow beneath the car */}
      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
      />

      {/* Camera controls — supports both free orbit and programmatic setLookAt */}
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