import { 
  MousePointer2, 
  Grid3X3, 
  Square, 
  DoorClosed, 
  PanelTop, 
  Armchair,
  ChevronsUp,
  Trash2,
  Ruler
} from 'lucide-react';
import { usePlannerStore } from '../store';
import { Tool } from '../types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

const tools: { id: Tool; icon: any; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'wall', icon: Grid3X3, label: 'Draw Wall' },
  { id: 'room', icon: Square, label: 'Add Room' },
  { id: 'door', icon: DoorClosed, label: 'Add Door' },
  { id: 'window', icon: PanelTop, label: 'Add Window' },
  { id: 'furniture', icon: Armchair, label: 'Add Furniture' },
  { id: 'stairs', icon: ChevronsUp, label: 'Add Stairs' },
];

export function LeftSidebar() {
  const { activeTool, setActiveTool, deleteWall, deleteRoom, deleteDoor, deleteWindow, deleteFurniture, selectedId, walls, rooms, doors, windows, furniture } = usePlannerStore();

  const handleDelete = () => {
    if (!selectedId) return;
    if (walls.some(w => w.id === selectedId)) deleteWall(selectedId);
    if (rooms.some(r => r.id === selectedId)) deleteRoom(selectedId);
    if (doors.some(d => d.id === selectedId)) deleteDoor(selectedId);
    if (windows.some(w => w.id === selectedId)) deleteWindow(selectedId);
    if (furniture.some(f => f.id === selectedId)) deleteFurniture(selectedId);
  };

  return (
    <motion.div 
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-16 border-r border-border bg-card/95 flex flex-col items-center py-4 z-30"
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
  );
}
