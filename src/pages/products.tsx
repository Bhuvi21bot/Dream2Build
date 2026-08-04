import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles, LayoutDashboard, Sofa, Compass, Zap, Layers,
  ArrowRight, Ruler, Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Products — "Blueprint & Paper" design system.
 * Each product gets its own purpose-built SVG mockup instead of a shared
 * "Interactive Demo UI" placeholder panel, and the palette rotates fully
 * (green / clay / ochre / slate / brick) across sections so five stacked
 * feature blocks don't read as one repeating green icon five times.
 */

const PALETTE = [
  { bg: "#2F6F4E" }, { bg: "#D97A3F" }, { bg: "#F2C14E" }, { bg: "#7A93A8" }, { bg: "#B25D5D" },
]
const tone = (i: number) => PALETTE[i % PALETTE.length]

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pd-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pd-grid)" />
    </svg>
  )
}

/* ---------- per-product mockups ---------- */

function FloorPlanMock({ c }: { c: string }) {
  const rooms = [
    { x: 6, y: 6, w: 44, h: 38 }, { x: 56, y: 6, w: 38, h: 24 },
    { x: 56, y: 34, w: 38, h: 10 }, { x: 6, y: 50, w: 30, h: 40 },
    { x: 40, y: 50, w: 54, h: 40 },
  ]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full p-8">
      {rooms.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={`${c}1f`} stroke={c} strokeOpacity="0.55" strokeWidth="0.8" rx="1" />
      ))}
      <circle cx="30" cy="6" r="1.2" fill={c} />
      <circle cx="70" cy="34" r="1.2" fill={c} />
    </svg>
  )
}

function InteriorMock({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full p-6">
      <polygon points="20,110 100,60 180,110 100,150" fill="#F4F1EA" stroke="#1E2A22" strokeOpacity="0.1" />
      <polygon points="20,110 100,60 100,10 20,60" fill={`${c}22`} stroke="#1E2A22" strokeOpacity="0.1" />
      <polygon points="180,110 100,60 100,10 180,60" fill="#EFE3CE" stroke="#1E2A22" strokeOpacity="0.1" />
      <rect x="55" y="95" width="30" height="20" fill={c} opacity="0.85" rx="2" />
      <rect x="110" y="90" width="24" height="25" fill={`${c}bb`} rx="2" />
      <circle cx="140" cy="45" r="6" fill="#F2C14E" opacity="0.9" />
    </svg>
  )
}

function ClimateMock({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full p-8">
      <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeOpacity="0.3" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="24" fill="none" stroke={c} strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="2 3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x1 = 50 + Math.cos(angle) * 38, y1 = 50 + Math.sin(angle) * 38
        const x2 = 50 + Math.cos(angle) * 44, y2 = 50 + Math.sin(angle) * 44
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeOpacity="0.4" strokeWidth="0.8" />
      })}
      <path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="14" r="2.2" fill="#F2C14E" />
      <text x="50" y="8" textAnchor="middle" fontSize="5" fill="#1E2A22" fillOpacity="0.5" fontFamily="monospace">N</text>
    </svg>
  )
}

function CostMock({ c }: { c: string }) {
  const rows = [
    ["Foundation", "$18,400"], ["Framing", "$24,900"], ["Roofing", "$11,200"],
    ["Electrical", "$9,800"], ["Plumbing", "$8,150"], ["Finishes", "$21,300"],
  ]
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 p-8">
      {rows.map(([label, val], i) => (
        <div key={label} className="flex items-center justify-between border-b border-[#1E2A22]/8 pb-2">
          <span className="font-mono text-xs text-[#1E2A22]/60">{label}</span>
          <span className="font-mono text-xs font-bold" style={{ color: i % 2 === 0 ? c : "#1E2A22" }}>{val}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center justify-between pt-1">
        <span className="font-mono text-xs font-bold uppercase tracking-wide">Total</span>
        <span className="font-mono text-sm font-bold" style={{ color: c }}>$93,750</span>
      </div>
    </div>
  )
}

function BoqMock({ c }: { c: string }) {
  const items = [
    { name: "Red brick", qty: "4,200 pcs" }, { name: "Cement (50kg)", qty: "180 bags" },
    { name: "Rebar 12mm", qty: "1.2 t" }, { name: "Ceramic tile", qty: "620 sqft" },
  ]
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-8">
      {items.map((it) => (
        <div key={it.name} className="flex items-center gap-3">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c }} />
          <span className="flex-1 text-sm text-[#1E2A22]/75">{it.name}</span>
          <span className="font-mono text-xs text-[#1E2A22]/50">{it.qty}</span>
        </div>
      ))}
    </div>
  )
}

