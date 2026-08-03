import { ZoomIn, ZoomOut, Maximize, Grid3X3, Magnet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlannerStore } from '../store';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

export function BottomToolbar() {
  const { 
    scale, setScale, 
    showGrid, toggleGrid, 
    snapToGrid, toggleSnap 
  } = usePlannerStore();

  const handleZoomIn = () => setScale(Math.min(scale * 1.2, 5));
  const handleZoomOut = () => setScale(Math.max(scale / 1.2, 0.1));
  const handleZoomReset = () => setScale(1);

  return (
    <div className="h-12 border-t border-[#2a1a0e] bg-[#1a0f07]/95 flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#120b05] rounded-md border border-[#2a1a0e] p-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/60 hover:text-foreground" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono w-12 text-center text-foreground/80">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/60 hover:text-foreground" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1 bg-[#2a1a0e]" />
          <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground/60 hover:text-foreground" onClick={handleZoomReset}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono text-foreground/40">
        1 grid unit = {100 / scale} cm
      </div>

      <div className="flex items-center gap-2">
        <Toggle 
          pressed={showGrid} 
          onPressedChange={toggleGrid}
          variant="outline"
          size="sm"
          className="h-8 border-[#2a1a0e] data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-500"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Grid
        </Toggle>
        <Toggle 
          pressed={snapToGrid} 
          onPressedChange={toggleSnap}
          variant="outline"
          size="sm"
          className="h-8 border-[#2a1a0e] data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-500"
        >
          <Magnet className="w-4 h-4 mr-2" />
          Snap
        </Toggle>
      </div>
    </div>
  );
}
