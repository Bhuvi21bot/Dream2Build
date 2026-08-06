import { usePlannerStore } from '../store';
import { Wall, Room, Door, Window, Furniture } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Camera, Orbit, User, Map, Eye } from 'lucide-react';

export function RightSidebar() {
  const { 
    selectedId, walls, rooms, doors, windows, furniture,
    updateWall, updateRoom, updateDoor, updateWindow, updateFurniture,
    view, cameraMode, setCameraMode
  } = usePlannerStore();

  const getSelectedElement = () => {
    if (!selectedId) return null;
    let type = 'none';
    let element: any = null;
    
    if (walls.some(w => w.id === selectedId)) { type = 'wall'; element = walls.find(w => w.id === selectedId); }
    else if (rooms.some(r => r.id === selectedId)) { type = 'room'; element = rooms.find(r => r.id === selectedId); }
    else if (doors.some(d => d.id === selectedId)) { type = 'door'; element = doors.find(d => d.id === selectedId); }
    else if (windows.some(w => w.id === selectedId)) { type = 'window'; element = windows.find(w => w.id === selectedId); }
    else if (furniture.some(f => f.id === selectedId)) { type = 'furniture'; element = furniture.find(f => f.id === selectedId); }
    
    return { type, element };
  };

  const selected = getSelectedElement();

  // Calculate total area
  const totalArea = rooms.reduce((acc, room) => {
    // simple bounding box area for polygon for now (assuming rectangles mostly in sample)
    const xs = room.points.map(p => p.x);
    const ys = room.points.map(p => p.y);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    return acc + (w * h) / 10000; // cm^2 to m^2
  }, 0);

  return (
    <motion.div 
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-72 border-l border-[#2a1a0e] bg-[#1a0f07]/95 flex flex-col z-30"
    >
      <div className="h-14 flex items-center px-4 border-b border-[#2a1a0e]">
        <h2 className="font-semibold text-sm tracking-wide text-foreground/90 uppercase">Properties</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-6">
          {!selected?.element ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-[#2a1a0e] flex items-center justify-center mx-auto mb-3">
                <MousePointer2Icon className="w-5 h-5 text-foreground/40" />
              </div>
              <p className="text-sm text-foreground/50">Select an element on the canvas to view and edit its properties.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Common Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{selected.type}</span>
                  <span className="text-xs text-foreground/50 font-mono">#{selected.element.id.substring(0, 4)}</span>
                </div>
              </div>

              {selected.type === 'wall' && (
                <WallProperties wall={selected.element} updateWall={updateWall} />
              )}
              {selected.type === 'room' && (
                <RoomProperties room={selected.element} updateRoom={updateRoom} />
              )}
              {selected.type === 'door' && (
                <DoorProperties door={selected.element} updateDoor={updateDoor} />
              )}
              {selected.type === 'window' && (
                <WindowProperties window={selected.element} updateWindow={updateWindow} />
              )}
              {selected.type === 'furniture' && (
                <FurnitureProperties item={selected.element} updateFurniture={updateFurniture} />
              )}
            </div>
          )}

          <Separator className="bg-[#2a1a0e]" />

          {/* Global Project Stats */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Project Summary</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#120b05] border border-[#2a1a0e] rounded-lg p-3">
                <div className="text-xl font-mono text-foreground mb-1">{totalArea.toFixed(1)} <span className="text-xs text-foreground/50">m²</span></div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-wide">Total Area</div>
              </div>
              <div className="bg-[#120b05] border border-[#2a1a0e] rounded-lg p-3">
                <div className="text-xl font-mono text-foreground mb-1">{rooms.length}</div>
                <div className="text-[10px] text-foreground/50 uppercase tracking-wide">Rooms</div>
              </div>
            </div>
          </div>

          {(view === '3d' || view === 'split') && (
            <>
              <Separator className="bg-[#2a1a0e]" />
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-3 h-3" /> Camera
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <CameraModeBtn mode="orbit" current={cameraMode} set={setCameraMode} icon={Orbit} label="Orbit" />
                  <CameraModeBtn mode="firstperson" current={cameraMode} set={setCameraMode} icon={User} label="First Person" />
                  <CameraModeBtn mode="top" current={cameraMode} set={setCameraMode} icon={Map} label="Top Down" />
                  <CameraModeBtn mode="dollhouse" current={cameraMode} set={setCameraMode} icon={Eye} label="Dollhouse" />
                </div>
              </div>
            </>
          )}

        </div>
      </ScrollArea>
    </motion.div>
  );
}

// Subcomponents for properties
function MousePointer2Icon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/><path d="m13 13 6 6"/></svg>;
}

function CameraModeBtn({ mode, current, set, icon: Icon, label }: any) {
  const active = mode === current;
  return (
    <button
      onClick={() => set(mode)}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
        active 
          ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
          : "bg-[#120b05] border-[#2a1a0e] text-foreground/60 hover:bg-[#2a1a0e]"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </button>
  );
}

function WallProperties({ wall, updateWall }: { wall: Wall, updateWall: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label className="text-xs text-foreground/70">Material</Label>
        <Select value={wall.material} onValueChange={(v) => updateWall(wall.id, { material: v })}>
          <SelectTrigger className="bg-[#120b05] border-[#2a1a0e]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0f07] border-[#2a1a0e]">
            <SelectItem value="white-paint">White Paint</SelectItem>
            <SelectItem value="concrete">Exposed Concrete</SelectItem>
            <SelectItem value="brick">Red Brick</SelectItem>
            <SelectItem value="wood-panel">Wood Panel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Thickness</Label>
          <span className="text-xs font-mono text-amber-500">{wall.thickness} cm</span>
        </div>
        <Slider 
          value={[wall.thickness]} 
          min={5} max={50} step={1}
          onValueChange={([v]) => updateWall(wall.id, { thickness: v })}
        />
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Height</Label>
          <span className="text-xs font-mono text-amber-500">{wall.height} cm</span>
        </div>
        <Slider 
          value={[wall.height]} 
          min={100} max={400} step={10}
          onValueChange={([v]) => updateWall(wall.id, { height: v })}
        />
      </div>
    </div>
  );
}

function RoomProperties({ room, updateRoom }: { room: Room, updateRoom: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label className="text-xs text-foreground/70">Room Name</Label>
        <Input 
          value={room.name} 
          onChange={(e) => updateRoom(room.id, { name: e.target.value })}
          className="bg-[#120b05] border-[#2a1a0e]"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-xs text-foreground/70">Type</Label>
        <Select value={room.type} onValueChange={(v) => updateRoom(room.id, { type: v })}>
          <SelectTrigger className="bg-[#120b05] border-[#2a1a0e]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0f07] border-[#2a1a0e]">
            {['bedroom', 'kitchen', 'living', 'bathroom', 'balcony', 'dining', 'corridor'].map(t => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs text-foreground/70">Floor Material</Label>
        <Select value={room.floorMaterial} onValueChange={(v) => updateRoom(room.id, { floorMaterial: v })}>
          <SelectTrigger className="bg-[#120b05] border-[#2a1a0e]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a0f07] border-[#2a1a0e]">
            <SelectItem value="hardwood">Hardwood</SelectItem>
            <SelectItem value="tiles">Ceramic Tiles</SelectItem>
            <SelectItem value="marble">Marble</SelectItem>
            <SelectItem value="carpet">Carpet</SelectItem>
            <SelectItem value="concrete">Polished Concrete</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function DoorProperties({ door, updateDoor }: { door: Door, updateDoor: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Width</Label>
          <span className="text-xs font-mono text-amber-500">{door.width} cm</span>
        </div>
        <Slider 
          value={[door.width]} 
          min={60} max={200} step={5}
          onValueChange={([v]) => updateDoor(door.id, { width: v })}
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-xs text-foreground/70">Swing Direction</Label>
        <div className="flex gap-2">
          <button 
            onClick={() => updateDoor(door.id, { swingDirection: 'left' })}
            className={`flex-1 py-2 text-xs rounded border ${door.swingDirection === 'left' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-[#120b05] border-[#2a1a0e] text-foreground/60'}`}
          >
            Left
          </button>
          <button 
            onClick={() => updateDoor(door.id, { swingDirection: 'right' })}
            className={`flex-1 py-2 text-xs rounded border ${door.swingDirection === 'right' ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-[#120b05] border-[#2a1a0e] text-foreground/60'}`}
          >
            Right
          </button>
        </div>
      </div>
    </div>
  );
}

function WindowProperties({ window, updateWindow }: { window: Window, updateWindow: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Width</Label>
          <span className="text-xs font-mono text-amber-500">{window.width} cm</span>
        </div>
        <Slider value={[window.width]} min={40} max={300} step={10} onValueChange={([v]) => updateWindow(window.id, { width: v })} />
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Height</Label>
          <span className="text-xs font-mono text-amber-500">{window.height} cm</span>
        </div>
        <Slider value={[window.height]} min={40} max={250} step={10} onValueChange={([v]) => updateWindow(window.id, { height: v })} />
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Sill Height</Label>
          <span className="text-xs font-mono text-amber-500">{window.sillHeight} cm</span>
        </div>
        <Slider value={[window.sillHeight]} min={0} max={150} step={5} onValueChange={([v]) => updateWindow(window.id, { sillHeight: v })} />
      </div>
    </div>
  );
}

function FurnitureProperties({ item, updateFurniture }: { item: Furniture, updateFurniture: any }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Rotation</Label>
          <span className="text-xs font-mono text-amber-500">{item.rotation}°</span>
        </div>
        <Slider value={[item.rotation]} min={0} max={360} step={15} onValueChange={([v]) => updateFurniture(item.id, { rotation: v })} />
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Width</Label>
          <span className="text-xs font-mono text-amber-500">{item.width} cm</span>
        </div>
        <Slider value={[item.width]} min={30} max={400} step={5} onValueChange={([v]) => updateFurniture(item.id, { width: v })} />
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-foreground/70">Depth</Label>
          <span className="text-xs font-mono text-amber-500">{item.depth} cm</span>
        </div>
        <Slider value={[item.depth]} min={30} max={400} step={5} onValueChange={([v]) => updateFurniture(item.id, { depth: v })} />
      </div>
    </div>
  );
}