const MOCKS = [FloorPlanMock, InteriorMock, ClimateMock, CostMock, BoqMock]

const PRODUCTS = [
  {
    id: "floor-planner", icon: LayoutDashboard, title: "AI Floor Planner",
    desc: "Generate optimized floor plans that respect structural constraints, plot lines, and your specific lifestyle needs.",
    features: ["Auto-routing of plumbing & electrical", "Real-time structural validation", "Export to DWG/DXF"],
  },
  {
    id: "interior", icon: Sofa, title: "Interior AI",
    desc: "Instantly visualize your space with different materials, colors, and furniture arrangements in photorealistic quality.",
    features: ["One-click style variations", "Natural lighting simulation", "AR-ready exports"],
  },
  {
    id: "climate", icon: Compass, title: "Climate & Energy",
    desc: "Simulate sun paths, wind flow, and thermal dynamics to optimize your home's energy efficiency before it's built.",
    features: ["Year-round solar study", "Passive cooling suggestions", "LEED score estimation"],
  },
  {
    id: "cost", icon: Zap, title: "Live Cost Estimator",
    desc: "As you design, our AI pulls local material and labor costs to keep your project strictly within budget.",
    features: ["Zip-code based pricing", "Alternative material suggestions", "Exportable budget sheets"],
  },
  {
    id: "boq", icon: Layers, title: "Material BOQ",
    desc: "Automatically generate a comprehensive Bill of Quantities so you know exactly how many bricks, tiles, and screws to order.",
    features: ["99% accuracy guarantee", "Supplier matching", "Waste-reduction calculation"],
  },
]

export default function Products() {
  return (
    <div className="w-full bg-[#FAF8F3] text-[#1E2A22]">
      {/* HEADER */}
      <div className="relative overflow-hidden border-b border-[#1E2A22]/10 bg-white py-24">
        <BlueprintGrid className="opacity-60" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">The suite</span>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight md:text-7xl">
            Five specialists. <span className="italic text-[#2F6F4E]">One workspace.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#1E2A22]/65">
            Everything you need to conceptualize, plan, and price a project — with the accuracy
            of a full design team, in a single tab.
          </p>
        </div>
      </div>

      {/* PRODUCT SECTIONS */}
      <div className="container mx-auto space-y-28 px-6 py-24">
        {PRODUCTS.map((product, idx) => {
          const t = tone(idx)
          const Mock = MOCKS[idx]
          return (
            <div
              key={product.id}
              className={`flex flex-col items-center gap-14 md:flex-row ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-6"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border"
                  style={{ backgroundColor: `${t.bg}14`, borderColor: `${t.bg}33` }}
                >
                  <product.icon className="h-6 w-6" style={{ color: t.bg }} />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: t.bg }}>
                  0{idx + 1} · {product.id.replace("-", " ")}
                </span>
                <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">{product.title}</h2>
                <p className="max-w-md text-lg leading-relaxed text-[#1E2A22]/65">{product.desc}</p>

                <ul className="space-y-3 pt-2">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 shrink-0" style={{ color: t.bg }} />
                      <span className="text-[#1E2A22]/80">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="mt-2 rounded-full border-[#1E2A22]/20">
                  Try {product.title.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative aspect-square w-full flex-1 overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-xl md:aspect-[4/3]"
              >
                <BlueprintGrid className="opacity-40" />
                <div className="absolute inset-0">
                  <Mock c={t.bg} />
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/60 shadow">
                  {idx === 0 && <><Ruler className="h-3 w-3" /> Live plan</>}
                  {idx === 1 && <><Palette className="h-3 w-3" /> HD render</>}
                  {idx === 2 && <><Compass className="h-3 w-3" /> Sun path</>}
                  {idx === 3 && <><Zap className="h-3 w-3" /> Live pricing</>}
                  {idx === 4 && <><Layers className="h-3 w-3" /> Material list</>}
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#1E2A22] py-24 text-[#FAF8F3]">
        <BlueprintGrid className="opacity-20 [&_path]:stroke-[#FAF8F3]" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="mb-5 font-serif text-3xl font-medium tracking-tight md:text-5xl">
            All five, in every project.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-[#FAF8F3]/70">
            No add-ons to unlock, no separate tools to juggle — the whole suite is there from your first draft.
          </p>
          <Button size="lg" className="rounded-full bg-[#D97A3F] px-8 font-semibold text-white hover:bg-[#c66a30]">
            Start designing, free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}