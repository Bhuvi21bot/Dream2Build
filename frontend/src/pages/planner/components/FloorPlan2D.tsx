/**
 * FloorPlan2D — Pure HTML5 Canvas floor-plan editor
 *
 * SELECT mode
 *   • Click any element to select it (highlighted with amber outline)
 *   • Drag selected ROOM body  → moves room
 *   • Drag selected ROOM vertex handle → reshapes (works for any room shape)
 *   • Drag selected WALL endpoint handle → moves that endpoint
 *   • Drag selected FURNITURE body → moves furniture
 *   • Drag selected FURNITURE corner handle → resizes
 *   • Drag empty canvas → pan the viewport
 *   • Delete / Backspace → delete selected
 *   • Esc → deselect
 *
 * WALL / ROOM tools  → click-and-drag to draw
 * FURNITURE          → click to place, then switch to Select to move/resize
 * DOOR / WINDOW      → hover near wall and click to insert
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { usePlannerStore } from '../store';
import { Point, Wall, Room, Furniture, FurnitureType, RoomType } from '../types';

// close-enough distance to consider polygon closed (world px)
const POLY_CLOSE_DIST = 30;

// ─── constants ────────────────────────────────────────────────────────────────
const GRID = 20;
const WALL_T = 14;          // default wall thickness
const HANDLE_R = 7;           // handle hit radius in world px
const SNAP_DIST = 40;          // wall-snap radius for door/window
const WALL_JOIN_DIST = 28;        // radius (world px) within which a new/dragged wall endpoint snaps to an existing wall's endpoint, joining the two walls

const ROOM_SHAPES = ['rect', 'l-shape', 'u-shape', 't-shape', 'octagonal'] as const;
type RoomShape = typeof ROOM_SHAPES[number];

const ROOM_COLORS: Record<RoomType, { fill: string; stroke: string }> = {
  living: { fill: 'rgba(218,178,120,0.4)', stroke: '#d4a96a' },
  bedroom: { fill: 'rgba(160,130,220,0.4)', stroke: '#9b7edb' },
  kitchen: { fill: 'rgba( 80,190,190,0.4)', stroke: '#4eb8b8' },
  bathroom: { fill: 'rgba( 80,140,220,0.4)', stroke: '#5e8edb' },
  dining: { fill: 'rgba(220,200,100,0.4)', stroke: '#c8b836' },
  balcony: { fill: 'rgba( 80,200,120,0.4)', stroke: '#40c870' },
  corridor: { fill: 'rgba(160,160,160,0.4)', stroke: '#8e8e8e' },
};

const FURNITURE_CFG: Record<FurnitureType, { w: number; d: number; fill: string; label: string }> = {
  sofa: { w: 200, d: 90, fill: '#8b6565', label: 'Sofa' },
  bed: { w: 160, d: 200, fill: '#5b6b9e', label: 'Bed' },
  'dining-table': { w: 140, d: 90, fill: '#9e7a4e', label: 'Dining Table' },
  chair: { w: 55, d: 55, fill: '#7a9e6b', label: 'Chair' },
  desk: { w: 120, d: 70, fill: '#4a9e9e', label: 'Desk' },
  wardrobe: { w: 150, d: 65, fill: '#9e5b8b', label: 'Wardrobe' },
  'kitchen-counter': { w: 220, d: 60, fill: '#8e8e8e', label: 'Counter' },
  toilet: { w: 50, d: 70, fill: '#cce8ff', label: 'Toilet' },
  bathtub: { w: 160, d: 75, fill: '#b8d8f0', label: 'Bathtub' },
  stairs: { w: 100, d: 250, fill: '#b8995a', label: 'Stairs' },
};

// ─── drag descriptor ──────────────────────────────────────────────────────────
type DragKind =
  | { kind: 'pan'; vx0: number; vy0: number; sx0: number; sy0: number }
  | { kind: 'move-room'; id: string; pts0: Point[]; wx0: number; wy0: number }
  | { kind: 'move-room-vertex'; id: string; vertIdx: number; pts0: Point[] }
  | { kind: 'move-furniture'; id: string; ox: number; oy: number; wx0: number; wy0: number }
  | { kind: 'resize-furniture'; id: string; corner: number; ox: number; oy: number; w0: number; d0: number; wx0: number; wy0: number }
  | { kind: 'move-wall-start'; id: string }
  | { kind: 'move-wall-end'; id: string }
  | { kind: 'move-wall'; id: string; start0: Point; end0: Point; wx0: number; wy0: number }
  | { kind: 'move-opening'; type: 'door' | 'window'; id: string; wallId: string; pos0: number; wx0: number; wy0: number }
  | { kind: 'draw-wall' | 'draw-room'; start: Point }
  | null;

// ─── helpers ──────────────────────────────────────────────────────────────────
function getRoomBBox(room: Room) {
  const xs = room.points.map(p => p.x);
  const ys = room.points.map(p => p.y);
  return {
    x: Math.min(...xs), y: Math.min(...ys),
    x2: Math.max(...xs), y2: Math.max(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
  };
}

function rectCorners(x: number, y: number, w: number, h: number): Point[] {
  return [
    { x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h },
  ];
}

// Generates non-rectangular room outlines. Ready to wire up once the room
// toolbar exposes a shape selector (currently only 'rect' is used by draw-room).
function getPointsForShape(shape: string, start: Point, end: Point): Point[] {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.max(20, Math.abs(end.x - start.x));
  const h = Math.max(20, Math.abs(end.y - start.y));

  if (shape === 'l-shape') {
    return [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h / 2 },
      { x: x + w / 2, y: y + h / 2 },
      { x: x + w / 2, y: y + h },
      { x, y: y + h }
    ];
  }
  if (shape === 'u-shape') {
    return [
      { x, y },
      { x: x + w / 3, y },
      { x: x + w / 3, y: y + h / 2 },
      { x: x + 2 * w / 3, y: y + h / 2 },
      { x: x + 2 * w / 3, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h }
    ];
  }
  if (shape === 't-shape') {
    return [
      { x: x + w / 3, y },
      { x: x + 2 * w / 3, y },
      { x: x + 2 * w / 3, y: y + h / 3 },
      { x: x + w, y: y + h / 3 },
      { x: x + w, y: y + h },
      { x, y: y + h },
      { x, y: y + h / 3 },
      { x: x + w / 3, y: y + h / 3 }
    ];
  }
  if (shape === 'octagonal') {
    return [
      { x: x + w / 3, y },
      { x: x + 2 * w / 3, y },
      { x: x + w, y: y + h / 3 },
      { x: x + w, y: y + 2 * h / 3 },
      { x: x + 2 * w / 3, y: y + h },
      { x: x + w / 3, y: y + h },
      { x, y: y + 2 * h / 3 },
      { x, y: y + h / 3 }
    ];
  }
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h }
  ];
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function projectOnWall(cursor: Point, wall: Wall) {
  const dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return null;
  const t = Math.max(0, Math.min(1, ((cursor.x - wall.start.x) * dx + (cursor.y - wall.start.y) * dy) / len2));
  return { t, pt: { x: wall.start.x + t * dx, y: wall.start.y + t * dy } };
}

function ptInPolygon(p: Point, pts: Point[]) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y, xj = pts[j].x, yj = pts[j].y;
    if (((yi > p.y) !== (yj > p.y)) && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ─── component ────────────────────────────────────────────────────────────────
export function FloorPlan2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [, forceRender] = useState(0);

  const viewRef = useRef({ x: 80, y: 80, scale: 1 });
  const dragRef = useRef<DragKind>(null);
  const mouseRef = useRef<Point>({ x: 0, y: 0 }); // world coords

  const store = usePlannerStore();
  const storeRef = useRef(store);
  storeRef.current = store;

  // ── room shape (for the 'room' drag-draw tool) ────────────────────────────
  const [roomShape, setRoomShape] = useState<RoomShape>('rect');
  const roomShapeRef = useRef(roomShape);
  roomShapeRef.current = roomShape;

  // ── export / import ────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────
  const snapV = (v: number) => storeRef.current.snapToGrid ? Math.round(v / GRID) * GRID : v;
  const snapP = (p: Point): Point => ({ x: snapV(p.x), y: snapV(p.y) });
  const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

  const toWorld = useCallback((sx: number, sy: number): Point => {
    const v = viewRef.current;
    return { x: (sx - v.x) / v.scale, y: (sy - v.y) / v.scale };
  }, []);

  // best wall for snap
  const bestWallSnap = (cursor: Point) => {
    const { walls } = storeRef.current;
    let best: { wall: Wall; t: number; pt: Point; d: number } | null = null;
    for (const wall of walls) {
      const res = projectOnWall(cursor, wall);
      if (!res) continue;
      const d = dist(cursor, res.pt);
      if (!best || d < best.d) best = { wall, t: res.t, pt: res.pt, d };
    }
    return best;
  };

  // nearest existing wall ENDPOINT (start or end) within join range — used to
  // auto-join new/dragged walls onto existing corners instead of leaving a gap
  const wallJointSnap = (p: Point, excludeWallId?: string): Point | null => {
    const { walls } = storeRef.current;
    let best: Point | null = null, bestD = Infinity;
    for (const w of walls) {
      if (w.id === excludeWallId) continue;
      for (const ep of [w.start, w.end]) {
        const d = dist(p, ep);
        if (d < bestD) { bestD = d; best = ep; }
      }
    }
    return best && bestD <= WALL_JOIN_DIST ? { x: best.x, y: best.y } : null;
  };
  // wall endpoint placement: prefer joining an existing corner, else fall back to grid snap
  const snapWallPoint = (p: Point, excludeWallId?: string): Point =>
    wallJointSnap(p, excludeWallId) ?? snapP(p);

  // ── keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dragRef.current = null;
        storeRef.current.cancelPolygon();
        storeRef.current.setActiveTool('select');
        storeRef.current.setSelectedId(null);
      }
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        storeRef.current.undo();
        return;
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        storeRef.current.redo();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement === document.body) {
        const { selectedId, walls, rooms, doors, windows, furniture,
          deleteWall, deleteRoom, deleteDoor, deleteWindow, deleteFurniture } = storeRef.current;
        if (!selectedId) return;
        e.preventDefault();
        if (walls.find(w => w.id === selectedId)) deleteWall(selectedId);
        else if (rooms.find(r => r.id === selectedId)) deleteRoom(selectedId);
        else if (doors.find(d => d.id === selectedId)) deleteDoor(selectedId);
        else if (windows.find(w => w.id === selectedId)) deleteWindow(selectedId);
        else if (furniture.find(f => f.id === selectedId)) deleteFurniture(selectedId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── resize observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth, h = el.clientHeight;
      [canvasRef, overlayRef].forEach(r => { if (r.current) { r.current.width = w; r.current.height = h; } });
      forceRender(n => n + 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── render loop ───────────────────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current, overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const ctx = canvas.getContext('2d')!, octx = overlay.getContext('2d')!;
    const { x: vx, y: vy, scale: vs } = viewRef.current;
    const W = canvas.width, H = canvas.height;
    const { walls, rooms, doors, windows, furniture, selectedId, activeTool,
      showGrid, selectedFurnitureType, polygonPoints } = storeRef.current;
    const mouse = mouseRef.current;

    // ── main canvas ──────────────────────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(vx, vy);
    ctx.scale(vs, vs);

    // background
    ctx.fillStyle = '#16213e';
    ctx.fillRect(-vx / vs, -vy / vs, W / vs, H / vs);

    // grid
    if (showGrid) {
      const ox = -vx / vs, oy = -vy / vs, gw = W / vs, gh = H / vs;
      const sx = Math.floor(ox / GRID) * GRID, sy = Math.floor(oy / GRID) * GRID;
      ctx.strokeStyle = 'rgba(255,165,0,0.08)';
      ctx.lineWidth = 0.5 / vs;
      for (let gx = sx; gx < ox + gw + GRID; gx += GRID) { ctx.beginPath(); ctx.moveTo(gx, sy); ctx.lineTo(gx, oy + gh + GRID); ctx.stroke(); }
      for (let gy = sy; gy < oy + gh + GRID; gy += GRID) { ctx.beginPath(); ctx.moveTo(sx, gy); ctx.lineTo(ox + gw + GRID, gy); ctx.stroke(); }
    }

    // rooms
    for (const room of rooms) {
      if (room.points.length < 3) continue;
      const clr = ROOM_COLORS[room.type] ?? ROOM_COLORS.living;
      const isSel = selectedId === room.id;
      ctx.beginPath();
      ctx.moveTo(room.points[0].x, room.points[0].y);
      room.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.fillStyle = clr.fill;
      ctx.fill();
      ctx.strokeStyle = isSel ? '#f59e0b' : clr.stroke;
      ctx.lineWidth = isSel ? 3 / vs : 1.5 / vs;
      ctx.stroke();
      // label
      const bb = getRoomBBox(room);
      ctx.font = `${Math.max(9, 13 / vs)}px Outfit,sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(room.name, bb.x + bb.w / 2, bb.y + bb.h / 2);
      // per-vertex handles when selected (for any polygon shape)
      if (isSel) {
        room.points.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, HANDLE_R / vs, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 / vs; ctx.stroke();
        });
      }
    }

    // walls
    for (const wall of walls) {
      const isSel = selectedId === wall.id;
      ctx.beginPath();
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.end.x, wall.end.y);
      ctx.strokeStyle = isSel ? '#f59e0b' : '#cccccc';
      ctx.lineWidth = wall.thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
      // endpoint handles when selected
      if (isSel) {
        for (const pt of [wall.start, wall.end]) {
          ctx.beginPath(); ctx.arc(pt.x, pt.y, HANDLE_R / vs + 2, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 / vs; ctx.stroke();
        }
        // length label
        const mx = (wall.start.x + wall.end.x) / 2, my = (wall.start.y + wall.end.y) / 2;
        const len = Math.round(dist(wall.start, wall.end));
        ctx.fillStyle = '#f59e0b';
        ctx.font = `bold ${11 / vs}px monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText(`${len} cm`, mx, my - 6 / vs);
      }
    }

    // doors
    for (const door of doors) {
      const wall = walls.find(w => w.id === door.wallId); if (!wall) continue;
      const dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
      if (dx === 0 && dy === 0) continue; // degenerate wall — skip instead of producing NaN
      const px = wall.start.x + dx * door.position;
      const py = wall.start.y + dy * door.position;
      const isSel = selectedId === door.id;
      ctx.save();
      ctx.translate(px, py); ctx.rotate(Math.atan2(dy, dx));
      ctx.fillStyle = '#16213e';
      ctx.fillRect(-door.width / 2, -wall.thickness / 2 - 1, door.width, wall.thickness + 2);
      ctx.beginPath();
      ctx.moveTo(-door.width / 2, wall.thickness / 2);
      ctx.lineTo(door.swingDirection === 'left' ? -door.width / 2 : door.width / 2, wall.thickness / 2 + door.width);
      ctx.strokeStyle = isSel ? '#f59e0b' : '#aaa'; ctx.lineWidth = 2.5 / vs; ctx.stroke();
      ctx.beginPath();
      ctx.arc(-door.width / 2, wall.thickness / 2, door.width, 0, Math.PI / 2);
      ctx.strokeStyle = (isSel ? '#f59e0b88' : '#88888855'); ctx.lineWidth = 1.2 / vs;
      ctx.setLineDash([4 / vs, 4 / vs]); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }

    // windows
    for (const win of windows) {
      const wall = walls.find(w => w.id === win.wallId); if (!wall) continue;
      const dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
      if (dx === 0 && dy === 0) continue; // degenerate wall — skip instead of producing NaN
      const px = wall.start.x + dx * win.position;
      const py = wall.start.y + dy * win.position;
      const isSel = selectedId === win.id;
      ctx.save();
      ctx.translate(px, py); ctx.rotate(Math.atan2(dy, dx));
      ctx.fillStyle = isSel ? 'rgba(100,180,255,0.65)' : 'rgba(100,180,255,0.4)';
      ctx.fillRect(-win.width / 2, -wall.thickness / 2, win.width, wall.thickness);
      ctx.strokeStyle = isSel ? '#f59e0b' : '#3b82f6'; ctx.lineWidth = 2 / vs;
      ctx.strokeRect(-win.width / 2, -wall.thickness / 2, win.width, wall.thickness);
      ctx.beginPath(); ctx.moveTo(-win.width / 2, 0); ctx.lineTo(win.width / 2, 0);
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5 / vs; ctx.stroke();
      ctx.restore();
    }

    // furniture
    for (const f of furniture) {
      const cfg = FURNITURE_CFG[f.type];
      const isSel = selectedId === f.id;
      ctx.save();
      ctx.translate(f.position.x, f.position.y);
      ctx.rotate((f.rotation * Math.PI) / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8 / vs;
      ctx.fillStyle = cfg.fill;
      roundRect(ctx, -f.width / 2, -f.depth / 2, f.width, f.depth, 6 / vs);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = isSel ? '#f59e0b' : 'rgba(0,0,0,0.35)';
      ctx.lineWidth = isSel ? 3 / vs : 1 / vs;
      roundRect(ctx, -f.width / 2, -f.depth / 2, f.width, f.depth, 6 / vs);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold ${Math.max(8, 11 / vs)}px Outfit,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(cfg.label, 0, 0);
      // resize handles
      if (isSel) {
        const corners = rectCorners(-f.width / 2, -f.depth / 2, f.width, f.depth);
        corners.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, HANDLE_R / vs, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b'; ctx.fill();
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5 / vs; ctx.stroke();
        });
      }
      ctx.restore();
    }

    ctx.restore();

    // ── overlay (live drawing preview) ───────────────────────────────────────
    octx.clearRect(0, 0, W, H);
    octx.save();
    octx.translate(vx, vy);
    octx.scale(vs, vs);

    const drag = dragRef.current;
    const sm = snapP(mouse);

    if (drag && (drag.kind === 'draw-wall') && activeTool === 'wall') {
      const { start } = drag;
      const joint = wallJointSnap(mouse);
      const endPt = joint ?? sm;
      octx.beginPath(); octx.moveTo(start.x, start.y); octx.lineTo(endPt.x, endPt.y);
      octx.strokeStyle = '#f59e0b'; octx.lineWidth = WALL_T; octx.lineCap = 'round';
      octx.globalAlpha = 0.55; octx.stroke(); octx.globalAlpha = 1;
      [start, endPt].forEach(p => { octx.beginPath(); octx.arc(p.x, p.y, 7 / vs, 0, Math.PI * 2); octx.fillStyle = '#f59e0b'; octx.fill(); });
      if (joint) {
        // highlight the corner we're about to join onto
        octx.beginPath(); octx.arc(joint.x, joint.y, 12 / vs, 0, Math.PI * 2);
        octx.strokeStyle = '#22c55e'; octx.lineWidth = 2 / vs; octx.stroke();
      }
      const mx = (start.x + endPt.x) / 2, my = (start.y + endPt.y) / 2;
      octx.fillStyle = joint ? '#22c55e' : '#f59e0b'; octx.font = `bold ${12 / vs}px monospace`;
      octx.textAlign = 'center'; octx.textBaseline = 'bottom';
      octx.fillText(`${Math.round(dist(start, endPt))} cm${joint ? ' · join' : ''}`, mx, my - 10 / vs);
    }

    if (drag && drag.kind === 'draw-room' && activeTool === 'room') {
      const { start } = drag;
      const shape = roomShapeRef.current;
      if (shape === 'rect') {
        const rx = Math.min(start.x, sm.x), ry = Math.min(start.y, sm.y);
        const rw = Math.abs(sm.x - start.x), rh = Math.abs(sm.y - start.y);
        octx.fillStyle = 'rgba(245,158,11,0.12)';
        octx.fillRect(rx, ry, rw, rh);
        octx.strokeStyle = '#f59e0b'; octx.lineWidth = 2 / vs;
        octx.setLineDash([8 / vs, 4 / vs]); octx.strokeRect(rx, ry, rw, rh); octx.setLineDash([]);
        octx.fillStyle = '#f59e0b'; octx.font = `bold ${11 / vs}px monospace`;
        octx.textAlign = 'center'; octx.textBaseline = 'bottom';
        octx.fillText(`${Math.round(rw)} × ${Math.round(rh)} cm`, rx + rw / 2, ry - 6 / vs);
      } else {
        const pts = getPointsForShape(shape, start, sm);
        octx.beginPath();
        octx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) octx.lineTo(pts[i].x, pts[i].y);
        octx.closePath();
        octx.fillStyle = 'rgba(245,158,11,0.12)';
        octx.fill();
        octx.strokeStyle = '#f59e0b'; octx.lineWidth = 2 / vs;
        octx.setLineDash([8 / vs, 4 / vs]); octx.stroke(); octx.setLineDash([]);
        const rx = Math.min(start.x, sm.x), ry = Math.min(start.y, sm.y);
        const rw = Math.abs(sm.x - start.x), rh = Math.abs(sm.y - start.y);
        octx.fillStyle = '#f59e0b'; octx.font = `bold ${11 / vs}px monospace`;
        octx.textAlign = 'center'; octx.textBaseline = 'bottom';
        octx.fillText(`${shape} · ${Math.round(rw)} × ${Math.round(rh)} cm`, rx + rw / 2, ry - 6 / vs);
      }
    }

    // ── Polygon room in-progress preview ──────────────────────────────────────
    if (activeTool === 'polygon-room' && polygonPoints.length > 0) {
      // filled polygon so far
      octx.beginPath();
      octx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) octx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      octx.lineTo(sm.x, sm.y);
      octx.fillStyle = 'rgba(245,158,11,0.10)';
      octx.fill();

      // edge line to cursor
      octx.beginPath();
      octx.moveTo(polygonPoints[polygonPoints.length - 1].x, polygonPoints[polygonPoints.length - 1].y);
      octx.lineTo(sm.x, sm.y);
      octx.strokeStyle = '#f59e0b'; octx.lineWidth = 2 / vs;
      octx.setLineDash([8 / vs, 4 / vs]); octx.stroke(); octx.setLineDash([]);

      // all existing edges
      octx.beginPath();
      octx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      for (let i = 1; i < polygonPoints.length; i++) octx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
      octx.strokeStyle = '#f59e0b'; octx.lineWidth = 2.5 / vs; octx.stroke();

      // vertex dots
      polygonPoints.forEach((p, i) => {
        const isFirst = i === 0;
        const nearFirst = isFirst ? false : dist(sm, polygonPoints[0]) < POLY_CLOSE_DIST / vs;
        octx.beginPath(); octx.arc(p.x, p.y, (isFirst ? 8 : 5) / vs, 0, Math.PI * 2);
        octx.fillStyle = isFirst ? (nearFirst ? '#22c55e' : '#f59e0b') : '#f59e0b'; octx.fill();
        octx.strokeStyle = '#fff'; octx.lineWidth = 1.5 / vs; octx.stroke();
      });

      // cursor dot
      const closeable = polygonPoints.length >= 3 && dist(sm, polygonPoints[0]) < POLY_CLOSE_DIST / vs;
      octx.beginPath(); octx.arc(sm.x, sm.y, 5 / vs, 0, Math.PI * 2);
      octx.fillStyle = closeable ? '#22c55e' : '#f59e0b88'; octx.fill();

      // hint
      const hint = closeable
        ? 'Click to close polygon'
        : `${polygonPoints.length} vertices · dbl-click or click ● to close`;
      octx.fillStyle = closeable ? '#22c55e' : '#f59e0b';
      octx.font = `bold ${11 / vs}px monospace`;
      octx.textAlign = 'center'; octx.textBaseline = 'bottom';
      octx.fillText(hint, sm.x, sm.y - 14 / vs);
    }

    if (activeTool === 'furniture') {
      const cfg = FURNITURE_CFG[selectedFurnitureType];
      octx.save(); octx.translate(sm.x, sm.y);
      octx.fillStyle = 'rgba(245,158,11,0.22)';
      roundRect(octx, -cfg.w / 2, -cfg.d / 2, cfg.w, cfg.d, 6 / vs); octx.fill();
      octx.strokeStyle = '#f59e0b'; octx.lineWidth = 1.5 / vs;
      octx.setLineDash([5 / vs, 3 / vs]);
      roundRect(octx, -cfg.w / 2, -cfg.d / 2, cfg.w, cfg.d, 6 / vs); octx.stroke();
      octx.setLineDash([]);
      octx.fillStyle = 'rgba(255,255,255,0.8)'; octx.font = `${11 / vs}px Outfit,sans-serif`;
      octx.textAlign = 'center'; octx.textBaseline = 'middle';
      octx.fillText(cfg.label, 0, 0);
      octx.restore();
    }

    if (activeTool === 'door' || activeTool === 'window') {
      const best = bestWallSnap(mouse);
      if (best && best.d < SNAP_DIST) {
        octx.beginPath(); octx.arc(best.pt.x, best.pt.y, 12 / vs, 0, Math.PI * 2);
        octx.fillStyle = activeTool === 'door' ? 'rgba(16,185,129,0.45)' : 'rgba(59,130,246,0.45)';
        octx.fill();
        octx.strokeStyle = activeTool === 'door' ? '#10b981' : '#3b82f6';
        octx.lineWidth = 2 / vs; octx.stroke();
        octx.fillStyle = activeTool === 'door' ? '#10b981' : '#3b82f6';
        octx.font = `${11 / vs}px monospace`; octx.textAlign = 'center'; octx.textBaseline = 'bottom';
        octx.fillText(`Click to add ${activeTool}`, best.pt.x, best.pt.y - 14 / vs);
      }
    }

    octx.restore();
  }, []);

  // trigger render every frame when something changes
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(render);
  });

  // ── mouse helpers ──────────────────────────────────────────────────────────
  const getXY = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { sx: e.clientX - r.left, sy: e.clientY - r.top };
  };

  // find what the cursor is near for a given world pos
  const hitTest = (world: Point) => {
    const { walls, rooms, furniture, selectedId, doors, windows } = storeRef.current;
    const vs = viewRef.current.scale;
    const HR = HANDLE_R / vs;

    // ── per-vertex handles for selected room ──────────────────────────────
    if (selectedId) {
      const selRoom = rooms.find(r => r.id === selectedId);
      if (selRoom) {
        for (let i = 0; i < selRoom.points.length; i++) {
          if (dist(world, selRoom.points[i]) <= HR + 4)
            return { type: 'room-vertex', id: selectedId, vertIdx: i } as const;
        }
      }
      const selFurn = furniture.find(f => f.id === selectedId);
      if (selFurn) {
        const rot = (selFurn.rotation * Math.PI) / 180;
        const dx = world.x - selFurn.position.x, dy = world.y - selFurn.position.y;
        const lx = dx * Math.cos(-rot) - dy * Math.sin(-rot);
        const ly = dx * Math.sin(-rot) + dy * Math.cos(-rot);
        const corners = rectCorners(-selFurn.width / 2, -selFurn.depth / 2, selFurn.width, selFurn.depth);
        for (let i = 0; i < corners.length; i++) {
          if (dist({ x: lx, y: ly }, corners[i]) <= HR + 4) {
            return { type: 'furn-resize', id: selectedId, corner: i } as const;
          }
        }
      }
      // wall endpoint handles
      const selWall = walls.find(w => w.id === selectedId);
      if (selWall) {
        if (dist(world, selWall.start) <= HR + 4) return { type: 'wall-start', id: selectedId } as const;
        if (dist(world, selWall.end) <= HR + 4) return { type: 'wall-end', id: selectedId } as const;
      }
    }

    // ── body hit tests ──────────────────────────────────────────────────────
    // doors
    for (const d of doors) {
      const wall = walls.find(w => w.id === d.wallId);
      if (!wall) continue;
      const dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) continue;
      const px = wall.start.x + (dx / len) * len * d.position;
      const py = wall.start.y + (dy / len) * len * d.position;
      if (dist(world, { x: px, y: py }) <= d.width / 2 + 10) {
        return { type: 'door', id: d.id } as const;
      }
    }

    // windows
    for (const win of windows) {
      const wall = walls.find(w => w.id === win.wallId);
      if (!wall) continue;
      const dx = wall.end.x - wall.start.x, dy = wall.end.y - wall.start.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) continue;
      const px = wall.start.x + (dx / len) * len * win.position;
      const py = wall.start.y + (dy / len) * len * win.position;
      if (dist(world, { x: px, y: py }) <= win.width / 2 + 10) {
        return { type: 'window', id: win.id } as const;
      }
    }

    for (let i = furniture.length - 1; i >= 0; i--) {
      const f = furniture[i];
      const rot = (f.rotation * Math.PI) / 180;
      const dx = world.x - f.position.x, dy = world.y - f.position.y;
      const lx = dx * Math.cos(-rot) - dy * Math.sin(-rot);
      const ly = dx * Math.sin(-rot) + dy * Math.cos(-rot);
      if (Math.abs(lx) <= f.width / 2 && Math.abs(ly) <= f.depth / 2)
        return { type: 'furniture', id: f.id } as const;
    }
    for (let i = walls.length - 1; i >= 0; i--) {
      const wall = walls[i];
      const res = projectOnWall(world, wall);
      if (res && dist(world, res.pt) < wall.thickness / 2 + 6) return { type: 'wall', id: wall.id } as const;
    }
    for (let i = rooms.length - 1; i >= 0; i--) {
      const room = rooms[i];
      if (ptInPolygon(world, room.points)) return { type: 'room', id: room.id } as const;
    }
    return null;
  };

  // compute cursor style
  const computeCursor = (world: Point): string => {
    const { activeTool } = storeRef.current;
    if (activeTool === 'wall' || activeTool === 'room') return 'crosshair';
    if (activeTool === 'polygon-room') return 'crosshair';
    if (activeTool === 'furniture') return 'copy';
    if (activeTool === 'door' || activeTool === 'window') return 'cell';
    const hit = hitTest(world);
    if (!hit) return 'default';
    if (hit.type === 'room-vertex' || hit.type === 'furn-resize') return 'grab';
    if (hit.type === 'wall-start' || hit.type === 'wall-end') return 'grab';
    if (hit.type === 'furniture' || hit.type === 'room') return 'move';
    if (hit.type === 'wall') return 'pointer';
    return 'default';
  };

  const [cursor, setCursor] = useState('default');

  // ── double click: close polygon ────────────────────────────────────────────
  const onDblClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const { activeTool, polygonPoints, closePolygon } = storeRef.current;
    if (activeTool === 'polygon-room' && polygonPoints.length >= 3) {
      closePolygon();
    }
  }, []);

  // ── mouse down ─────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const { sx, sy } = getXY(e);
    const world = toWorld(sx, sy);
    const sp = snapP(world);
    const { activeTool, setSelectedId, addWall, addRoom, addFurniture,
      addDoor, addWindow, selectedFurnitureType, selectedRoomType,
      polygonPoints, addPolygonPoint, closePolygon } = storeRef.current;
    const { x: vx, y: vy } = viewRef.current;

    // ── drawing tools ──────────────────────────────────────────────────────
    if (activeTool === 'wall') {
      dragRef.current = { kind: 'draw-wall', start: snapWallPoint(world) };
      return;
    }
    if (activeTool === 'room') {
      dragRef.current = { kind: 'draw-room', start: sp };
      return;
    }
    // ── polygon room: click to add vertices ────────────────────────────────
    if (activeTool === 'polygon-room') {
      // if near first point and have >= 3 pts → close
      if (polygonPoints.length >= 3 && dist(sp, polygonPoints[0]) < POLY_CLOSE_DIST / viewRef.current.scale) {
        closePolygon();
      } else {
        addPolygonPoint(sp);
      }
      return;
    }
    if (activeTool === 'furniture') {
      const cfg = FURNITURE_CFG[selectedFurnitureType];
      addFurniture({
        id: 'f_' + Math.random().toString(36).slice(2), type: selectedFurnitureType,
        position: sp, rotation: 0, width: cfg.w, depth: cfg.d, color: cfg.fill
      });
      setSelectedId(null);
      return;
    }
    if (activeTool === 'door' || activeTool === 'window') {
      const best = bestWallSnap(world);
      if (best && best.d < SNAP_DIST) {
        if (activeTool === 'door') addDoor({ id: 'd_' + Math.random().toString(36).slice(2), wallId: best.wall.id, position: best.t, width: 90, swingDirection: 'left', material: 'wood' });
        else addWindow({ id: 'w_' + Math.random().toString(36).slice(2), wallId: best.wall.id, position: best.t, width: 120, height: 150, sillHeight: 90 });
      }
      return;
    }

    // ── select mode ────────────────────────────────────────────────────────
    const hit = hitTest(world);

    if (hit?.type === 'room-vertex') {
      const room = storeRef.current.rooms.find(r => r.id === hit.id)!;
      dragRef.current = { kind: 'move-room-vertex', id: hit.id, vertIdx: hit.vertIdx, pts0: room.points.map(p => ({ ...p })) };
      return;
    }
    if (hit?.type === 'furn-resize') {
      const f = storeRef.current.furniture.find(fi => fi.id === hit.id)!;
      dragRef.current = {
        kind: 'resize-furniture', id: hit.id, corner: hit.corner,
        ox: f.position.x, oy: f.position.y, w0: f.width, d0: f.depth, wx0: world.x, wy0: world.y
      };
      return;
    }
    if (hit?.type === 'wall-start') {
      dragRef.current = { kind: 'move-wall-start', id: hit.id };
      return;
    }
    if (hit?.type === 'wall-end') {
      dragRef.current = { kind: 'move-wall-end', id: hit.id };
      return;
    }
    if (hit?.type === 'furniture') {
      const f = storeRef.current.furniture.find(fi => fi.id === hit.id)!;
      setSelectedId(hit.id);
      dragRef.current = { kind: 'move-furniture', id: hit.id, ox: f.position.x, oy: f.position.y, wx0: world.x, wy0: world.y };
      return;
    }
    if (hit?.type === 'door') {
      const door = storeRef.current.doors.find(d => d.id === hit.id)!;
      setSelectedId(hit.id);
      dragRef.current = { kind: 'move-opening', type: 'door', id: hit.id, wallId: door.wallId, pos0: door.position, wx0: world.x, wy0: world.y };
      return;
    }
    if (hit?.type === 'window') {
      const win = storeRef.current.windows.find(w => w.id === hit.id)!;
      setSelectedId(hit.id);
      dragRef.current = { kind: 'move-opening', type: 'window', id: hit.id, wallId: win.wallId, pos0: win.position, wx0: world.x, wy0: world.y };
      return;
    }
    if (hit?.type === 'wall') {
      const wall = storeRef.current.walls.find(w => w.id === hit.id)!;
      setSelectedId(hit.id);
      dragRef.current = { kind: 'move-wall', id: hit.id, start0: { ...wall.start }, end0: { ...wall.end }, wx0: world.x, wy0: world.y };
      return;
    }
    if (hit?.type === 'room') {
      const room = storeRef.current.rooms.find(r => r.id === hit.id)!;
      setSelectedId(hit.id);
      dragRef.current = { kind: 'move-room', id: hit.id, pts0: room.points.map(p => ({ ...p })), wx0: world.x, wy0: world.y };
      return;
    }

    // empty canvas → pan (store the screen-space origin so mousemove can compute a clean delta)
    setSelectedId(null);
    dragRef.current = { kind: 'pan', vx0: vx, vy0: vy, sx0: sx, sy0: sy };
  }, [toWorld]);

  // ── mouse move ─────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const { sx, sy } = getXY(e);
    const world = toWorld(sx, sy);
    mouseRef.current = world;
    const sp = snapP(world);
    const drag = dragRef.current;

    // update cursor
    setCursor(computeCursor(world));

    if (!drag) return;

    if (drag.kind === 'pan') {
      viewRef.current.x = drag.vx0 + (sx - drag.sx0);
      viewRef.current.y = drag.vy0 + (sy - drag.sy0);
      return;
    }

    if (drag.kind === 'move-room') {
      const dx = world.x - drag.wx0, dy = world.y - drag.wy0;
      const sdx = snapV(dx), sdy = snapV(dy);
      const newPts = drag.pts0.map(p => ({ x: p.x + sdx, y: p.y + sdy }));
      storeRef.current.updateRoom(drag.id, { points: newPts });
      return;
    }

    // ── polygon vertex drag ──────────────────────────────────────────────────
    if (drag.kind === 'move-room-vertex') {
      const newPts = drag.pts0.map((p, i) => i === drag.vertIdx ? sp : { ...p });
      storeRef.current.updateRoom(drag.id, { points: newPts });
      return;
    }

    if (drag.kind === 'move-furniture') {
      const dx = world.x - drag.wx0, dy = world.y - drag.wy0;
      storeRef.current.updateFurniture(drag.id, { position: { x: snapV(drag.ox + dx), y: snapV(drag.oy + dy) } });
      return;
    }

    if (drag.kind === 'resize-furniture') {
      const f = storeRef.current.furniture.find(fi => fi.id === drag.id)!;
      const dx = world.x - drag.wx0, dy = world.y - drag.wy0;
      let nw = drag.w0, nd = drag.d0, nx = drag.ox, ny = drag.oy;
      // corner 0=TL, 1=TR, 2=BR, 3=BL (in local furniture coords, unrotated)
      if (drag.corner === 0) { nw = Math.max(40, drag.w0 - dx * 2); nd = Math.max(40, drag.d0 - dy * 2); }
      else if (drag.corner === 1) { nw = Math.max(40, drag.w0 + dx * 2); nd = Math.max(40, drag.d0 - dy * 2); }
      else if (drag.corner === 2) { nw = Math.max(40, drag.w0 + dx * 2); nd = Math.max(40, drag.d0 + dy * 2); }
      else if (drag.corner === 3) { nw = Math.max(40, drag.w0 - dx * 2); nd = Math.max(40, drag.d0 + dy * 2); }
      storeRef.current.updateFurniture(drag.id, { width: snapV(nw), depth: snapV(nd) });
      return;
    }

    if (drag.kind === 'move-wall-start') {
      storeRef.current.updateWall(drag.id, { start: snapWallPoint(world, drag.id) });
      return;
    }
    if (drag.kind === 'move-wall-end') {
      storeRef.current.updateWall(drag.id, { end: snapWallPoint(world, drag.id) });
      return;
    }
    if (drag.kind === 'move-wall') {
      const dx = world.x - drag.wx0, dy = world.y - drag.wy0;
      const sdx = snapV(dx), sdy = snapV(dy);
      storeRef.current.updateWall(drag.id, {
        start: { x: drag.start0.x + sdx, y: drag.start0.y + sdy },
        end: { x: drag.end0.x + sdx, y: drag.end0.y + sdy }
      });
      return;
    }
    if (drag.kind === 'move-opening') {
      const wall = storeRef.current.walls.find(w => w.id === drag.wallId);
      if (!wall) return;
      const res = projectOnWall(world, wall);
      if (res) {
        const newPos = Math.max(0.02, Math.min(0.98, res.t));
        if (drag.type === 'door') {
          storeRef.current.updateDoor(drag.id, { position: newPos });
        } else {
          storeRef.current.updateWindow(drag.id, { position: newPos });
        }
      }
      return;
    }
  }, [toWorld]);

  // ── mouse up ───────────────────────────────────────────────────────────────
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    const { sx, sy } = getXY(e);
    const world = toWorld(sx, sy);
    const sp = snapP(world);
    const drag = dragRef.current;
    const { activeTool, addWall, addRoom, selectedRoomType } = storeRef.current;

    if (drag?.kind === 'draw-wall') {
      const endPt = snapWallPoint(world);
      if (dist(drag.start, endPt) > 10) {
        addWall({
          id: 'w_' + Math.random().toString(36).slice(2), start: drag.start, end: endPt,
          thickness: WALL_T, height: 280, material: 'white-paint'
        });
      }
    }
    if (drag?.kind === 'draw-room') {
      const rw = Math.abs(sp.x - drag.start.x), rh = Math.abs(sp.y - drag.start.y);
      if (rw > 20 && rh > 20) {
        const clr = ROOM_COLORS[selectedRoomType] ?? ROOM_COLORS.living;
        const points = getPointsForShape(roomShapeRef.current, drag.start, sp);
        addRoom({
          id: 'r_' + Math.random().toString(36).slice(2),
          name: selectedRoomType.charAt(0).toUpperCase() + selectedRoomType.slice(1),
          type: selectedRoomType,
          points,
          floorMaterial: 'hardwood', color: clr.fill
        });
      }
    }

    dragRef.current = null;
  }, [toWorld]);

  // ── export / import ────────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    const { walls, rooms, doors, windows, furniture } = storeRef.current;
    const data = { version: 1, exportedAt: new Date().toISOString(), walls, rooms, doors, windows, furniture };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floorplan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImportClick = useCallback(() => { fileInputRef.current?.click(); }, []);

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data || !Array.isArray(data.walls) || !Array.isArray(data.rooms)) {
          throw new Error('missing walls/rooms arrays');
        }
        const s = storeRef.current;
        // clear current plan (walls last, since doors/windows reference wallId)
        [...s.furniture].forEach(f => s.deleteFurniture(f.id));
        [...s.doors].forEach(d => s.deleteDoor(d.id));
        [...s.windows].forEach(w => s.deleteWindow(w.id));
        [...s.rooms].forEach(r => s.deleteRoom(r.id));
        [...s.walls].forEach(w => s.deleteWall(w.id));
        // re-add from file (walls first so door/window wallId refs resolve)
        (data.walls as Wall[]).forEach(w => s.addWall(w));
        (data.rooms as Room[]).forEach(r => s.addRoom(r));
        (data.doors ?? []).forEach((d: any) => s.addDoor(d));
        (data.windows ?? []).forEach((w: any) => s.addWindow(w));
        (data.furniture as Furniture[] ?? []).forEach(f => s.addFurniture(f));
        s.setSelectedId(null);
        setImportError(null);
      } catch (err) {
        setImportError('Could not load that file — not a valid floor plan JSON.');
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
  }, []);

  // ── wheel zoom ─────────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const { sx, sy } = getXY(e);
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    const v = viewRef.current;
    const ns = Math.min(8, Math.max(0.08, v.scale * factor));
    viewRef.current = { x: sx - (sx - v.x) * (ns / v.scale), y: sy - (sy - v.y) * (ns / v.scale), scale: ns };
    storeRef.current.setScale(ns);
    forceRender(n => n + 1);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden select-none" style={{ background: '#16213e' }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <canvas ref={overlayRef} className="absolute inset-0 pointer-events-none" />

      {/* interaction layer */}
      <div
        className="absolute inset-0"
        style={{ cursor }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDblClick}
        onMouseLeave={() => { dragRef.current = null; }}
        onWheel={onWheel}
      />

      {/* export / import */}
      <div className="absolute top-3 right-3 z-30 flex gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-black/75 border border-emerald-500/40 rounded-full text-[11px] text-emerald-400 font-mono hover:bg-black/90 transition-colors"
        >
          ⬇ Export
        </button>
        <button
          onClick={handleImportClick}
          className="px-3 py-1.5 bg-black/75 border border-blue-400/40 rounded-full text-[11px] text-blue-300 font-mono hover:bg-black/90 transition-colors"
        >
          ⬆ Import
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
      </div>
      {importError && (
        <div className="absolute top-14 right-3 z-30 px-3 py-1.5 bg-red-950/90 border border-red-500/40 rounded-full text-[11px] text-red-300 font-mono pointer-events-none">
          {importError}
        </div>
      )}

      {/* room shape picker */}
      {store.activeTool === 'room' && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
          {ROOM_SHAPES.map(shape => (
            <button
              key={shape}
              onClick={() => setRoomShape(shape)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono border transition-colors ${roomShape === shape
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-black/75 text-amber-400 border-amber-500/40 hover:bg-black/90'
                }`}
            >
              {shape === 'rect' ? 'Rect' : shape.replace('-shape', '').toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* tool hints */}
      {store.activeTool === 'wall' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-amber-500/40 rounded-full text-[11px] text-amber-400 font-mono flex items-center gap-2 pointer-events-none backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Click & drag to draw a wall · Esc to cancel
        </div>
      )}
      {store.activeTool === 'room' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-amber-500/40 rounded-full text-[11px] text-amber-400 font-mono flex items-center gap-2 pointer-events-none backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          Click & drag to draw room · Drag to move · Vertex ● handles to reshape
        </div>
      )}
      {store.activeTool === 'polygon-room' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-green-500/40 rounded-full text-[11px] text-green-400 font-mono flex items-center gap-2 pointer-events-none backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
          Click to add vertices · Dbl-click or click ● to close polygon · Esc to cancel
        </div>
      )}
      {store.activeTool === 'furniture' && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-amber-500/40 rounded-full text-[11px] text-amber-400 font-mono pointer-events-none backdrop-blur-sm">
          Click to place {FURNITURE_CFG[store.selectedFurnitureType]?.label} · Switch to Select to move / resize
        </div>
      )}
      {(store.activeTool === 'door' || store.activeTool === 'window') && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-blue-400/40 rounded-full text-[11px] text-blue-300 font-mono pointer-events-none backdrop-blur-sm">
          Hover near a wall and click to add {store.activeTool}
        </div>
      )}
      {store.activeTool === 'select' && store.selectedId && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-black/75 border border-amber-500/30 rounded-full text-[11px] text-amber-400/80 font-mono pointer-events-none backdrop-blur-sm">
          Drag to move · Drag vertex ● to reshape · Delete to remove · Ctrl+Z undo
        </div>
      )}
    </div>
  );
}