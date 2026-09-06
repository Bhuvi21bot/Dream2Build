import {
  MousePointer2, Grid3X3, Square, DoorClosed, PanelTop, Armchair,
  ChevronsUp, Trash2, Ruler, Sofa, Bed, Table2, Laptop, Bath,
  Pentagon, Search, BookOpen, Tv, Archive, Sparkles, Lamp, Trees,
  RectangleHorizontal, Sun, HelpCircle, ChefHat,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePlannerStore } from '../store';
import { Tool, FurnitureType, FurnitureCategory, FurnitureStyle, RoomType } from '../types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Tool strip ───────────────────────────────────────────────────────────────
const TOOLS: { id: Tool; icon: any; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'wall', icon: Grid3X3, label: 'Draw Wall' },
  { id: 'room', icon: Square, label: 'Rectangle Room' },
  { id: 'polygon-room', icon: Pentagon, label: 'Polygon Room (click vertices, dbl-click to close)' },
  { id: 'door', icon: DoorClosed, label: 'Add Door' },
  { id: 'window', icon: PanelTop, label: 'Add Window' },
  { id: 'furniture', icon: Armchair, label: 'Add Furniture' },
];

// ─── Furniture catalog ────────────────────────────────────────────────────────
interface CatalogItem { type: FurnitureType; label: string; icon: any; category: FurnitureCategory }

const CATALOG: CatalogItem[] = [
  { type: 'sofa', label: 'Sofa', icon: Sofa, category: 'seating' },
  { type: 'armchair', label: 'Armchair', icon: Armchair, category: 'seating' },
  { type: 'loveseat', label: 'Loveseat', icon: Sofa, category: 'seating' },
  { type: 'bench', label: 'Bench', icon: RectangleHorizontal, category: 'seating' },
  { type: 'ottoman', label: 'Ottoman', icon: Square, category: 'seating' },
  { type: 'chair', label: 'Chair', icon: Armchair, category: 'seating' },

  { type: 'bed', label: 'Bed', icon: Bed, category: 'sleeping' },
  { type: 'nightstand', label: 'Nightstand', icon: Archive, category: 'sleeping' },

  { type: 'dining-table', label: 'Dining Table', icon: Table2, category: 'tables' },
  { type: 'desk', label: 'Desk', icon: Laptop, category: 'tables' },

  { type: 'wardrobe', label: 'Wardrobe', icon: DoorClosed, category: 'storage' },
  { type: 'bookshelf', label: 'Bookshelf', icon: BookOpen, category: 'storage' },
  { type: 'tv-console', label: 'TV Console', icon: Tv, category: 'storage' },
  { type: 'cabinet', label: 'Cabinet', icon: Archive, category: 'storage' },

  { type: 'kitchen-counter', label: 'Counter', icon: ChefHat, category: 'kitchen' },

  { type: 'toilet', label: 'Toilet', icon: HelpCircle, category: 'bathroom' },
  { type: 'bathtub', label: 'Bathtub', icon: Bath, category: 'bathroom' },

  { type: 'plant', label: 'Plant', icon: Sparkles, category: 'decor' },
  { type: 'lamp', label: 'Lamp', icon: Lamp, category: 'decor' },
  { type: 'mirror', label: 'Mirror', icon: Square, category: 'decor' },

  { type: 'outdoor-tree', label: 'Tree', icon: Trees, category: 'outdoor' },
  { type: 'fence', label: 'Fence', icon: RectangleHorizontal, category: 'outdoor' },

  { type: 'stairs', label: 'Stairs', icon: ChevronsUp, category: 'structural' },
];

const CATEGORIES: { id: FurnitureCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'seating', label: 'Seating' },
  { id: 'sleeping', label: 'Bedroom' },
  { id: 'tables', label: 'Tables' },
  { id: 'storage', label: 'Storage' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'bathroom', label: 'Bath' },
  { id: 'decor', label: 'Decor' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'structural', label: 'Other' },
];

