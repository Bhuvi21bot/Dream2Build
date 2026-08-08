import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from './store';
import { PlannerNavbar } from './components/PlannerNavbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { BottomToolbar } from './components/BottomToolbar';
import { SplitView } from './components/SplitView';

export default function Planner() {
  const loadSamplePlan = usePlannerStore(state => state.loadSamplePlan);
  const walls = usePlannerStore(state => state.walls);
  const view = usePlannerStore(state => state.view);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (walls.length === 0) {
      const params = new URLSearchParams(window.location.search);
      const template = params.get('template') || 'oasis';
      loadSamplePlan(template);
    }
  }, [walls.length, loadSamplePlan]);

  // Handle "Generate 3D" global event (can be triggered from navbar)
  useEffect(() => {
    const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        usePlannerStore.getState().setView('3d');
      }, 1500);
    };
    
    window.addEventListener('dream2build:generate3d', handleGenerate);
    return () => window.removeEventListener('dream2build:generate3d', handleGenerate);
  }, []);

  return (
    <div className="h-[100dvh] w-screen flex flex-col bg-background overflow-hidden text-foreground selection:bg-amber-500/30 selection:text-amber-500">
      <PlannerNavbar />
      
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar />
        
        <div className="flex-1 overflow-hidden relative bg-muted/40">
          <SplitView />
          
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <div className="text-center flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full mb-6"
                  />
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display text-amber-500 tracking-wider"
                  >
                    Generating 3D Environment
                  </motion.h2>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 250 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-1 bg-gradient-to-r from-amber-600 to-amber-400 mt-4 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <RightSidebar />
      </div>
      
      <BottomToolbar />
    </div>
  );
}
