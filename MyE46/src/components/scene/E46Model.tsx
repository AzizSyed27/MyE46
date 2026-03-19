import { useEffect, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { useBuildStore } from '../../store/buildStore'
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
  INTERIOR_TRIM_NODES,
  WINDOW_TINT_NODES,
  TINT_LEVELS,
  BODY_MATERIAL_NAMES,
  RIM_MATERIAL_NAMES,
} from '../../data/slots'

/** Check if a material name contains any of the target substrings */
function materialMatches(materialName: string, targets: string[]): boolean {
  const lower = materialName.toLowerCase()
  return targets.some((t) => lower.includes(t.toLowerCase()))
}

/** Collect all node names that are togglable (not always-visible) */
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

/** Build the set of node names that should be visible for the current config */
function getVisibleNodes(state: {
  frontBumper: string
  frontLip: string
  rearBumper: string
  spoiler: string
  roof: string
  badge: string
  wheels: string
  sideVents: string
  mirrors: string
  headlights: string
}): Set<string> {
  const visible = new Set<string>()

  // --- Single slots ---
  if (state.frontLip !== 'none') {
    visible.add('front_lip')
  }

  if (state.spoiler !== 'none') {
    visible.add(state.spoiler)
  }

  visible.add(state.roof)
  visible.add(state.badge)

  // --- Paired slots ---
  // frontBumper
  const frontKey = `frontBumper.${state.frontBumper}`
  const frontNodes = PAIRED_SLOTS[frontKey]
  if (frontNodes) {
    frontNodes.forEach((n) => visible.add(n))
  }
  
  // rearBumper
  const rearKey = `rearBumper.${state.rearBumper}`
  const rearNodes = PAIRED_SLOTS[rearKey]
  if (rearNodes) {
    rearNodes.forEach((n) => visible.add(n))
  }

  // mirrors
  const mirrorKey = `mirrors.${state.mirrors}`
  const mirrorNodes = PAIRED_SLOTS[mirrorKey]
  if (mirrorNodes) {
    mirrorNodes.forEach((n) => visible.add(n))
  }

  // sideVents
  if (state.sideVents !== 'none') {
    const ventKey = `sideVents.${state.sideVents}`
    const ventNodes = PAIRED_SLOTS[ventKey]
    if (ventNodes) {
      ventNodes.forEach((n) => visible.add(n))
    }
  }

  // --- Quad slots ---
  const wheelNodes = QUAD_SLOTS[state.wheels]
  if (wheelNodes) {
    wheelNodes.forEach((n) => visible.add(n))
  }

  return visible
}

/** All node names involved in any paired/grouped option */
const ALL_PAIRED_NODES = new Set<string>([
  ...ALL_FRONT_BUMPER_NODES,
  ...ALL_REAR_BUMPER_NODES,
  ...ALL_MIRROR_NODES,
  ...ALL_SIDE_VENT_NODES,
])

export default function E46Model() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/models/e46.glb')
  const glassFixed = useRef(false)

  // Subscribe to all relevant store values
  const frontBumper = useBuildStore((s) => s.frontBumper)
  const frontLip = useBuildStore((s) => s.frontLip)
  const rearBumper = useBuildStore((s) => s.rearBumper)
  const spoiler = useBuildStore((s) => s.spoiler)
  const roof = useBuildStore((s) => s.roof)
  const badge = useBuildStore((s) => s.badge)
  const wheels = useBuildStore((s) => s.wheels)
  const sideVents = useBuildStore((s) => s.sideVents)
  const mirrors = useBuildStore((s) => s.mirrors)
  const headlights = useBuildStore((s) => s.headlights)
  const paintColor = useBuildStore((s) => s.paintColor)
  const secondaryColor = useBuildStore((s) => s.secondaryColor)
  const rimColor = useBuildStore((s) => s.rimColor)
  const interiorColor = useBuildStore((s) => s.interiorColor)
  const windowTint = useBuildStore((s) => s.windowTint)
  const rideHeight = useBuildStore((s) => s.rideHeight)

  const togglableNames = useMemo(() => getAllTogglableNames(), [])

  const nodeMap = useMemo(() => {
    const map = new Map<string, Object3D>()
    scene.traverse((child) => {
      if (child.name) {
        map.set(child.name, child)
      }
    })
    return map
  }, [scene])

  // --- Glass fix (once on mount) ---
  useEffect(() => {
    if (glassFixed.current) return
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
    glassFixed.current = true
  }, [scene])

  // --- Visibility logic ---
  useEffect(() => {
    const visibleSet = getVisibleNodes({
      frontBumper,
      frontLip,
      rearBumper,
      spoiler,
      roof,
      badge,
      wheels,
      sideVents,
      mirrors,
      headlights,
    })

    for (const [name, node] of nodeMap) {
      if (togglableNames.has(name) || ALL_PAIRED_NODES.has(name)) {
        node.visible = visibleSet.has(name)
      }
    }

    for (const name of ALWAYS_VISIBLE) {
      const node = nodeMap.get(name)
      if (node) node.visible = true
    }
  }, [
    frontBumper,
    frontLip,
    rearBumper,
    spoiler,
    roof,
    badge,
    wheels,
    sideVents,
    mirrors,
    headlights,
    nodeMap,
    togglableNames,
  ])

  // --- Primary paint color ---
  useEffect(() => {
    for (const nodeName of PAINT_TARGET_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = mesh.material as MeshStandardMaterial
          if (mat.name && materialMatches(mat.name, BODY_MATERIAL_NAMES)) {
            const cloned = mat.clone()
            cloned.color.set(paintColor)
            mesh.material = cloned
          }
        }
      })
    }
  }, [paintColor, nodeMap])

  // --- Secondary body color (trim / accents) ---
  useEffect(() => {
    for (const nodeName of SECONDARY_COLOR_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = (mesh.material as MeshStandardMaterial).clone()
          mat.color.set(secondaryColor)
          mesh.material = mat
        }
      })
    }
  }, [secondaryColor, nodeMap])

  // --- Interior trim color ---
  useEffect(() => {
    for (const nodeName of INTERIOR_TRIM_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = (mesh.material as MeshStandardMaterial).clone()
          mat.color.set(interiorColor)
          mesh.material = mat
        }
      })
    }
  }, [interiorColor, nodeMap])

  // --- Rim color ---
  useEffect(() => {
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
              cloned.color.set(rimColor)
              mesh.material = cloned
            }
          }
        })
      }
    }
  }, [rimColor, nodeMap])

  // --- Window tint ---
  useEffect(() => {
    const tint = TINT_LEVELS[windowTint] ?? TINT_LEVELS['none']

    for (const nodeName of WINDOW_TINT_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if (
          (child as Mesh).isMesh &&
          (child as Mesh).material &&
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
  }, [windowTint, nodeMap])

  // --- Ride height ---
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.y = rideHeight
    }
  }, [rideHeight])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/e46.glb')