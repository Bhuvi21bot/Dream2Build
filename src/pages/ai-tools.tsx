import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, Layers, Compass, Zap, Sofa, CheckCircle2, ChevronRight,
  TrendingUp, Download, Check, ShieldCheck, Sun, Wind, DollarSign,
  ClipboardList, ArrowRight, Play, Info
} from "lucide-react"

// AI Floor Planner Page Component
export function AIFloorPlannerPage() {
  const [prompt, setPrompt] = useState("Modern 3-bedroom cabin with large south-facing windows")
  const [isGenerating, setIsGenerating] = useState(false)
  const [rooms, setRooms] = useState<any>([])
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setRooms([
        { x: 10, y: 10, w: 40, h: 40, label: "Living Area", fill: "#FAF1EA" },
        { x: 55, y: 10, w: 35, h: 22, label: "Kitchen", fill: "#FAF8F3" },
        { x: 55, y: 35, w: 35, h: 15, label: "Bathroom", fill: "#e7bc91" },
        { x: 10, y: 55, w: 38, h: 35, label: "Master Bed", fill: "#FAF1EA" },
        { x: 52, y: 55, w: 38, h: 35, label: "Guest Bed", fill: "#FAF8F3" }
      ])
      setIsGenerating(false)
      toast({
        title: "Layout Generated!",
        description: "Your structural layout is ready. You can now tweak details or load it into the editor.",
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">AI Generator Suite</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">AI Floor Planner</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Input structural requirements to synthesize a custom scale blueprint layout instantly.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
              <label className="text-xs font-mono uppercase tracking-wider text-[#1E2A22]/60">Design Intent Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-4 text-sm outline-none placeholder:text-[#1E2A22]/30 focus:border-[#a47148]"
                placeholder="e.g. Minimalist A-frame cabin with central chimney..."
              />
              <Button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="mt-4 w-full rounded-full bg-[#a47148] py-6 text-white hover:bg-[#8e603d] flex items-center justify-center gap-2"
              >
                {isGenerating ? "Synthesizing Layout..." : "Generate Floor Plan"}
                <Sparkles className="h-4 w-4" />
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm flex items-center justify-center p-6">
              {isGenerating && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-12 h-12 border-4 border-[#a47148]/20 border-t-[#a47148] rounded-full mb-4" />
                  <p className="font-mono text-xs">MAPPING STRUCTURAL VECTORS...</p>
                </div>
              )}

              {rooms.length > 0 ? (
                <svg viewBox="0 0 100 100" className="w-full h-full max-h-[360px]">
                  {rooms.map((r: any, i: number) => (
                    <g key={i}>
                      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke="#1E2A22" strokeWidth="0.8" rx="2" />
                      <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" fontSize="3.8" fill="#1E2A22" fillOpacity="0.8" fontFamily="monospace">{r.label}</text>
                    </g>
                  ))}
                </svg>
              ) : (
                <div className="text-center text-[#1E2A22]/50">
                  <Layers className="h-10 w-10 text-[#a47148]/55 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Ready to draft</p>
                  <p className="text-xs max-w-xs mt-1">Input your specs and click generate to visualize vector mapping outputs.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Interior AI Component
export function InteriorAIPage() {
  const [style, setStyle] = useState("japandi")
  const [sliderVal, setSliderVal] = useState(50)
  const { toast } = useToast()

  const roomStyles = {
    japandi: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
    scandinavian: "https://images.unsplash.com/photo-1615529182906-c146e4c761b0?q=80&w=800&auto=format&fit=crop",
    modern: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop",
    industrial: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop"
  }

  const beforeImg = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop"

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">AI Generator Suite</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Interior AI Stylist</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Select custom interior designs to instantly populate styles, textures, and matching furniture sets.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
              <label className="text-xs font-mono uppercase tracking-wider text-[#1E2A22]/60">Theme Style Selection</label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {Object.keys(roomStyles).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStyle(s)
                      toast({ title: `Styled to ${s.toUpperCase()}!`, description: "Slide image below to view comparison." })
                    }}
                    className={`rounded-2xl border p-4 text-left capitalize transition-all ${
                      style === s ? "border-[#a47148] bg-[#a47148]/5" : "border-[#1E2A22]/15 hover:border-[#a47148]/40"
                    }`}
                  >
                    <span className="font-medium text-[#1E2A22]">{s}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm p-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl select-none">
                <img src={beforeImg} alt="Before" className="absolute inset-0 h-full w-full object-cover" />
                <div 
                  className="absolute inset-y-0 right-0 overflow-hidden" 
                  style={{ left: `${sliderVal}%` }}
                >
                  <img 
                    src={roomStyles[style as keyof typeof roomStyles]} 
                    alt="After" 
                    className="absolute inset-y-0 right-0 h-full w-full object-cover max-w-none" 
                    style={{ width: "100%", height: "100%", transform: `translateX(-${sliderVal}%)` }}
                  />
                </div>
                {/* Drag Slider Indicator */}
                <div className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center" style={{ left: `${sliderVal}%` }}>
                  <div className="h-10 w-6 rounded-full bg-white shadow flex items-center justify-center font-bold text-xs">↔</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-mono text-[#1E2A22]/50">BEFORE DRAFT</span>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={sliderVal} 
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="flex-1 mx-6 h-1 bg-[#FAF8F3] rounded-full appearance-none cursor-pointer accent-[#a47148]" 
                />
                <span className="text-xs font-mono text-[#a47148] font-bold">AFTER AI STYLE</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Climate & Energy Component
export function ClimateEnergyPage() {
  const [orientation, setOrientation] = useState(0)
  const [solarYear, setSolarYear] = useState("annual")
  const [climateOptions, setClimateOptions] = useState({
    southGlass: true,
    passiveVent: false,
    solarRoof: true
  })

  // Mock scoring calculation
  const getEnergyScore = () => {
    let base = 72
    if (climateOptions.southGlass) base += 8
    if (climateOptions.passiveVent) base += 6
    if (climateOptions.solarRoof) base += 12
    return base
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Sustainability & Engineering</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Climate & Energy Simulator</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Simulate architectural placement to maximize daylight, airflow, and passive cooling features.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium">Environmental Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#1E2A22]/60">South-Facing Overhangs</label>
                  <input
                    type="checkbox"
                    checked={climateOptions.southGlass}
                    onChange={(e) => setClimateOptions({ ...climateOptions, southGlass: e.target.checked })}
                    className="accent-[#a47148]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#1E2A22]/60">Cross-Wind Openings</label>
                  <input
                    type="checkbox"
                    checked={climateOptions.passiveVent}
                    onChange={(e) => setClimateOptions({ ...climateOptions, passiveVent: e.target.checked })}
                    className="accent-[#a47148]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#1E2A22]/60">Photovoltaic Array</label>
                  <input
                    type="checkbox"
                    checked={climateOptions.solarRoof}
                    onChange={(e) => setClimateOptions({ ...climateOptions, solarRoof: e.target.checked })}
                    className="accent-[#a47148]"
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-[#1E2A22]/10 pt-4">
                <label className="text-xs font-mono text-[#1E2A22]/50">Orientation angle: {orientation}°</label>
                <input
                  type="range"
                  min="0" max="360"
                  value={orientation}
                  onChange={(e) => setOrientation(Number(e.target.value))}
                  className="w-full accent-[#a47148] mt-2 cursor-pointer"
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm grid grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="font-serif text-xl font-medium">Dynamic Energy Rating</h3>
                <p className="text-sm text-[#1E2A22]/50 mt-1">Updates based on sun orientation and ventilation pathways.</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold text-[#a47148]">{getEnergyScore()}</span>
                  <span className="text-sm text-[#1E2A22]/40 font-mono">/ 100 (LEED Estimate)</span>
                </div>
              </div>
              <div className="flex justify-center">
                <svg viewBox="0 0 100 100" className="w-full max-w-[150px] transition-transform duration-500" style={{ transform: `rotate(${orientation}deg)` }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#FAF8F3" strokeWidth="6" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#a47148" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="#a47148" strokeOpacity="0.2" strokeWidth="0.8" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="#a47148" strokeOpacity="0.2" strokeWidth="0.8" />
                  <circle cx="50" cy="14" r="5" fill="#FAF1EA" stroke="#a47148" strokeWidth="1.5" />
                  <text x="50" y="32" textAnchor="middle" fontSize="12" fill="#a47148" fontFamily="monospace" fontWeight="bold">N</text>
                </svg>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Live Cost Estimator Component
export function LiveCostEstimatorPage() {
  const [sqft, setSqft] = useState(1500)
  const [zipcode, setZipcode] = useState("90210")
  const [quality, setQuality] = useState("standard")

  const getBaseCost = () => {
    let rate = 150
    if (quality === "premium") rate = 240
    if (quality === "eco") rate = 190
    return sqft * rate
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Financial Analytics</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Live Cost Estimator</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Get instant local builder estimates based on square footage, materials quality, and zipcode averages.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm space-y-4">
              <div>
                <label className="text-xs font-mono text-[#1E2A22]/50">Square Footage: {sqft} sqft</label>
                <input
                  type="range"
                  min="200" max="6000" step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full accent-[#a47148] mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#1E2A22]/50">Local ZIP Code</label>
                <Input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="mt-1 bg-[#FAF8F3] border-[#1E2A22]/10 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#1E2A22]/50">Finish Quality Standard</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["standard", "premium", "eco"].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`rounded-xl border p-2 text-xs capitalize font-medium ${
                        quality === q ? "border-[#a47148] bg-[#a47148]/5 text-[#a47148]" : "border-[#1E2A22]/10 hover:border-[#a47148]/30"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#a47148]">Estimated Total Budget</span>
                <div className="text-5xl font-serif font-bold text-[#1E2A22]">
                  ${getBaseCost().toLocaleString()}
                </div>
                <p className="text-sm text-[#1E2A22]/60">Calculated based on standard construction rates in Zip {zipcode}. Includes standard labor averages and initial design drafts.</p>
              </div>

              <div className="mt-8 border-t border-[#1E2A22]/10 pt-6 flex justify-between items-center">
                <span className="text-xs font-mono text-[#1E2A22]/45">Export detailed pricing sheets</span>
                <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] flex gap-2">
                  <Download className="h-4 w-4" /> Export CSV Sheet
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Material BOQ Component
export function MaterialBOQPage() {
  const [downloaded, setDownloaded] = useState(false)

  const boqData = [
    { name: "Concrete Footings & Slab", qty: "48 cu. yd.", cost: "$8,200", status: "In Stock" },
    { name: "Structural Rebar #4 & #5", qty: "1.4 tons", cost: "$3,100", status: "Shipped" },
    { name: "Red Brick (Partition Walls)", qty: "4,600 pcs", cost: "$2,800", status: "Pending" },
    { name: "Low-E South-Facing Windows", qty: "8 units", cost: "$9,400", status: "In Stock" },
    { name: "Hardwood Engineered Flooring", qty: "1,200 sqft", cost: "$6,200", status: "Pending" }
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-4xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Industrial Procurement</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Material Bill of Quantities (BOQ)</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Extract automated counts and supplier matched pricing straight from structural blueprint properties.</p>

        <Card className="mt-8 overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#FAF8F3] border-b border-[#1E2A22]/10 font-mono text-[10px] uppercase tracking-wider text-[#1E2A22]/50">
                  <th className="p-4">Material Specification</th>
                  <th className="p-4">Quantity Required</th>
                  <th className="p-4">Estimated Local Cost</th>
                  <th className="p-4">Supplier Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A22]/10 text-sm">
                {boqData.map((row, i) => (
                  <tr key={i} className="hover:bg-[#FAF8F3]/50">
                    <td className="p-4 font-semibold">{row.name}</td>
                    <td className="p-4 font-mono text-xs">{row.qty}</td>
                    <td className="p-4 font-mono text-xs text-[#a47148] font-bold">{row.cost}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
                        row.status === "In Stock" ? "bg-green-50 border-green-200 text-green-700" :
                        row.status === "Shipped" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-orange-50 border-orange-200 text-orange-700"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF8F3] p-6 border-t border-[#1E2A22]/10 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#1E2A22]/50">
              <ShieldCheck className="h-4 w-4 text-[#a47148]" /> Standard validation checks completed on 5 items.
            </div>
            <Button
              onClick={() => {
                setDownloaded(true)
                setTimeout(() => setDownloaded(false), 2000)
              }}
              className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] flex gap-2"
            >
              {downloaded ? (
                <>Downloaded <Check className="h-4 w-4" /></>
              ) : (
                <>Download BOQ Document <Download className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
