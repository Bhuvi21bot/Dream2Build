import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Environment, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { usePlannerStore } from '../store';
import { Wall, Door, Window, Furniture, FurnitureType } from '../types';

// ─── Floor material definitions ──────────────────────────────────────────────
interface MatDef {
  color: string;
  roughness: number;
  metalness: number;
  gridColor?: string;
  gridSpacing?: number;
}

const FLOOR_MATERIALS: Record<string, MatDef> = {
  hardwood: { color: '#a0612a', roughness: 0.45, metalness: 0.05, gridColor: '#7a4a1a', gridSpacing: 80 },
  tiles: { color: '#d8d0c4', roughness: 0.25, metalness: 0.12, gridColor: '#aaa499', gridSpacing: 60 },
  marble: { color: '#f0eeea', roughness: 0.08, metalness: 0.18, gridColor: '#d8d4ce', gridSpacing: 200 },
  carpet: { color: '#4a5a6a', roughness: 1.0, metalness: 0.0 },
  concrete: { color: '#7a7a7a', roughness: 0.88, metalness: 0.0, gridColor: '#666', gridSpacing: 300 },
};

const WALL_MATERIALS: Record<string, { color: string; roughness: number; metalness?: number }> = {
  'white-paint': { color: '#f0eeea', roughness: 0.9 },
  'concrete': { color: '#808080', roughness: 0.85 },
  'brick': { color: '#b36038', roughness: 0.95 },
  'wood-panel': { color: '#7a4a20', roughness: 0.65, metalness: 0.05 },
};

const DOOR_HEIGHT = 210; // cm — doors don't carry a height field in the data model, so we assume a standard height

// ─── color helpers ────────────────────────────────────────────────────────────
function shade(hex: string, amt: number): string {
  // amt in [-1,1]; negative = darker, positive = lighter
  const c = hex.replace('#', '');
  const num = parseInt(c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c, 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amt >= 0 ? (255 - v) * amt : v * amt))));
  r = f(r); g = f(g); b = f(b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ─── Floor tile grid overlay ─────────────────────────────────────────────────
function FloorGrid({ xs, ys, spacing, color }: { xs: number; ys: number; spacing: number; color: string }) {
  const points: THREE.Vector3[] = [];
  const xMin = Math.floor(xs / spacing) * spacing;
  const xMax = Math.ceil((xs + 1200) / spacing) * spacing;
  const yMin = Math.floor(ys / spacing) * spacing;
  const yMax = Math.ceil((ys + 1200) / spacing) * spacing;

  for (let x = xMin; x <= xMax; x += spacing) {
    points.push(new THREE.Vector3(x, 0.1, yMin), new THREE.Vector3(x, 0.1, yMax));
  }
  for (let y = yMin; y <= yMax; y += spacing) {
    points.push(new THREE.Vector3(xMin, 0.1, y), new THREE.Vector3(xMax, 0.1, y));
  }

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} opacity={0.35} transparent />
    </lineSegments>
  );
}

