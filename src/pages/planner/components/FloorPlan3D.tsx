import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Environment, ContactShadows, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { usePlannerStore } from '../store';

function SceneContent() {
  const { walls, rooms, doors, windows, furniture, cameraMode } = usePlannerStore();
  const { camera } = useThree();

  useEffect(() => {
    // Camera transitions based on mode
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
      camera.position.set(300, 160, 300); // 1.6m high
      camera.lookAt(500, 160, 500);
    }
  }, [cameraMode, camera]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[1000, 2000, 1000]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <Environment preset="apartment" />

      {/* Render Rooms (Floors) */}
      {rooms.map((room) => {
        if (room.points.length < 3) return null;
        
        const shape = new THREE.Shape();
        shape.moveTo(room.points[0].x, room.points[0].y);
        for (let i = 1; i < room.points.length; i++) {
          shape.lineTo(room.points[i].x, room.points[i].y);
        }
        
        const extrudeSettings = { depth: 5, bevelEnabled: false };
        const colorMap: Record<string, string> = {
          hardwood: '#8b5a2b', tiles: '#d3d3d3', marble: '#fdfdfd', carpet: '#556b2f', concrete: '#808080'
        };

        return (
          <group key={room.id} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <mesh receiveShadow castShadow>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial color={colorMap[room.floorMaterial] || '#999'} roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Render Walls */}
      {walls.map((wall) => {
        const dx = wall.end.x - wall.start.x;
        const dy = wall.end.y - wall.start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        const cx = wall.start.x + dx / 2;
        const cy = wall.start.y + dy / 2;

        const materialMap: Record<string, any> = {
          'white-paint': { color: '#f5f5f5', roughness: 0.9 },
          'concrete': { color: '#888888', roughness: 0.8 },
          'brick': { color: '#a0522d', roughness: 1 },
          'wood-panel': { color: '#8b5a2b', roughness: 0.7 },
        };
        const matArgs = materialMap[wall.material] || materialMap['white-paint'];

        return (
          <group key={wall.id} position={[cx, wall.height / 2, cy]} rotation={[0, -angle, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[length, wall.height, wall.thickness]} />
              <meshStandardMaterial {...matArgs} />
            </mesh>
          </group>
        );
      })}

      {/* Render Furniture */}
      {furniture.map((f) => {
        return (
          <group key={f.id} position={[f.position.x, 0, f.position.y]} rotation={[0, -f.rotation * Math.PI / 180, 0]}>
            <mesh position={[0, 30, 0]} castShadow>
              <boxGeometry args={[f.width, 60, f.depth]} />
              <meshStandardMaterial color={f.color} roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* Base ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </>
  );
}

export function FloorPlan3D() {
  const { cameraMode } = usePlannerStore();
  
  return (
    <div className="w-full h-full bg-background">
      <Canvas shadows gl={{ antialias: true }}>
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
