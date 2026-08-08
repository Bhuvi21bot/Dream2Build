import { 
  MousePointer2, 
  Grid3X3, 
  Square, 
  DoorClosed, 
  PanelTop, 
  Armchair,
  ChevronsUp,
  Trash2,
  Ruler,
  Sofa,
  Bed,
  Table,
  Laptop,
  Bath,
  HelpCircle
} from 'lucide-react';
import { usePlannerStore } from '../store';
import { Tool, FurnitureType, RoomType } from '../types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const tools: { id: Tool; icon: any; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'wall', icon: Grid3X3, label: 'Draw Wall' },
  { id: 'room', icon: Square, label: 'Add Room' },
  { id: 'door', icon: DoorClosed, label: 'Add Door' },
  { id: 'window', icon: PanelTop, label: 'Add Window' },
  { id: 'furniture', icon: Armchair, label: 'Add Furniture' },
];

const furnitureOptions: { type: FurnitureType; label: string; icon: any }[] = [
  { type: 'sofa', label: 'Sofa', icon: Sofa },
  { type: 'bed', label: 'Bed', icon: Bed },
  { type: 'dining-table', label: 'Dining Table', icon: Table },
  { type: 'chair', label: 'Chair', icon: Armchair },
  { type: 'desk', label: 'Desk', icon: Laptop },
  { type: 'wardrobe', label: 'Wardrobe', icon: DoorClosed },
  { type: 'kitchen-counter', label: 'Counter', icon: Table },
  { type: 'toilet', label: 'Toilet', icon: HelpCircle },
  { type: 'bathtub', label: 'Bathtub', icon: Bath },
  { type: 'stairs', label: 'Stairs', icon: ChevronsUp },
];

const roomOptions: { type: RoomType; label: string; color: string }[] = [
  { type: 'living', label: 'Living Room', color: 'rgba(210,180,140,0.4)' },
  { type: 'bedroom', label: 'Bedroom', color: 'rgba(210,180,210,0.4)' },
  { type: 'kitchen', label: 'Kitchen', color: 'rgba(180,210,210,0.4)' },
  { type: 'bathroom', label: 'Bathroom', color: 'rgba(180,180,210,0.4)' },
  { type: 'dining', label: 'Dining Room', color: 'rgba(210,210,180,0.4)' },
  { type: 'balcony', label: 'Balcony', color: 'rgba(180,210,180,0.4)' },
  { type: 'corridor', label: 'Corridor', color: 'rgba(200,200,200,0.4)' },
];

export function LeftSidebar() {
  const { 
    activeTool, setActiveTool, 
    selectedFurnitureType, setSelectedFurnitureType,
    selectedRoomType, setSelectedRoomType,
    deleteWall, deleteRoom, deleteDoor, deleteWindow, deleteFurniture, 
    selectedId, walls, rooms, doors, windows, furniture 
  } = usePlannerStore();

  const handleDelete = () => {
    if (!selectedId) return;
    if (walls.some(w => w.id === selectedId)) deleteWall(selectedId);
    if (rooms.some(r => r.id === selectedId)) deleteRoom(selectedId);
    if (doors.some(d => d.id === selectedId)) deleteDoor(selectedId);
    if (windows.some(w => w.id === selectedId)) deleteWindow(selectedId);
    if (furniture.some(f => f.id === selectedId)) deleteFurniture(selectedId);
  };

  return (
    <div className="relative flex h-full z-30">
      {/* Primary Sidebar */}
      <motion.div 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-16 border-r border-border bg-card/95 flex flex-col items-center py-4 relative z-40"
      >
        <div className="flex flex-col gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            
            return (
              <Tooltip key={tool.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                      isActive 
                        ? "bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.5)]" 
                        : "text-foreground/50 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                  <p>{tool.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={handleDelete}
                disabled={!selectedId}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/50 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
              <p>Delete Selected (Del)</p>
            </TooltipContent>
          </Tooltip>

          <div className="w-8 h-px bg-border mx-auto" />

          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-muted transition-all"
              >
                <Ruler className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
              <p>Measurements & Ruler</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.div>

      {/* Slide-out Options Panel */}
      <AnimatePresence>
        {(activeTool === 'furniture' || activeTool === 'room') && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-48 border-r border-border bg-card/90 backdrop-blur-md p-4 flex flex-col gap-4 overflow-y-auto"
          >
            {activeTool === 'furniture' && (
              <>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  Select Furniture
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  {furnitureOptions.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = selectedFurnitureType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => setSelectedFurnitureType(opt.type)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center gap-3 text-sm transition-all",
                          isSelected
                            ? "bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.5)] font-semibold"
                            : "text-foreground/75 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <OptIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeTool === 'room' && (
              <>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  Select Room Type
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  {roomOptions.map((opt) => {
                    const isSelected = selectedRoomType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        onClick={() => setSelectedRoomType(opt.type)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-all",
                          isSelected
                            ? "bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.5)] font-semibold"
                            : "text-foreground/75 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        <div 
                          className="w-3.5 h-3.5 rounded border border-white/20" 
                          style={{ backgroundColor: opt.color }}
                        />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
