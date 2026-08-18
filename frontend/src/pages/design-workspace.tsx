import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, Layers, PenTool, Sofa, Compass, Ruler, HelpCircle,
  FolderOpen, Save, Share2, Play, Grid, Trash2, Maximize, Plus
} from "lucide-react"

export function DesignWorkspace({ category }: { category: string }) {
  const [selectedTool, setSelectedTool] = useState("select")
  const [elements, setElements] = useState<any>([
    { id: 1, type: "room", name: "Main Hall", x: 20, y: 20, w: 120, h: 80 },
    { id: 2, type: "room", name: "Balcony", x: 140, y: 20, w: 40, h: 80 }
  ])
  const { toast } = useToast()

  const formattedTitle = category
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  const handleAddElement = () => {
    const newId = elements.length + 1
    setElements([...elements, { id: newId, type: "room", name: `Room ${newId}`, x: 50, y: 50, w: 80, h: 60 }])
    toast({ title: "Room added!", description: `Placed 'Room ${newId}' on drafting board.` })
  }

  const handleSave = () => {
    toast({ title: "Draft Saved!", description: `Successfully stored ${formattedTitle} layout to local projects database.` })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2A22]/10 pb-6 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">DESIGN WORKSPACE</span>
            <h1 className="font-serif text-3xl font-medium tracking-tight mt-1">{formattedTitle}</h1>
            <p className="text-xs text-[#1E2A22]/50 font-mono">Status: Editing Draft • scale 1:50</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full flex gap-1.5 border-[#1E2A22]/10" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] flex gap-1.5" onClick={() => window.location.href = "/planner"}>
              Open in 3D Planner <Play className="h-4 w-4 fill-white" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Tools Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50 mb-4">Toolbar</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: "select", label: "Select Element", icon: Compass },
                  { id: "wall", label: "Draw Walls", icon: PenTool },
                  { id: "measure", label: "Measure Tool", icon: Ruler },
                  { id: "catalog", label: "Drag Furniture", icon: Sofa }
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex items-center gap-3 w-full rounded-xl p-3 text-sm font-medium transition-all ${
                      selectedTool === tool.id ? "bg-[#a47148]/10 text-[#a47148]" : "hover:bg-[#FAF8F3] text-[#1E2A22]/75"
                    }`}
                  >
                    <tool.icon className="h-4 w-4" />
                    {tool.label}
                  </button>
                ))}
              </div>

              <Button 
                onClick={handleAddElement} 
                className="mt-6 w-full rounded-full border border-dashed border-[#a47148]/45 bg-[#FAF8F3] text-[#a47148] hover:bg-[#a47148]/5 flex gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Room Module
              </Button>
            </Card>
          </div>

          {/* Interactive Draft Canvas */}
          <div className="lg:col-span-3">
            <Card className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm flex items-center justify-center p-6">
              {/* Drafting Grid Lines */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                <div className="w-full h-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px]" />
              </div>

              <div className="relative w-full h-full border border-dashed border-[#1E2A22]/20 rounded-2xl bg-[#FAF8F3]/50 z-10 overflow-hidden">
                {elements.map((el: any) => (
                  <motion.div
                    key={el.id}
                    drag
                    dragMomentum={false}
                    dragConstraints={{ left: 0, right: 360, top: 0, bottom: 260 }}
                    style={{ left: el.x, top: el.y, width: el.w, height: el.h }}
                    className="absolute cursor-move rounded-xl border border-[#a47148]/60 bg-[#FAF1EA]/90 p-3 shadow-sm select-none flex flex-col justify-between"
                  >
                    <span className="font-mono text-[10px] text-[#a47148] font-bold uppercase tracking-wider">{el.type}</span>
                    <span className="font-medium text-sm text-[#1E2A22]">{el.name}</span>
                    <div className="flex justify-end gap-1">
                      <button onClick={(e) => {
                        e.stopPropagation()
                        setElements(elements.filter((x: any) => x.id !== el.id))
                      }} className="text-[#1E2A22]/40 hover:text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <Button size="icon" variant="outline" className="rounded-full bg-white shadow" onClick={() => toast({ title: "Grid view enabled" })}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full bg-white shadow" onClick={() => toast({ title: "Fullscreen mode" })}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
