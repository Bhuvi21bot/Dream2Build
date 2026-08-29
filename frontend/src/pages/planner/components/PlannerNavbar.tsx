import { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, Save, Undo, Redo, Download, Settings, Box,
  LayoutPanelLeft, Columns2, Grid3X3, X, Magnet, Ruler
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlannerStore } from '../store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// ─── Settings Modal ───────────────────────────────────────────────────────────
function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showGrid, snapToGrid, gridSize, toggleGrid, toggleSnap, setScale, scale } = usePlannerStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[380px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/50 p-6 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Settings className="w-4 h-4 text-amber-500" />
                </div>
                <h2 className="font-semibold text-foreground">Planner Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-4 p-4 bg-background rounded-xl border border-border">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <Grid3X3 className="w-3 h-3" /> Grid & Snap
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground/80 flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-foreground/40" /> Show Grid
                </Label>
                <Switch checked={showGrid} onCheckedChange={toggleGrid} />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground/80 flex items-center gap-2">
                  <Magnet className="w-4 h-4 text-foreground/40" /> Snap to Grid
                </Label>
                <Switch checked={snapToGrid} onCheckedChange={toggleSnap} />
              </div>
            </div>

            {/* Scale */}
            <div className="flex flex-col gap-4 p-4 bg-background rounded-xl border border-border">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <Ruler className="w-3 h-3" /> View Scale
              </div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-sm text-foreground/80">Canvas Zoom</Label>
                <span className="text-xs font-mono text-amber-500">{(scale * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[scale]}
                min={0.1}
                max={3}
                step={0.05}
                onValueChange={([v]) => setScale(v)}
              />
            </div>

            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-none"
            >
              Done
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function PlannerNavbar() {
  const { view, setView, undo, redo, canUndo, canRedo, walls, rooms, doors, windows, furniture } = usePlannerStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleGenerate3D = () => {
    window.dispatchEvent(new Event('dream2build:generate3d'));
  };

  const handleSave = () => {
    try {
      const state = { walls, rooms, doors, windows, furniture };
      localStorage.setItem('dream2build_plan', JSON.stringify(state));
      toast({
        title: '✅ Plan Saved',
        description: 'Your floor plan has been saved to browser storage.',
      });
    } catch {
      toast({ title: '❌ Save Failed', description: 'Could not save plan.', variant: 'destructive' });
    }
  };

  const handleDownload = () => {
    try {
      const state = { walls, rooms, doors, windows, furniture, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dream2build-plan-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: '⬇️ Downloaded', description: 'Floor plan exported as JSON.' });
    } catch {
      toast({ title: '❌ Download Failed', description: 'Could not export plan.', variant: 'destructive' });
    }
  };

  return (
    <>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <header className="h-14 border-b border-border bg-card/90 backdrop-blur-xl flex items-center justify-between px-4 z-40">
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Box className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-display font-bold text-lg tracking-wide text-amber-500">
              KHUSHEE
            </span>
          </div>
        </div>

        {/* Centre: Undo/Redo/Save */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canUndo}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="text-foreground/70 hover:text-foreground hover:bg-muted disabled:opacity-30"
          >
            <Undo className="w-4 h-4 mr-1.5" />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!canRedo}
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className="text-foreground/70 hover:text-foreground hover:bg-muted disabled:opacity-30"
          >
            <Redo className="w-4 h-4 mr-1.5" />
            Redo
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            title="Save to browser storage"
            className="text-foreground/70 hover:text-foreground hover:bg-muted"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save
          </Button>
        </div>

        {/* Right: View toggle + Generate + Download + Settings */}
        <div className="flex items-center gap-3">
          <div className="bg-background rounded-md p-1 border border-border flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('2d')}
              className={cn("px-3 h-8", view === '2d' ? "bg-muted text-amber-500" : "text-foreground/60 hover:text-foreground hover:bg-muted/50")}
            >
              <LayoutPanelLeft className="w-4 h-4 mr-2" />
              2D
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('split')}
              className={cn("px-3 h-8", view === 'split' ? "bg-muted text-amber-500" : "text-foreground/60 hover:text-foreground hover:bg-muted/50")}
            >
              <Columns2 className="w-4 h-4 mr-2" />
              Split
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('3d')}
              className={cn("px-3 h-8", view === '3d' ? "bg-muted text-amber-500" : "text-foreground/60 hover:text-foreground hover:bg-muted/50")}
            >
              <Box className="w-4 h-4 mr-2" />
              3D
            </Button>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleGenerate3D}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-900/20 border-none"
            >
              Generate 3D
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download plan as JSON"
            className="text-foreground/70 hover:text-foreground hover:bg-muted"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            className="text-foreground/70 hover:text-foreground hover:bg-muted"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>
    </>
  );
}
