/**
 * SINGLE_SLOTS — one node per option, toggle visibility by matching name.
 * Key = slot name, Value = array of all possible node names for that slot.
 */
export const SINGLE_SLOTS: Record<string, string[]> = {

    frontLip: ['front_lip'],
    spoiler: ['spoiler_stock', 'spoiler_roof', 'spoiler_ducktail'],
    roof: ['roof', 'roof_sun'],
    badge: [
        'badge_318i',
        'badge_320d',
        'badge_320i',
        'badge_325i',
        'badge_325xi',
        'badge_330d',
        'badge_330dx',
        'badge_330i',
        'badge_330xi',
        'badge_m3',
    ],
}

/**
 * PAIRED_SLOTS — each option maps to exactly 2 nodes that toggle together.
 * Key format: "slotName.optionId"
 */
export const PAIRED_SLOTS: Record<string, string[]> = {
    // frontBumper options
    'frontBumper.front_bumper_stock': ['front_bumper_stock', 'front_bumper_stock_trim'],
    'frontBumper.front_bumper_mtech1': ['front_bumper_mtech1', 'front_bumper_mtech1_trim'],
    'frontBumper.front_bumper_zhp': ['front_bumper_zhp', 'front_bumper_zhp_trim'],
    'frontBumper.front_bumper_m3': ['front_bumper_m3', 'front_bumper_m3_trim'],

    // rearBumper options
    'rearBumper.rear_bumper_none': ['rear_bumper_none', 'rear_bumper_none_trim'],
    'rearBumper.rear_bumper_mtech2_single': [
        'rear_bumper_mtech2',
        'rear_bumper_mtech2_single_exhaust',
    ],
    'rearBumper.rear_bumper_mtech2_dual': [
        'rear_bumper_mtech2',
        'rear_bumper_mtech2_dual_exhaust',
    ],
    'rearBumper.rear_bumper_m3': ['rear_bumper_m3'],

    // sideVents options
    'sideVents.m_side_vents': [
        'front_right_m_side_vent',
        'front_left_m_side_vent',
    ],

    // mirrors options
    'mirrors.stock': ['left_mirror_stock', 'right_mirror_stock'],
    'mirrors.m3': ['left_mirror_m3', 'right_mirror_m3'],
}

/**
 * QUAD_SLOTS — each wheel style maps to 4 corner nodes.
 */
export const QUAD_SLOTS: Record<string, string[]> = {
    rim_bbs_chr: [
        'rim_bbs_chr_front_left',
        'rim_bbs_chr_front_right',
        'rim_bbs_chr_rear_left',
        'rim_bbs_chr_rear_right',
    ],
    rim_style_37: [
        'rim_style_37_front_left',
        'rim_style_37_front_right',
        'rim_style_37_rear_left',
        'rim_style_37_rear_right',
    ],
    rim_style_119: [
        'rim_style_119_front_left',
        'rim_style_119_front_right',
        'rim_style_119_rear_left',
        'rim_style_119_rear_right',
    ],
    rim_style_135: [
        'rim_style_135_front_left',
        'rim_style_135_front_right',
        'rim_style_135_rear_left',
        'rim_style_135_rear_right',
    ],
    rim_style_166: [
        'rim_style_166_front_left',
        'rim_style_166_front_right',
        'rim_style_166_rear_left',
        'rim_style_166_rear_right',
    ],
}

/**
 * ALL_FRONT_BUMPER_NODES — every node involved in any front bumper option.
 * Used to hide all before showing the selected option.
 */
export const ALL_FRONT_BUMPER_NODES: string[] = [
  'front_bumper_stock',
  'front_bumper_stock_trim',
  'front_bumper_mtech1',
  'front_bumper_mtech1_trim',
  'front_bumper_zhp',
  'front_bumper_zhp_trim',
  'front_bumper_m3',
  'front_bumper_m3_trim',
]

/**
 * ALL_REAR_BUMPER_NODES — every node involved in any rear bumper option.
 * Used to hide all before showing the selected option.
 */
export const ALL_REAR_BUMPER_NODES: string[] = [
    'rear_bumper_none',
    'rear_bumper_mtech2',
    'rear_bumper_mtech2_single_exhaust',
    'rear_bumper_mtech2_dual_exhaust',
    'rear_bumper_m3',
]

/**
 * ALL_MIRROR_NODES — every node involved in any mirror option.
 */
export const ALL_MIRROR_NODES: string[] = [
    'left_mirror_stock',
    'right_mirror_stock',
    'left_mirror_m3',
    'right_mirror_m3',
]

/**
 * ALL_SIDE_VENT_NODES — every node involved in side vents.
 */
