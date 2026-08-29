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
  textureScale?: number
  textureRotation?: number
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

export type Tool = 'select' | 'wall' | 'room' | 'polygon-room' | 'door' | 'window' | 'furniture' | 'stairs' | 'delete'

// A snapshot of mutable state for undo/redo
export type HistorySnapshot = {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  furniture: Furniture[]
}

export type FloorPlanState = {
  walls: Wall[]
  rooms: Room[]
  doors: Door[]
  windows: Window[]
  furniture: Furniture[]
  selectedId: string | null
  activeTool: Tool
  selectedFurnitureType: FurnitureType
  selectedRoomType: RoomType
  selectedRoomShape: 'square' | 'l-shape' | 'u-shape' | 't-shape' | 'octagonal'
  gridSize: number
  snapToGrid: boolean
  showGrid: boolean
  scale: number // px per cm
  view: 'split' | '2d' | '3d'
  cameraMode: 'orbit' | 'firstperson' | 'top' | 'dollhouse'

  // Polygon room in-progress vertices
  polygonPoints: Point[]

  // Undo/Redo history
  history: HistorySnapshot[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean

  setSelectedFurnitureType: (type: FurnitureType) => void
  setSelectedRoomType: (type: RoomType) => void
  setSelectedRoomShape: (shape: 'square' | 'l-shape' | 'u-shape' | 't-shape' | 'octagonal') => void

  addWall: (wall: Wall) => void
  updateWall: (id: string, wall: Partial<Wall>, saveHistory?: boolean) => void
  deleteWall: (id: string) => void

  addRoom: (room: Room) => void
  updateRoom: (id: string, room: Partial<Room>, saveHistory?: boolean) => void
  deleteRoom: (id: string) => void

  addDoor: (door: Door) => void
  updateDoor: (id: string, door: Partial<Door>, saveHistory?: boolean) => void
  deleteDoor: (id: string) => void

  addWindow: (window: Window) => void
  updateWindow: (id: string, window: Partial<Window>, saveHistory?: boolean) => void
  deleteWindow: (id: string) => void

  addFurniture: (furniture: Furniture) => void
  updateFurniture: (id: string, furniture: Partial<Furniture>, saveHistory?: boolean) => void
  deleteFurniture: (id: string) => void

  setActiveTool: (tool: Tool) => void
  setSelectedId: (id: string | null) => void
  setView: (view: 'split' | '2d' | '3d') => void
  setCameraMode: (mode: 'orbit' | 'firstperson' | 'top' | 'dollhouse') => void
  toggleGrid: () => void
  toggleSnap: () => void
  setScale: (scale: number) => void

  // Polygon room drawing
  addPolygonPoint: (pt: Point) => void
  closePolygon: () => void
  cancelPolygon: () => void

  // History
  undo: () => void
  redo: () => void
  pushHistory: () => void

  clearAll: () => void
  loadSamplePlan: (templateId?: string) => void
}
