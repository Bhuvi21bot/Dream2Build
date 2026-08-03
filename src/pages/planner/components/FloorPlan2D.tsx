import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Rect, Group, Text, Shape } from 'react-konva';
import { usePlannerStore } from '../store';

const GRID_SIZE = 20;

export function FloorPlan2D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  
  const { 
    walls, rooms, doors, windows, furniture,
    activeTool, selectedId, setSelectedId,
    scale, showGrid, snapToGrid
  } = usePlannerStore();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    usePlannerStore.getState().setScale(newScale);

    setStagePos({
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  const drawGrid = () => {
    if (!showGrid || !dimensions.width) return null;
    const lines = [];
    
    const startX = Math.floor(-stagePos.x / scale / GRID_SIZE) * GRID_SIZE;
    const endX = Math.floor((dimensions.width - stagePos.x) / scale / GRID_SIZE) * GRID_SIZE;
    
    const startY = Math.floor(-stagePos.y / scale / GRID_SIZE) * GRID_SIZE;
    const endY = Math.floor((dimensions.height - stagePos.y) / scale / GRID_SIZE) * GRID_SIZE;

    for (let i = startX; i <= endX; i += GRID_SIZE) {
      lines.push(
        <Line 
          key={`v${i}`} 
          points={[i, startY, i, endY]} 
          stroke="rgba(255, 150, 50, 0.05)" 
          strokeWidth={1 / scale} 
        />
      );
    }
    for (let i = startY; i <= endY; i += GRID_SIZE) {
      lines.push(
        <Line 
          key={`h${i}`} 
          points={[startX, i, endX, i]} 
          stroke="rgba(255, 150, 50, 0.05)" 
          strokeWidth={1 / scale} 
        />
      );
    }
    return lines;
  };

  return (
    <div className="w-full h-full bg-[#1a1008]" ref={containerRef}>
      {dimensions.width > 0 && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onWheel={handleWheel}
          draggable={activeTool === 'select'}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={scale}
          scaleY={scale}
          onDragEnd={(e) => {
            setStagePos({ x: e.target.x(), y: e.target.y() });
          }}
          onClick={(e) => {
            // Click on empty space deselects
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {drawGrid()}
          </Layer>
          <Layer>
            {/* Rooms (Background) */}
            {rooms.map((room) => {
              const flatPoints = room.points.flatMap(p => [p.x, p.y]);
              return (
                <Group key={room.id} onClick={() => setSelectedId(room.id)}>
                  <Line
                    points={flatPoints}
                    closed
                    fill={room.color}
                    stroke={selectedId === room.id ? '#f59e0b' : 'transparent'}
                    strokeWidth={2 / scale}
                  />
                  {/* Room Name Label */}
                  {room.points.length > 0 && (
                    <Text
                      x={Math.min(...room.points.map(p => p.x)) + 50}
                      y={Math.min(...room.points.map(p => p.y)) + 50}
                      text={room.name}
                      fontSize={16 / scale}
                      fontFamily="Outfit"
                      fill="rgba(255,255,255,0.5)"
                    />
                  )}
                </Group>
              );
            })}

            {/* Walls */}
            {walls.map((wall) => {
              const isSelected = selectedId === wall.id;
              return (
                <Group key={wall.id} onClick={() => setSelectedId(wall.id)}>
                  <Line
                    points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
                    stroke={isSelected ? '#f59e0b' : '#d4d4d4'}
                    strokeWidth={wall.thickness}
                    lineCap="round"
                    lineJoin="round"
                  />
                  {isSelected && (
                    <>
                      <Circle x={wall.start.x} y={wall.start.y} radius={8/scale} fill="#f59e0b" />
                      <Circle x={wall.end.x} y={wall.end.y} radius={8/scale} fill="#f59e0b" />
                    </>
                  )}
                </Group>
              );
            })}

            {/* Doors */}
            {doors.map((door) => {
              const wall = walls.find(w => w.id === door.wallId);
              if (!wall) return null;
              
              const dx = wall.end.x - wall.start.x;
              const dy = wall.end.y - wall.start.y;
              const angle = Math.atan2(dy, dx);
              
              const px = wall.start.x + dx * door.position;
              const py = wall.start.y + dy * door.position;
              
              const isSelected = selectedId === door.id;

              return (
                <Group 
                  key={door.id} 
                  x={px} y={py} 
                  rotation={(angle * 180) / Math.PI}
                  onClick={() => setSelectedId(door.id)}
                >
                  {/* Cut in wall visual */}
                  <Rect x={-door.width/2} y={-wall.thickness/2 - 1} width={door.width} height={wall.thickness + 2} fill="#1a1008" />
                  {/* Door panel */}
                  <Line 
                    points={[
                      -door.width/2, wall.thickness/2, 
                      door.swingDirection === 'left' ? -door.width/2 : door.width/2, 
                      wall.thickness/2 + door.width
                    ]} 
                    stroke={isSelected ? '#f59e0b' : '#a3a3a3'} 
                    strokeWidth={4} 
                  />
                  {/* Swing arc (simplified as a line for now, or Konva.Arc) */}
                </Group>
              );
            })}

            {/* Windows */}
            {windows.map((win) => {
              const wall = walls.find(w => w.id === win.wallId);
              if (!wall) return null;
              
              const dx = wall.end.x - wall.start.x;
              const dy = wall.end.y - wall.start.y;
              const angle = Math.atan2(dy, dx);
              
              const px = wall.start.x + dx * win.position;
              const py = wall.start.y + dy * win.position;
              
              const isSelected = selectedId === win.id;

              return (
                <Group 
                  key={win.id} 
                  x={px} y={py} 
                  rotation={(angle * 180) / Math.PI}
                  onClick={() => setSelectedId(win.id)}
                >
                  <Rect x={-win.width/2} y={-wall.thickness/2} width={win.width} height={wall.thickness} fill="#88ccff" opacity={0.5} />
                  <Rect x={-win.width/2} y={-wall.thickness/2} width={win.width} height={wall.thickness} stroke={isSelected ? '#f59e0b' : '#3b82f6'} strokeWidth={2} />
                  <Line points={[-win.width/2, 0, win.width/2, 0]} stroke="#3b82f6" strokeWidth={2} />
                </Group>
              );
            })}

            {/* Furniture */}
            {furniture.map((f) => {
              const isSelected = selectedId === f.id;
              return (
                <Group 
                  key={f.id} 
                  x={f.position.x} y={f.position.y} 
                  rotation={f.rotation}
                  onClick={() => setSelectedId(f.id)}
                  draggable={activeTool === 'select' && isSelected}
                  onDragEnd={(e) => {
                    usePlannerStore.getState().updateFurniture(f.id, {
                      position: { x: e.target.x(), y: e.target.y() }
                    });
                  }}
                >
                  <Rect 
                    x={-f.width/2} y={-f.depth/2} 
                    width={f.width} height={f.depth} 
                    fill={f.color} 
                    stroke={isSelected ? '#f59e0b' : '#000'} 
                    strokeWidth={isSelected ? 4/scale : 1/scale}
                    cornerRadius={4}
                  />
                  {f.type === 'bed' && (
                    <Rect x={-f.width/2 + 5} y={-f.depth/2 + 5} width={40} height={f.depth - 10} fill="#fff" opacity={0.8} cornerRadius={4} />
                  )}
                </Group>
              );
            })}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
