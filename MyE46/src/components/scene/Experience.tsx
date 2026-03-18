import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import E46Model from './E46Model'

export default function Experience() {
  return (
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

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3}
          maxDistance={12}
          enablePan={false}
          target={[0, 0.5, 0]}
        />
      </Suspense>
    </Canvas>
  )
}