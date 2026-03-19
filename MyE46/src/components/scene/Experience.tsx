import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useState, useEffect, useCallback } from 'react'
import E46Model from './E46Model'
import Loader from '../ui/Loader'

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
              <LoaderBar />
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

/** Progress bar — reads Drei's useProgress outside the Canvas */
function LoaderBar() {
  // We can't use useProgress here since it needs to be outside Canvas
  // Instead, use a simple indeterminate animation via CSS
  return <div className="loader-bar-fill loader-bar-fill--indeterminate" />
}

/** Inner component so we can fire onLoaded after Suspense resolves */
function SceneContent({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    onLoaded()
  }, [onLoaded])

  return (
    <>
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

      <Environment preset="city" />

      <E46Model />

      <ContactShadows
        position={[0, -0.49, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
      />

      <OrbitControls
        makeDefault
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={12}
        enablePan={false}
        target={[0, 0.5, 0]}
      />
    </>
  )
}