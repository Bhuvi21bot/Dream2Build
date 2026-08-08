import { Link } from 'wouter';
import { ArrowLeft, Save, Undo, Redo, Download, Settings, Box, LayoutPanelLeft, Columns2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlannerStore } from '../store';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function PlannerNavbar() {
  const { view, setView } = usePlannerStore();

  const handleGenerate3D = () => {
    window.dispatchEvent(new Event('dream2build:generate3d'));
  };

  return (
    <header className="h-14 border-b border-border bg-card/90 backdrop-blur-xl flex items-center justify-between px-4 z-40">
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
            Planner
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-muted">
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-muted">
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground hover:bg-muted">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="flex items-center gap-4">
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
        
        <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground hover:bg-muted">
          <Download className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground hover:bg-muted">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
