import { create } from 'zustand';
import { FloorPlanState, Wall, Room, Door, Window, Furniture } from './types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

export const usePlannerStore = create<FloorPlanState>((set) => ({
  walls: [],
  rooms: [],
  doors: [],
  windows: [],
  furniture: [],
  selectedId: null,
  activeTool: 'select',
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  scale: 1, // px per cm
  view: '2d',
  cameraMode: 'orbit',
  
  addWall: (wall) => set((state) => ({ walls: [...state.walls, wall] })),
  updateWall: (id, wall) => set((state) => ({ walls: state.walls.map(w => w.id === id ? { ...w, ...wall } : w) })),
  deleteWall: (id) => set((state) => ({ 
    walls: state.walls.filter(w => w.id !== id),
    doors: state.doors.filter(d => d.wallId !== id),
    windows: state.windows.filter(w => w.wallId !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  updateRoom: (id, room) => set((state) => ({ rooms: state.rooms.map(r => r.id === id ? { ...r, ...room } : r) })),
  deleteRoom: (id) => set((state) => ({ 
    rooms: state.rooms.filter(r => r.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  addDoor: (door) => set((state) => ({ doors: [...state.doors, door] })),
  updateDoor: (id, door) => set((state) => ({ doors: state.doors.map(d => d.id === id ? { ...d, ...door } : d) })),
  deleteDoor: (id) => set((state) => ({ 
    doors: state.doors.filter(d => d.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  addWindow: (window) => set((state) => ({ windows: [...state.windows, window] })),
  updateWindow: (id, window) => set((state) => ({ windows: state.windows.map(w => w.id === id ? { ...w, ...window } : w) })),
  deleteWindow: (id) => set((state) => ({ 
    windows: state.windows.filter(w => w.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  addFurniture: (furniture) => set((state) => ({ furniture: [...state.furniture, furniture] })),
  updateFurniture: (id, furniture) => set((state) => ({ furniture: state.furniture.map(f => f.id === id ? { ...f, ...furniture } : f) })),
  deleteFurniture: (id) => set((state) => ({ 
    furniture: state.furniture.filter(f => f.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  setActiveTool: (tool) => set({ activeTool: tool, selectedId: null }),
  setSelectedId: (id) => set({ selectedId: id, activeTool: 'select' }),
  setView: (view) => set({ view }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setScale: (scale) => set({ scale }),
  
  clearAll: () => set({ walls: [], rooms: [], doors: [], windows: [], furniture: [], selectedId: null }),
  
  loadSamplePlan: () => {
    // Basic 2-bedroom apartment sample
    // Size: ~ 10m x 8m
    const originX = 100;
    const originY = 100;

    const walls: Wall[] = [
      // Outer shell (1000cm x 800cm)
      { id: 'w1', start: { x: originX, y: originY }, end: { x: originX + 1000, y: originY }, thickness: 20, height: 280, material: 'brick' },
      { id: 'w2', start: { x: originX + 1000, y: originY }, end: { x: originX + 1000, y: originY + 800 }, thickness: 20, height: 280, material: 'brick' },
      { id: 'w3', start: { x: originX + 1000, y: originY + 800 }, end: { x: originX, y: originY + 800 }, thickness: 20, height: 280, material: 'brick' },
      { id: 'w4', start: { x: originX, y: originY + 800 }, end: { x: originX, y: originY }, thickness: 20, height: 280, material: 'brick' },
      
      // Inner walls
      // Vertical separating living from bedrooms
      { id: 'w5', start: { x: originX + 500, y: originY }, end: { x: originX + 500, y: originY + 800 }, thickness: 15, height: 280, material: 'white-paint' },
      // Horizontal separating kitchen/bathroom
      { id: 'w6', start: { x: originX, y: originY + 400 }, end: { x: originX + 500, y: originY + 400 }, thickness: 15, height: 280, material: 'white-paint' },
      // Horizontal separating two bedrooms
      { id: 'w7', start: { x: originX + 500, y: originY + 400 }, end: { x: originX + 1000, y: originY + 400 }, thickness: 15, height: 280, material: 'white-paint' },
    ];

    const rooms: Room[] = [
      {
        id: 'r1', name: 'Living Room', type: 'living', floorMaterial: 'hardwood', color: 'rgba(210,180,140,0.4)',
        points: [{x: originX, y: originY}, {x: originX+500, y: originY}, {x: originX+500, y: originY+400}, {x: originX, y: originY+400}]
      },
      {
        id: 'r2', name: 'Kitchen', type: 'kitchen', floorMaterial: 'tiles', color: 'rgba(180,210,210,0.4)',
        points: [{x: originX, y: originY+400}, {x: originX+500, y: originY+400}, {x: originX+500, y: originY+800}, {x: originX, y: originY+800}]
      },
      {
        id: 'r3', name: 'Master Bedroom', type: 'bedroom', floorMaterial: 'carpet', color: 'rgba(210,180,210,0.4)',
        points: [{x: originX+500, y: originY}, {x: originX+1000, y: originY}, {x: originX+1000, y: originY+400}, {x: originX+500, y: originY+400}]
      },
      {
        id: 'r4', name: 'Guest Bedroom', type: 'bedroom', floorMaterial: 'hardwood', color: 'rgba(210,210,180,0.4)',
        points: [{x: originX+500, y: originY+400}, {x: originX+1000, y: originY+400}, {x: originX+1000, y: originY+800}, {x: originX+500, y: originY+800}]
      },
    ];

    const doors: Door[] = [
      { id: 'd1', wallId: 'w5', position: 0.2, width: 90, swingDirection: 'left', material: 'wood' }, // to master bed
      { id: 'd2', wallId: 'w5', position: 0.8, width: 90, swingDirection: 'right', material: 'wood' }, // to guest bed
      { id: 'd3', wallId: 'w6', position: 0.5, width: 90, swingDirection: 'left', material: 'wood' }, // to kitchen
      { id: 'd4', wallId: 'w4', position: 0.5, width: 100, swingDirection: 'right', material: 'wood' }, // front door
    ];

    const windows: Window[] = [
      { id: 'win1', wallId: 'w1', position: 0.3, width: 120, height: 150, sillHeight: 90 },
      { id: 'win2', wallId: 'w1', position: 0.8, width: 120, height: 150, sillHeight: 90 },
      { id: 'win3', wallId: 'w2', position: 0.5, width: 200, height: 150, sillHeight: 90 },
      { id: 'win4', wallId: 'w3', position: 0.7, width: 120, height: 150, sillHeight: 90 },
    ];

    const furniture: Furniture[] = [
      { id: 'f1', type: 'sofa', position: { x: originX + 250, y: originY + 150 }, rotation: 0, width: 200, depth: 90, color: '#aa5555' },
      { id: 'f2', type: 'bed', position: { x: originX + 750, y: originY + 200 }, rotation: 90, width: 180, depth: 200, color: '#5555aa' },
      { id: 'f3', type: 'bed', position: { x: originX + 750, y: originY + 600 }, rotation: 90, width: 140, depth: 200, color: '#55aa55' },
      { id: 'f4', type: 'kitchen-counter', position: { x: originX + 250, y: originY + 700 }, rotation: 0, width: 250, depth: 60, color: '#aaaaaa' },
    ];

    set({ walls, rooms, doors, windows, furniture, scale: 1 });
  }
}));
