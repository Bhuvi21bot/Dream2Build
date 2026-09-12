export type Point = { x: number; y: number }

export type RoomType = 'bedroom' | 'kitchen' | 'living' | 'bathroom' | 'balcony' | 'dining' | 'corridor'
export type WallMaterial = 'white-paint' | 'concrete' | 'brick' | 'wood-panel'
export type FloorMaterial = 'hardwood' | 'tiles' | 'marble' | 'carpet' | 'concrete'
export type DoorMaterial = 'wood' | 'glass' | 'metal'
export type FurnitureStyle = 'modern' | 'classic' | 'minimalist' | 'rustic'
export type FurnitureCategory = 'seating' | 'sleeping' | 'tables' | 'storage' | 'kitchen' | 'bathroom' | 'decor' | 'outdoor' | 'structural'

export type FurnitureType =
  | 'sofa' | 'armchair' | 'loveseat' | 'bench' | 'ottoman' | 'chair'
  | 'bed' | 'nightstand'
  | 'dining-table' | 'desk'
  | 'wardrobe' | 'bookshelf' | 'tv-console' | 'cabinet'
  | 'kitchen-counter'
  | 'toilet' | 'bathtub'
  | 'plant' | 'lamp' | 'mirror'
  | 'outdoor-tree' | 'fence'
  | 'stairs'

export type Wall = {
  id: string
  start: Point
  end: Point
  thickness: number
  height: number
  material: WallMaterial
  paintColor?: string
}

export type Room = {
  id: string
  name: string
  type: RoomType
  points: Point[]
  floorMaterial: FloorMaterial
  ceilingMaterial?: WallMaterial
  color: string
  textureScale?: number
  textureRotation?: number
}

export type Door = {
  id: string
  wallId: string
  position: number
  width: number
  swingDirection: 'left' | 'right'
  material: DoorMaterial
}

export type Window = {
  id: string
  wallId: string
  position: number
  width: number
  height: number
  sillHeight: number
  curtains?: boolean
  curtainColor?: string
}

export type Furniture = {
  id: string
  type: FurnitureType
  roomId?: string
  position: Point
  rotation: number
  width: number
  depth: number
  height?: number
  color: string
  style?: FurnitureStyle
  variant?: string
}

export type Tool = 'select' | 'wall' | 'room' | 'polygon-room' | 'door' | 'window' | 'furniture' | 'stairs' | 'delete'

export type ClipboardItem = Wall | Room | Door | Window | Furniture

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
  selectedIds: string[]
  clipboard: ClipboardItem[]
  activeTool: Tool
  selectedFurnitureType: FurnitureType
  selectedFurnitureStyle: FurnitureStyle
  selectedRoomType: RoomType
  selectedRoomShape: 'square' | 'l-shape' | 'u-shape' | 't-shape' | 'octagonal'
  gridSize: number
  snapToGrid: boolean
  showGrid: boolean
  showCeilingLights: boolean
  sunTime: number
  scale: number
  view: 'split' | '2d' | '3d'
  cameraMode: 'orbit' | 'firstperson' | 'top' | 'dollhouse'
  polygonPoints: Point[]
  history: HistorySnapshot[]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean

  setSelectedFurnitureType: (type: FurnitureType) => void
  setSelectedFurnitureStyle: (style: FurnitureStyle) => void
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
  setSelectedIds: (ids: string[]) => void
  setClipboard: (items: ClipboardItem[]) => void
  setGridSize: (size: number) => void
  setSnapToGrid: (snap: boolean) => void
  setShowGrid: (show: boolean) => void
  setShowCeilingLights: (show: boolean) => void
  setSunTime: (time: number) => void
  setScale: (scale: number) => void
  setView: (view: 'split' | '2d' | '3d') => void
  setCameraMode: (mode: 'orbit' | 'firstperson' | 'top' | 'dollhouse') => void
  toggleGrid: () => void
  toggleSnap: () => void
  toggleCeilingLights: () => void

  addPolygonPoint: (pt: Point) => void
  closePolygon: () => void
  cancelPolygon: () => void

  undo: () => void
  redo: () => void
  pushHistory: () => void

  clearAll: () => void
  loadSamplePlan: (templateId?: string) => void
}