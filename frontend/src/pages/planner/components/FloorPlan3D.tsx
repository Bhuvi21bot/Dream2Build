import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Environment, OrthographicCamera, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { usePlannerStore } from '../store';
import { Wall, Door, Window, Furniture, FurnitureType, FurnitureStyle, Room } from '../types';

// ─── Floor material definitions ──────────────────────────────────────────────
interface MatDef {
  color: string;
  roughness: number;
  metalness: number;
  gridColor?: string;
  gridSpacing?: number;
  texture: 'wood' | 'tile' | 'marble' | 'carpet' | 'concrete';
}

const FLOOR_MATERIALS: Record<string, MatDef> = {
  hardwood: { color: '#a0612a', roughness: 0.45, metalness: 0.05, gridColor: '#7a4a1a', gridSpacing: 80, texture: 'wood' },
  tiles: { color: '#d8d0c4', roughness: 0.25, metalness: 0.12, gridColor: '#aaa499', gridSpacing: 60, texture: 'tile' },
  marble: { color: '#f0eeea', roughness: 0.08, metalness: 0.18, gridColor: '#d8d4ce', gridSpacing: 200, texture: 'marble' },
  carpet: { color: '#4a5a6a', roughness: 1.0, metalness: 0.0, texture: 'carpet' },
  concrete: { color: '#7a7a7a', roughness: 0.88, metalness: 0.0, gridColor: '#666', gridSpacing: 300, texture: 'concrete' },
};

interface WallMatDef { color: string; roughness: number; metalness?: number; texture?: 'brick' | 'panel' }
const WALL_MATERIALS: Record<string, WallMatDef> = {
  'white-paint': { color: '#f0eeea', roughness: 0.9 },
  'concrete': { color: '#808080', roughness: 0.85 },
  'brick': { color: '#b36038', roughness: 0.95, texture: 'brick' },
  'wood-panel': { color: '#7a4a20', roughness: 0.65, metalness: 0.05, texture: 'panel' },
};

const DOOR_HEIGHT = 210; // cm — doors don't carry a height field in the data model, so we assume a standard height
const BASEBOARD_H = 9;  // cm — skirting board height at the foot of each wall

// ─── color helpers ────────────────────────────────────────────────────────────
function shade(hex: string, amt: number): string {
  const c = hex.replace('#', '');
  const num = parseInt(c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c, 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt >= 0 ? (255 - v) * amt : v * amt))));
  r = f(r); g = f(g); b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── procedural PBR-ish canvas textures (generated once, cached & reused) ─────
const textureCache: Record<string, THREE.CanvasTexture> = {};

function cached(key: string, factory: () => THREE.CanvasTexture): THREE.CanvasTexture {
  if (!textureCache[key]) {
    const tex = factory();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    textureCache[key] = tex;
  }
  return textureCache[key];
}

function newCanvas(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  return { canvas, ctx: canvas.getContext('2d')! };
}

function makeWoodTexture(base: string): THREE.CanvasTexture {
  return cached('wood-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
    const plankH = 32;
    for (let y = 0; y < 256; y += plankH) {
      const tone = shade(base, (Math.random() - 0.5) * 0.18);
      ctx.fillStyle = tone;
      ctx.fillRect(0, y, 256, plankH - 2);
      ctx.strokeStyle = shade(tone, -0.12);
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 5; i++) {
        const gy = y + Math.random() * plankH;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        for (let x = 0; x <= 256; x += 32) ctx.lineTo(x, gy + (Math.random() - 0.5) * 3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = shade(base, -0.4);
      ctx.beginPath(); ctx.moveTo(0, y + plankH - 1); ctx.lineTo(256, y + plankH - 1); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(4, 4);
    return tex;
  });
}

function makeTileTexture(base: string, grout: string): THREE.CanvasTexture {
  return cached('tile-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    ctx.fillStyle = grout; ctx.fillRect(0, 0, 256, 256);
    const cell = 64, gap = 3;
    for (let y = 0; y < 256; y += cell) {
      for (let x = 0; x < 256; x += cell) {
        ctx.fillStyle = shade(base, (Math.random() - 0.5) * 0.08);
        ctx.fillRect(x + gap, y + gap, cell - gap * 2, cell - gap * 2);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(3, 3);
    return tex;
  });
}

function makeMarbleTexture(base: string): THREE.CanvasTexture {
  return cached('marble-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = shade(base, -0.25);
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 10; i++) {
      ctx.globalAlpha = 0.25 + Math.random() * 0.25;
      ctx.beginPath();
      let x = Math.random() * 256, y = 0;
      ctx.moveTo(x, y);
      while (y < 256) {
        x += (Math.random() - 0.5) * 60;
        y += 20 + Math.random() * 30;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(2, 2);
    return tex;
  });
}

function makeCarpetTexture(base: string): THREE.CanvasTexture {
  return cached('carpet-' + base, () => {
    const { canvas, ctx } = newCanvas(128);
    ctx.fillStyle = base; ctx.fillRect(0, 0, 128, 128);
    const imgData = ctx.getImageData(0, 0, 128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 20;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
      imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + n));
      imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(6, 6);
    return tex;
  });
}

function makeConcreteTexture(base: string): THREE.CanvasTexture {
  return cached('concrete-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 0 : 255},${Math.random() > 0.5 ? 0 : 255},${Math.random() > 0.5 ? 0 : 255},${Math.random() * 0.06})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 3, Math.random() * 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(3, 3);
    return tex;
  });
}

