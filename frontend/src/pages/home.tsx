import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, Star,
  PenTool, Wand2, Upload, LayoutTemplate, Users,
  Layers, Sun, Ruler, Sofa, Compass, Palette,
} from "lucide-react"
import Antigravity from "@/components/Antigravity"

import scratchImg from "@/assets/start-from-scratch.jpg"
import wizardImg from "@/assets/smart-wizard.jpg"
import importImg from "@/assets/import-plan.jpg"
import templateImg from "@/assets/templates.jpg"
import hireImg from "@/assets/hire-designer.jpg"

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bp-grid)" />
    </svg>
  )
}

function EditorMock() {
  const rooms = [
    { x: 8, y: 8, w: 46, h: 40, fill: "#DCEFE6", label: "Living" },
    { x: 58, y: 8, w: 34, h: 24, fill: "#FBE7D3", label: "Kitchen" },
    { x: 58, y: 36, w: 34, h: 12, fill: "#F6E3B4", label: "Bath" },
    { x: 8, y: 52, w: 30, h: 40, fill: "#E4E9F7", label: "Bed 1" },
    { x: 42, y: 52, w: 24, h: 40, fill: "#F3DDE4", label: "Bed 2" },
    { x: 70, y: 52, w: 22, h: 40, fill: "#DCEFE6", label: "Deck" },
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[#1E2A22]/10 bg-[#F4F1EA] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D97A3F]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2C14E]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2F6F4E]/50" />
        <span className="ml-3 font-mono text-[11px] text-[#1E2A22]/40">dream2build.app/editor</span>
      </div>
      <div className="flex">
        <div className="hidden w-14 flex-col items-center gap-4 border-r border-[#1E2A22]/10 py-6 sm:flex">
          {[PenTool, Layers, Palette, Ruler].map((Icon, i) => (
            <div key={i} className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F6F4E]/10">
              <Icon className="h-4 w-4 text-[#2F6F4E]" />
            </div>
          ))}
        </div>
        <div className="relative flex-1 p-6">
          <svg viewBox="0 0 100 100" className="w-full">
            {rooms.map((r, i) => (
              <g key={i}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke="#1E2A22" strokeOpacity="0.15" strokeWidth="0.6" rx="1.5" />
                <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" fontSize="4.2" fill="#1E2A22" fillOpacity="0.55" fontFamily="monospace">{r.label}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="hidden w-40 flex-col gap-3 border-l border-[#1E2A22]/10 p-4 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#1E2A22]/40">Materials</span>
          {["#2F6F4E", "#D97A3F", "#F2C14E", "#7A93A8", "#B25D5D"].map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-md border border-[#1E2A22]/10" style={{ backgroundColor: c }} />
              <span className="h-2 flex-1 rounded-full bg-[#1E2A22]/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RenderMock() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-gradient-to-b from-[#EAF3EC] to-[#DCEFE6] shadow-xl">
      <BlueprintGrid className="opacity-30" />
      <svg viewBox="0 0 200 150" className="absolute inset-0 h-full w-full">
        <polygon points="20,110 100,60 180,110 100,150" fill="#F4F1EA" stroke="#1E2A22" strokeOpacity="0.15" />
        <polygon points="20,110 100,60 100,10 20,60" fill="#DCEFE6" stroke="#1E2A22" strokeOpacity="0.15" />
        <polygon points="180,110 100,60 100,10 180,60" fill="#EFE3CE" stroke="#1E2A22" strokeOpacity="0.15" />
        <rect x="55" y="95" width="30" height="20" fill="#D97A3F" opacity="0.85" rx="2" />
        <rect x="110" y="90" width="24" height="25" fill="#2F6F4E" opacity="0.8" rx="2" />
        <circle cx="140" cy="45" r="6" fill="#F2C14E" opacity="0.9" />
      </svg>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/60 shadow">
        <Sun className="h-3 w-3 text-[#D97A3F]" /> HD render · 4K
      </div>
    </div>
  )
}

/** Explicit type — needed because `popular` only exists on one entry;
 *  without this, TS strict mode would error on `entry.popular` below. */
type EntryPoint = {
  key: string
  icon: React.ComponentType<{ className?: string }>
  image: string
  label: string
  copy: string
  description: string
  bullets: string[]
  href: string
  popular?: boolean
}

const ENTRY_POINTS: EntryPoint[] = [
  { key: "scratch", icon: PenTool, image: scratchImg, label: "Start from scratch", copy: "A blank canvas and full control.", description: "Open a completely empty 2D canvas and draw your own walls, rooms, and openings from a grid.", bullets: ["Full control over every wall, door, and window", "Snap-to-grid drawing tools", "Switch to 3D anytime to check scale"], href: "/start-from-scratch" },
  { key: "wizard", icon: Wand2, image: wizardImg, label: "Smart Wizard", copy: "Answer a few questions, get a plan.", description: "A short guided flow — lot size, number of rooms, style — that generates a starting floor plan for you to edit.", bullets: ["Takes about 3 minutes", "Generates a first-draft layout automatically", "Fully editable afterward"], href: "/wizard", popular: true },
  { key: "import", icon: Upload, image: importImg, label: "Import a plan", copy: "Upload a blueprint photo to convert.", description: "Upload a photo or scan of an existing floor plan and we'll convert it into an editable layout.", bullets: ["Supports photos, scans, and PDFs", "Auto-detects walls, doors, and windows", "Review and correct before finishing"], href: "/import" },
  { key: "template", icon: LayoutTemplate, image: templateImg, label: "Templates", copy: "Start from a ready-made layout.", description: "Pick from a library of pre-built floor plans across common home types and sizes.", bullets: ["Organized by home type and square footage", "Fully editable once selected", "Good if you're not sure what you want yet"], href: "/templates" },
  { key: "hire", icon: Users, image: hireImg, label: "Hire a designer", copy: "Bring in a pro when you need one.", description: "Get matched with a professional designer who can take your project from concept to finished plan.", bullets: ["Matched based on project type and budget", "Message and share your draft directly", "Pay per project, no subscription"], href: "/designers" },
]

const FEATURES = [
  { icon: Layers, eyebrow: "01 · Editor", title: "Switch between 2D and 3D without losing your place", copy: "Lay out walls and rooms in 2D, then drop into 3D to check scale, sightlines, and flow — the same project, two views.", mock: "editor" as const },
  { icon: Sofa, eyebrow: "02 · Catalog", title: "Furnish from a catalog built for real rooms", copy: "Thousands of furniture, decor, flooring, and material items, sized correctly and ready to drag in.", mock: "editor" as const },
  { icon: Sun, eyebrow: "03 · Rendering", title: "See it in real light before you commit to anything", copy: "HD rendering adds lighting, shadows, and reflections so the preview looks like the finished room, not a diagram.", mock: "render" as const },
  { icon: Compass, eyebrow: "04 · Site analysis", title: "Know how the sun and wind move through the plan", copy: "Orientation, daylight, and airflow are checked automatically as you draft, not left for an engineer to catch later.", mock: "render" as const },
]

/** Desktop accordion panel — width is driven entirely by framer-motion's
 *  own `animate` prop (spring physics) instead of a CSS `flex-[n]` class.
 *  This is the fix for the "stutter": before, a Tailwind CSS transition
 *  was fighting an AnimatePresence content-swap that used mode="wait"
 *  (full fade-out before fade-in), so the width jump and the content
 *  swap were never actually in sync. Now both are driven by the same
 *  animation system and overlap naturally. */
function EntryPanel({
  entry,
  index,
  isActive,
  onActivate,
  onOpen,
}: {
  entry: EntryPoint
  index: number
  isActive: boolean
  onActivate: () => void
  onOpen: () => void
}) {
  const Icon = entry.icon
  return (
    <motion.button
      type="button"
      layout
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={() => (isActive ? onOpen() : onActivate())}
      animate={{ flexGrow: isActive ? 3.5 : 0.65 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      aria-expanded={isActive}
      aria-label={isActive ? `${entry.label} — activate to open details` : `${entry.label} — hover or focus to expand`}
      className={`group relative min-w-0 overflow-hidden rounded-[28px] border text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6F4E] ${isActive ? "border-[#2F6F4E]/30 shadow-xl" : "max-w-[84px] border-[#1E2A22]/10 hover:border-[#1E2A22]/20"
        }`}
      style={{ flexBasis: 0 }}
    >
      <img
        src={entry.image}
        alt={entry.label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <motion.div
        animate={{
          background: isActive
            ? "linear-gradient(to top, rgba(30,42,34,0.90), rgba(30,42,34,0.35), transparent)"
            : "linear-gradient(to top, rgba(30,42,34,0.70), rgba(30,42,34,0.15), transparent)",
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
      />

      <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-black/5">
          <Icon className="h-4 w-4 text-[#2F6F4E]" />
        </div>
        {isActive && entry.popular && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-[#D97A3F] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-white"
          >
            Popular
          </motion.span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-4 bottom-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
              0{index + 1} — {entry.key}
            </span>
            <h4 className="mt-1 font-serif text-[22px] font-medium leading-none text-white">{entry.label}</h4>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/80">{entry.copy}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1E2A22] shadow">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-6"
          >
            <span className="mb-3 h-7 w-px bg-white/40" />
            <span className="text-center font-serif text-sm font-medium leading-tight text-white [writing-mode:vertical-lr] rotate-180 drop-shadow">
              {entry.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {isActive && (
        <motion.div
          layoutId="entry-accent"
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-[#D97A3F]"
        />
      )}
    </motion.button>
  )
}

export default function Home() {
  const [activeEntry, setActiveEntry] = useState<EntryPoint | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)

  const goTo = (href: string) => (window.location.href = href)

  return (
    <div className="w-full bg-[#FAF8F3] text-[#1E2A22]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#1E2A22]/10">
        <BlueprintGrid />
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-multiply">
          <Antigravity count={550} magnetRadius={11} ringRadius={5} waveSpeed={0.2} waveAmplitude={0.5} particleSize={1.5} lerpSpeed={0.1} color="#a47148" autoAnimate particleVariance={1} rotationSpeed={0} depthFactor={1} pulseSpeed={3} particleShape="capsule" fieldStrength={10} />
        </div>
        <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-16 px-6 pb-24 pt-36 md:pb-28 md:pt-40 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2F6F4E]/30 bg-[#2F6F4E]/5 px-3 py-1.5 text-[#2F6F4E]">
              <Sparkles className="h-3.5 w-3.5" /><span className="font-mono text-xs uppercase tracking-wider">Free to start · No card needed</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-[4.2rem]">
              Design your <span className="italic text-[#2F6F4E]">home</span>,<br />in 2D and 3D.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-lg text-lg text-[#1E2A22]/70">
              Draw a floor plan, furnish it from a full catalog, and render it in HD — all in one browser tab. No download, no drafting experience required.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full bg-[#D97A3F] px-7 text-white hover:bg-[#c66a30]" onClick={() => window.open('/planner', '_blank')}>Start designing <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button size="lg" variant="outline" className="rounded-full border-[#1E2A22]/20 px-7">See how it works</Button>
            </motion.div>
            <div className="mt-8 flex items-center gap-2 font-mono text-xs text-[#1E2A22]/60">
              <div className="flex text-[#F2C14E]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
              4.4 average · 90M+ homes designed
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}><EditorMock /></motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-[#1E2A22]/10 bg-white py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <Stat value="90M+" label="users worldwide" /><Stat value="8,000+" label="catalog items" /><Stat value="4.4 / 5" label="on G2 & Capterra" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-10 gap-y-3 text-[#1E2A22]/40">
            <span className="font-serif text-lg italic">Forbes</span><span className="text-lg font-bold tracking-tight">TechCrunch</span><span className="font-serif text-lg italic">Architectural Digest</span>
          </div>
        </div>
      </section>

      {/* ===== HOWEVER YOU LIKE TO BEGIN - LEFT HEADING | RIGHT IMAGES ===== */}
      <section className="py-20 md:py-28 bg-[#FAF8F3]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-10 lg:gap-16 items-center">

            {/* LEFT : HEADING + SUB HEADING */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#D97A3F]">
                <span className="h-px w-8 bg-[#D97A3F]/40" /> Get started
              </span>
              <h2 className="mt-4 font-serif text-[42px] font-medium leading-[0.9] tracking-tight md:text-[52px]">
                However you like
                <br />
                <span className="italic text-[#2F6F4E]">to begin.</span>
              </h2>
              <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-[#1E2A22]/60">
                Five ways in, same finished result. Start blank, use our wizard, or bring your own plan — all fully editable in the same editor.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-[#1E2A22]/70">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F6F4E] text-white"><CheckCircle2 className="h-3.5 w-3.5" /></span>
                  No experience needed, switch to 3D anytime
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1E2A22]/70">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F6F4E] text-white"><CheckCircle2 className="h-3.5 w-3.5" /></span>
                  Free to start, export when you're ready
                </div>
              </div>

              <Button onClick={() => setActiveEntry(ENTRY_POINTS[activeIndex])} className="mt-8 rounded-full bg-[#1E2A22] px-7 py-6 text-white hover:bg-black overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={ENTRY_POINTS[activeIndex].key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center"
                  >
                    Start with {ENTRY_POINTS[activeIndex].label} <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </AnimatePresence>
              </Button>
              <p className="mt-3 font-mono text-xs text-[#1E2A22]/40">Hover images on the right to preview • Click to open</p>
            </motion.div>

            {/* RIGHT : IMAGE ACCORDION WITH DETAILS */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full"
            >
              {/* Desktop */}
              <div className="hidden md:flex h-[500px] w-full gap-3">
                {ENTRY_POINTS.map((entry, i) => (
                  <EntryPanel
                    key={entry.key}
                    entry={entry}
                    index={i}
                    isActive={i === activeIndex}
                    onActivate={() => setActiveIndex(i)}
                    onOpen={() => setActiveEntry(entry)}
                  />
                ))}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-3 md:hidden">
                {ENTRY_POINTS.map((entry, i) => {
                  const isActive = i === activeIndex
                  const Icon = entry.icon
                  return (
                    <motion.button
                      key={entry.key}
                      layout
                      onClick={() => (isActive ? setActiveEntry(entry) : setActiveIndex(i))}
                      animate={{ height: isActive ? 360 : 72 }}
                      transition={{ type: "spring", stiffness: 260, damping: 32 }}
                      className={`relative overflow-hidden rounded-[22px] border text-left ${isActive ? "border-[#2F6F4E]/30 shadow-lg" : "border-[#1E2A22]/10"}`}
                    >
                      <img src={entry.image} alt={entry.label} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A22]/85 via-[#1E2A22]/30 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow"><Icon className="h-4 w-4 text-[#2F6F4E]" /></div>
                            <span className="font-serif text-base font-medium text-white">{entry.label}</span>
                          </div>
                          <span className="font-mono text-xs text-white/60">0{i + 1}</span>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-2"
                            >
                              <p className="text-sm text-white/80">{entry.copy}</p>
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#1E2A22]">
                                Continue <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Dialog open={!!activeEntry} onOpenChange={(o) => !o && setActiveEntry(null)}>
        <DialogContent className="overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3] p-0 sm:max-w-md">
          {activeEntry && (
            <>
              <div className="relative h-44 w-full overflow-hidden">
                <img src={activeEntry.image} alt={activeEntry.label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F3] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow"><activeEntry.icon className="h-5 w-5 text-[#2F6F4E]" /></div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <DialogHeader><DialogTitle className="font-serif text-2xl">{activeEntry.label}</DialogTitle><DialogDescription className="text-[#1E2A22]/65">{activeEntry.description}</DialogDescription></DialogHeader>
                <ul className="my-4 space-y-2">{activeEntry.bullets.map((b) => <li key={b} className="flex gap-2 text-sm text-[#1E2A22]/70"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6F4E]" />{b}</li>)}</ul>
                <DialogFooter className="flex-row justify-end gap-2">
                  <Button variant="outline" className="rounded-full" onClick={() => setActiveEntry(null)}>Cancel</Button>
                  <Button className="rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]" onClick={() => { goTo(activeEntry.href); setActiveEntry(null) }}>Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* FEATURES */}
      <section className="border-y border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto flex flex-col gap-24 px-6">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6F4E]/10"><f.icon className="h-5 w-5 text-[#2F6F4E]" /></div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">{f.eyebrow}</span>
                <h3 className="mb-4 mt-2 font-serif text-2xl font-medium tracking-tight md:text-3xl">{f.title}</h3>
                <p className="max-w-md text-[#1E2A22]/65">{f.copy}</p>
              </div>
              <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>{f.mock === "editor" ? <EditorMock /> : <RenderMock />}</motion.div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-24"><BlueprintGrid className="opacity-50" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 max-w-xl"><span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">The process</span><h2 className="mt-3 font-serif text-3xl font-medium md:text-5xl">Three drafts to a finished home.</h2></div>
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
            <svg className="pointer-events-none absolute left-0 top-[19px] hidden w-full md:block" height="2"><line x1="0%" y1="1" x2="70%" y2="1" stroke="#2F6F4E" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="6 5" /></svg>
            <Step n="01" title="Draw the plan" copy="Sketch walls and rooms to scale, or start from a template." /><Step n="02" title="Furnish & finish" copy="Drag in furniture, flooring, and materials from the catalog." /><Step n="03" title="Render & export" copy="Generate an HD render, then export plans and a cost estimate." />
          </div>
        </div>
      </section>

      <section className="border-y border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mb-14 max-w-xl"><span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">From the community</span><h2 className="mt-3 font-serif text-3xl font-medium md:text-4xl">People designing on Dream2Build.</h2></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[{ name: "Priya N.", role: "First-time homeowner", quote: "Drew our kitchen renovation in an afternoon, sent the plan straight to our contractor.", initials: "PN" }, { name: "Marcus T.", role: "Interior designer", quote: "The catalog sizing is accurate enough that I use it for real client presentations now.", initials: "MT" }, { name: "Ana R.", role: "Renter", quote: "Rearranged my whole apartment in 3D before moving a single box.", initials: "AR" }].map((t) => (
              <Card key={t.name} className="rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3] p-6"><div className="mb-4 flex text-[#F2C14E]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div><p className="mb-6 text-[#1E2A22]/75">"{t.quote}"</p><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F6F4E]/15 font-mono text-xs font-bold text-[#2F6F4E]">{t.initials}</div><div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-[#1E2A22]/50">{t.role}</div></div></div></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAF8F3] py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row"><div><span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Marketplace</span><h2 className="mt-3 font-serif text-3xl font-medium md:text-4xl">Start from someone else's blueprint.</h2></div><Button variant="outline" className="rounded-full border-[#1E2A22]/20">Browse all plans <ChevronRight className="ml-1 h-4 w-4" /></Button></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[{ name: "Modern Oasis Villa", sqft: "3,200", price: "$49" }, { name: "Sunlit Courtyard House", sqft: "2,150", price: "$39" }, { name: "Timber Ridge Cabin", sqft: "1,480", price: "$29" }].map((p) => (
              <Card key={p.name} className="overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-white"><div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-[#DCEFE6] to-[#F4F1EA]"><svg viewBox="0 0 100 70" className="h-24 w-36 opacity-80"><rect x="4" y="4" width="42" height="30" fill="#2F6F4E" fillOpacity="0.18" stroke="#2F6F4E" strokeOpacity="0.4" /><rect x="50" y="4" width="46" height="18" fill="#D97A3F" fillOpacity="0.18" stroke="#D97A3F" strokeOpacity="0.4" /><rect x="4" y="38" width="30" height="28" fill="#F2C14E" fillOpacity="0.2" stroke="#F2C14E" strokeOpacity="0.5" /><rect x="38" y="38" width="58" height="28" fill="#7A93A8" fillOpacity="0.18" stroke="#7A93A8" strokeOpacity="0.4" /></svg><div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-sm font-bold shadow-sm">{p.price}</div></div><CardContent className="p-6"><h4 className="mb-1 font-serif text-xl font-medium">{p.name}</h4><p className="mb-4 text-sm text-[#1E2A22]/50">By @archstudio</p><div className="flex items-center justify-between text-sm"><span className="flex items-center font-medium text-[#2F6F4E]"><Sparkles className="mr-1 h-4 w-4" /> 4.9 (120)</span><span className="font-mono text-[#1E2A22]/50">{p.sqft} sqft</span></div></CardContent></Card>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1E2A22] py-28 text-[#FAF8F3]"><BlueprintGrid className="opacity-20 [&_path]:stroke-[#FAF8F3]" />
        <div className="container relative z-10 mx-auto px-6 text-center"><h2 className="mb-6 font-serif text-4xl font-medium md:text-6xl">Your dream home is one draft away.</h2><p className="mx-auto mb-10 max-w-2xl text-lg text-[#FAF8F3]/70">Join 90M+ people already designing on Dream2Build.</p><Button size="lg" className="rounded-full bg-[#D97A3F] px-8 text-base font-semibold text-white hover:bg-[#c66a30]" onClick={() => window.open('/planner', '_blank')}>Start designing, free <ArrowRight className="ml-2 h-4 w-4" /></Button><p className="mt-6 flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-wider text-[#FAF8F3]/50"><span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> No card required</span><span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> 3 free projects</span></p></div>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="flex items-baseline gap-2"><span className="font-serif text-2xl font-medium text-[#2F6F4E]">{value}</span><span className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50">{label}</span></div>
}
function Step({ n, title, copy }: { n: string; title: string; copy: string }) {
  return <div className="relative"><span className="mb-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2F6F4E] bg-[#FAF8F3] font-mono text-sm font-bold text-[#2F6F4E]">{n}</span><h3 className="mb-3 font-serif text-2xl font-medium">{title}</h3><p className="text-[#1E2A22]/60">{copy}</p></div>
}