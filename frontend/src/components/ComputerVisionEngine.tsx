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
      <div className="relative w-full aspect-square md:aspect-auto md:h-full bg-white rounded-3xl border border-[#1E2A22]/10 overflow-hidden flex items-center justify-center p-8 shadow-sm">
        {/* Blueprint Grid Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #2F6F4E 1px, transparent 1px), linear-gradient(to bottom, #2F6F4E 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Base Floor Plan SVG */}
        <svg className="w-full h-full max-w-md drop-shadow-xl" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          
          {/* Default state */}
          <motion.path 
            d="M 10 10 L 90 10 L 90 90 L 10 90 Z" 
            strokeWidth="1" 
            className="text-[#1E2A22]/20"
          />
          <motion.path 
            d="M 50 10 L 50 90" 
            strokeWidth="1" 
            className="text-[#1E2A22]/20"
          />
          <motion.path 
            d="M 10 50 L 50 50" 
            strokeWidth="1" 
            className="text-[#1E2A22]/20"
          />

          {/* Image Preprocessing (Pillow) */}
          <motion.rect
            x="0" y="0" width="100" height="100"
            fill="url(#scanning-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'Pillow' ? 0.3 : 0 }}
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
            className="text-[#2F6F4E]"
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
            <rect x="12" y="12" width="36" height="36" fill="rgba(217, 122, 63, 0.2)" stroke="#D97A3F" strokeWidth="0.5" />
            <rect x="52" y="12" width="36" height="76" fill="rgba(242, 193, 78, 0.2)" stroke="#F2C14E" strokeWidth="0.5" />
            <rect x="12" y="52" width="36" height="36" fill="rgba(47, 111, 78, 0.2)" stroke="#2F6F4E" strokeWidth="0.5" />
          </motion.g>

          {/* Matrix Operations (NumPy) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'NumPy' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {[...Array(10)].map((_, i) => (
              [...Array(10)].map((_, j) => (
                <rect key={`${i}-${j}`} x={i * 10} y={j * 10} width="10" height="10" stroke="rgba(30,42,34,0.1)" strokeWidth="0.5" fill={Math.random() > 0.5 ? "rgba(30,42,34,0.05)" : "none"} />
              ))
            ))}
          </motion.g>

          {/* Geometry/Optimization (SciPy) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: hoveredLib === 'SciPy' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#a47148]"
          >
            <path d="M 10 10 Q 50 -10 90 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 1" />
            <path d="M 10 10 L 50 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </motion.g>

          <defs>
            <linearGradient id="scanning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#a47148" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Scanning Laser Animation */}
        <motion.div 
          className="absolute left-0 right-0 h-0.5 bg-[#a47148] shadow-[0_0_10px_#a47148]"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono text-[#1E2A22]/60 bg-white/90 px-3 py-1.5 rounded-md backdrop-blur border border-[#1E2A22]/10">
          <span>{hoveredLib ? `Processing: ${hoveredLib}` : 'Awaiting Input'}</span>
          <span>AI.CV.ENG</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#FAF8F3] text-[#1E2A22] py-24 px-6 md:px-12 lg:px-24 font-sans h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a47148]/10 border border-[#a47148]/20 text-[#a47148] text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Cpu className="w-4 h-4" />
            Powered by Python + AI
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight"
          >
            Computer Vision Engine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#1E2A22]/60 max-w-2xl mx-auto"
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
                    relative p-6 rounded-2xl border transition-all duration-300 cursor-default
                    ${isHovered 
                      ? 'bg-white border-[#a47148]/40 shadow-lg scale-[1.02]' 
                      : 'bg-white/60 border-[#1E2A22]/10 hover:border-[#1E2A22]/20'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${isHovered ? 'bg-[#a47148]/15 text-[#a47148]' : 'bg-[#1E2A22]/5 text-[#1E2A22]/50'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center justify-between font-serif">
                        {lib.name}
                        {isHovered && <span className="text-[10px] font-mono uppercase tracking-wide text-[#a47148] bg-[#a47148]/10 px-2 py-1 rounded-full animate-pulse">Active processing</span>}
                      </h3>
                      <p className="text-[#1E2A22]/70 mb-4 text-sm leading-relaxed">
                        {lib.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {lib.useCases.map((useCase) => (
                          <div key={useCase} className="flex items-center gap-2 text-xs text-[#1E2A22]/60">
                            <CheckCircle2 className="w-3 h-3 text-[#2F6F4E]" />
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
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a47148]/30 to-transparent -translate-y-1/2 z-0" />
            
            {pipelineSteps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="relative z-10 flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#1E2A22]/10 flex items-center justify-center text-[#1E2A22]/50 group-hover:border-[#a47148] group-hover:text-[#a47148] group-hover:bg-[#a47148]/5 transition-all duration-300 shadow-sm">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="mt-4 text-xs font-medium text-[#1E2A22]/60 text-center max-w-[80px] group-hover:text-[#1E2A22] transition-colors">
                    {step}
                  </span>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <ChevronRight className="md:hidden text-[#1E2A22]/20 w-5 h-5 my-2" />
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
          <h3 className="text-xs uppercase tracking-widest font-mono text-[#d4a276] mb-6">Under the Hood</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="px-4 py-2 rounded-full bg-white border border-[#1E2A22]/10 text-sm text-[#1E2A22]/70 hover:bg-[#a47148] hover:text-white hover:border-[#a47148] transition-all cursor-default shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
