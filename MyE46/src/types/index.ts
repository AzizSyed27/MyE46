export interface BuildConfig {
    id: string
    name: string
    paintColor: string
    rimColor: string
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
    rideHeight: number
    notes: string
    createdAt: string
    updatedAt: string
}

export interface PartDefinition {
    id: string
    name: string
    description?: string
    price: number
    styleTags: string[]
    nodes?: Record<string, string>
}

export interface StylePreset {
    id: string
    name: string
    description: string
    partialConfig: Partial<Omit<BuildConfig, 'id' | 'name' | 'notes' | 'createdAt' | 'updatedAt'>>
}