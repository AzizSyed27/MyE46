import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import {
  SINGLE_SLOTS,
  PAIRED_SLOTS,
  QUAD_SLOTS,
  ALWAYS_VISIBLE,
  ALL_FRONT_BUMPER_NODES,
  ALL_REAR_BUMPER_NODES,
  ALL_MIRROR_NODES,
  ALL_SIDE_VENT_NODES,
  PAINT_TARGET_NODES,
  SECONDARY_COLOR_NODES,
  CALIPER_NODES,
  WINDOW_TINT_NODES,
  TINT_LEVELS,
  BODY_MATERIAL_NAMES,
  RIM_MATERIAL_NAMES,
} from '../../data/slots'

/** Fixed preset — Aggressive Street */
const LANDING_PRESET = {
  paintColor: '#770d0f',
  secondaryColor: '#0d0d0d',
  rimColor: '#c4c4c4',
  caliperColor: '#770d0f',
  interiorColor: '#0d0d0d',
  frontBumper: 'front_bumper_m3',
  frontLip: 'none',
  rearBumper: 'rear_bumper_mtech2_single',
  wheels: 'rim_style_119',
  headlights: 'projectors',
  sideVents: 'm_side_vents',
  mirrors: 'm3',
  spoiler: 'spoiler_ducktail',
  roof: 'roof',
  badge: 'badge_m3',
  windowTint: '15',
  rideHeight: -0.06,
}

function materialMatches(materialName: string, targets: string[]): boolean {
  const lower = materialName.toLowerCase()
  return targets.some((t) => lower.includes(t.toLowerCase()))
}

function getAllTogglableNames(): Set<string> {
  const names = new Set<string>()
  for (const nodes of Object.values(SINGLE_SLOTS)) {
    nodes.forEach((n) => names.add(n))
  }
  for (const nodes of Object.values(PAIRED_SLOTS)) {
    nodes.forEach((n) => names.add(n))
  }
  for (const nodes of Object.values(QUAD_SLOTS)) {
    nodes.forEach((n) => names.add(n))
  }
  return names
}

const ALL_PAIRED_NODES = new Set<string>([
  ...ALL_FRONT_BUMPER_NODES,
  ...ALL_REAR_BUMPER_NODES,
  ...ALL_MIRROR_NODES,
  ...ALL_SIDE_VENT_NODES,
])

interface LandingModelProps {
  rotationSpeed?: number
  paused?: boolean
  simplified?: boolean
}

