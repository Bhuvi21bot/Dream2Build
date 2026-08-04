import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  Sparkles, ArrowRight, CheckCircle2, ChevronRight, Star,
  PenTool, Wand2, Upload, LayoutTemplate, Users,
  Layers, Sun, Ruler, Sofa, Compass, Palette,
} from "lucide-react"
// NOTE: adjust this import path to wherever your Antigravity component actually lives
import Antigravity from "@/components/Antigravity"
import { Navbar } from "@/components/navbar"
/**
 * DESIGN SYSTEM — "Blueprint & Paper" (unchanged from previous pass)
 * Background #FAF8F3 · Ink #1E2A22 · Primary #2F6F4E · Accent #D97A3F · Line #C9D6C9
 * Display: Fraunces (serif) · Body: Plus Jakarta Sans · Data: JetBrains Mono
 *
 * This pass mirrors Planner5D's actual homepage structure:
 *   Hero (product screenshot, not lifestyle photo) → trust bar → 5 entry points
 *   (Start from scratch / Smart Wizard / Import a plan / Templates / Hire a designer)
 *   → alternating feature showcase → how it works → testimonials → community
 *   plans → final CTA.
 * No external/AI-generated image assets — every visual is built from CSS + SVG so
 * the file has zero image dependencies.
 */

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

/** CSS/SVG stand-in for a product screenshot: a browser-chrome frame around a floor-plan canvas. */
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
                <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" fontSize="4.2" fill="#1E2A22" fillOpacity="0.55" fontFamily="monospace">
                  {r.label}
                </text>
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

/** Simple isometric-ish room built purely with layered SVG shapes to stand in for a "3D render". */
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

const ENTRY_POINTS = [
  { icon: PenTool, label: "Start from scratch", copy: "A blank canvas and full control." },
  { icon: Wand2, label: "Smart Wizard", copy: "Answer a few questions, get a plan." },
  { icon: Upload, label: "Import a plan", copy: "Upload a blueprint photo to convert." },
  { icon: LayoutTemplate, label: "Templates", copy: "Start from a ready-made layout." },
  { icon: Users, label: "Hire a designer", copy: "Bring in a pro when you need one." },
]

const FEATURES = [
  {
    icon: Layers,
    eyebrow: "01 · Editor",
    title: "Switch between 2D and 3D without losing your place",
    copy: "Lay out walls and rooms in 2D, then drop into 3D to check scale, sightlines, and flow — the same project, two views.",
    mock: "editor" as const,
  },
  {
    icon: Sofa,
    eyebrow: "02 · Catalog",
    title: "Furnish from a catalog built for real rooms",
    copy: "Thousands of furniture, decor, flooring, and material items, sized correctly and ready to drag in.",
    mock: "editor" as const,
  },
  {
    icon: Sun,
    eyebrow: "03 · Rendering",
    title: "See it in real light before you commit to anything",
    copy: "HD rendering adds lighting, shadows, and reflections so the preview looks like the finished room, not a diagram.",
    mock: "render" as const,
  },
  {
    icon: Compass,
    eyebrow: "04 · Site analysis",
    title: "Know how the sun and wind move through the plan",
    copy: "Orientation, daylight, and airflow are checked automatically as you draft, not left for an engineer to catch later.",
    mock: "render" as const,
  },
]