function makeBrickTexture(base: string): THREE.CanvasTexture {
  return cached('brick-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    const mortar = '#c9c2b8';
    ctx.fillStyle = mortar; ctx.fillRect(0, 0, 256, 256);
    const bw = 64, bh = 24, gap = 4;
    let row = 0;
    for (let y = 0; y < 256; y += bh) {
      const offset = row % 2 === 0 ? 0 : bw / 2;
      for (let x = -bw; x < 256 + bw; x += bw) {
        ctx.fillStyle = shade(base, (Math.random() - 0.5) * 0.15);
        ctx.fillRect(x + offset + gap / 2, y + gap / 2, bw - gap, bh - gap);
      }
      row++;
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(2, 1);
    return tex;
  });
}

function makeWoodPanelTexture(base: string): THREE.CanvasTexture {
  return cached('panel-' + base, () => {
    const { canvas, ctx } = newCanvas(256);
    ctx.fillStyle = base; ctx.fillRect(0, 0, 256, 256);
    const plankW = 40;
    for (let x = 0; x < 256; x += plankW) {
      ctx.fillStyle = shade(base, (Math.random() - 0.5) * 0.14);
      ctx.fillRect(x, 0, plankW - 2, 256);
      ctx.strokeStyle = shade(base, -0.35);
      ctx.beginPath(); ctx.moveTo(x + plankW - 1, 0); ctx.lineTo(x + plankW - 1, 256); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(1, 1);
    return tex;
  });
}

function textureFor(def: MatDef): THREE.CanvasTexture {
  switch (def.texture) {
    case 'wood': return makeWoodTexture(def.color);
    case 'tile': return makeTileTexture(def.color, def.gridColor ?? '#999');
    case 'marble': return makeMarbleTexture(def.color);
    case 'carpet': return makeCarpetTexture(def.color);
    case 'concrete': return makeConcreteTexture(def.color);
  }
}

function wallTextureFor(def: WallMatDef): THREE.CanvasTexture | null {
  if (def.texture === 'brick') return makeBrickTexture(def.color);
  if (def.texture === 'panel') return makeWoodPanelTexture(def.color);
  return null;
}

// ─── Floor tile grid overlay (fine reference lines on top of the texture) ─────
function FloorGrid({ xs, ys, spacing, color }: { xs: number; ys: number; spacing: number; color: string }) {
  const points: THREE.Vector3[] = [];
  const xMin = Math.floor(xs / spacing) * spacing;
  const xMax = Math.ceil((xs + 1200) / spacing) * spacing;
  const yMin = Math.floor(ys / spacing) * spacing;
  const yMax = Math.ceil((ys + 1200) / spacing) * spacing;

  for (let x = xMin; x <= xMax; x += spacing) {
    points.push(new THREE.Vector3(x, 0.15, yMin), new THREE.Vector3(x, 0.15, yMax));
  }
  for (let y = yMin; y <= yMax; y += spacing) {
    points.push(new THREE.Vector3(xMin, 0.15, y), new THREE.Vector3(xMax, 0.15, y));
  }

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} opacity={0.25} transparent />
    </lineSegments>
  );
}