// ─── Wall with real door/window openings ──────────────────────────────────────
function Wall3D({ wall, doors, windows }: { wall: Wall; doors: Door[]; windows: Window[] }) {
  const dx = wall.end.x - wall.start.x;
  const dy = wall.end.y - wall.start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;
  const angle = Math.atan2(dy, dx);
  const cx = wall.start.x + dx / 2;
  const cy = wall.start.y + dy / 2;
  const matArgs = WALL_MATERIALS[wall.material] ?? WALL_MATERIALS['white-paint'];

  const wallDoors = doors.filter(d => d.wallId === wall.id);
  const wallWindows = windows.filter(w => w.wallId === wall.id);

  // Fast path: no openings, single solid box (cheap, common case)
  if (wallDoors.length === 0 && wallWindows.length === 0) {
    return (
      <group position={[cx, wall.height / 2, cy]} rotation={[0, -angle, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[length, wall.height, wall.thickness]} />
          <meshStandardMaterial {...matArgs} />
        </mesh>
      </group>
    );
  }

  // Build a list of openings in local coords (0 = wall start, length = wall end)
  type Opening =
    | { type: 'door'; pos: number; width: number }
    | { type: 'window'; pos: number; width: number; sill: number; height: number };

  const openings: Opening[] = [
    ...wallDoors.map(d => ({ type: 'door' as const, pos: d.position * length, width: d.width })),
    ...wallWindows.map(w => ({ type: 'window' as const, pos: w.position * length, width: w.width, sill: w.sillHeight, height: w.height })),
  ].sort((a, b) => a.pos - b.pos);

  const segs: JSX.Element[] = [];
  let cursor = 0;

  const solidSeg = (key: string, from: number, to: number, yCenter: number, h: number) => {
    if (to - from <= 0.01) return;
    const localX = (from + to) / 2 - length / 2;
    segs.push(
      <mesh key={key} position={[localX, yCenter, 0]} castShadow receiveShadow>
        <boxGeometry args={[to - from, h, wall.thickness]} />
        <meshStandardMaterial {...matArgs} />
      </mesh>
    );
  };

  openings.forEach((o, i) => {
    const left = Math.max(0, o.pos - o.width / 2);
    const right = Math.min(length, o.pos + o.width / 2);

    // solid wall segment before this opening (full height)
    solidSeg(`pre-${i}`, cursor, left, wall.height / 2, wall.height);

    const openLocalX = o.pos - length / 2;

    if (o.type === 'door') {
      const doorH = Math.min(DOOR_HEIGHT, wall.height - 5);
      const lintelH = wall.height - doorH;
      if (lintelH > 0) {
        segs.push(
          <mesh key={`lintel-${i}`} position={[openLocalX, doorH + lintelH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, lintelH, wall.thickness]} />
            <meshStandardMaterial {...matArgs} />
          </mesh>
        );
      }
      // door leaf sitting in the opening
      segs.push(
        <mesh key={`leaf-${i}`} position={[openLocalX + (right - left) * 0.18, doorH / 2, 0]} castShadow>
          <boxGeometry args={[Math.max(10, (right - left) * 0.62), doorH - 4, Math.max(3, wall.thickness * 0.35)]} />
          <meshStandardMaterial color="#6b4a30" roughness={0.55} />
        </mesh>
      );
      // frame
      segs.push(
        <mesh key={`frame-${i}`} position={[openLocalX, doorH / 2, 0]}>
          <boxGeometry args={[right - left, doorH, wall.thickness + 1]} />
          <meshStandardMaterial color="#3a2a1a" wireframe />
        </mesh>
      );
    } else {
      const sill = o.sill;
      const header = o.sill + o.height;
      if (sill > 0) {
        segs.push(
          <mesh key={`sill-${i}`} position={[openLocalX, sill / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, sill, wall.thickness]} />
            <meshStandardMaterial {...matArgs} />
          </mesh>
        );
      }
      if (header < wall.height) {
        segs.push(
          <mesh key={`header-${i}`} position={[openLocalX, header + (wall.height - header) / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[right - left, wall.height - header, wall.thickness]} />
            <meshStandardMaterial {...matArgs} />
          </mesh>
        );
      }
      // glass pane
      segs.push(
        <mesh key={`glass-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[right - left - 2, o.height - 2, Math.max(2, wall.thickness * 0.25)]} />
          <meshPhysicalMaterial color="#bcdfff" transparent opacity={0.35} roughness={0.05} transmission={0.5} />
        </mesh>
      );
      // frame
      segs.push(
        <mesh key={`wframe-${i}`} position={[openLocalX, sill + o.height / 2, 0]}>
          <boxGeometry args={[right - left, o.height, wall.thickness + 1]} />
          <meshStandardMaterial color="#3b82f6" wireframe />
        </mesh>
      );
    }

    cursor = right;
  });

  // trailing solid segment after last opening
  solidSeg('post-last', cursor, length, wall.height / 2, wall.height);

  return <group position={[cx, 0, cy]} rotation={[0, -angle, 0]}>{segs}</group>;
}

// ─── Type-specific furniture geometry ─────────────────────────────────────────
function FurnitureMesh({ f }: { f: Furniture }) {
  const base = f.color;
  const dark = shade(base, -0.35);
  const light = shade(base, 0.25);
  const { width: w, depth: d, type } = f;

  switch (type as FurnitureType) {
    case 'sofa':
      return (
        <group>
          <mesh position={[0, 20, 0]} castShadow><boxGeometry args={[w, 40, d]} /><meshStandardMaterial color={base} roughness={0.8} /></mesh>
          <mesh position={[0, 55, -d / 2 + 8]} castShadow><boxGeometry args={[w, 40, 16]} /><meshStandardMaterial color={dark} roughness={0.8} /></mesh>
          <mesh position={[-w / 2 + 8, 45, 0]} castShadow><boxGeometry args={[16, 30, d - 16]} /><meshStandardMaterial color={dark} roughness={0.8} /></mesh>
          <mesh position={[w / 2 - 8, 45, 0]} castShadow><boxGeometry args={[16, 30, d - 16]} /><meshStandardMaterial color={dark} roughness={0.8} /></mesh>
        </group>
      );

    case 'bed':
      return (
        <group>
          <mesh position={[0, 15, 0]} castShadow><boxGeometry args={[w, 25, d]} /><meshStandardMaterial color={dark} roughness={0.9} /></mesh>
          <mesh position={[0, 32, 4]} castShadow><boxGeometry args={[w - 6, 14, d - 20]} /><meshStandardMaterial color={base} roughness={0.95} /></mesh>
          <mesh position={[0, 42, -d / 2 + 16]} castShadow><boxGeometry args={[w - 16, 10, 24]} /><meshStandardMaterial color={light} roughness={1} /></mesh>
          <mesh position={[0, 65, -d / 2 + 4]} castShadow><boxGeometry args={[w, 60, 8]} /><meshStandardMaterial color={dark} roughness={0.7} /></mesh>
        </group>
      );

    case 'dining-table':
    case 'desk': {
      const topH = type === 'desk' ? 72 : 75;
      const legR = 3.5;
      const legs = [
        [-w / 2 + 8, -d / 2 + 8], [w / 2 - 8, -d / 2 + 8], [-w / 2 + 8, d / 2 - 8], [w / 2 - 8, d / 2 - 8],
      ];
      return (
        <group>
          <mesh position={[0, topH, 0]} castShadow><boxGeometry args={[w, 4, d]} /><meshStandardMaterial color={base} roughness={0.5} /></mesh>
          {legs.map(([lx, lz], i) => (
            <mesh key={i} position={[lx, topH / 2, lz]} castShadow>
              <cylinderGeometry args={[legR, legR, topH, 10]} />
              <meshStandardMaterial color={dark} roughness={0.5} metalness={0.2} />
            </mesh>
          ))}
        </group>
      );
    }

    case 'chair': {
      const legR = 2.5, seatH = 45;
      const legs = [
        [-w / 2 + 6, -d / 2 + 6], [w / 2 - 6, -d / 2 + 6], [-w / 2 + 6, d / 2 - 6], [w / 2 - 6, d / 2 - 6],
      ];
      return (
        <group>
          <mesh position={[0, seatH, 0]} castShadow><boxGeometry args={[w, 5, d]} /><meshStandardMaterial color={base} roughness={0.7} /></mesh>
          <mesh position={[0, seatH + 22, -d / 2 + 3]} castShadow><boxGeometry args={[w, 44, 5]} /><meshStandardMaterial color={base} roughness={0.7} /></mesh>
          {legs.map(([lx, lz], i) => (
            <mesh key={i} position={[lx, seatH / 2, lz]} castShadow>
              <cylinderGeometry args={[legR, legR, seatH, 8]} />
              <meshStandardMaterial color={dark} roughness={0.4} metalness={0.3} />
            </mesh>
          ))}
        </group>
      );
    }

    case 'wardrobe':
      return (
        <group>
          <mesh position={[0, 100, 0]} castShadow><boxGeometry args={[w, 200, d]} /><meshStandardMaterial color={base} roughness={0.55} /></mesh>
          <mesh position={[0, 100, d / 2 + 0.3]}><boxGeometry args={[2, 196, 0.5]} /><meshStandardMaterial color={dark} /></mesh>
          <mesh position={[-w / 4, 100, d / 2 + 1]} castShadow><sphereGeometry args={[2.2, 8, 8]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
          <mesh position={[w / 4, 100, d / 2 + 1]} castShadow><sphereGeometry args={[2.2, 8, 8]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
        </group>
      );

    case 'kitchen-counter':
      return (
        <group>
          <mesh position={[0, 42, 0]} castShadow><boxGeometry args={[w, 84, d]} /><meshStandardMaterial color={base} roughness={0.6} /></mesh>
          <mesh position={[0, 87, 0]} castShadow><boxGeometry args={[w + 4, 6, d + 4]} /><meshStandardMaterial color={light} roughness={0.15} metalness={0.1} /></mesh>
        </group>
      );

    case 'toilet':
      return (
        <group>
          <mesh position={[0, 20, d / 4]} castShadow><cylinderGeometry args={[w / 2.4, w / 2.6, 40, 16]} /><meshStandardMaterial color={base} roughness={0.15} /></mesh>
          <mesh position={[0, 55, -d / 2 + 6]} castShadow><boxGeometry args={[w * 0.7, 40, 12]} /><meshStandardMaterial color={base} roughness={0.15} /></mesh>
        </group>
      );

    case 'bathtub':
      return (
        <group>
          <mesh position={[0, 27, 0]} castShadow><boxGeometry args={[w, 55, d]} /><meshStandardMaterial color={base} roughness={0.2} /></mesh>
          <mesh position={[0, 50, 0]} castShadow><boxGeometry args={[w - 14, 8, d - 14]} /><meshStandardMaterial color={light} roughness={0.1} /></mesh>
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
              <meshStandardMaterial color={i % 2 === 0 ? base : shade(base, -0.1)} roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    }

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
function SceneContent() {
  const { walls, rooms, doors, windows, furniture, cameraMode } = usePlannerStore();
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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[1000, 2000, 1000]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={5000}
        shadow-camera-left={-1500}
        shadow-camera-right={1500}
        shadow-camera-top={1500}
        shadow-camera-bottom={-1500}
      />
      <directionalLight position={[-800, 800, -800]} intensity={0.4} />
      <Environment preset="apartment" />

      {/* ── Floors ── */}
      {rooms.map((room) => {
        if (room.points.length < 3) return null;
        const matDef = FLOOR_MATERIALS[room.floorMaterial] ?? FLOOR_MATERIALS.hardwood;

        const shape = new THREE.Shape();
        shape.moveTo(room.points[0].x, room.points[0].y);
        for (let i = 1; i < room.points.length; i++) shape.lineTo(room.points[i].x, room.points[i].y);

        const extrudeSettings = { depth: 8, bevelEnabled: false };
        const xs = Math.min(...room.points.map(p => p.x));
        const ys = Math.min(...room.points.map(p => p.y));

        return (
          <group key={room.id}>
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
              <mesh receiveShadow castShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={matDef.color} roughness={matDef.roughness} metalness={matDef.metalness} />
              </mesh>
            </group>
            {matDef.gridColor && matDef.gridSpacing && (
              <FloorGrid xs={xs} ys={ys} spacing={matDef.gridSpacing} color={matDef.gridColor} />
            )}
          </group>
        );
      })}

      {/* ── Walls (now with real door/window openings) ── */}
      {walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} doors={doors} windows={windows} />
      ))}

      {/* ── Furniture (type-specific geometry) ── */}
      {furniture.map((f) => (
        <group key={f.id} position={[f.position.x, 0, f.position.y]} rotation={[0, -f.rotation * Math.PI / 180, 0]}>
          <FurnitureMesh f={f} />
        </group>
      ))}

      {/* ── Ground plane ── */}
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