export default function Home() {
  return (
    <div className="w-full bg-[#FAF8F3] text-[#1E2A22] font-sans">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#1E2A22]/10">
        <BlueprintGrid />

        {/* Ambient particle field — spans the full hero so hover works everywhere and there's no seam between a "covered" patch and plain background */}
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-multiply">
          <Antigravity
            count={550}
            magnetRadius={11}
            ringRadius={5}
            waveSpeed={0.2}
            waveAmplitude={0.5}
            particleSize={1.5}
            lerpSpeed={0.1}
            color="#2F6F4E"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>

        <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-16 px-6 pb-24 pt-36 pointer-events-none md:pb-28 md:pt-40 lg:grid-cols-[1fr_1.05fr]">
          <div className="pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2F6F4E]/30 bg-[#2F6F4E]/5 px-3 py-1.5 text-[#2F6F4E]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono text-xs uppercase tracking-wider">Free to start · No card needed</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl lg:text-[4.2rem]"
            >
              Design your <span className="italic text-[#2F6F4E]">home</span>,
              <br />in 2D and 3D.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg text-[#1E2A22]/70"
            >
              Draw a floor plan, furnish it from a full catalog, and render it in HD —
              all in one browser tab. No download, no drafting experience required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button size="lg" className="rounded-full bg-[#D97A3F] px-7 text-white hover:bg-[#c66a30]">
                Start designing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-[#1E2A22]/20 px-7">
                See how it works
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 flex items-center gap-2 font-mono text-xs text-[#1E2A22]/60"
            >
              <div className="flex text-[#F2C14E]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              4.4 average · 90M+ homes designed
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="pointer-events-auto"
          >
            <EditorMock />
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-[#1E2A22]/10 bg-white py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <Stat value="90M+" label="users worldwide" />
            <Stat value="8,000+" label="catalog items" />
            <Stat value="4.4 / 5" label="on G2 & Capterra" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-10 gap-y-3 text-[#1E2A22]/40">
            <span className="font-serif text-lg italic">Forbes</span>
            <span className="text-lg font-bold tracking-tight">TechCrunch</span>
            <span className="font-serif text-lg italic">Architectural Digest</span>
          </div>
        </div>
      </section>

      {/* ENTRY POINTS */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-10 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Get started</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">However you like to begin.</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {ENTRY_POINTS.map(({ icon: Icon, label, copy }) => (
              <button
                key={label}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-[#1E2A22]/10 bg-white p-5 text-left transition-colors hover:border-[#2F6F4E]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6F4E]/10 transition-colors group-hover:bg-[#2F6F4E]/15">
                  <Icon className="h-5 w-5 text-[#2F6F4E]" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">{label}</div>
                  <div className="mt-1 text-xs text-[#1E2A22]/55">{copy}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ALTERNATING FEATURE SHOWCASE */}
      <section className="border-y border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto flex flex-col gap-24 px-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6F4E]/10">
                  <f.icon className="h-5 w-5 text-[#2F6F4E]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">{f.eyebrow}</span>
                <h3 className="mb-4 mt-2 font-serif text-2xl font-medium tracking-tight md:text-3xl">{f.title}</h3>
                <p className="max-w-md text-[#1E2A22]/65">{f.copy}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {f.mock === "editor" ? <EditorMock /> : <RenderMock />}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden py-24">
        <BlueprintGrid className="opacity-50" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">The process</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-5xl">Three drafts to a finished home.</h2>
          </div>

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
            <svg className="pointer-events-none absolute left-0 top-[19px] hidden w-full md:block" height="2">
              <line x1="16%" y1="1" x2="84%" y2="1" stroke="#2F6F4E" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />
            </svg>
            <Step n="01" title="Draw the plan" copy="Sketch walls and rooms to scale, or start from a template." />
            <Step n="02" title="Furnish & finish" copy="Drag in furniture, flooring, and materials from the catalog." />
            <Step n="03" title="Render & export" copy="Generate an HD render, then export plans and a cost estimate." />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mb-14 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">From the community</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">People designing on Dream2Build.</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: "Priya N.", role: "First-time homeowner", quote: "Drew our kitchen renovation in an afternoon, sent the plan straight to our contractor.", initials: "PN" },
              { name: "Marcus T.", role: "Interior designer", quote: "The catalog sizing is accurate enough that I use it for real client presentations now.", initials: "MT" },
              { name: "Ana R.", role: "Renter", quote: "Rearranged my whole apartment in 3D before moving a single box.", initials: "AR" },
            ].map((t) => (
              <Card key={t.name} className="rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3] p-6">
                <div className="mb-4 flex text-[#F2C14E]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="mb-6 text-[#1E2A22]/75">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F6F4E]/15 font-mono text-xs font-bold text-[#2F6F4E]">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-[#1E2A22]/50">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY PLANS */}
      <section className="bg-[#FAF8F3] py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Marketplace</span>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">Start from someone else's blueprint.</h2>
            </div>
            <Button variant="outline" className="rounded-full border-[#1E2A22]/20">
              Browse all plans <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Modern Oasis Villa", sqft: "3,200", price: "$49" },
              { name: "Sunlit Courtyard House", sqft: "2,150", price: "$39" },
              { name: "Timber Ridge Cabin", sqft: "1,480", price: "$29" },
            ].map((p) => (
              <Card key={p.name} className="overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-white">
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-[#DCEFE6] to-[#F4F1EA]">
                  <svg viewBox="0 0 100 70" className="h-24 w-36 opacity-80">
                    <rect x="4" y="4" width="42" height="30" fill="#2F6F4E" fillOpacity="0.18" stroke="#2F6F4E" strokeOpacity="0.4" strokeWidth="1" />
                    <rect x="50" y="4" width="46" height="18" fill="#D97A3F" fillOpacity="0.18" stroke="#D97A3F" strokeOpacity="0.4" strokeWidth="1" />
                    <rect x="4" y="38" width="30" height="28" fill="#F2C14E" fillOpacity="0.2" stroke="#F2C14E" strokeOpacity="0.5" strokeWidth="1" />
                    <rect x="38" y="38" width="58" height="28" fill="#7A93A8" fillOpacity="0.18" stroke="#7A93A8" strokeOpacity="0.4" strokeWidth="1" />
                  </svg>
                  <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-sm font-bold shadow-sm">
                    {p.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="mb-1 font-serif text-xl font-medium">{p.name}</h4>
                  <p className="mb-4 text-sm text-[#1E2A22]/50">By @archstudio</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center font-medium text-[#2F6F4E]"><Sparkles className="mr-1 h-4 w-4" /> 4.9 (120)</span>
                    <span className="font-mono text-[#1E2A22]/50">{p.sqft} sqft</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#1E2A22] py-28 text-[#FAF8F3]">
        <BlueprintGrid className="opacity-20 [&_path]:stroke-[#FAF8F3]" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight md:text-6xl">
            Your dream home is one draft away.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#FAF8F3]/70">
            Join 90M+ people already designing on Dream2Build.
          </p>
          <Button size="lg" className="rounded-full bg-[#D97A3F] px-8 text-base font-semibold text-white hover:bg-[#c66a30]">
            Start designing, free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-6 flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-wider text-[#FAF8F3]/50">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> No card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> 3 free projects</span>
          </p>
        </div>
      </section>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-serif text-2xl font-medium text-[#2F6F4E]">{value}</span>
      <span className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50">{label}</span>
    </div>
  )
}

function Step({ n, title, copy }: { n: string; title: string; copy: string }) {
  return (
    <div className="relative">
      <span className="mb-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2F6F4E] bg-[#FAF8F3] font-mono text-sm font-bold text-[#2F6F4E]">
        {n}
      </span>
      <h3 className="mb-3 font-serif text-2xl font-medium">{title}</h3>
      <p className="text-[#1E2A22]/60">{copy}</p>
    </div>
  )
}