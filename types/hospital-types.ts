export interface Room {
  id: string
  name: string
  type: string
  floor: number
  points: [number, number][] // Polygon points
  center: [number, number] // Center point for labels and navigation
  icon?: string
}

export interface Hallway {
  id: string
  floor: number
  points: [number, number][] // Polyline points
}

export interface NavigationPoint {
  id: string
  name: string
  floor: number
  position: [number, number]
  connections: string[] // IDs of connected navigation points
  type: "room" | "hallway" | "elevator" | "stairs" | "entrance" | "exit"
}
