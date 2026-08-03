import { Layout } from "@/components/layout"
import { Sparkles, LayoutDashboard, Sofa, Compass, Zap, Layers, PenTool } from "lucide-react"
import { motion } from "framer-motion"

export default function Products() {
  const products = [
    {
      id: "floor-planner",
      icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
      title: "AI Floor Planner",
      desc: "Generate optimized floor plans that respect structural constraints, plot lines, and your specific lifestyle needs.",
      features: ["Auto-routing of plumbing & electrical", "Real-time structural validation", "Export to DWG/DXF"]
    },
    {
      id: "interior",
      icon: <Sofa className="w-8 h-8 text-primary" />,
      title: "Interior AI",
      desc: "Instantly visualize your space with different materials, colors, and furniture arrangements in photorealistic quality.",
      features: ["One-click style variations", "Natural lighting simulation", "AR ready exports"]
    },
    {
      id: "climate",
      icon: <Compass className="w-8 h-8 text-primary" />,
      title: "Climate & Energy",
      desc: "Simulate sun paths, wind flow, and thermal dynamics to optimize your home's energy efficiency before it's built.",
      features: ["Year-round solar study", "Passive cooling suggestions", "LEED score estimation"]
    },
    {
      id: "cost",
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Live Cost Estimator",
      desc: "As you design, our AI pulls local material and labor costs to keep your project strictly within budget.",
      features: ["Zip-code based pricing", "Alternative material suggestions", "Exportable budget sheets"]
    },
    {
      id: "boq",
      icon: <Layers className="w-8 h-8 text-primary" />,
      title: "Material BOQ",
      desc: "Automatically generate a comprehensive Bill of Quantities so you know exactly how many bricks, tiles, and screws to order.",
      features: ["99% accuracy guarantee", "Supplier matching", "Waste reduction calculation"]
    }
  ]

  return (
    <div className="w-full">
      <div className="bg-muted py-24 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">The AI Design Suite</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to conceptualize, plan, and estimate your project with unprecedented accuracy.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 space-y-32">
        {products.map((product, idx) => (
          <div key={product.id} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                {product.icon}
              </div>
              <h2 className="text-4xl font-display font-bold">{product.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.desc}</p>
              
              <ul className="space-y-4 pt-4">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center overflow-hidden relative"
            >
              {/* Fallback pattern since we don't have images for all */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
              <p className="text-muted-foreground font-mono">Interactive Demo UI</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
