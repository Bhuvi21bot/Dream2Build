export type Point = { x: number; y: number }

export type RoomType = 'bedroom' | 'kitchen' | 'living' | 'bathroom' | 'balcony' | 'dining' | 'corridor'
export type WallMaterial = 'white-paint' | 'concrete' | 'brick' | 'wood-panel'
export type FloorMaterial = 'hardwood' | 'tiles' | 'marble' | 'carpet' | 'concrete'
export type DoorMaterial = 'wood' | 'glass' | 'metal'
export type FurnitureType = 'sofa' | 'bed' | 'dining-table' | 'chair' | 'desk' | 'wardrobe' | 'kitchen-counter' | 'toilet' | 'bathtub' | 'stairs'

export type Wall = {
  id: string
  start: Point
  end: Point
  thickness: number
  height: number
  material: WallMaterial
}

export type Room = {
  id: string
  name: string
  type: RoomType
  points: Point[]
  floorMaterial: FloorMaterial
  color: string
}

export type Door = {
  id: string
  wallId: string
  position: number // 0-1 along the wall
  width: number
  swingDirection: 'left' | 'right'
  material: DoorMaterial
}

export type Window = {
  id: string
  wallId: string
  position: number // 0-1 along wall
  width: number
  height: number
  sillHeight: number
}

export type Furniture = {
  id: string
  type: FurnitureType
  roomId?: string
  position: Point
  rotation: number
  width: number
  depth: number
  color: string
}

export type Tool = 'select' | 'wall' | 'room' | 'door' | 'window' | 'furniture' | 'stairs' | 'delete'

export type FloorPlanState = {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  furniture: Furniture[]
  selectedId: string | null
  activeTool: Tool
  gridSize: number
  snapToGrid: boolean
  showGrid: boolean
  scale: number // px per cm
  view: 'split' | '2d' | '3d'
  cameraMode: 'orbit' | 'firstperson' | 'top' | 'dollhouse'

  addWall: (wall: Wall) => void
  updateWall: (id: string, wall: Partial<Wall>) => void
  deleteWall: (id: string) => void

  addRoom: (room: Room) => void
  updateRoom: (id: string, room: Partial<Room>) => void
  deleteRoom: (id: string) => void

  addDoor: (door: Door) => void
  updateDoor: (id: string, door: Partial<Door>) => void
  deleteDoor: (id: string) => void

  addWindow: (window: Window) => void
  updateWindow: (id: string, window: Partial<Window>) => void
  deleteWindow: (id: string) => void

  addFurniture: (furniture: Furniture) => void
  updateFurniture: (id: string, furniture: Partial<Furniture>) => void
  deleteFurniture: (id: string) => void

  setActiveTool: (tool: Tool) => void
  setSelectedId: (id: string | null) => void
  setView: (view: 'split' | '2d' | '3d') => void
  setCameraMode: (mode: 'orbit' | 'firstperson' | 'top' | 'dollhouse') => void
  toggleGrid: () => void
  toggleSnap: () => void
  setScale: (scale: number) => void

  clearAll: () => void
  loadSamplePlan: () => void
}
