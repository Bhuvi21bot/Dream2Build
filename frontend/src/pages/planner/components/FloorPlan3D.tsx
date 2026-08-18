import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Environment, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { usePlannerStore } from '../store';

// ─── Floor material definitions ──────────────────────────────────────────────
// Each material has distinct color, roughness, metalness and an optional grid
// overlay color so materials are instantly recognisable in 3D.
interface MatDef {
  color: string;
  roughness: number;
  metalness: number;
  gridColor?: string;      // optional tile/plank grid overlay
  gridSpacing?: number;    // spacing of grid lines in scene units
}

const FLOOR_MATERIALS: Record<string, MatDef> = {
  hardwood: {
    color: '#a0612a',      // warm amber brown
    roughness: 0.45,
    metalness: 0.05,
    gridColor: '#7a4a1a',  // darker plank lines
    gridSpacing: 80,
  },
  tiles: {
    color: '#d8d0c4',      // cream/beige ceramic
    roughness: 0.25,
    metalness: 0.12,
    gridColor: '#aaa499',  // tile grout lines
    gridSpacing: 60,
  },
  marble: {
    color: '#f0eeea',      // near-white with slight warmth
    roughness: 0.08,
    metalness: 0.18,
    gridColor: '#d8d4ce',  // subtle slab veins
    gridSpacing: 200,
  },
  carpet: {
    color: '#4a5a6a',      // slate blue-grey carpet
    roughness: 1.0,
    metalness: 0.0,
    // no grid — carpet is seamless
  },
  concrete: {
    color: '#7a7a7a',      // mid-grey polished concrete
    roughness: 0.88,
    metalness: 0.0,
    gridColor: '#666',     // expansion joints
    gridSpacing: 300,
  },
};

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
        for (let i = 1; i < room.points.length; i++) {
          shape.lineTo(room.points[i].x, room.points[i].y);
        }

        const extrudeSettings = { depth: 8, bevelEnabled: false };

        // bounding box for grid placement
        const xs = Math.min(...room.points.map(p => p.x));
        const ys = Math.min(...room.points.map(p => p.y));

        return (
          <group key={room.id}>
            <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
              <mesh receiveShadow castShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                  color={matDef.color}
                  roughness={matDef.roughness}
                  metalness={matDef.metalness}
                />
              </mesh>
            </group>
            {/* Grid overlay for tiles / hardwood planks / marble slabs */}
            {matDef.gridColor && matDef.gridSpacing && (
              <FloorGrid
                xs={xs}
                ys={ys}
                spacing={matDef.gridSpacing}
                color={matDef.gridColor}
              />
            )}
          </group>
        );
      })}

      {/* ── Walls ── */}
      {walls.map((wall) => {
        const dx = wall.end.x - wall.start.x;
        const dy = wall.end.y - wall.start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const cx = wall.start.x + dx / 2;
        const cy = wall.start.y + dy / 2;

        const materialMap: Record<string, { color: string; roughness: number; metalness?: number }> = {
          'white-paint': { color: '#f0eeea', roughness: 0.9 },
          'concrete':    { color: '#808080', roughness: 0.85 },
          'brick':       { color: '#b36038', roughness: 0.95 },
          'wood-panel':  { color: '#7a4a20', roughness: 0.65, metalness: 0.05 },
        };
        const matArgs = materialMap[wall.material] ?? materialMap['white-paint'];

        return (
          <group key={wall.id} position={[cx, wall.height / 2, cy]} rotation={[0, -angle, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[length, wall.height, wall.thickness]} />
              <meshStandardMaterial {...matArgs} />
            </mesh>
          </group>
        );
      })}

      {/* ── Furniture ── */}
      {furniture.map((f) => (
        <group key={f.id} position={[f.position.x, 0, f.position.y]} rotation={[0, -f.rotation * Math.PI / 180, 0]}>
          <mesh position={[0, 30, 0]} castShadow>
            <boxGeometry args={[f.width, 60, f.depth]} />
            <meshStandardMaterial color={f.color} roughness={0.6} />
          </mesh>
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

        {cameraMode === 'orbit'      && <OrbitControls target={[500, 0, 500]} makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />}
        {cameraMode === 'dollhouse'  && <OrbitControls target={[500, 0, 500]} makeDefault maxPolarAngle={Math.PI / 2 - 0.05} />}
        {cameraMode === 'top'        && <OrbitControls target={[500, 0, 500]} enableRotate={false} />}
        {cameraMode === 'firstperson' && <PointerLockControls />}
      </Canvas>
    </div>
  );
}
