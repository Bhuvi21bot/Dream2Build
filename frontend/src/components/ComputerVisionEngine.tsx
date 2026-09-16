import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanSearch, Image as ImageIcon, Layers, Grid, Variable, CheckCircle2, ChevronRight, Cpu } from 'lucide-react';

const libraries = [
  {
    name: 'OpenCV',
    icon: ScanSearch,
    description: 'Identifies architectural lines so Dream2Build can understand your walls.',
    useCases: ['Wall detection', 'Line detection', 'Door/window detection', 'Image preprocessing'],
    highlight: 'lines'
  },
  {
    name: 'Pillow',
    icon: ImageIcon,
    description: 'Prepares and optimizes your floor-plan images for AI analysis.',
    useCases: ['Image preprocessing', 'Format conversion', 'Image optimization'],
    highlight: 'image'
  },
  {
    name: 'scikit-image',
    icon: Layers,
    description: 'Segments the image to understand where rooms and distinct areas are located.',
    useCases: ['Segmentation', 'Edge detection', 'Region analysis'],
    highlight: 'regions'
  },
  {
    name: 'NumPy',
    icon: Grid,
    description: 'Processes the raw pixel matrix required for advanced computer vision calculations.',
    useCases: ['Pixel processing', 'Matrix operations', 'Numerical computation'],
    highlight: 'matrix'
  },
  {
    name: 'SciPy',
    icon: Variable,
    description: 'Applies geometric algorithms to ensure walls and corners are perfectly aligned.',
    useCases: ['Geometry', 'Optimization', 'Mathematical processing'],
    highlight: 'geometry'
  }
];

const pipelineSteps = [
  'Upload Floor Plan',
  'Image Processing',
  'Feature Detection',
  'Room Segmentation',
  'Geometry Processing',
  'Structured Floor Plan',
  '3D Generation'
];

const techStack = [
  'OpenCV', 'Pillow', 'scikit-image', 'NumPy', 'SciPy', 'PyTorch', 'YOLO', 'SAM', 'Shapely', 'trimesh'
];

export function ComputerVisionEngine() {
  const [hoveredLib, setHoveredLib] = useState<string | null>(null);

  // SVG representation for the interactive visualizer
  const renderVisualizer = () => {
    return (
      <div className="relative w-full aspect-square md:aspect-auto md:h-full bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden flex items-center justify-center p-8">
        {/* Blueprint Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Base Floor Plan SVG */}
        <svg className="w-full h-full max-w-md drop-shadow-2xl" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          
          {/* Default state */}
          <motion.path 
            d="M 10 10 L 90 10 L 90 90 L 10 90 Z" 
            strokeWidth="1" 
            className="text-slate-500"
          />
          <motion.path 
            d="M 50 10 L 50 90" 
            strokeWidth="1" 
            className="text-slate-500"
          />
          <motion.path 
            d="M 10 50 L 50 50" 
            strokeWidth="1" 
            className="text-slate-500"
          />

          {/* Image Preprocessing (Pillow) */}
          <motion.rect
            x="0" y="0" width="100" height="100"
            fill="url(#scanning-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'Pillow' ? 0.2 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Wall/Line Detection (OpenCV) */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: hoveredLib === 'OpenCV' ? 1 : 0,
              scale: hoveredLib === 'OpenCV' ? 1 : 0.95
            }}
            transition={{ duration: 0.3 }}
            className="text-cyan-400"
            strokeWidth="2"
          >
            <path d="M 10 10 L 90 10 L 90 90 L 10 90 Z" strokeDasharray="4 2" />
            <circle cx="50" cy="10" r="1" fill="currentColor" />
            <circle cx="90" cy="50" r="1" fill="currentColor" />
          </motion.g>

          {/* Region Segmentation (scikit-image) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'scikit-image' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <rect x="12" y="12" width="36" height="36" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="0.5" />
            <rect x="52" y="12" width="36" height="76" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="0.5" />
            <rect x="12" y="52" width="36" height="36" fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="0.5" />
          </motion.g>

          {/* Matrix Operations (NumPy) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'NumPy' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(10)].map((_, i) => (
              [...Array(10)].map((_, j) => (
                <rect key={`${i}-${j}`} x={i * 10} y={j * 10} width="10" height="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill={Math.random() > 0.5 ? "rgba(255,255,255,0.05)" : "none"} />
              ))
            ))}
          </motion.g>

          {/* Geometry/Optimization (SciPy) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'SciPy' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-green-400"
          >
            <path d="M 10 10 Q 50 -10 90 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
            <path d="M 10 10 L 50 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </motion.g>

          <defs>
            <linearGradient id="scanning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Scanning Laser Animation */}
        <motion.div 
          className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-md backdrop-blur border border-slate-700">
          <span>{hoveredLib ? `Processing: ${hoveredLib}` : 'Awaiting Input'}</span>
          <span>AI.CV.ENG</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#0B0F19] text-white py-24 px-6 md:px-12 lg:px-24 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Cpu className="w-4 h-4" />
            Powered by Python + AI
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Computer Vision Engine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Turning 2D floor plans into intelligent architectural data. Dream2Build uses computer vision and mathematical geometry to understand walls, rooms, doors, and windows before generating the 3D environment.
          </motion.p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          
          {/* Left Column: Visualizer */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[400px] lg:h-[600px] sticky top-24"
          >
            {renderVisualizer()}
          </motion.div>

          {/* Right Column: Tech Cards */}
          <div className="space-y-4">
            {libraries.map((lib, index) => {
              const Icon = lib.icon;
              const isHovered = hoveredLib === lib.name;
              return (
                <motion.div
                  key={lib.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredLib(lib.name)}
                  onMouseLeave={() => setHoveredLib(null)}
                  className={`
                    relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-default
                    ${isHovered 
                      ? 'bg-slate-800/80 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.02]' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isHovered ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                        {lib.name}
                        {isHovered && <span className="text-xs font-normal text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full animate-pulse">Active processing</span>}
                      </h3>
                      <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                        {lib.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {lib.useCases.map((useCase) => (
                          <div key={useCase} className="flex items-center gap-2 text-xs text-slate-400">
                            <CheckCircle2 className="w-3 h-3 text-slate-500" />
                            {useCase}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -translate-y-1/2 z-0" />
            
            {pipelineSteps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="relative z-10 flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all duration-300 shadow-xl">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="mt-4 text-xs font-medium text-slate-400 text-center max-w-[80px] group-hover:text-slate-200 transition-colors">
                    {step}
                  </span>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <ChevronRight className="md:hidden text-slate-700 w-5 h-5 my-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-6">Under the Hood</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all cursor-default shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center border border-slate-700/50 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">From Blueprint to Reality</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto relative z-10">
            Upload your floor plan and let Dream2Build understand your space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)] w-full sm:w-auto">
              Try 2D → 3D
            </button>
            <button className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold transition-colors w-full sm:w-auto">
              Explore AI Features
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
