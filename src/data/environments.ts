export interface LightConfig {
  type: 'ambient' | 'directional' | 'spot' | 'point'
  position?: [number, number, number]
  intensity: number
  color: string
  castShadow?: boolean
  angle?: number
  penumbra?: number
  distance?: number
  target?: [number, number, number]
}

export interface EnvironmentPreset {
  id: string
  name: string
  description: string
  backgroundColor: string
  hdri: 'city' | 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'park' | 'lobby'
  hdriIntensity: number
  lights: LightConfig[]
  shadowOpacity: number
  shadowBlur: number
}

export const ENVIRONMENT_PRESETS: Record<string, EnvironmentPreset> = {
  studio: {
    id: 'studio',
    name: 'Studio',
    description: 'Clean, balanced lighting for detailed inspection',
    backgroundColor: '#f5f0e8',
    hdri: 'city',
    hdriIntensity: 0.8,
    lights: [
      {
        type: 'ambient',
        intensity: 0.4,
        color: '#ffffff',
      },
      {
        type: 'directional',
        position: [5, 8, 5],
        intensity: 1.2,
        color: '#ffffff',
        castShadow: true,
      },
      {
        type: 'directional',
        position: [-3, 4, -4],
        intensity: 0.4,
        color: '#ffffff',
      },
    ],
    shadowOpacity: 0.4,
    shadowBlur: 2.5,
  },

  outdoor: {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Golden hour warmth with natural sunlight',
    backgroundColor: '#c8d8e8',
    hdri: 'sunset',
    hdriIntensity: 1.0,
    lights: [
      {
        type: 'ambient',
        intensity: 0.5,
        color: '#ffeedd',
      },
      {
        type: 'directional',
        position: [8, 6, 3],
        intensity: 2.0,
        color: '#ffd4a0',
        castShadow: true,
      },
      {
        type: 'directional',
        position: [-4, 3, -2],
        intensity: 0.3,
        color: '#a0c0ff',
      },
    ],
    shadowOpacity: 0.5,
    shadowBlur: 3.5,
  },

  night: {
    id: 'night',
    name: 'Night',
    description: 'Dramatic contrast with moody atmosphere',
    backgroundColor: '#080810',
    hdri: 'night',
    hdriIntensity: 0.3,
    lights: [
      {
        type: 'ambient',
        intensity: 0.08,
        color: '#1a1a2e',
      },
      {
        type: 'spot',
        position: [4, 6, 3],
        intensity: 3.0,
        color: '#ffeedd',
        castShadow: true,
        angle: 0.5,
        penumbra: 0.8,
        distance: 20,
      },
      {
        type: 'spot',
        position: [-3, 5, -2],
        intensity: 1.5,
        color: '#aabbff',
        angle: 0.6,
        penumbra: 0.9,
        distance: 18,
      },
      {
        type: 'point',
        position: [0, 0.3, 3],
        intensity: 0.5,
        color: '#ff6633',
        distance: 6,
      },
    ],
    shadowOpacity: 0.7,
    shadowBlur: 1.5,
  },

  showroom: {
    id: 'showroom',
    name: 'Showroom',
    description: 'Premium car photography with sharp highlights',
    backgroundColor: '#1a1a1a',
    hdri: 'warehouse',
    hdriIntensity: 0.4,
    lights: [
      {
        type: 'ambient',
        intensity: 0.15,
        color: '#ffffff',
      },
      {
        type: 'directional',
        position: [0, 10, 0],
        intensity: 2.5,
        color: '#ffffff',
        castShadow: true,
      },
      {
        type: 'directional',
        position: [5, 3, 5],
        intensity: 0.6,
        color: '#ffffff',
      },
      {
        type: 'directional',
        position: [-5, 3, -5],
        intensity: 0.6,
        color: '#ffffff',
      },
    ],
    shadowOpacity: 0.6,
    shadowBlur: 2.0,
  },
}

/** Ordered list for UI display */
export const ENVIRONMENT_LIST: EnvironmentPreset[] = [
  ENVIRONMENT_PRESETS.studio,
  ENVIRONMENT_PRESETS.outdoor,
  ENVIRONMENT_PRESETS.night,
  ENVIRONMENT_PRESETS.showroom,
]