export const ALL_SIDE_VENT_NODES: string[] = [
    'front_right_m_side_vent',
    'front_left_m_side_vent',
]

/**
 * ALWAYS_VISIBLE — nodes that are never toggled off.
 */
export const ALWAYS_VISIBLE: string[] = [
    'dash',
    'e46racing_diff_46',
    'front_left_door',
    'front_left_fender',
    'front_left_seat',
    'front_left_trim',
    'front_left_window',
    'front_right_door',
    'front_right_door_trim',
    'front_right_seat',
    'front_right_window',
    'front_window',
    'hood',
    'kidney_grills',
    'left_fender',
    'left_side_turn_signal',
    'quarter_panel',
    'radiator',
    'rear_left_door',
    'rear_left_taillight',
    'rear_left_trim',
    'rear_left_window',
    'rear_right_door',
    'rear_right_taillight',
    'rear_right_trim',
    'rear_right_window',
    'rear_seat',
    'rear_window',
    'right_side_turn_signal',
    'trunk',
    'tire_front_left',
    'tire_front_right',
    'tire_rear_left',
    'tire_rear_right',
    'left_headlight_projectors',
    'right_headlight_projectors',
]

/**
 * PAINT_TARGET_NODES — every node that receives primary body paint color.
 */
export const PAINT_TARGET_NODES: string[] = [
    'hood',
    'trunk',
    'roof',
    'roof_sun',
    'front_left_door',
    'front_right_door',
    'rear_left_door',
    'rear_right_door',
    'front_left_fender',
    'left_fender',
    'quarter_panel',
    'front_bumper_stock',
    'front_bumper_mtech1',
    'front_bumper_zhp',
    'front_bumper_m3',
    'rear_bumper_none',
    'rear_bumper_mtech2',
    'rear_bumper_mtech2_single_exhaust',
    'rear_bumper_mtech2_dual_exhaust',
    'rear_bumper_m3',
    'left_mirror_stock',
    'right_mirror_stock',
    'left_mirror_m3',
    'right_mirror_m3',
    'left_headlight_under',
    'right_headlight_under',
]

/**
 * SECONDARY_COLOR_NODES — exterior trim/accent nodes that receive
 * the secondary body color (lips, trim pieces, grills, spoilers).
 */
export const SECONDARY_COLOR_NODES: string[] = [
    'front_lip',
    'front_bumper_stock_trim',
    'front_bumper_mtech1_trim',
    'front_bumper_zhp_trim',
    'front_bumper_m3_trim',
    'rear_bumper_mtech2_single_exhaust',
    'rear_bumper_mtech2_dual_exhaust',
    'rear_bumper_none_trim',
    'exterior_trim',
    'spoiler_ducktail',
    'spoiler_roof',
    'spoiler_stock',
    'kidney_grills',
]

/**
 * INTERIOR_TRIM_NODES — cabin surfaces that receive interior trim color.
 */
export const INTERIOR_TRIM_NODES: string[] = [
    'dash',
    'front_left_seat',
    'front_left_trim',
    'front_right_seat',
    'front_right_door_trim',
    'rear_left_trim',
    'rear_right_trim',
    'rear_seat',
    'inner_trim',
]

/**
 * WINDOW_TINT_NODES — all glass panels that receive window tint.
 */
export const WINDOW_TINT_NODES: string[] = [
    'front_left_window',
    'front_right_window',
    'front_window',
    'rear_left_window',
    'rear_right_window',
    'rear_window',
]

/**
 * TINT_LEVELS — maps tint ID to Three.js material values.
 * VLT = Visible Light Transmission. Lower VLT = darker tint.
 * "none" uses the base glass fix values (clear).
 */
export const TINT_LEVELS: Record<string, { opacity: number; color: string }> = {
    none:  { opacity: 0.18, color: '#cccccc' },
    '70':  { opacity: 0.28, color: '#555555' },
    '50':  { opacity: 0.38, color: '#333333' },
    '35':  { opacity: 0.50, color: '#222222' },
    '15':  { opacity: 0.65, color: '#111111' },
    '5':   { opacity: 0.78, color: '#0a0a0a' },
}

/**
 * Material name substrings used to identify body paint materials.
 */
export const BODY_MATERIAL_NAMES: string[] = [
    'e46racing_body',
    'e46racing_body_2',
    'e46racing_body_parts',
]

/**
 * Material name substrings used to identify rim/wheel materials.
 */
export const RIM_MATERIAL_NAMES: string[] = [
    'e46racing_bbs',
    'e46racing_wheel',
    'e46racing_wheel2',
    'e46racing_wheel3',
    'e46racing_wheel_5',
]