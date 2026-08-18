import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, Upload,
  Ruler, LayoutTemplate, Users, Trash2, Check,
  MessageSquare, Calendar, Home, Compass, Map, Info, Star
} from "lucide-react"

// Smart Wizard Component
export function SmartWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "residential",
    style: "modern",
    rooms: "3",
    levels: "1",
    lotSize: "2000"
  })
  const { toast } = useToast()

  const handleNext = () => setStep((s) => Math.min(s + 1, 3))
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1))

  const handleFinish = () => {
    toast({
      title: "Floor plan generated!",
      description: "We've created a custom starter blueprint matching your options. Opening in editor...",
    })
    setTimeout(() => {
      window.location.href = "/planner"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Step {step} of 3</span>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">Smart Setup Wizard</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Answer a few questions to generate a custom starting floor plan.</p>

        <div className="mt-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <label className="block text-sm font-semibold">What type of building are you designing?</label>
              <div className="grid grid-cols-2 gap-3">
                {["residential", "commercial", "cabin", "adu"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`rounded-2xl border p-4 text-left capitalize transition-all ${
                      formData.type === t ? "border-[#a47148] bg-[#a47148]/5" : "border-[#1E2A22]/15 hover:border-[#a47148]/40"
                    }`}
                  >
                    <span className="font-medium text-[#1E2A22]">{t === "adu" ? "ADU (Tiny Home)" : t}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <label className="block text-sm font-semibold">Which interior design style fits best?</label>
              <div className="grid grid-cols-2 gap-3">
                {["modern", "minimalist", "japandi", "craftsman"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormData({ ...formData, style: s })}
                    className={`rounded-2xl border p-4 text-left capitalize transition-all ${
                      formData.style === s ? "border-[#a47148] bg-[#a47148]/5" : "border-[#1E2A22]/15 hover:border-[#a47148]/40"
                    }`}
                  >
                    <span className="font-medium text-[#1E2A22]">{s}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <label className="block text-sm font-semibold">Specify project specifications</label>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#1E2A22]/50 font-mono uppercase">Number of Bedrooms</label>
                  <Input
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    className="mt-1 border-[#1E2A22]/15 bg-[#FAF8F3] rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#1E2A22]/50 font-mono uppercase font-semibold">Levels / Floors</label>
                  <Input
                    type="number"
                    value={formData.levels}
                    onChange={(e) => setFormData({ ...formData, levels: e.target.value })}
                    className="mt-1 border-[#1E2A22]/15 bg-[#FAF8F3] rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex justify-between border-t border-[#1E2A22]/10 pt-6">
          <Button variant="outline" className="rounded-full" onClick={handlePrev} disabled={step === 1}>
            Previous
          </Button>
          {step < 3 ? (
            <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d]" onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button className="rounded-full bg-[#d4a276] text-white hover:bg-[#c39165]" onClick={handleFinish}>
              Generate Plan <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Import Plan Component
export function ImportPlan() {
  const [file, setFile] = useState<File | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleStartScan = () => {
    if (!file) return
    setIsScanning(true)
    setProgress(0)
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsScanning(false)
            toast({
              title: "Blueprint recognized successfully!",
              description: "AI mapped 4 rooms, 6 openings, and structured partition walls automatically. Opening editor...",
            })
            setTimeout(() => {
              window.location.href = "/planner"
            }, 1200)
          }, 500)
          return 100
        }
        return p + 4
      })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Import Image / CAD</span>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">Convert Draft Blueprint</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Upload a blueprint image or PDF to generate a full 3D interactive structure.</p>

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a47148]/35 bg-[#FAF8F3] py-16 text-center cursor-pointer transition-colors hover:bg-[#FAF8F3]/60"
          >
            <Upload className="h-12 w-12 text-[#a47148] mb-4" />
            <p className="text-sm font-semibold">Drag & drop your file here, or click to upload</p>
            <p className="mt-1 text-xs text-[#1E2A22]/50 font-mono">Supports PNG, JPG, PDF up to 20MB</p>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-[#FAF8F3] p-4 border border-[#1E2A22]/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a47148]/10 text-[#a47148]">
                  <LayoutTemplate className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[240px]">{file.name}</p>
                  <p className="text-xs text-[#1E2A22]/40 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span>Running AI Blueprint OCR Parser...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF8F3]">
                  <div className="h-full bg-[#a47148] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {!isScanning && (
              <Button onClick={handleStartScan} className="w-full rounded-full bg-[#a47148] py-6 text-white hover:bg-[#8e603d]">
                Convert blueprint into 3D design
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Templates Component
export function Templates() {
  const [filter, setFilter] = useState("all")
  
  const templateList = [
    { id: "oasis", name: "Modern Oasis Villa", tag: "villa", sqft: 3200, rooms: "4 Bed, 4 Bath", desc: "A luxury architectural villa centered around open solar courtyards." },
    { id: "cabin", name: "Timber Ridge Cabin", tag: "cabin", sqft: 1480, rooms: "2 Bed, 1.5 Bath", desc: "A cozy modern retreat utilizing passive ridge-vent cross winds." },
    { id: "adu", name: "Sunlit Courtyard ADU", tag: "adu", sqft: 400, rooms: "Studio, 1 Bath", desc: "Highly optimized tiny home maximizing multi-functional storage walls." },
    { id: "townhouse", name: "Metro Quad Townhouse", tag: "townhouse", sqft: 2150, rooms: "3 Bed, 3 Bath", desc: "A space-efficient vertical layout with multi-layered roof-decks." }
  ]

  const filtered = filter === "all" ? templateList : templateList.filter(t => t.tag === filter)

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Draft Templates</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Starter Architect Templates</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Select a layout from our collection to populate your starting editor environment.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["all", "villa", "cabin", "adu", "townhouse"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                filter === t ? "bg-[#a47148] text-white" : "bg-white border border-[#1E2A22]/10 text-[#1E2A22]/65 hover:bg-[#FAF8F3]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <Card key={item.id} className="overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm flex flex-col justify-between">
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-[#e7bc91]/20 to-[#FAF8F3] p-4">
                <svg viewBox="0 0 100 70" className="h-24 w-36 opacity-80">
                  <rect x="4" y="4" width="42" height="30" fill="#a47148" fillOpacity="0.18" stroke="#a47148" strokeOpacity="0.4" />
                  <rect x="50" y="4" width="46" height="18" fill="#d4a276" fillOpacity="0.18" stroke="#d4a276" strokeOpacity="0.4" />
                  <rect x="4" y="38" width="30" height="28" fill="#e7bc91" fillOpacity="0.2" stroke="#e7bc91" strokeOpacity="0.5" />
                  <rect x="38" y="38" width="58" height="28" fill="#bc8a5f" fillOpacity="0.18" stroke="#bc8a5f" strokeOpacity="0.4" />
                </svg>
                <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-xs font-bold shadow-sm text-[#a47148]">
                  {item.sqft} sqft
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-xl font-medium">{item.name}</h4>
                  <p className="text-xs text-[#1E2A22]/50 font-mono mt-1">{item.rooms}</p>
                  <p className="mt-3 text-sm text-[#1E2A22]/70 leading-relaxed">{item.desc}</p>
                </div>
                <Button 
                  onClick={() => window.location.href = `/planner?template=${item.id}`}
                  className="mt-6 w-full rounded-full bg-[#a47148] text-white hover:bg-[#8e603d]"
                >
                  Use Layout <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hire Designer Component
export function HireDesigner() {
  const [selectedDesigner, setSelectedDesigner] = useState<any>(null)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<any>([
    { sender: "designer", text: "Hi there! I reviewed your ADU draft blueprint. I think we can optimize the storage wall alignment to free up 15% more walking space." }
  ])

  const designers = [
    { id: 1, name: "Marcus Chen", role: "Passive House Consultant", rate: "$120/hr", initials: "MC", rating: "4.9", projects: 34 },
    { id: 2, name: "Sarah Jenkins", role: "Residential Designer", rate: "$95/hr", initials: "SJ", rating: "4.8", projects: 42 },
    { id: 3, name: "Elena Rodriguez", role: "Interior Architect", rate: "$110/hr", initials: "ER", rating: "5.0", projects: 19 }
  ]

  const handleSend = () => {
    if (!chatInput.trim()) return
    setMessages([...messages, { sender: "user", text: chatInput }])
    setChatInput("")
    setTimeout(() => {
      setMessages((m: any) => [...m, { sender: "designer", text: "That sounds like a great plan. Let's arrange a time to review the 3D model together." }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Collaborative Design</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Hire a Professional Designer</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Match with top architects and interior designers to co-create or inspect your blueprints.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50">Available designers</h3>
            {designers.map((designer) => (
              <button
                key={designer.id}
                onClick={() => setSelectedDesigner(designer)}
                className={`w-full text-left rounded-2xl border p-4 transition-all bg-white ${
                  selectedDesigner?.id === designer.id ? "border-[#a47148] shadow-md bg-[#a47148]/5" : "border-[#1E2A22]/10 hover:border-[#a47148]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#bc8a5f]/15 font-semibold text-[#a47148]">
                    {designer.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{designer.name}</h4>
                    <p className="text-xs text-[#1E2A22]/50">{designer.role}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className="text-[#a47148] font-bold font-mono">{designer.rate}</span>
                      <span className="text-yellow-600 flex items-center gap-0.5"><Star className="h-3 w-3 fill-yellow-600" /> {designer.rating}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedDesigner ? (
              <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="bg-[#FAF8F3] px-6 py-4 border-b border-[#1E2A22]/10 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bc8a5f]/25 font-bold text-[#a47148]">
                    {selectedDesigner.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{selectedDesigner.name}</h4>
                    <p className="text-xs text-[#1E2A22]/40">Active now</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg: any, i: number) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === "user" ? "bg-[#a47148] text-white" : "bg-[#FAF8F3] border border-[#1E2A22]/10"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-[#1E2A22]/10 flex gap-2 bg-[#FAF8F3]">
                  <Input
                    placeholder="Type a message to your designer..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="border-[#1E2A22]/10 rounded-full"
                  />
                  <Button onClick={handleSend} className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] px-6">
                    Send
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#1E2A22]/10 rounded-3xl h-[500px] text-center p-8 bg-white/40">
                <MessageSquare className="h-10 w-10 text-[#1E2A22]/30 mb-3" />
                <h4 className="font-serif text-lg font-medium">No conversation selected</h4>
                <p className="text-sm text-[#1E2A22]/50 max-w-sm mt-1">Select a designer from the list to start discussing your project or ask for structural advice.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
