import { useEffect, useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, Object3D } from 'three'
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
  CALIPER_NODES,
  INTERIOR_TRIM_NODES,
  WINDOW_TINT_NODES,
  TINT_LEVELS,
  RIDE_HEIGHT_FIXED_NODES,
  BODY_MATERIAL_NAMES,
  RIM_MATERIAL_NAMES,
  PAINT_FINISH_PROPERTIES
} from '../../data/slots'

// ─── Module-level storage for baked Y positions ─────────────────────
// Persists across component mount/unmount cycles within the same session.
// Only captured once when the GLB is first loaded fresh.
const _bakedYPositions = new Map<string, number>()
let _positionsCaptured = false
// ────────────────────────────────────────────────────────────────────

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
  const frontKey = `frontBumper.${state.frontBumper}`
  const frontNodes = PAIRED_SLOTS[frontKey]
  if (frontNodes) {
    frontNodes.forEach((n) => visible.add(n))
  }

  const rearKey = `rearBumper.${state.rearBumper}`
  const rearNodes = PAIRED_SLOTS[rearKey]
  if (rearNodes) {
    rearNodes.forEach((n) => visible.add(n))
  }

  const mirrorKey = `mirrors.${state.mirrors}`
  const mirrorNodes = PAIRED_SLOTS[mirrorKey]
  if (mirrorNodes) {
    mirrorNodes.forEach((n) => visible.add(n))
  }

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
  const caliperColor = useBuildStore((s) => s.caliperColor)
  const interiorColor = useBuildStore((s) => s.interiorColor)
  const windowTint = useBuildStore((s) => s.windowTint)
  const rideHeight = useBuildStore((s) => s.rideHeight)
  const paintFinish = useBuildStore((s) => s.paintFinish)

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

  // --- Capture baked Y positions (once per session, before any effects) ---
  // This runs synchronously in useMemo so it executes before useEffect hooks.
  // On full page reload: GLB is fresh, positions are baked defaults → captured.
  // On SPA remount: _positionsCaptured is still true → skipped, originals intact.
  useMemo(() => {
    if (_positionsCaptured) return
    for (const nodeName of RIDE_HEIGHT_FIXED_NODES) {
      const node = nodeMap.get(nodeName)
      if (node) {
        _bakedYPositions.set(nodeName, node.position.y)
      }
    }
    _positionsCaptured = true
  }, [nodeMap])

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
  // --- Primary paint color + finish ---
  useEffect(() => {
    const finish = PAINT_FINISH_PROPERTIES[paintFinish] ?? PAINT_FINISH_PROPERTIES['metallic']

    for (const nodeName of PAINT_TARGET_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = mesh.material as MeshStandardMaterial
          if (mat.name && materialMatches(mat.name, BODY_MATERIAL_NAMES)) {
            // Create a MeshPhysicalMaterial for clearcoat support
            const physical = new MeshPhysicalMaterial({
              color: paintColor,
              roughness: finish.roughness,
              metalness: finish.metalness,
              clearcoat: finish.clearcoat,
              clearcoatRoughness: finish.clearcoatRoughness,
              envMapIntensity: mat.envMapIntensity,
            })
            // Preserve the material name for future matching
            physical.name = mat.name
            mesh.material = physical
          }
        }
      })
    }
  }, [paintColor, paintFinish, nodeMap])

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

  // --- Caliper color ---
  useEffect(() => {
    for (const nodeName of CALIPER_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      node.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const mesh = child as Mesh
          const mat = (mesh.material as MeshStandardMaterial).clone()
          mat.color.set(caliperColor)
          mesh.material = mat
        }
      })
    }
  }, [caliperColor, nodeMap])

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
  // Drop the entire group, then compensate fixed nodes using their
  // baked Y positions (captured at module level on first GLB load).
  useEffect(() => {
    if (!groupRef.current) return

    // 1. Drop the entire car
    groupRef.current.position.y = rideHeight

    // 2. Compensate fixed nodes so they stay planted at ground level
    for (const nodeName of RIDE_HEIGHT_FIXED_NODES) {
      const node = nodeMap.get(nodeName)
      if (!node) continue
      const bakedY = _bakedYPositions.get(nodeName) ?? 0
      node.position.y = bakedY - rideHeight
    }
  }, [rideHeight, nodeMap])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/e46.glb')