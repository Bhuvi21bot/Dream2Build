import { create } from 'zustand';
import { FloorPlanState, HistorySnapshot, Wall, Room, Door, Window, Furniture, Point } from './types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

const HISTORY_LIMIT = 50;

function snapshot(state: FloorPlanState): HistorySnapshot {
  return {
    walls: state.walls.map(w => ({ ...w, start: { ...w.start }, end: { ...w.end } })),
    rooms: state.rooms.map(r => ({ ...r, points: r.points.map(p => ({ ...p })) })),
    doors: state.doors.map(d => ({ ...d })),
    windows: state.windows.map(w => ({ ...w })),
    furniture: state.furniture.map(f => ({ ...f, position: { ...f.position } })),
  };
}

export const usePlannerStore = create<FloorPlanState>((set, get) => ({
  walls: [],
  rooms: [],
  doors: [],
  windows: [],
  furniture: [],
  selectedId: null,
  activeTool: 'select',
  selectedFurnitureType: 'sofa',
  selectedRoomType: 'living',
  selectedRoomShape: 'square',
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  scale: 1,
  view: '2d',
  cameraMode: 'orbit',
  polygonPoints: [],

  // Undo/Redo
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  pushHistory: () => set((state) => {
    const snap = snapshot(state);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(snap);
    if (newHistory.length > HISTORY_LIMIT) newHistory.shift();
    const newIndex = newHistory.length - 1;
    return { history: newHistory, historyIndex: newIndex, canUndo: true, canRedo: false };
  }),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    const newIndex = state.historyIndex - 1;
    const snap = state.history[newIndex];
    return {
      ...snap,
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: true,
    };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    const newIndex = state.historyIndex + 1;
    const snap = state.history[newIndex];
    return {
      ...snap,
      historyIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < state.history.length - 1,
    };
  }),

  setSelectedFurnitureType: (type) => set({ selectedFurnitureType: type }),
  setSelectedRoomType: (type) => set({ selectedRoomType: type }),
  setSelectedRoomShape: (shape) => set({ selectedRoomShape: shape }),

  addWall: (wall) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return { walls: [...state.walls, wall], history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
  }),
  updateWall: (id, wall, saveHistory) => set((state) => {
    if (saveHistory) {
      const snap = snapshot(state);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
      return { walls: state.walls.map(w => w.id === id ? { ...w, ...wall } : w), history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
    }
    return { walls: state.walls.map(w => w.id === id ? { ...w, ...wall } : w) };
  }),
  deleteWall: (id) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return {
      walls: state.walls.filter(w => w.id !== id),
      doors: state.doors.filter(d => d.wallId !== id),
      windows: state.windows.filter(w => w.wallId !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),

  addRoom: (room) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return { rooms: [...state.rooms, room], history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
  }),
  updateRoom: (id, room, saveHistory) => set((state) => {
    if (saveHistory) {
      const snap = snapshot(state);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
      return { rooms: state.rooms.map(r => r.id === id ? { ...r, ...room } : r), history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
    }
    return { rooms: state.rooms.map(r => r.id === id ? { ...r, ...room } : r) };
  }),
  deleteRoom: (id) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return {
      rooms: state.rooms.filter(r => r.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),

  addDoor: (door) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return { doors: [...state.doors, door], history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
  }),
  updateDoor: (id, door, saveHistory) => set((state) => {
    if (saveHistory) {
      const snap = snapshot(state);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
      return { doors: state.doors.map(d => d.id === id ? { ...d, ...door } : d), history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
    }
    return { doors: state.doors.map(d => d.id === id ? { ...d, ...door } : d) };
  }),
  deleteDoor: (id) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return {
      doors: state.doors.filter(d => d.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),

  addWindow: (window) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return { windows: [...state.windows, window], history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
  }),
  updateWindow: (id, window, saveHistory) => set((state) => {
    if (saveHistory) {
      const snap = snapshot(state);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
      return { windows: state.windows.map(w => w.id === id ? { ...w, ...window } : w), history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
    }
    return { windows: state.windows.map(w => w.id === id ? { ...w, ...window } : w) };
  }),
  deleteWindow: (id) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return {
      windows: state.windows.filter(w => w.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),

  addFurniture: (furniture) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return { furniture: [...state.furniture, furniture], history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
  }),
  updateFurniture: (id, furniture, saveHistory) => set((state) => {
    if (saveHistory) {
      const snap = snapshot(state);
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
      return { furniture: state.furniture.map(f => f.id === id ? { ...f, ...furniture } : f), history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false };
    }
    return { furniture: state.furniture.map(f => f.id === id ? { ...f, ...furniture } : f) };
  }),
  deleteFurniture: (id) => set((state) => {
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    return {
      furniture: state.furniture.filter(f => f.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),

  setActiveTool: (tool) => set({ activeTool: tool, selectedId: null, polygonPoints: [] }),
  setSelectedId: (id) => set({ selectedId: id, activeTool: 'select' }),
  setView: (view) => set({ view }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setScale: (scale) => set({ scale }),

  // Polygon room drawing
  addPolygonPoint: (pt: Point) => set((state) => ({ polygonPoints: [...state.polygonPoints, pt] })),
  closePolygon: () => set((state) => {
    const pts = state.polygonPoints;
    if (pts.length < 3) return { polygonPoints: [] };
    const { selectedRoomType } = state;
    const ROOM_COLORS: Record<string, string> = {
      living: 'rgba(218,178,120,0.4)', bedroom: 'rgba(160,130,220,0.4)',
      kitchen: 'rgba(80,190,190,0.4)', bathroom: 'rgba(80,140,220,0.4)',
      dining: 'rgba(220,200,100,0.4)', balcony: 'rgba(80,200,120,0.4)',
      corridor: 'rgba(160,160,160,0.4)',
    };
    const snap = snapshot(state);
    const newHistory = [...state.history.slice(0, state.historyIndex + 1), snap].slice(-HISTORY_LIMIT);
    const newRoom: Room = {
      id: 'r_' + Math.random().toString(36).slice(2),
      name: selectedRoomType.charAt(0).toUpperCase() + selectedRoomType.slice(1),
      type: selectedRoomType,
      points: pts.map(p => ({ ...p })),
      floorMaterial: 'hardwood',
      color: ROOM_COLORS[selectedRoomType] ?? ROOM_COLORS.living,
    };
    return {
      rooms: [...state.rooms, newRoom],
      polygonPoints: [],
      activeTool: 'select',
      history: newHistory, historyIndex: newHistory.length - 1, canUndo: true, canRedo: false,
    };
  }),
  cancelPolygon: () => set({ polygonPoints: [], activeTool: 'select' }),

  clearAll: () => set({ walls: [], rooms: [], doors: [], windows: [], furniture: [], selectedId: null, polygonPoints: [] }),

  loadSamplePlan: (templateId?: string) => {
    const originX = 100;
    const originY = 100;

    let walls: Wall[] = [];
    let rooms: Room[] = [];
    let doors: Door[] = [];
    let windows: Window[] = [];
    let furniture: Furniture[] = [];

    const tid = templateId || 'oasis';

    if (tid === 'oasis') {
      walls = [
        { id: 'w1', start: { x: originX, y: originY }, end: { x: originX + 1000, y: originY }, thickness: 20, height: 300, material: 'brick' },
        { id: 'w2', start: { x: originX + 1000, y: originY }, end: { x: originX + 1000, y: originY + 800 }, thickness: 20, height: 300, material: 'brick' },
        { id: 'w3', start: { x: originX + 1000, y: originY + 800 }, end: { x: originX, y: originY + 800 }, thickness: 20, height: 300, material: 'brick' },
        { id: 'w4', start: { x: originX, y: originY + 800 }, end: { x: originX, y: originY }, thickness: 20, height: 300, material: 'brick' },
        { id: 'w5', start: { x: originX + 500, y: originY }, end: { x: originX + 500, y: originY + 800 }, thickness: 15, height: 300, material: 'white-paint' },
        { id: 'w6', start: { x: originX, y: originY + 400 }, end: { x: originX + 500, y: originY + 400 }, thickness: 15, height: 300, material: 'white-paint' },
        { id: 'w7', start: { x: originX + 500, y: originY + 400 }, end: { x: originX + 1000, y: originY + 400 }, thickness: 15, height: 300, material: 'white-paint' },
      ];
      rooms = [
        { id: 'r1', name: 'Villa Living Room', type: 'living', floorMaterial: 'hardwood', color: 'rgba(210,180,140,0.4)', points: [{x: originX, y: originY}, {x: originX+500, y: originY}, {x: originX+500, y: originY+400}, {x: originX, y: originY+400}] },
        { id: 'r2', name: 'Courtyard Kitchen', type: 'kitchen', floorMaterial: 'tiles', color: 'rgba(180,210,210,0.4)', points: [{x: originX, y: originY+400}, {x: originX+500, y: originY+400}, {x: originX+500, y: originY+800}, {x: originX, y: originY+800}] },
        { id: 'r3', name: 'Oasis Master Bed', type: 'bedroom', floorMaterial: 'carpet', color: 'rgba(210,180,210,0.4)', points: [{x: originX+500, y: originY}, {x: originX+1000, y: originY}, {x: originX+1000, y: originY+400}, {x: originX+500, y: originY+400}] },
        { id: 'r4', name: 'Oasis Guest Bed', type: 'bedroom', floorMaterial: 'marble', color: 'rgba(210,210,180,0.4)', points: [{x: originX+500, y: originY+400}, {x: originX+1000, y: originY+400}, {x: originX+1000, y: originY+800}, {x: originX+500, y: originY+800}] },
      ];
      doors = [
        { id: 'd1', wallId: 'w5', position: 0.2, width: 90, swingDirection: 'left', material: 'wood' },
        { id: 'd2', wallId: 'w5', position: 0.8, width: 90, swingDirection: 'right', material: 'wood' },
        { id: 'd3', wallId: 'w6', position: 0.5, width: 90, swingDirection: 'left', material: 'wood' },
        { id: 'd4', wallId: 'w4', position: 0.5, width: 100, swingDirection: 'right', material: 'wood' },
      ];
      windows = [
        { id: 'win1', wallId: 'w1', position: 0.3, width: 120, height: 150, sillHeight: 90 },
        { id: 'win2', wallId: 'w1', position: 0.8, width: 120, height: 150, sillHeight: 90 },
        { id: 'win3', wallId: 'w2', position: 0.5, width: 200, height: 150, sillHeight: 90 },
        { id: 'win4', wallId: 'w3', position: 0.7, width: 120, height: 150, sillHeight: 90 },
      ];
      furniture = [
        { id: 'f1', type: 'sofa', position: { x: originX + 250, y: originY + 150 }, rotation: 0, width: 200, depth: 90, color: '#aa5555' },
        { id: 'f2', type: 'bed', position: { x: originX + 750, y: originY + 200 }, rotation: 90, width: 180, depth: 200, color: '#5555aa' },
        { id: 'f3', type: 'bed', position: { x: originX + 750, y: originY + 600 }, rotation: 90, width: 140, depth: 200, color: '#55aa55' },
        { id: 'f4', type: 'kitchen-counter', position: { x: originX + 250, y: originY + 700 }, rotation: 0, width: 250, depth: 60, color: '#aaaaaa' },
      ];
    } else if (tid === 'cabin') {
      walls = [
        { id: 'w1', start: { x: originX, y: originY }, end: { x: originX + 900, y: originY }, thickness: 25, height: 260, material: 'brick' },
        { id: 'w2', start: { x: originX + 900, y: originY }, end: { x: originX + 900, y: originY + 700 }, thickness: 25, height: 260, material: 'brick' },
        { id: 'w3', start: { x: originX + 900, y: originY + 700 }, end: { x: originX, y: originY + 700 }, thickness: 25, height: 260, material: 'brick' },
        { id: 'w4', start: { x: originX, y: originY + 700 }, end: { x: originX, y: originY }, thickness: 25, height: 260, material: 'brick' },
        { id: 'w5', start: { x: originX + 450, y: originY }, end: { x: originX + 450, y: originY + 700 }, thickness: 15, height: 260, material: 'white-paint' }
      ];
      rooms = [
        { id: 'r1', name: 'Pine Living & Dining', type: 'living', floorMaterial: 'hardwood', color: 'rgba(230,190,120,0.4)', points: [{x: originX, y: originY}, {x: originX+450, y: originY}, {x: originX+450, y: originY+700}, {x: originX, y: originY+700}] },
        { id: 'r2', name: 'Ridge Bedroom', type: 'bedroom', floorMaterial: 'carpet', color: 'rgba(180,210,180,0.4)', points: [{x: originX+450, y: originY}, {x: originX+900, y: originY}, {x: originX+900, y: originY+700}, {x: originX+450, y: originY+700}] }
      ];
      doors = [
        { id: 'd1', wallId: 'w5', position: 0.5, width: 85, swingDirection: 'left', material: 'wood' },
        { id: 'd2', wallId: 'w4', position: 0.2, width: 90, swingDirection: 'right', material: 'wood' }
      ];
      windows = [
        { id: 'win1', wallId: 'w1', position: 0.5, width: 180, height: 140, sillHeight: 80 },
        { id: 'win2', wallId: 'w3', position: 0.5, width: 140, height: 140, sillHeight: 80 }
      ];
      furniture = [
        { id: 'f1', type: 'sofa', position: { x: originX + 220, y: originY + 350 }, rotation: 90, width: 180, depth: 85, color: '#8b5a2b' },
        { id: 'f2', type: 'bed', position: { x: originX + 680, y: originY + 350 }, rotation: 270, width: 170, depth: 190, color: '#3d5a45' }
      ];
    } else if (tid === 'adu') {
      walls = [
        { id: 'w1', start: { x: originX, y: originY }, end: { x: originX + 600, y: originY }, thickness: 15, height: 250, material: 'brick' },
        { id: 'w2', start: { x: originX + 600, y: originY }, end: { x: originX + 600, y: originY + 400 }, thickness: 15, height: 250, material: 'brick' },
        { id: 'w3', start: { x: originX + 600, y: originY + 400 }, end: { x: originX, y: originY + 400 }, thickness: 15, height: 250, material: 'brick' },
        { id: 'w4', start: { x: originX, y: originY + 400 }, end: { x: originX, y: originY }, thickness: 15, height: 250, material: 'brick' }
      ];
      rooms = [
        { id: 'r1', name: 'Studio ADU Space', type: 'living', floorMaterial: 'hardwood', color: 'rgba(240,220,200,0.4)', points: [{x: originX, y: originY}, {x: originX+600, y: originY}, {x: originX+600, y: originY+400}, {x: originX, y: originY+400}] }
      ];
      doors = [{ id: 'd1', wallId: 'w4', position: 0.8, width: 90, swingDirection: 'right', material: 'wood' }];
      windows = [{ id: 'win1', wallId: 'w1', position: 0.5, width: 220, height: 160, sillHeight: 70 }];
      furniture = [
        { id: 'f1', type: 'bed', position: { x: originX + 480, y: originY + 120 }, rotation: 0, width: 140, depth: 190, color: '#7a8b9a' },
        { id: 'f2', type: 'sofa', position: { x: originX + 180, y: originY + 280 }, rotation: 180, width: 160, depth: 80, color: '#9a7a8b' }
      ];
    } else {
      walls = [
        { id: 'w1', start: { x: originX, y: originY }, end: { x: originX + 800, y: originY }, thickness: 20, height: 280, material: 'brick' },
        { id: 'w2', start: { x: originX + 800, y: originY }, end: { x: originX + 800, y: originY + 800 }, thickness: 20, height: 280, material: 'brick' },
        { id: 'w3', start: { x: originX + 800, y: originY + 800 }, end: { x: originX, y: originY + 800 }, thickness: 20, height: 280, material: 'brick' },
        { id: 'w4', start: { x: originX, y: originY + 800 }, end: { x: originX, y: originY }, thickness: 20, height: 280, material: 'brick' },
        { id: 'w5', start: { x: originX, y: originY + 400 }, end: { x: originX + 800, y: originY + 400 }, thickness: 15, height: 280, material: 'white-paint' }
      ];
      rooms = [
        { id: 'r1', name: 'Vertical Townhouse Studio', type: 'living', floorMaterial: 'tiles', color: 'rgba(200,200,220,0.4)', points: [{x: originX, y: originY}, {x: originX+800, y: originY}, {x: originX+800, y: originY+400}, {x: originX, y: originY+400}] },
        { id: 'r2', name: 'Townhouse Bedroom', type: 'bedroom', floorMaterial: 'hardwood', color: 'rgba(220,200,200,0.4)', points: [{x: originX, y: originY+400}, {x: originX+800, y: originY+400}, {x: originX+800, y: originY+800}, {x: originX, y: originY+800}] }
      ];
      doors = [
        { id: 'd1', wallId: 'w5', position: 0.5, width: 90, swingDirection: 'left', material: 'wood' },
        { id: 'd2', wallId: 'w4', position: 0.5, width: 90, swingDirection: 'right', material: 'wood' }
      ];
      windows = [
        { id: 'win1', wallId: 'w1', position: 0.3, width: 140, height: 150, sillHeight: 90 },
        { id: 'win2', wallId: 'w3', position: 0.7, width: 140, height: 150, sillHeight: 90 }
      ];
      furniture = [
        { id: 'f1', type: 'sofa', position: { x: originX + 400, y: originY + 150 }, rotation: 0, width: 200, depth: 90, color: '#6b7a8a' },
        { id: 'f2', type: 'bed', position: { x: originX + 400, y: originY + 600 }, rotation: 180, width: 180, depth: 200, color: '#8a6b7a' }
      ];
    }

    set({ walls, rooms, doors, windows, furniture, scale: 1, polygonPoints: [] });
  }
}));