// ─── Wall with real door/window openings + baseboard trim ─────────────────────
function Wall3D({ wall, doors, windows }: { wall: Wall; doors: Door[]; windows: Window[] }) {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;
  const angle = Math.atan2(dy, dx);
  const cx = wall.start.x + dx / 2;
  const cy = wall.start.y + dy / 2;
  const matDef = WALL_MATERIALS[wall.material] ?? WALL_MATERIALS['white-paint'];
  const wallTex = wall.paintColor ? null : wallTextureFor(matDef);
  const matArgs = wall.paintColor
    ? { color: wall.paintColor, roughness: 0.75, metalness: 0 }
    : { color: matDef.color, roughness: matDef.roughness, metalness: matDef.metalness ?? 0 };

  const wallDoors = doors.filter(d => d.wallId === wall.id);
  const wallWindows = windows.filter(w => w.wallId === wall.id);

  if (wallDoors.length === 0 && wallWindows.length === 0) {
    return (
      <group position={[cx, 0, cy]} rotation={[0, -angle, 0]}>
        <mesh position={[0, wall.height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[length, wall.height, wall.thickness]} />
          {wallTex ? <meshStandardMaterial map={wallTex} roughness={matDef.roughness} metalness={matDef.metalness ?? 0} /> : <meshStandardMaterial {...matArgs} />}
        </mesh>
        <mesh position={[0, BASEBOARD_H / 2, wall.thickness / 2 - 1]} castShadow>
          <boxGeometry args={[length, BASEBOARD_H, 2]} />
          <meshStandardMaterial color="#e8e5df" roughness={0.4} />
        </mesh>
        <mesh position={[0, BASEBOARD_H / 2, -wall.thickness / 2 + 1]} castShadow>
          <boxGeometry args={[length, BASEBOARD_H, 2]} />
          <meshStandardMaterial color="#e8e5df" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  type Opening =
    | { type: 'door'; pos: number; width: number }
    | { type: 'window'; pos: number; width: number; sill: number; height: number; curtains?: boolean; curtainColor?: string };

  const openings: Opening[] = [
    ...wallDoors.map(d => ({ type: 'door' as const, pos: d.position * length, width: d.width })),
    ...wallWindows.map(w => ({ type: 'window' as const, pos: w.position * length, width: w.width, sill: w.sillHeight, height: w.height, curtains: w.curtains, curtainColor: w.curtainColor })),
  ].sort((a, b) => a.pos - b.pos);

  const segs: JSX.Element[] = [];
  let cursor = 0;

  const wallMat = () => wallTex
    ? <meshStandardMaterial map={wallTex} roughness={matDef.roughness} metalness={matDef.metalness ?? 0} />
    : <meshStandardMaterial {...matArgs} />;

  const solidSeg = (key: string, from: number, to: number, yCenter: number, h: number) => {
    if (to - from <= 0.01) return;
    const localX = (from + to) / 2 - length / 2;
    segs.push(
      <mesh key={key} position={[localX, yCenter, 0]} castShadow receiveShadow>
        <boxGeometry args={[to - from, h, wall.thickness]} />
        {wallMat()}
      </mesh>
    );
  };

  openings.forEach((o, i) => {
    const left = Math.max(0, o.pos - o.width / 2);
    const right = Math.min(length, o.pos + o.width / 2);
    solidSeg(`pre-${i}`, cursor, left, wall.height / 2, wall.height);

    const openLocalX = o.pos - length / 2;

    if (o.type === 'door') {
      const doorH = Math.min(DOOR_HEIGHT, wall.height - 5);
      const lintelH = wall.height - doorH;
      if (lintelH > 0) {
        segs.push(
          <mesh key={`lintel-${i}`} position={[openLocalX, doorH + lintelH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, lintelH, wall.thickness]} />
            {wallMat()}
          </mesh>
        );
      }
      segs.push(
        <mesh key={`leaf-${i}`} position={[openLocalX + (right - left) * 0.18, doorH / 2, 0]} castShadow>
          <boxGeometry args={[Math.max(10, (right - left) * 0.62), doorH - 4, Math.max(3, wall.thickness * 0.35)]} />
          <meshStandardMaterial map={makeWoodPanelTexture('#6b4a30')} roughness={0.5} />
        </mesh>
      );
      segs.push(
        <mesh key={`handle-${i}`} position={[openLocalX + (right - left) * 0.18 + (right - left) * 0.62 * 0.35, doorH * 0.45, wall.thickness * 0.22]} castShadow>
          <sphereGeometry args={[1.8, 8, 8]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>
      );
      segs.push(
        <mesh key={`frame-${i}`} position={[openLocalX, doorH / 2, 0]}>
          <boxGeometry args={[right - left, doorH, wall.thickness + 1]} />
          <meshStandardMaterial color="#3a2a1a" wireframe />
        </mesh>
      );
    } else {
      const sill = o.sill, header = o.sill + o.height;
      if (sill > 0) {
        segs.push(
          <mesh key={`sill-${i}`} position={[openLocalX, sill / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, sill, wall.thickness]} />
            {wallMat()}
          </mesh>
        );
        segs.push(
          <mesh key={`ledge-${i}`} position={[openLocalX, sill - 1, wall.thickness / 2 + 1.5]} castShadow>
            <boxGeometry args={[right - left + 6, 2.5, 3]} />
            <meshStandardMaterial color="#e8e5df" roughness={0.3} />
          </mesh>
        );
      }
      if (header < wall.height) {
        segs.push(
          <mesh key={`header-${i}`} position={[openLocalX, header + (wall.height - header) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, wall.height - header, wall.thickness]} />
            {wallMat()}
          </mesh>
        );
      }
      segs.push(
        <mesh key={`glass-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[right - left - 2, o.height - 2, Math.max(2, wall.thickness * 0.25)]} />
          <meshPhysicalMaterial
            color="#dceeff"
            transparent opacity={0.28}
            roughness={0.04}
            metalness={0}
            transmission={0.85}
            thickness={2}
            ior={1.5}
            envMapIntensity={1.2}
          />
        </mesh>
      );
      segs.push(
        <mesh key={`wframe-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[right - left, o.height, wall.thickness + 1]} />
          <meshStandardMaterial color="#2a2a2a" wireframe />
        </mesh>
      );
      segs.push(
        <mesh key={`mullion-v-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[1.5, o.height, wall.thickness + 1.2]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      );
      segs.push(
        <mesh key={`mullion-h-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[right - left, 1.5, wall.thickness + 1.2]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      );
      if (o.curtains) {
        const curtainColor = o.curtainColor ?? '#d8cfc0';
        const curtainH = wall.height - sill * 0.15; // hangs from near-ceiling down past the sill
        const curtainY = curtainH / 2 + sill * 0.1;
        const panelW = (right - left) * 0.38;
        [-1, 1].forEach((side) => {
          segs.push(
            <mesh
              key={`curtain-${i}-${side}`}
              position={[openLocalX + side * ((right - left) / 2 + panelW * 0.3), curtainY, wall.thickness / 2 + 3]}
              castShadow
            >
              <boxGeometry args={[panelW, curtainH, 3]} />
              <meshStandardMaterial map={makeCarpetTexture(curtainColor)} roughness={0.95} />
            </mesh>
          );
        });
        // curtain rod
        segs.push(
          <mesh key={`rod-${i}`} position={[openLocalX, wall.height - sill * 0.1, wall.thickness / 2 + 3]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, right - left + panelW * 1.4, 8]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      }
    }

    cursor = right;
  });

  solidSeg('post-last', cursor, length, wall.height / 2, wall.height);

  return <group position={[cx, 0, cy]} rotation={[0, -angle, 0]}>{segs}</group>;
}

// ─── Type-specific furniture geometry ─────────────────────────────────────────
function FurnitureMesh({ f }: { f: Furniture }) {
  const base = f.color;
  const dark = shade(base, -0.35);
  const light = shade(base, 0.25);
  const { width: w, depth: d, type } = f;
  const style: FurnitureStyle = f.style ?? 'modern';
  const woodTex = useMemo(() => makeWoodTexture(shade(base, -0.2)), [base]);
  const fabricTex = useMemo(() => makeCarpetTexture(base), [base]);

  // Style-driven detail knobs, shared across cases below:
  // - legTaper: how much slimmer legs get toward the floor (rustic = chunky, minimalist = thin)
  // - cushions: whether soft-seating gets scatter cushions (skipped for minimalist)
  // - legMetal: whether legs read as metal (modern) or wood (classic/rustic/minimalist default wood)
  const legTaper = style === 'rustic' ? 1.3 : style === 'minimalist' ? 0.6 : 1;
  const showCushions = style !== 'minimalist';
  const legsAreMetal = style === 'modern';

  switch (type as FurnitureType) {
    case 'sofa':
      return (
        <group>
          <mesh position={[0, 20, 0]} castShadow><boxGeometry args={[w, 40, d]} /><meshStandardMaterial map={fabricTex} roughness={0.85} /></mesh>
          <mesh position={[0, 55, -d / 2 + 8]} castShadow><boxGeometry args={[w, 40, 16]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          <mesh position={[-w / 2 + 8, 45, 0]} castShadow><boxGeometry args={[16, 30, d - 16]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          <mesh position={[w / 2 - 8, 45, 0]} castShadow><boxGeometry args={[16, 30, d - 16]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          {showCushions && (
            <>
              <mesh position={[-w / 4, 46, -d / 4]} rotation={[0, 0.3, 0.1]} castShadow>
                <boxGeometry args={[26, 10, 26]} /><meshStandardMaterial color={light} roughness={0.9} />
              </mesh>
              <mesh position={[w / 4, 46, -d / 4]} rotation={[0, -0.25, -0.1]} castShadow>
                <boxGeometry args={[26, 10, 26]} /><meshStandardMaterial color={shade(base, 0.4)} roughness={0.9} />
              </mesh>
            </>
          )}
        </group>
      );

    case 'bed':
      return (
        <group>
          <mesh position={[0, 15, 0]} castShadow><boxGeometry args={[w, 25, d]} /><meshStandardMaterial map={woodTex} roughness={0.8} /></mesh>
          <mesh position={[0, 32, 4]} castShadow><boxGeometry args={[w - 6, 14, d - 20]} /><meshStandardMaterial color={base} roughness={0.95} /></mesh>
          <mesh position={[0, 40, d / 2 - 30]} rotation={[0.05, 0, 0]} castShadow>
            <boxGeometry args={[w - 10, 8, 34]} /><meshStandardMaterial color={shade(base, -0.15)} roughness={0.95} />
          </mesh>
          <mesh position={[0, 42, -d / 2 + 16]} castShadow><boxGeometry args={[w - 16, 10, 24]} /><meshStandardMaterial color={light} roughness={1} /></mesh>
          <mesh position={[-w / 4, 44, -d / 2 + 16]} rotation={[0, 0, 0.05]} castShadow><boxGeometry args={[w / 2 - 12, 9, 22]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>
          <mesh position={[0, 65, -d / 2 + 4]} castShadow><boxGeometry args={[w, 60, 8]} /><meshStandardMaterial map={woodTex} roughness={0.65} /></mesh>
        </group>
      );

    case 'dining-table':
    case 'desk': {
      const topH = type === 'desk' ? 72 : 75;
      const legR = 3.5 * legTaper;
      const legs = [
        [-w / 2 + 8, -d / 2 + 8], [w / 2 - 8, -d / 2 + 8], [-w / 2 + 8, d / 2 - 8], [w / 2 - 8, d / 2 - 8],
      ];
      return (
        <group>
          <mesh position={[0, topH, 0]} castShadow><boxGeometry args={[w, 4, d]} /><meshStandardMaterial map={woodTex} roughness={0.35} /></mesh>
          {legs.map(([lx, lz], i) => (
            <mesh key={i} position={[lx, topH / 2, lz]} castShadow>
              <cylinderGeometry args={[legR * 0.8, legR, topH, 10]} />
              {legsAreMetal
                ? <meshStandardMaterial color="#3a3a3a" roughness={0.35} metalness={0.7} />
                : <meshStandardMaterial color={dark} roughness={0.5} metalness={0.05} />}
            </mesh>
          ))}
        </group>
      );
    }

    case 'chair': {
      const legR = 2.5 * legTaper, seatH = 45;
      const legs = [
        [-w / 2 + 6, -d / 2 + 6], [w / 2 - 6, -d / 2 + 6], [-w / 2 + 6, d / 2 - 6], [w / 2 - 6, d / 2 - 6],
      ];
      return (
        <group>
          <mesh position={[0, seatH, 0]} castShadow><boxGeometry args={[w, 5, d]} /><meshStandardMaterial color={base} roughness={0.7} /></mesh>
          <mesh position={[0, seatH + 22, -d / 2 + 3]} castShadow><boxGeometry args={[w, 44, 5]} /><meshStandardMaterial color={base} roughness={0.7} /></mesh>
          {legs.map(([lx, lz], i) => (
            <mesh key={i} position={[lx, seatH / 2, lz]} castShadow>
              <cylinderGeometry args={[legR * 0.7, legR, seatH, 8]} />
              {legsAreMetal
                ? <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.75} />
                : <meshStandardMaterial color={dark} roughness={0.45} metalness={0.05} />}
            </mesh>
          ))}
        </group>
      );
    }

    case 'wardrobe':
      return (
        <group>
          <mesh position={[0, 100, 0]} castShadow><boxGeometry args={[w, 200, d]} /><meshStandardMaterial map={woodTex} roughness={0.5} /></mesh>
          <mesh position={[0, 100, d / 2 + 0.3]}><boxGeometry args={[2, 196, 0.5]} /><meshStandardMaterial color={dark} /></mesh>
          <mesh position={[-w / 4, 100, d / 2 + 1]} castShadow><sphereGeometry args={[2.2, 8, 8]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
          <mesh position={[w / 4, 100, d / 2 + 1]} castShadow><sphereGeometry args={[2.2, 8, 8]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
          {[-w / 4, w / 4].map((px, i) => (
            <mesh key={i} position={[px, 100, d / 2 + 0.35]}><boxGeometry args={[0.6, 196, 0.4]} /><meshStandardMaterial color={dark} /></mesh>
          ))}
        </group>
      );

    case 'kitchen-counter':
      return (
        <group>
          <mesh position={[0, 42, 0]} castShadow><boxGeometry args={[w, 84, d]} /><meshStandardMaterial map={woodTex} roughness={0.6} /></mesh>
          <mesh position={[0, 87, 0]} castShadow><boxGeometry args={[w + 4, 6, d + 4]} /><meshStandardMaterial color={light} roughness={0.1} metalness={0.15} /></mesh>
          {Array.from({ length: Math.max(2, Math.round(w / 60)) }).map((_, i, arr) => (
            <mesh key={i} position={[-w / 2 + (w / arr.length) * (i + 0.5), 55, d / 2 + 0.6]} castShadow>
              <boxGeometry args={[10, 1.5, 1.5]} />
              <meshStandardMaterial color="#c9c9c9" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      );

    case 'toilet':
      return (
        <group>
          <mesh position={[0, 20, d / 4]} castShadow><cylinderGeometry args={[w / 2.4, w / 2.6, 40, 16]} /><meshStandardMaterial color={base} roughness={0.12} /></mesh>
          <mesh position={[0, 55, -d / 2 + 6]} castShadow><boxGeometry args={[w * 0.7, 40, 12]} /><meshStandardMaterial color={base} roughness={0.12} /></mesh>
          <mesh position={[0, 76, -d / 2 + 6]}><boxGeometry args={[w * 0.72, 2, 13]} /><meshStandardMaterial color={shade(base, -0.1)} roughness={0.15} /></mesh>
        </group>
      );

    case 'bathtub':
      return (
        <group>
          <mesh position={[0, 27, 0]} castShadow><boxGeometry args={[w, 55, d]} /><meshStandardMaterial color={base} roughness={0.2} /></mesh>
          <mesh position={[0, 50, 0]} castShadow><boxGeometry args={[w - 14, 8, d - 14]} /><meshStandardMaterial color={light} roughness={0.08} metalness={0.05} /></mesh>
          <mesh position={[w / 2 - 8, 52, -d / 2 + 10]} castShadow><cylinderGeometry args={[2, 2, 6, 8]} /><meshStandardMaterial color="#c9c9c9" metalness={0.8} roughness={0.2} /></mesh>
        </group>
      );

    case 'stairs': {
      const steps = 12;
      const stepH = 18, stepD = d / steps;
      return (
        <group>
          {Array.from({ length: steps }).map((_, i) => (
            <mesh key={i} position={[0, stepH * (i + 1) - stepH / 2, -d / 2 + stepD * i + stepD / 2]} castShadow receiveShadow>
              <boxGeometry args={[w, stepH * (i + 1), stepD]} />
              <meshStandardMaterial map={woodTex} roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    }

    // ── seating additions: armchair/loveseat share the sofa's construction at
    // different scale; bench and ottoman are simpler upholstered forms
    case 'armchair':
    case 'loveseat':
      return (
        <group>
          <mesh position={[0, 20, 0]} castShadow><boxGeometry args={[w, 38, d]} /><meshStandardMaterial map={fabricTex} roughness={0.85} /></mesh>
          <mesh position={[0, 52, -d / 2 + 7]} castShadow><boxGeometry args={[w, 38, 14]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          <mesh position={[-w / 2 + 7, 42, 0]} castShadow><boxGeometry args={[14, 28, d - 14]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          <mesh position={[w / 2 - 7, 42, 0]} castShadow><boxGeometry args={[14, 28, d - 14]} /><meshStandardMaterial color={dark} roughness={0.85} /></mesh>
          {showCushions && (
            <mesh position={[0, 44, 0]} castShadow>
              <boxGeometry args={[w - 30, 8, d - 30]} /><meshStandardMaterial color={light} roughness={0.9} />
            </mesh>
          )}
        </group>
      );

    case 'bench':
      return (
        <group>
          <mesh position={[0, 42, 0]} castShadow><boxGeometry args={[w, 6, d]} /><meshStandardMaterial map={woodTex} roughness={0.5} /></mesh>
          {[[-w / 2 + 6, -d / 2 + 6], [w / 2 - 6, -d / 2 + 6], [-w / 2 + 6, d / 2 - 6], [w / 2 - 6, d / 2 - 6]].map(([lx, lz], i) => (
            <mesh key={i} position={[lx, 20, lz]} castShadow>
              <cylinderGeometry args={[2 * legTaper, 2.5 * legTaper, 40, 8]} />
              {legsAreMetal
                ? <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.7} />
                : <meshStandardMaterial color={dark} roughness={0.5} />}
            </mesh>
          ))}
        </group>
      );

    case 'ottoman':
      return (
        <mesh position={[0, 22, 0]} castShadow>
          <boxGeometry args={[w, 32, d]} />
          <meshStandardMaterial map={fabricTex} roughness={0.85} />
        </mesh>
      );

    // ── nightstand: small cabinet with a drawer face and a lamp on top ──────
    case 'nightstand':
      return (
        <group>
          <mesh position={[0, 25, 0]} castShadow><boxGeometry args={[w, 50, d]} /><meshStandardMaterial map={woodTex} roughness={0.55} /></mesh>
          <mesh position={[0, 30, d / 2 + 0.3]}><boxGeometry args={[w * 0.7, 14, 0.5]} /><meshStandardMaterial color={dark} /></mesh>
          <mesh position={[0, 12, d / 2 + 0.3]}><boxGeometry args={[w * 0.7, 14, 0.5]} /><meshStandardMaterial color={dark} /></mesh>
        </group>
      );

    // ── storage: bookshelf/tv-console/cabinet share a cased-goods construction ─
    case 'bookshelf': {
      const shelves = 4;
      return (
        <group>
          <mesh position={[0, 100, 0]} castShadow><boxGeometry args={[w, 200, d]} /><meshStandardMaterial map={woodTex} roughness={0.6} /></mesh>
          {Array.from({ length: shelves }).map((_, i) => (
            <mesh key={i} position={[0, 40 + i * 45, d * 0.05]}>
              <boxGeometry args={[w - 6, 2, d - 6]} /><meshStandardMaterial color={dark} roughness={0.6} />
            </mesh>
          ))}
        </group>
      );
    }

    case 'tv-console':
      return (
        <group>
          <mesh position={[0, 25, 0]} castShadow><boxGeometry args={[w, 50, d]} /><meshStandardMaterial map={woodTex} roughness={0.5} /></mesh>
          <mesh position={[0, 51, 0]} castShadow><boxGeometry args={[w + 2, 2, d + 2]} /><meshStandardMaterial color={light} roughness={0.2} /></mesh>
          <mesh position={[0, 90, -d / 2 + 3]}>
            <boxGeometry args={[w * 0.75, w * 0.42, 4]} /><meshStandardMaterial color="#111" roughness={0.2} metalness={0.3} />
          </mesh>
        </group>
      );

    case 'cabinet':
      return (
        <group>
          <mesh position={[0, 45, 0]} castShadow><boxGeometry args={[w, 90, d]} /><meshStandardMaterial map={woodTex} roughness={0.55} /></mesh>
          <mesh position={[0, 45, d / 2 + 0.3]}><boxGeometry args={[1.2, 86, 0.5]} /><meshStandardMaterial color={dark} /></mesh>
        </group>
      );

    // ── decor: plant / lamp / mirror — small, purely decorative geometry ────
    case 'plant':
      return (
        <group>
          <mesh position={[0, 15, 0]} castShadow><cylinderGeometry args={[w / 2.5, w / 3, 30, 12]} /><meshStandardMaterial color="#8a6b4e" roughness={0.8} /></mesh>
          <mesh position={[0, 55, 0]} castShadow>
            <sphereGeometry args={[Math.max(w, d) / 2, 8, 8]} />
            <meshStandardMaterial color="#3a6b3a" roughness={0.9} />
          </mesh>
        </group>
      );

    case 'lamp':
      return (
        <group>
          <mesh position={[0, 3, 0]} castShadow><cylinderGeometry args={[w / 2.2, w / 2.2, 6, 12]} /><meshStandardMaterial color={dark} roughness={0.4} metalness={0.4} /></mesh>
          <mesh position={[0, 55, 0]} castShadow><cylinderGeometry args={[1.5, 1.5, 100, 8]} /><meshStandardMaterial color={dark} roughness={0.4} metalness={0.4} /></mesh>
          <mesh position={[0, 112, 0]} castShadow>
            <coneGeometry args={[w / 1.8, 26, 16, 1, true]} />
            <meshStandardMaterial color={base} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[0, 105, 0]} intensity={0.4} distance={200} color="#ffe8b0" />
        </group>
      );

    case 'mirror':
      return (
        <group>
          <mesh position={[0, 90, 0]} castShadow><boxGeometry args={[w, 120, 4]} /><meshStandardMaterial color={dark} roughness={0.5} metalness={0.3} /></mesh>
          <mesh position={[0, 90, 2.2]}>
            <boxGeometry args={[w - 8, 112, 0.5]} />
            <meshStandardMaterial color="#dbe9f5" roughness={0.05} metalness={0.6} />
          </mesh>
        </group>
      );

    // ── outdoor: simple tree and fence-panel geometry ───────────────────────
    case 'outdoor-tree':
      return (
        <group>
          <mesh position={[0, 60, 0]} castShadow><cylinderGeometry args={[6, 9, 120, 10]} /><meshStandardMaterial color="#6b4a30" roughness={0.9} /></mesh>
          <mesh position={[0, 145, 0]} castShadow>
            <sphereGeometry args={[Math.max(w, d) / 2, 10, 10]} />
            <meshStandardMaterial color="#3a6b3a" roughness={0.95} />
          </mesh>
        </group>
      );

    case 'fence':
      return (
        <group>
          {Array.from({ length: Math.max(2, Math.round(w / 25)) }).map((_, i, arr) => (
            <mesh key={i} position={[-w / 2 + (w / arr.length) * (i + 0.5), 45, 0]} castShadow>
              <boxGeometry args={[6, 90, d]} /><meshStandardMaterial map={woodTex} roughness={0.75} />
            </mesh>
          ))}
          <mesh position={[0, 80, 0]} castShadow><boxGeometry args={[w, 8, d]} /><meshStandardMaterial map={woodTex} roughness={0.75} /></mesh>
        </group>
      );

    default:
      return (
        <mesh position={[0, 30, 0]} castShadow>
          <boxGeometry args={[w, 60, d]} />
          <meshStandardMaterial color={base} roughness={0.6} />
        </mesh>
      );
  }
}

// ─── Scene ───────────────────────────────────────────────────────────────────
// ─── Room floor (own component so per-room texture scale/rotation can use hooks) ─
function RoomFloor({ room }: { room: Room }) {
  if (room.points.length < 3) return null;
  const matDef = FLOOR_MATERIALS[room.floorMaterial] ?? FLOOR_MATERIALS.hardwood;
  const baseTex = textureFor(matDef);

  // Clone rather than mutate the shared cached texture, so adjusting this room's
  // scale/rotation doesn't affect every other room using the same floor material.
  const tex = useMemo(() => {
    const t = baseTex.clone();
    t.needsUpdate = true;
    t.center.set(0.5, 0.5);
    t.repeat.copy(baseTex.repeat).multiplyScalar(room.textureScale ?? 1);
    t.rotation = ((room.textureRotation ?? 0) * Math.PI) / 180;
    return t;
  }, [baseTex, room.textureScale, room.textureRotation]);

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(room.points[0].x, room.points[0].y);
    for (let i = 1; i < room.points.length; i++) s.lineTo(room.points[i].x, room.points[i].y);
    return s;
  }, [room.points]);

  const xs = Math.min(...room.points.map(p => p.x));
  const ys = Math.min(...room.points.map(p => p.y));
  const extrudeSettings = { depth: 8, bevelEnabled: false };

  return (
    <group>
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
        <mesh receiveShadow castShadow>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial map={tex} roughness={matDef.roughness} metalness={matDef.metalness} />
        </mesh>
      </group>
      {matDef.gridColor && matDef.gridSpacing && (
        <FloorGrid xs={xs} ys={ys} spacing={matDef.gridSpacing} color={matDef.gridColor} />
      )}
    </group>
  );
}

// ─── Ceiling light — one per room, positioned at its centroid, actually lights the scene ─
function RoomCeilingLight({ room, wallHeight }: { room: Room; wallHeight: number }) {
  const cx = room.points.reduce((s, p) => s + p.x, 0) / room.points.length;
  const cy = room.points.reduce((s, p) => s + p.y, 0) / room.points.length;
  return (
    <group position={[cx, wallHeight - 4, cy]}>
      <pointLight intensity={0.9} distance={500} decay={2} color="#fff4e0" castShadow shadow-mapSize={[512, 512]} />
      <mesh>
        <cylinderGeometry args={[10, 10, 3, 16]} />
        <meshStandardMaterial color="#e8e5df" roughness={0.4} />
      </mesh>
      <mesh position={[0, -3, 0]}>
        <sphereGeometry args={[5, 12, 12]} />
        <meshStandardMaterial color="#fff8e8" emissive="#fff2cc" emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

// ─── Auto-rug — a soft decorative rug placed under seating/bed clusters, derived
// purely from furniture footprint (not a stored entity, so it needs no schema change) ─
const RUG_TYPES: FurnitureType[] = ['sofa', 'loveseat', 'bed', 'armchair'];

function AutoRug({ f }: { f: Furniture }) {
  const rugW = f.width * 1.6;
  const rugD = f.depth * 1.8;
  const rugTex = useMemo(() => makeCarpetTexture(shade(f.color, 0.5)), [f.color]);
  return (
    <mesh position={[0, -7.4, f.depth * 0.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[rugW, rugD]} />
      <meshStandardMaterial map={rugTex} roughness={0.95} transparent opacity={0.92} />
    </mesh>
  );
}

function SceneContent() {
  const { walls, rooms, doors, windows, furniture, cameraMode, showCeilingLights } = usePlannerStore();
  const { camera } = useThree();

  useEffect(() => {
    if (cameraMode === 'top') {
      camera.position.set(500, 1500, 500);
      camera.lookAt(500, 0, 500);
    } else if (cameraMode === 'dollhouse') {
      camera.position.set(1200, 800, 1200);
      camera.lookAt(500, 0, 500);
    } else if (cameraMode === 'orbit') {
      camera.position.set(500, 500, 1500);
      camera.lookAt(500, 0, 500);
    } else if (cameraMode === 'firstperson') {
      camera.position.set(300, 160, 300);
      camera.lookAt(500, 160, 500);
    }
  }, [cameraMode, camera]);

  return (
    <>
      <hemisphereLight args={['#cfe8ff', '#4a3c2c', 0.55]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[1000, 2000, 1000]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={5000}
        shadow-camera-left={-1500}
        shadow-camera-right={1500}
        shadow-camera-top={1500}
        shadow-camera-bottom={-1500}
        shadow-bias={-0.0004}
        shadow-radius={4}
      />
      <directionalLight position={[-900, 700, -600]} intensity={0.35} color="#bcd4ff" />
      <directionalLight position={[0, -200, 0]} intensity={0.08} color="#e8c9a0" />
      <Environment preset="apartment" />

      {rooms.map((room) => <RoomFloor key={room.id} room={room} />)}

      {walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} doors={doors} windows={windows} />
      ))}

      {furniture.map((f) => (
        <group key={f.id} position={[f.position.x, 0, f.position.y]} rotation={[0, -f.rotation * Math.PI / 180, 0]}>
          {RUG_TYPES.includes(f.type) && <AutoRug f={f} />}
          <FurnitureMesh f={f} />
        </group>
      ))}

      {showCeilingLights && rooms.map((room) => {
        // use the tallest wall bounding this room's rough area as a stand-in ceiling height
        const roomWallHeight = walls.length > 0 ? Math.max(...walls.map(w => w.height)) : 270;
        return <RoomCeilingLight key={`light-${room.id}`} room={room} wallHeight={roomWallHeight} />;
      })}

      <ContactShadows position={[500, -7.9, 500]} opacity={0.35} scale={3000} blur={2.5} far={20} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]} receiveShadow>
        <planeGeometry args={[8000, 8000]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export function FloorPlan3D() {
  const { cameraMode } = usePlannerStore();

  return (
    <div className="w-full h-full bg-background">
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
        {cameraMode === 'top' ? (
          <OrthographicCamera makeDefault position={[500, 2000, 500]} zoom={0.5} near={0.1} far={5000} />
        ) : (
          <PerspectiveCamera makeDefault fov={60} near={1} far={10000} />
        )}

        <SceneContent />

        {cameraMode === 'orbit' && <OrbitControls target={[500, 0, 500]} makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />}
        {cameraMode === 'dollhouse' && <OrbitControls target={[500, 0, 500]} makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />}
        {cameraMode === 'top' && <OrbitControls target={[500, 0, 500]} enableRotate={false} />}
        {cameraMode === 'firstperson' && <PointerLockControls />}
      </Canvas>
    </div>
  );
}