import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, Upload,
  Ruler, LayoutTemplate, Users, Trash2, Check, AlertCircle,
  MessageSquare, Calendar, Home, Compass, Map, Info, Star,
  Search, ArrowUpDown, X, RefreshCw, Clock
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                    */
/* ------------------------------------------------------------------ */

const WIZARD_STORAGE_KEY = "d2b:wizard-draft"
const CHAT_STORAGE_PREFIX = "d2b:designer-chat:"

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — fail silently, feature is a convenience only */
  }
}

/** Small segmented progress indicator used by any multi-step flow. */
function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-[#a47148]" : "bg-[#1E2A22]/10"
            }`}
        />
      ))}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {message}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/*  Smart Wizard                                                      */
/* ------------------------------------------------------------------ */

type WizardData = {
  type: string
  style: string
  rooms: string
  levels: string
  lotSize: string
}

const WIZARD_DEFAULTS: WizardData = {
  type: "residential",
  style: "modern",
  rooms: "3",
  levels: "1",
  lotSize: "2000",
}

function validateWizardStep(step: number, data: WizardData) {
  const errors: Partial<Record<keyof WizardData, string>> = {}
  if (step === 3) {
    const rooms = Number(data.rooms)
    const levels = Number(data.levels)
    const lot = Number(data.lotSize)
    if (!data.rooms || Number.isNaN(rooms) || rooms < 1 || rooms > 20) {
      errors.rooms = "Enter a number of bedrooms between 1 and 20."
    }
    if (!data.levels || Number.isNaN(levels) || levels < 1 || levels > 10) {
      errors.levels = "Enter a number of levels between 1 and 10."
    }
    if (!data.lotSize || Number.isNaN(lot) || lot < 200 || lot > 200000) {
      errors.lotSize = "Enter a lot size between 200 and 200,000 sq ft."
    }
  }
  return errors
}

export function SmartWizard() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<WizardData>(() => loadJSON(WIZARD_STORAGE_KEY, WIZARD_DEFAULTS))
  const [errors, setErrors] = useState<Partial<Record<keyof WizardData, string>>>({})
  const [status, setStatus] = useState<"idle" | "generating" | "error">("idle")
  const { toast } = useToast()

  useEffect(() => {
    saveJSON(WIZARD_STORAGE_KEY, formData)
  }, [formData])

  const stepErrors = validateWizardStep(step, formData)
  const isStepValid = Object.keys(stepErrors).length === 0

  const handleNext = () => {
    const nextErrors = validateWizardStep(step, formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setStep((s) => Math.min(s + 1, 3))
  }
  const handlePrev = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleFinish = async () => {
    const finalErrors = validateWizardStep(3, formData)
    setErrors(finalErrors)
    if (Object.keys(finalErrors).length > 0) return

    setStatus("generating")
    try {
      // Simulated generation call — swap for a real POST /api/wizard/generate.
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          Math.random() < 0.08 ? reject(new Error("generation_failed")) : resolve()
        }, 1400)
      })
      toast({
        title: "Floor plan generated!",
        description: "We've created a custom starter blueprint matching your options. Opening in editor...",
      })
      window.localStorage.removeItem(WIZARD_STORAGE_KEY)
      setTimeout(() => {
        window.location.href = "/planner"
      }, 1200)
    } catch {
      setStatus("error")
      toast({
        title: "Couldn't generate a plan",
        description: "Something went wrong on our end. Please try again.",
        variant: "destructive" as any,
      })
    }
  }

  const OptionGroup = ({
    label,
    field,
    options,
  }: {
    label: string
    field: "type" | "style"
    options: { value: string; display: string }[]
  }) => (
    <div className="space-y-5">
      <label className="block text-sm font-semibold" id={`${field}-label`}>{label}</label>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby={`${field}-label`}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={formData[field] === o.value}
            onClick={() => setFormData({ ...formData, [field]: o.value })}
            className={`rounded-2xl border p-4 text-left capitalize transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47148] ${formData[field] === o.value ? "border-[#a47148] bg-[#a47148]/5" : "border-[#1E2A22]/15 hover:border-[#a47148]/40"
              }`}
          >
            <span className="font-medium text-[#1E2A22]">{o.display}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Step {step} of 3</span>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">Smart Setup Wizard</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Answer a few questions to generate a custom starting floor plan.</p>

        <div className="mt-6"><StepProgress step={step} total={3} /></div>

        <div className="mt-8" aria-live="polite">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <OptionGroup
                label="What type of building are you designing?"
                field="type"
                options={[
                  { value: "residential", display: "residential" },
                  { value: "commercial", display: "commercial" },
                  { value: "cabin", display: "cabin" },
                  { value: "adu", display: "ADU (Tiny Home)" },
                ]}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <OptionGroup
                label="Which interior design style fits best?"
                field="style"
                options={["modern", "minimalist", "japandi", "craftsman"].map((s) => ({ value: s, display: s }))}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <label className="block text-sm font-semibold">Specify project specifications</label>
              <div className="space-y-4">
                <div>
                  <label htmlFor="rooms" className="text-xs text-[#1E2A22]/50 font-mono uppercase">Number of bedrooms</label>
                  <Input
                    id="rooms"
                    type="number"
                    min={1}
                    max={20}
                    inputMode="numeric"
                    value={formData.rooms}
                    aria-invalid={!!errors.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.rooms ? "border-red-400" : "border-[#1E2A22]/15"}`}
                  />
                  <FieldError message={errors.rooms} />
                </div>
                <div>
                  <label htmlFor="levels" className="text-xs text-[#1E2A22]/50 font-mono uppercase font-semibold">Levels / floors</label>
                  <Input
                    id="levels"
                    type="number"
                    min={1}
                    max={10}
                    inputMode="numeric"
                    value={formData.levels}
                    aria-invalid={!!errors.levels}
                    onChange={(e) => setFormData({ ...formData, levels: e.target.value })}
                    className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.levels ? "border-red-400" : "border-[#1E2A22]/15"}`}
                  />
                  <FieldError message={errors.levels} />
                </div>
                <div>
                  <label htmlFor="lotSize" className="text-xs text-[#1E2A22]/50 font-mono uppercase">Lot size (sq ft)</label>
                  <Input
                    id="lotSize"
                    type="number"
                    min={200}
                    max={200000}
                    inputMode="numeric"
                    value={formData.lotSize}
                    aria-invalid={!!errors.lotSize}
                    onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                    className={`mt-1 rounded-xl bg-[#FAF8F3] ${errors.lotSize ? "border-red-400" : "border-[#1E2A22]/15"}`}
                  />
                  <FieldError message={errors.lotSize} />
                </div>
              </div>
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" /> Generation failed. Please try again.
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex justify-between border-t border-[#1E2A22]/10 pt-6">
          <Button variant="outline" className="rounded-full" onClick={handlePrev} disabled={step === 1 || status === "generating"}>
            Previous
          </Button>
          {step < 3 ? (
            <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d]" onClick={handleNext} disabled={!isStepValid}>
              Next step
            </Button>
          ) : (
            <Button
              className="rounded-full bg-[#d4a276] text-white hover:bg-[#c39165] disabled:opacity-60"
              onClick={handleFinish}
              disabled={!isStepValid || status === "generating"}
            >
              {status === "generating" ? (
                <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Generating…</span>
              ) : (
                <span className="flex items-center">{status === "error" ? "Try again" : "Generate plan"} <Sparkles className="ml-2 h-4 w-4" /></span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Import Plan                                                       */
/* ------------------------------------------------------------------ */

const MAX_FILE_BYTES = 20 * 1024 * 1024
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"]

function validateImportFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Unsupported file type. Upload a PNG, JPG, or PDF."
  }
  if (file.size > MAX_FILE_BYTES) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). The limit is 20MB.`
  }
  return null
}

export function ImportPlan() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const applyFile = (candidate: File | undefined | null) => {
    if (!candidate) return
    const error = validateImportFile(candidate)
    setFileError(error)
    if (error) {
      setFile(null)
      setPreviewUrl(null)
      return
    }
    setFile(candidate)
    setScanError(false)
    if (candidate.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(candidate))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    applyFile(e.dataTransfer.files[0])
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => applyFile(e.target.files?.[0])

  const clearFile = () => {
    setFile(null)
    setFileError(null)
    setPreviewUrl(null)
    setScanError(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleStartScan = () => {
    if (!file) return
    setIsScanning(true)
    setScanError(false)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          // Simulated OCR result — swap for a real recognition endpoint.
          const succeeded = Math.random() > 0.1
          setTimeout(() => {
            setIsScanning(false)
            if (succeeded) {
              toast({
                title: "Blueprint recognized successfully!",
                description: "AI mapped 4 rooms, 6 openings, and structured partition walls automatically. Opening editor...",
              })
              setTimeout(() => {
                window.location.href = "/planner"
              }, 1200)
            } else {
              setScanError(true)
            }
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
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Import image / PDF</span>
        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight">Convert draft blueprint</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Upload a blueprint image or PDF to generate a full 3D interactive structure.</p>

        {!file ? (
          <>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className={`mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 text-center cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47148] ${isDragging ? "border-[#a47148] bg-[#a47148]/10" : "border-[#a47148]/35 bg-[#FAF8F3] hover:bg-[#FAF8F3]/60"
                }`}
            >
              <Upload className={`h-12 w-12 mb-4 transition-transform ${isDragging ? "scale-110 text-[#a47148]" : "text-[#a47148]"}`} />
              <p className="text-sm font-semibold">{isDragging ? "Drop it here" : "Drag & drop your file here, or click to upload"}</p>
              <p className="mt-1 text-xs text-[#1E2A22]/50 font-mono">Supports PNG, JPG, PDF up to 20MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <FieldError message={fileError ?? undefined} />
          </>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-[#FAF8F3] p-4 border border-[#1E2A22]/10">
              <div className="flex items-center gap-3 min-w-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#a47148]/10 text-[#a47148]">
                    <LayoutTemplate className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate max-w-[240px]">{file.name}</p>
                  <p className="text-xs text-[#1E2A22]/40 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button aria-label="Remove file" onClick={clearFile} className="shrink-0 text-red-500 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isScanning && (
              <div className="space-y-2" aria-live="polite">
                <div className="flex justify-between text-xs font-mono">
                  <span>Running AI blueprint parser…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#FAF8F3]">
                  <div className="h-full bg-[#a47148] transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {scanError && !isScanning && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>We couldn't detect walls or rooms in this file. Try a clearer scan, or draw the plan from scratch instead.</span>
              </div>
            )}

            {!isScanning && (
              <Button onClick={handleStartScan} className="w-full rounded-full bg-[#a47148] py-6 text-white hover:bg-[#8e603d]">
                {scanError ? "Try again" : "Convert blueprint into 3D design"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Templates                                                         */
/* ------------------------------------------------------------------ */

type SortKey = "relevance" | "sqft-asc" | "sqft-desc" | "name"

const TEMPLATE_LIST = [
  { id: "oasis", name: "Modern Oasis Villa", tag: "villa", sqft: 3200, rooms: "4 Bed, 4 Bath", desc: "A luxury architectural villa centered around open solar courtyards." },
  { id: "cabin", name: "Timber Ridge Cabin", tag: "cabin", sqft: 1480, rooms: "2 Bed, 1.5 Bath", desc: "A cozy modern retreat utilizing passive ridge-vent cross winds." },
  { id: "adu", name: "Sunlit Courtyard ADU", tag: "adu", sqft: 400, rooms: "Studio, 1 Bath", desc: "Highly optimized tiny home maximizing multi-functional storage walls." },
  { id: "townhouse", name: "Metro Quad Townhouse", tag: "townhouse", sqft: 2150, rooms: "3 Bed, 3 Bath", desc: "A space-efficient vertical layout with multi-layered roof-decks." },
]

export function Templates() {
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("relevance")

  const filtered = useMemo(() => {
    let list = filter === "all" ? TEMPLATE_LIST : TEMPLATE_LIST.filter((t) => t.tag === filter)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
    }
    const sorted = [...list]
    if (sort === "sqft-asc") sorted.sort((a, b) => a.sqft - b.sqft)
    if (sort === "sqft-desc") sorted.sort((a, b) => b.sqft - a.sqft)
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [filter, query, sort])

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Draft templates</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Starter architect templates</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Select a layout from our collection to populate your starting editor environment.</p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1E2A22]/35" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              aria-label="Search templates"
              className="rounded-full border-[#1E2A22]/10 bg-white pl-10"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E2A22]/35 hover:text-[#1E2A22]/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs font-mono uppercase text-[#1E2A22]/50">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-[#1E2A22]/10 bg-white px-3 py-1.5 text-[#1E2A22] normal-case focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47148]"
            >
              <option value="relevance">Relevance</option>
              <option value="sqft-asc">Sq ft: low to high</option>
              <option value="sqft-desc">Sq ft: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by home type">
          {["all", "villa", "cabin", "adu", "townhouse"].map((t) => (
            <button
              key={t}
              role="radio"
              aria-checked={filter === t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a47148] ${filter === t ? "bg-[#a47148] text-white" : "bg-white border border-[#1E2A22]/10 text-[#1E2A22]/65 hover:bg-[#FAF8F3]"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-14 flex flex-col items-center rounded-3xl border-2 border-dashed border-[#1E2A22]/10 py-16 text-center">
            <LayoutTemplate className="h-8 w-8 text-[#1E2A22]/30 mb-3" />
            <h4 className="font-serif text-lg font-medium">No templates match</h4>
            <p className="mt-1 max-w-sm text-sm text-[#1E2A22]/50">Try a different search term or clear the type filter.</p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => { setQuery(""); setFilter("all") }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
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
                    Use layout <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hire Designer                                                     */
/* ------------------------------------------------------------------ */

type ChatMessage = { sender: "designer" | "user"; text: string; ts: number }

const DESIGNERS = [
  { id: 1, name: "Marcus Chen", role: "Passive House Consultant", rate: "$120/hr", initials: "MC", rating: "4.9", projects: 34, specialty: "sustainable" },
  { id: 2, name: "Sarah Jenkins", role: "Residential Designer", rate: "$95/hr", initials: "SJ", rating: "4.8", projects: 42, specialty: "residential" },
  { id: 3, name: "Elena Rodriguez", role: "Interior Architect", rate: "$110/hr", initials: "ER", rating: "5.0", projects: 19, specialty: "interior" },
]

function greetingFor(name: string): ChatMessage {
  return {
    sender: "designer",
    text: `Hi there! I'm ${name.split(" ")[0]}. Share your draft blueprint or a few goals for the space and I'll take a first pass.`,
    ts: Date.now(),
  }
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export function HireDesigner() {
  const [selectedDesigner, setSelectedDesigner] = useState<typeof DESIGNERS[number] | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const filteredDesigners = specialtyFilter === "all" ? DESIGNERS : DESIGNERS.filter((d) => d.specialty === specialtyFilter)

  useEffect(() => {
    if (!selectedDesigner) return
    const key = CHAT_STORAGE_PREFIX + selectedDesigner.id
    const stored = loadJSON<ChatMessage[]>(key, [])
    setMessages(stored.length > 0 ? stored : [greetingFor(selectedDesigner.name)])
    setBookingConfirmed(null)
  }, [selectedDesigner])

  useEffect(() => {
    if (!selectedDesigner || messages.length === 0) return
    saveJSON(CHAT_STORAGE_PREFIX + selectedDesigner.id, messages)
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, selectedDesigner])

  const handleSend = () => {
    if (!chatInput.trim() || !selectedDesigner) return
    const userMsg: ChatMessage = { sender: "user", text: chatInput.trim(), ts: Date.now() }
    setMessages((m) => [...m, userMsg])
    setChatInput("")
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((m) => [...m, {
        sender: "designer",
        text: "That sounds like a great plan. Let's arrange a time to review the 3D model together.",
        ts: Date.now(),
      }])
    }, 1200)
  }

  const confirmBooking = () => {
    if (!bookingDate || !selectedDesigner) return
    setBookingConfirmed(bookingDate)
    setBookingOpen(false)
    toast({
      title: "Session requested",
      description: `We've sent your request to ${selectedDesigner.name} for ${new Date(bookingDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}.`,
    })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">Collaborative design</span>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight">Hire a professional designer</h1>
        <p className="mt-2 text-sm text-[#1E2A22]/60">Match with top architects and interior designers to co-create or inspect your blueprints.</p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50">Available designers</h3>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter by specialty">
              {[
                { value: "all", label: "All" },
                { value: "sustainable", label: "Sustainable" },
                { value: "residential", label: "Residential" },
                { value: "interior", label: "Interior" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  role="radio"
                  aria-checked={specialtyFilter === opt.value}
                  onClick={() => setSpecialtyFilter(opt.value)}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors ${specialtyFilter === opt.value ? "bg-[#a47148] text-white" : "bg-white border border-[#1E2A22]/10 text-[#1E2A22]/60"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {filteredDesigners.map((designer) => (
              <button
                key={designer.id}
                onClick={() => setSelectedDesigner(designer)}
                className={`w-full text-left rounded-2xl border p-4 transition-all bg-white ${selectedDesigner?.id === designer.id ? "border-[#a47148] shadow-md bg-[#a47148]/5" : "border-[#1E2A22]/10 hover:border-[#a47148]/30"
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
                      <span className="text-[#1E2A22]/40">{designer.projects} projects</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedDesigner ? (
              <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm overflow-hidden flex flex-col h-[540px]">
                <div className="bg-[#FAF8F3] px-6 py-4 border-b border-[#1E2A22]/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bc8a5f]/25 font-bold text-[#a47148]">
                      {selectedDesigner.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{selectedDesigner.name}</h4>
                      <p className="text-xs text-[#1E2A22]/40 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active now</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    onClick={() => setBookingOpen(true)}
                  >
                    <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book session
                  </Button>
                </div>

                {bookingConfirmed && (
                  <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Session requested for {new Date(bookingConfirmed).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </div>
                )}

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === "user" ? "bg-[#a47148] text-white" : "bg-[#FAF8F3] border border-[#1E2A22]/10"
                        }`}>
                        {msg.text}
                      </div>
                      <span className="mt-1 flex items-center gap-1 text-[10px] text-[#1E2A22]/35">
                        <Clock className="h-2.5 w-2.5" /> {formatTime(msg.ts)}
                      </span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start">
                      <div className="flex items-center gap-1 rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] px-4 py-3">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#1E2A22]/30" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-[#1E2A22]/10 flex gap-2 bg-[#FAF8F3]">
                  <Input
                    placeholder="Type a message to your designer..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    aria-label="Message"
                    className="border-[#1E2A22]/10 rounded-full"
                  />
                  <Button onClick={handleSend} disabled={!chatInput.trim()} className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] px-6">
                    Send
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#1E2A22]/10 rounded-3xl h-[540px] text-center p-8 bg-white/40">
                <MessageSquare className="h-10 w-10 text-[#1E2A22]/30 mb-3" />
                <h4 className="font-serif text-lg font-medium">No conversation selected</h4>
                <p className="text-sm text-[#1E2A22]/50 max-w-sm mt-1">Select a designer from the list to start discussing your project or ask for structural advice.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bookingOpen && selectedDesigner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
            onClick={() => setBookingOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h3 className="font-serif text-xl font-medium">Book a session with {selectedDesigner.name}</h3>
              <p className="mt-1 text-sm text-[#1E2A22]/60">Pick a date and time — {selectedDesigner.name.split(" ")[0]} will confirm within 24 hours.</p>
              <label htmlFor="booking-date" className="mt-5 block text-xs font-mono uppercase text-[#1E2A22]/50">Date & time</label>
              <Input
                id="booking-date"
                type="datetime-local"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="mt-1.5 rounded-xl border-[#1E2A22]/15"
              />
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => setBookingOpen(false)}>Cancel</Button>
                <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d]" disabled={!bookingDate} onClick={confirmBooking}>
                  Request session
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}