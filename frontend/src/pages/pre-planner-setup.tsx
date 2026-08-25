import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowRight, LayoutTemplate } from "lucide-react"

type SetupData = {
  unit: "ft" | "m"
  width: string
  depth: string
  orientation: string
  snap: string
}

const DEFAULTS: SetupData = {
  unit: "ft",
  width: "50",
  depth: "100",
  orientation: "0",
  snap: "1"
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  )
}

function validateSetup(data: SetupData) {
  const errors: Partial<Record<keyof SetupData, string>> = {}
  
  const width = Number(data.width)
  if (!data.width || Number.isNaN(width) || width <= 0) {
    errors.width = "Width must be greater than 0."
  }
  
  const depth = Number(data.depth)
  if (!data.depth || Number.isNaN(depth) || depth <= 0) {
    errors.depth = "Depth must be greater than 0."
  }

  const orientation = Number(data.orientation)
  if (!data.orientation || Number.isNaN(orientation) || orientation < 0 || orientation > 360) {
    errors.orientation = "Enter a valid angle between 0 and 360."
  }

  const snap = Number(data.snap)
  if (!data.snap || Number.isNaN(snap) || snap <= 0) {
    errors.snap = "Grid snap size must be greater than 0."
  }

  return errors
}

export function PrePlannerSetup() {
  const [formData, setFormData] = useState<SetupData>(DEFAULTS)
  const [errors, setErrors] = useState<Partial<Record<keyof SetupData, string>>>({})

  const handleStart = () => {
    const nextErrors = validateSetup(formData)
    setErrors(nextErrors)
    
    if (Object.keys(nextErrors).length > 0) return

    const params = new URLSearchParams({
      unit: formData.unit,
      width: formData.width,
      depth: formData.depth,
      orientation: formData.orientation,
      snap: formData.snap,
    })

    window.location.href = `/planner?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Setup</span>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">Start from Scratch</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Configure your blank canvas dimensions and environment settings before drafting.</p>

        <div className="mt-8 space-y-6" aria-live="polite">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            
            {/* Unit System */}
            <div>
              <label className="block text-sm font-semibold mb-3">Unit System</label>
              <div className="flex gap-3" role="radiogroup">
                {[
                  { value: "ft", display: "Imperial (Feet/Inches)" },
                  { value: "m", display: "Metric (Meters)" },
                ].map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={formData.unit === o.value}
                    onClick={() => setFormData({ ...formData, unit: o.value as "ft" | "m" })}
                    className={`flex-1 rounded-2xl border p-4 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47148] ${
                      formData.unit === o.value ? "border-[#a47148] bg-[#a47148]/5" : "border-[#1E2A22]/15 hover:border-[#a47148]/40"
                    }`}
                  >
                    <span className="font-medium text-[#1E2A22]">{o.display}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lot Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width" className="text-xs text-[#1E2A22]/50 font-mono uppercase">Lot Width ({formData.unit})</label>
                <Input
                  id="width"
                  type="number"
                  min={1}
                  value={formData.width}
                  aria-invalid={!!errors.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.width ? "border-red-400" : "border-[#1E2A22]/15"}`}
                />
                <FieldError message={errors.width} />
              </div>
              <div>
                <label htmlFor="depth" className="text-xs text-[#1E2A22]/50 font-mono uppercase">Lot Depth ({formData.unit})</label>
                <Input
                  id="depth"
                  type="number"
                  min={1}
                  value={formData.depth}
                  aria-invalid={!!errors.depth}
                  onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.depth ? "border-red-400" : "border-[#1E2A22]/15"}`}
                />
                <FieldError message={errors.depth} />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="orientation" className="text-xs text-[#1E2A22]/50 font-mono uppercase">North Orientation (°)</label>
                <Input
                  id="orientation"
                  type="number"
                  min={0}
                  max={360}
                  value={formData.orientation}
                  aria-invalid={!!errors.orientation}
                  onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                  className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.orientation ? "border-red-400" : "border-[#1E2A22]/15"}`}
                />
                <FieldError message={errors.orientation} />
              </div>
              <div>
                <label htmlFor="snap" className="text-xs text-[#1E2A22]/50 font-mono uppercase">Grid Snap Size ({formData.unit})</label>
                <Input
                  id="snap"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={formData.snap}
                  aria-invalid={!!errors.snap}
                  onChange={(e) => setFormData({ ...formData, snap: e.target.value })}
                  className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.snap ? "border-red-400" : "border-[#1E2A22]/15"}`}
                />
                <FieldError message={errors.snap} />
              </div>
            </div>

          </motion.div>
        </div>

        <div className="mt-8 flex justify-end border-t border-[#1E2A22]/10 pt-6">
          <Button
            className="rounded-full bg-[#d4a276] text-white hover:bg-[#c39165]"
            onClick={handleStart}
          >
            <span className="flex items-center gap-2">Open Editor <ArrowRight className="h-4 w-4" /></span>
          </Button>
        </div>
      </div>
    </div>
  )
}