export default function LandingModel({
  rotationSpeed = 0.15,
  paused = false,
  simplified = false,
}: LandingModelProps) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/models/e46.glb')
  const initialized = useRef(false)

  const nodeMap = useMemo(() => {
    const map = new Map<string, Object3D>()
    scene.traverse((child) => {
      if (child.name) {
        map.set(child.name, child)
      }
    })
    return map
  }, [scene])

  const togglableNames = useMemo(() => getAllTogglableNames(), [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const p = LANDING_PRESET

    // --- Visibility ---
    const visible = new Set<string>()

    const frontNodes = PAIRED_SLOTS[`frontBumper.${p.frontBumper}`]
    if (frontNodes) frontNodes.forEach((n) => visible.add(n))

    if (p.frontLip !== 'none') visible.add('front_lip')

    const rearNodes = PAIRED_SLOTS[`rearBumper.${p.rearBumper}`]
    if (rearNodes) rearNodes.forEach((n) => visible.add(n))

    const mirrorNodes = PAIRED_SLOTS[`mirrors.${p.mirrors}`]
    if (mirrorNodes) mirrorNodes.forEach((n) => visible.add(n))

    if (p.sideVents !== 'none') {
      const ventNodes = PAIRED_SLOTS[`sideVents.${p.sideVents}`]
      if (ventNodes) ventNodes.forEach((n) => visible.add(n))
    }

    if (p.spoiler !== 'none') visible.add(p.spoiler)
    visible.add(p.roof)
    visible.add(p.badge)

    const wheelNodes = QUAD_SLOTS[p.wheels]
    if (wheelNodes) wheelNodes.forEach((n) => visible.add(n))

    for (const [name, node] of nodeMap) {
      if (togglableNames.has(name) || ALL_PAIRED_NODES.has(name)) {
        node.visible = visible.has(name)
      }
    }
    for (const name of ALWAYS_VISIBLE) {
      const node = nodeMap.get(name)
      if (node) node.visible = true
    }

    // --- Glass fix ---
    scene.traverse((child) => {
      if (
        (child as Mesh).isMesh &&
        (child as Mesh).material &&
        ((child as Mesh).material as MeshStandardMaterial).name?.toLowerCase().includes('e46racing_glass')
      ) {
        const mesh = child as Mesh
        const mat = (mesh.material as MeshStandardMaterial).clone()
        mat.transparent = true
        mat.opacity = 0.18
        mat.roughness = 0
        mat.metalness = 0.1
        mesh.renderOrder = 1
        mesh.material = mat
      }
    })

    // --- Window tint (skip on simplified) ---
    if (!simplified) {
      const tint = TINT_LEVELS[p.windowTint] ?? TINT_LEVELS['none']
      for (const nodeName of WINDOW_TINT_NODES) {
        const node = nodeMap.get(nodeName)
        if (!node) continue
        node.traverse((child) => {
          if (
            (child as Mesh).isMesh &&
            ((child as Mesh).material as MeshStandardMaterial).name?.toLowerCase().includes('e46racing_glass')
          ) {
            const mesh = child as Mesh
            const mat = (mesh.material as MeshStandardMaterial).clone()
            mat.transparent = true
            mat.opacity = tint.opacity
            mat.color.set(tint.color)
            mat.roughness = 0
            mat.metalness = 0.1
            mesh.renderOrder = 1
            mesh.material = mat
          }
        })
      }
    }

    // --- Paint color (MeshStandardMaterial — cheaper than Physical) ---
    for (const nodeName of PAINT_TARGET_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = mesh.material as MeshStandardMaterial
          if (mat.name && materialMatches(mat.name, BODY_MATERIAL_NAMES)) {
            const cloned = mat.clone()
            cloned.color.set(p.paintColor)
            cloned.roughness = 0.25
            cloned.metalness = 0.8
            mesh.material = cloned
          }
        }
      })
    }

    // --- Secondary color (skip on simplified) ---
    if (!simplified) {
      for (const nodeName of SECONDARY_COLOR_NODES) {
        const node = nodeMap.get(nodeName)
        if (!node) continue
        node.traverse((child) => {
          if ((child as Mesh).isMesh && (child as Mesh).material) {
            const mesh = child as Mesh
            const mat = (mesh.material as MeshStandardMaterial).clone()
            mat.color.set(p.secondaryColor)
            mesh.material = mat
          }
        })
      }
    }

    // --- Rim color ---
    for (const nodes of Object.values(QUAD_SLOTS)) {
      for (const nodeName of nodes) {
        const node = nodeMap.get(nodeName)
        if (!node) continue
        node.traverse((child) => {
          if ((child as Mesh).isMesh && (child as Mesh).material) {
            const mesh = child as Mesh
            const mat = mesh.material as MeshStandardMaterial
            if (mat.name && materialMatches(mat.name, RIM_MATERIAL_NAMES)) {
              const cloned = mat.clone()
              cloned.color.set(p.rimColor)
              cloned.roughness = 0.2
              cloned.metalness = 0.85
              mesh.material = cloned
            }
          }
        })
      }
    }

    // --- Caliper color (skip on simplified) ---
    if (!simplified) {
      for (const nodeName of CALIPER_NODES) {
        const node = nodeMap.get(nodeName)
        if (!node) continue
        node.traverse((child) => {
          if ((child as Mesh).isMesh && (child as Mesh).material) {
            const mesh = child as Mesh
            const mat = (mesh.material as MeshStandardMaterial).clone()
            mat.color.set(p.caliperColor)
            mesh.material = mat
          }
        })
      }
    }

    // --- Ride height ---
    if (groupRef.current) {
      groupRef.current.position.y = p.rideHeight
    }
  }, [scene, nodeMap, togglableNames, simplified])

  // --- Turntable rotation ---
  useFrame((_, delta) => {
    if (paused || !groupRef.current) return
    groupRef.current.rotation.y += delta * rotationSpeed
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/e46.glb')