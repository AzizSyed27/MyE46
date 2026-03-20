export interface CameraAngle {
  position: [number, number, number]
  target: [number, number, number]
  duration: number
}

/**
 * Camera angles per slot category.
 * position = where the camera sits
 * target = where the camera looks
 * duration = transition time in seconds
 */
export const CAMERA_ANGLES: Record<string, CameraAngle> = {
  // Default hero shot — used on load and after presets
  default: {
    position: [4, 2, 5],
    target: [0, 0.5, 0],
    duration: 1.5,
  },

  // Front bumper / front lip — front 3/4 low angle
  frontBumper: {
    position: [1.0, 1.0, 4.5],
    target: [0, 0.2, 0.8],
    duration: 1.2,
  },
  frontLip: {
    position: [2.5, 0.6, 3.0],
    target: [0, 0.0, 1.0],
    duration: 1.2,
  },

  // Rear bumper / spoiler / badge — rear 3/4
  rearBumper: {
    position: [-1.5, 1.0, -4.5],
    target: [0, 0.3, -0.8],
    duration: 1.2,
  },
  spoiler: {
    position: [-3.0, 1.8, -3.0],
    target: [0, 0.6, -0.5],
    duration: 1.2,
  },
  badge: {
    position: [-0.1, 1.0, -4.0],
    target: [0, 0.4, -1.0],
    duration: 1.2,
  },

  // Wheels / ride height / calipers — low sweep at wheel level
  wheels: {
    position: [3.5, 0.5, 2.5],
    target: [0, 0.1, 0],
    duration: 1.2,
  },
  rideHeight: {
    position: [4.0, 0.4, 2.0],
    target: [0, 0.0, 0],
    duration: 1.0,
  },
  caliperColor: {
    position: [2.5, 0.4, 2.8],
    target: [0.5, 0.1, 0.5],
    duration: 1.2,
  },
  rimColor: {
    position: [3.5, 0.5, 2.5],
    target: [0, 0.1, 0],
    duration: 1.2,
  },

  // Mirrors / side vents — side profile
  mirrors: {
    position: [4.0, 1.2, 0.5],
    target: [0, 0.5, 0],
    duration: 1.2,
  },
  sideVents: {
    position: [3.8, 0.8, 1.0],
    target: [0.5, 0.3, 0.5],
    duration: 1.2,
  },

  // Roof — elevated high angle
  roof: {
    position: [2.0, 4.0, 2.0],
    target: [0, 0.5, 0],
    duration: 1.2,
  },

  // Interior — close shot through window
  interiorColor: {
    position: [2.2, 1.2, 0.8],
    target: [0, 0.6, 0],
    duration: 1.2,
  },

  // Window tint — side angle to see glass
  windowTint: {
    position: [3.5, 1.4, 1.5],
    target: [0, 0.6, 0],
    duration: 1.2,
  },

  // Headlights — front close-up, slightly low
  headlights: {
    position: [2.5, 0.8, 3.5],
    target: [0, 0.4, 1.0],
    duration: 1.2,
  },

  // Body colors — hero 3/4 showing full body
  paintColor: {
    position: [4.5, 2.0, 4.5],
    target: [0, 0.4, 0],
    duration: 1.4,
  },
  secondaryColor: {
    position: [4.0, 1.5, 4.0],
    target: [0, 0.3, 0],
    duration: 1.4,
  },

  // Preset applied — cinematic hero sweep
  preset: {
    position: [5.0, 2.2, 4.5],
    target: [0, 0.4, 0],
    duration: 1.8,
  },
}