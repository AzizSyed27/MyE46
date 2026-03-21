import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BuildConfig } from '../types'
import mods from '../data/mods.json'

/** Default values for a fresh build */
export const DEFAULT_CONFIG: Omit<BuildConfig, 'id' | 'name' | 'notes' | 'createdAt' | 'updatedAt'> = {
  paintColor: '#a8a8a8',
  paintFinish: 'metallic',
  secondaryColor: '#1a1a1a',
  rimColor: '#a8a8a8',
  caliperColor: '#1a1a1a',
  interiorColor: '#1a1a1a',
  frontBumper: 'front_bumper_stock',
  frontLip: 'none',
  rearBumper: 'rear_bumper_mtech2_single',
  wheels: 'rim_bbs_chr',
  headlights: 'stock',
  sideVents: 'none',
  mirrors: 'stock',
  spoiler: 'spoiler_stock',
  roof: 'roof',
  badge: 'badge_330i',
  windowTint: 'none',
  rideHeight: 0,
}

type SlotKey = keyof typeof DEFAULT_CONFIG

interface BuildStore {
  // Current build state
  paintColor: string
  paintFinish: string
  secondaryColor: string
  rimColor: string
  caliperColor: string
  interiorColor: string
  frontBumper: string
  frontLip: string
  rearBumper: string
  wheels: string
  headlights: string
  sideVents: string
  mirrors: string
  spoiler: string
  roof: string
  badge: string
  windowTint: string
  rideHeight: number

  // Camera tracking
  lastChangedSlot: string | null

  // Viewer preferences
  environment: string

  // Saved builds
  savedBuilds: BuildConfig[]

  // Actions — individual slot setters
  setSlot: (key: SlotKey, value: string | number) => void

  // Actions — preset / bulk apply (used by presets + future AI co-pilot)
  applyPreset: (partial: Partial<Omit<BuildConfig, 'id' | 'name' | 'notes' | 'createdAt' | 'updatedAt'>>) => void

  // Actions — reset to defaults
  resetBuild: () => void

  // Actions — camera tracking
  clearLastChangedSlot: () => void

  // Actions — viewer preferences
  setEnvironment: (id: string) => void

  // Actions — saved build CRUD
  saveBuild: (name: string, notes?: string) => string
  deleteBuild: (id: string) => void
  loadBuild: (id: string) => void
  updateBuild: (id: string, updates: Partial<Pick<BuildConfig, 'name' | 'notes'>>) => void

  // Computed
  getTotalPrice: () => number
}

/** Look up the price of a part by slot and id */
function getPartPrice(slot: string, id: string): number {
  const catalog = mods[slot as keyof typeof mods] as Array<{ id: string; price: number }> | undefined
  if (!catalog) return 0
  const part = catalog.find((p) => p.id === id)
  return part?.price ?? 0
}

/** Generate a simple unique id */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const useBuildStore = create<BuildStore>()(
  persist(
    (set, get) => ({
      // Initial state from defaults
      ...DEFAULT_CONFIG,

      lastChangedSlot: null,

      environment: 'studio',

      savedBuilds: [],

      setSlot: (key, value) => {
        set({ [key]: value, lastChangedSlot: key })
      },

      applyPreset: (partial) => {
        set({ ...partial, lastChangedSlot: 'preset' })
      },

      resetBuild: () => {
        set({ ...DEFAULT_CONFIG, lastChangedSlot: 'preset' })
      },

      clearLastChangedSlot: () => {
        set({ lastChangedSlot: null })
      },

      setEnvironment: (id) => {
        set({ environment: id })
      },

      saveBuild: (name, notes = '') => {
        const state = get()
        const now = new Date().toISOString()
        const id = generateId()

        const build: BuildConfig = {
          id,
          name,
          notes,
          paintColor: state.paintColor,
          paintFinish: state.paintFinish,
          secondaryColor: state.secondaryColor,
          rimColor: state.rimColor,
          caliperColor: state.caliperColor,
          interiorColor: state.interiorColor,
          frontBumper: state.frontBumper,
          frontLip: state.frontLip,
          rearBumper: state.rearBumper,
          wheels: state.wheels,
          headlights: state.headlights,
          sideVents: state.sideVents,
          mirrors: state.mirrors,
          spoiler: state.spoiler,
          roof: state.roof,
          badge: state.badge,
          windowTint: state.windowTint,
          rideHeight: state.rideHeight,
          createdAt: now,
          updatedAt: now,
        }

        set({ savedBuilds: [...state.savedBuilds, build] })
        return id
      },

      deleteBuild: (id) => {
        set({ savedBuilds: get().savedBuilds.filter((b) => b.id !== id) })
      },

      loadBuild: (id) => {
        const build = get().savedBuilds.find((b) => b.id === id)
        if (!build) return

        set({
          paintColor: build.paintColor,
          secondaryColor: build.secondaryColor,
          rimColor: build.rimColor,
          caliperColor: build.caliperColor,
          interiorColor: build.interiorColor,
          frontBumper: build.frontBumper,
          frontLip: build.frontLip,
          rearBumper: build.rearBumper,
          wheels: build.wheels,
          headlights: build.headlights,
          sideVents: build.sideVents,
          mirrors: build.mirrors,
          spoiler: build.spoiler,
          roof: build.roof,
          badge: build.badge,
          windowTint: build.windowTint,
          rideHeight: build.rideHeight,
          lastChangedSlot: 'preset',
        })
      },

      updateBuild: (id, updates) => {
        set({
          savedBuilds: get().savedBuilds.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          ),
        })
      },

      getTotalPrice: () => {
        const state = get()
        return (
          getPartPrice('frontBumper', state.frontBumper) +
          getPartPrice('frontLip', state.frontLip) +
          getPartPrice('rearBumper', state.rearBumper) +
          getPartPrice('wheels', state.wheels) +
          getPartPrice('sideVents', state.sideVents) +
          getPartPrice('headlights', state.headlights) +
          getPartPrice('mirrors', state.mirrors) +
          getPartPrice('spoiler', state.spoiler) +
          getPartPrice('roof', state.roof) +
          getPartPrice('badge', state.badge) +
          getPartPrice('windowTint', state.windowTint) + 
          getPartPrice('paintFinish', state.paintFinish) 
        )
      },
    }),
    {
      name: 'mye46-build-storage',
      partialize: (state) => {
        // Exclude lastChangedSlot from persistence — it's ephemeral
        // Keep environment — it's a viewer preference
        const { lastChangedSlot, ...rest } = state
        return rest
      },
    }
  )
)