const STYLES: { id: FurnitureStyle; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },
  { id: 'minimalist', label: 'Minimal' },
  { id: 'rustic', label: 'Rustic' },
];

// ─── Room options ─────────────────────────────────────────────────────────────
const ROOM_OPTIONS: { type: RoomType; label: string; color: string }[] = [
  { type: 'living', label: 'Living Room', color: 'rgba(210,180,140,0.5)' },
  { type: 'bedroom', label: 'Bedroom', color: 'rgba(180,160,220,0.5)' },
  { type: 'kitchen', label: 'Kitchen', color: 'rgba(120,200,200,0.5)' },
  { type: 'bathroom', label: 'Bathroom', color: 'rgba(120,160,220,0.5)' },
  { type: 'dining', label: 'Dining Room', color: 'rgba(220,210,130,0.5)' },
  { type: 'balcony', label: 'Balcony', color: 'rgba(120,210,150,0.5)' },
  { type: 'corridor', label: 'Corridor', color: 'rgba(190,190,190,0.5)' },
];

const SHAPES: { id: 'square' | 'l-shape' | 'u-shape' | 't-shape' | 'octagonal'; label: string; path: string }[] = [
  { id: 'square', label: 'Rect', path: 'M10,10 L30,10 L30,30 L10,30 Z' },
  { id: 'l-shape', label: 'L', path: 'M10,10 L24,10 L24,20 L30,20 L30,30 L10,30 Z' },
  { id: 'u-shape', label: 'U', path: 'M10,10 L16,10 L16,20 L24,20 L24,10 L30,10 L30,30 L10,30 Z' },
  { id: 't-shape', label: 'T', path: 'M14,10 L26,10 L26,18 L30,18 L30,30 L10,30 L10,18 L14,18 Z' },
  { id: 'octagonal', label: 'Oct', path: 'M16,10 L24,10 L30,16 L30,24 L24,30 L16,30 L10,24 L10,16 Z' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function LeftSidebar() {
  const {
    activeTool, setActiveTool,
    selectedFurnitureType, setSelectedFurnitureType,
    selectedFurnitureStyle, setSelectedFurnitureStyle,
    selectedRoomType, setSelectedRoomType,
    selectedRoomShape, setSelectedRoomShape,
    showCeilingLights, toggleCeilingLights,
    selectedId,
    walls, rooms, doors, windows, furniture,
    deleteWall, deleteRoom, deleteDoor, deleteWindow, deleteFurniture,
  } = usePlannerStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FurnitureCategory | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CATALOG.filter(o =>
      (category === 'all' || o.category === category) &&
      (!q || o.label.toLowerCase().includes(q))
    );
  }, [search, category]);

  const handleDelete = () => {
    if (!selectedId) return;
    if (walls.find(w => w.id === selectedId)) deleteWall(selectedId);
    if (rooms.find(r => r.id === selectedId)) deleteRoom(selectedId);
    if (doors.find(d => d.id === selectedId)) deleteDoor(selectedId);
    if (windows.find(w => w.id === selectedId)) deleteWindow(selectedId);
    if (furniture.find(f => f.id === selectedId)) deleteFurniture(selectedId);
  };

  const showPanel = activeTool === 'furniture' || activeTool === 'room' || activeTool === 'polygon-room';

  return (
    <div className="relative flex h-full z-30">
      {/* ── Icon strip ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ x: -80 }} animate={{ x: 0 }}
        className="w-16 border-r border-border bg-card/95 flex flex-col items-center py-4 gap-3 z-40"
      >
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id} delayDuration={300}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTool(id)}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  activeTool === id
                    ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1.5px_rgba(245,158,11,0.5)]'
                    : 'text-foreground/50 hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right"><p>{label}</p></TooltipContent>
          </Tooltip>
        ))}

        <div className="flex-1" />

        {/* Ceiling lights toggle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCeilingLights}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                showCeilingLights
                  ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1.5px_rgba(245,158,11,0.5)]'
                  : 'text-foreground/40 hover:text-foreground hover:bg-muted'
              )}
            >
              <Sun className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{showCeilingLights ? 'Ceiling lights on' : 'Ceiling lights off'} (3D)</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete selected */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              onClick={handleDelete}
              disabled={!selectedId}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/40 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-25 disabled:pointer-events-none transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right"><p>Delete Selected (Del)</p></TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-muted transition-all">
              <Ruler className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right"><p>Measure distance</p></TooltipContent>
        </Tooltip>
      </motion.div>

      {/* ── Slide-out panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={cn(
              'border-r border-border bg-card/90 backdrop-blur-md flex flex-col overflow-hidden',
              activeTool === 'furniture' ? 'w-64' : 'w-52'
            )}
          >

            {/* ── Furniture catalog ──────────────────────────────────────── */}
            {activeTool === 'furniture' && (
              <div className="flex flex-col h-full">
                {/* Search */}
                <div className="p-3 pb-2">
                  <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5">
                    <Search className="w-3.5 h-3.5 text-foreground/40 shrink-0" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search…"
                      className="w-full bg-transparent text-xs outline-none placeholder:text-foreground/40"
                    />
                  </div>
                </div>

                {/* Category tabs */}
                <div className="px-3 pb-2 flex flex-wrap gap-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all',
                        category === c.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                          : 'border-border text-foreground/50 hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Style picker */}
                <div className="px-3 pb-2">
                  <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1.5">Style</p>
                  <div className="grid grid-cols-4 gap-1">
                    {STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedFurnitureStyle(s.id)}
                        className={cn(
                          'py-1 rounded-md text-[9px] font-semibold border truncate transition-all',
                          selectedFurnitureStyle === s.id
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                            : 'border-border text-foreground/50 hover:text-foreground hover:bg-muted'
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border mx-3 mb-2" />

                {/* Catalog grid */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                  {filtered.length === 0 ? (
                    <p className="text-xs text-foreground/40 text-center py-8">No results for "{search}"</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {filtered.map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          onClick={() => setSelectedFurnitureType(type)}
                          className={cn(
                            'flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl transition-all text-center',
                            selectedFurnitureType === type
                              ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1.5px_rgba(245,158,11,0.5)]'
                              : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="text-[10px] leading-tight truncate w-full">{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Room tool panel ────────────────────────────────────────── */}
            {(activeTool === 'room' || activeTool === 'polygon-room') && (
              <div className="flex flex-col h-full p-4 gap-4">
                {activeTool === 'room' && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Shape</p>
                    <div className="grid grid-cols-2 gap-2">
                      {SHAPES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedRoomShape(s.id)}
                          className={cn(
                            'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all',
                            selectedRoomShape === s.id
                              ? 'bg-amber-500/20 border-amber-500 text-amber-500'
                              : 'border-border text-foreground/50 hover:text-foreground hover:bg-muted'
                          )}
                        >
                          <svg viewBox="0 0 40 40" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.5" strokeLinejoin="round">
                            <path d={s.path} />
                          </svg>
                          <span className="text-[10px]">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTool === 'polygon-room' && (
                  <p className="text-[10px] text-foreground/50 leading-relaxed">
                    Click to add vertices. Double-click or click near the first point (●) to close the polygon.
                  </p>
                )}

                <div>
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Room Type</p>
                  <div className="flex flex-col gap-1.5">
                    {ROOM_OPTIONS.map(({ type, label, color }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedRoomType(type)}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-all',
                          selectedRoomType === type
                            ? 'bg-amber-500/20 text-amber-500 shadow-[inset_0_0_0_1.5px_rgba(245,158,11,0.5)]'
                            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <span className="truncate">{label}</span>
                        <span className="w-3.5 h-3.5 rounded border border-white/20 shrink-0" style={{ backgroundColor: color }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}