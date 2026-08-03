import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Zap, PenTool, LayoutDashboard, Compass, Layers, Sofa } from "lucide-react"
import heroImg from "@assets/generated_images/hero-house.jpg"
import appUiImg from "@assets/generated_images/app-ui.jpg"
import feat1Img from "@assets/generated_images/feature-floorplan.jpg"
import feat2Img from "@assets/generated_images/feature-interior.jpg"
import feat3Img from "@assets/generated_images/feature-climate.jpg"
import feat4Img from "@assets/generated_images/feature-cost.jpg"
import step1Img from "@assets/generated_images/step-1.jpg"
import step2Img from "@assets/generated_images/step-2.jpg"
import step3Img from "@assets/generated_images/step-3.jpg"
import market1Img from "@assets/generated_images/market-preview.jpg"
import { Card, CardContent } from "@/components/ui/card"

/**
 * DESIGN SYSTEM — "Blueprint & Paper"
 * ------------------------------------------------
 * Background : #FAF8F3 (warm paper)      Ink        : #1E2A22 (deep forest-charcoal)
 * Primary    : #2F6F4E (working-drawing green)       Accent : #D97A3F (clay/amber, NOT #D97757)
 * Line       : #C9D6C9 (blueprint grid line, low opacity)
 * Highlight  : #F2C14E (sun-yellow, used sparingly on tags/badges)
 *
 * Display type : "Fraunces" (warm, slightly quirky serif — reads architectural, not corporate)
 * Body type    : "Plus Jakarta Sans"
 * Data/mono    : "JetBrains Mono" for figures, sqft, prices — evokes spec sheets / dimensions
 *
 * Signature element: a faint architectural grid + hand-drawn dashed "sketch lines" that
 * run underneath every section, as if the whole page is one continuous blueprint sheet
 * that gets progressively "built up" as you scroll — sections literally look like they're
 * being drafted (dashed outline → filled card).
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="bp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bp-grid)" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="w-full bg-[#FAF8F3] text-[#1E2A22] font-sans">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#1E2A22]/10">
        <BlueprintGrid />
        <div className="container relative z-10 mx-auto grid grid-cols-1 gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: copy + input */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2F6F4E]/30 bg-[#2F6F4E]/5 px-3 py-1.5 text-[#2F6F4E]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-mono text-xs uppercase tracking-wider">Draft engine v2.0 — now live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[#1E2A22] md:text-6xl lg:text-7xl"
            >
              Sketch a home.
              <br />
              <span className="italic text-[#2F6F4E]">Watch it get built.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-[#1E2A22]/70"
            >
              Describe the house in your head. Dream2Build turns it into a real floor plan,
              a furnished 3D walkthrough, and a priced materials list — the same night.
            </motion.p>

            {/* Input box styled like a spec-sheet field, not a glowing AI box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 w-full max-w-xl"
            >
              <div className="rounded-2xl border-2 border-dashed border-[#2F6F4E]/40 bg-white/70 p-2 shadow-[4px_4px_0_0_#1E2A22]">
                <div className="flex items-center rounded-xl bg-white px-4 py-3">
                  <input
                    type="text"
                    placeholder="A 3-bed mid-century home in Austin, big windows, tight budget…"
                    className="w-full flex-1 border-none bg-transparent text-base font-medium text-[#1E2A22] outline-none placeholder:text-[#1E2A22]/40"
                  />
                  <Button
                    size="lg"
                    className="ml-2 rounded-lg bg-[#D97A3F] text-white hover:bg-[#c66a30]"
                  >
                    Draft it <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wide text-[#1E2A22]/60"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#2F6F4E]" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#2F6F4E]" /> No card needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#2F6F4E]" /> Exports to CAD</span>
            </motion.div>
          </div>

          {/* Right: hero image, clipped like a floor-plan room outline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] border-2 border-dashed border-[#2F6F4E]/30" />
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#1E2A22]/10 shadow-xl"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 82%, 82% 100%, 0 100%)" }}
            >
              <img src={heroImg} alt="Dream home rendered by Dream2Build" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-xl border border-[#1E2A22]/10 bg-white px-4 py-3 shadow-lg">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/50">Lot 04 · Austin, TX</div>
              <div className="font-serif text-lg font-medium text-[#1E2A22]">2,340 sqft · 3 bed</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-b border-[#1E2A22]/10 bg-white py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-4xl font-medium text-[#2F6F4E]">120,492+</span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50">homes drafted to date</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-10 gap-y-3 text-[#1E2A22]/40">
            <span className="font-serif text-lg italic">Forbes</span>
            <span className="text-lg font-bold tracking-tight">TechCrunch</span>
            <span className="font-serif text-lg italic">Architectural Digest</span>
            <span className="font-mono text-lg">WIRED</span>
          </div>
        </div>
      </section>

      {/* PRODUCT DEMO STRIP */}
      <section className="relative overflow-hidden py-24">
        <BlueprintGrid className="opacity-60" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">The workspace</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-[#1E2A22] md:text-5xl">
              One canvas. Plan, furnish, and price it.
            </h2>
          </div>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#1E2A22]/10 shadow-2xl"
          >
            <img src={appUiImg} alt="Dream2Build interface" className="h-auto w-full" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES BENTO GRID */}
      <section className="border-y border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mb-14 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Under the hood</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-5xl">
              Six specialists, working the same set of drawings.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Feature 1 - Large */}
            <Card className="group overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3] md:col-span-2">
              <div className="flex h-full flex-col md:flex-row">
                <div className="flex flex-1 flex-col justify-center p-8">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6F4E]/10">
                    <LayoutDashboard className="h-5 w-5 text-[#2F6F4E]" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-medium">AI Floor Planner</h3>
                  <p className="text-[#1E2A22]/60">
                    Structurally sound layouts generated from your lot size, household, and taste — ready to hand to an engineer.
                  </p>
                </div>
                <div className="relative min-h-[220px] flex-1 overflow-hidden">
                  <img src={feat1Img} alt="Floor Planner" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </Card>

            <FeatureCard img={feat2Img} icon={Sofa} title="Interior AI" copy="See materials, lighting, and furniture rendered in realistic detail before you buy a thing." />
            <FeatureCard img={feat3Img} icon={Compass} title="Climate Analysis" copy="Sun path, wind, and energy efficiency, optimized automatically for your site." />
            <FeatureCard img={feat4Img} icon={Zap} title="Live Cost Estimator" copy="Localized labor and material pricing that updates as the design changes." />

            <Card className="flex flex-col justify-center space-y-6 rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3] p-6">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <Layers className="h-5 w-5 text-[#2F6F4E]" />
                  <h3 className="text-lg font-semibold">Material BOQ</h3>
                </div>
                <p className="text-sm text-[#1E2A22]/60">A full bill of quantities, exported for your contractor.</p>
              </div>
              <div className="h-px w-full bg-[#1E2A22]/10" />
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <PenTool className="h-5 w-5 text-[#2F6F4E]" />
                  <h3 className="text-lg font-semibold">CAD Export</h3>
                </div>
                <p className="text-sm text-[#1E2A22]/60">Standard DWG files, ready for your architect to take over.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — a sketched, connected path rather than giant faded numerals */}
      <section className="relative overflow-hidden py-24">
        <BlueprintGrid className="opacity-50" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">The process</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-5xl">Three drafts to a finished home.</h2>
          </div>

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
            {/* connecting dashed line, desktop only */}
            <svg className="pointer-events-none absolute left-0 top-[92px] hidden w-full md:block" height="2">
              <line x1="16%" y1="1" x2="84%" y2="1" stroke="#2F6F4E" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" />
            </svg>

            <Step img={step1Img} n="01" title="Describe your vision" copy="Tell it your needs, aesthetic, and budget the way you'd tell a friend." />
            <Step img={step2Img} n="02" title="Generate & refine" copy="Review plans, 3D models, and cost estimates. Iterate until it fits." />
            <Step img={step3Img} n="03" title="Export & build" copy="Hand contractors CAD files, material lists, and energy reports." />
          </div>
        </div>
      </section>

      {/* MARKETPLACE SNEAK PEEK */}
      <section className="border-t border-[#1E2A22]/10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Community</span>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-5xl">Start from someone else's blueprint.</h2>
              <p className="mt-4 max-w-xl text-[#1E2A22]/60">Thousands of finished designs from the community — buy one, remix it, make it yours.</p>
            </div>
            <Button variant="outline" className="rounded-full border-[#1E2A22]/20">
              Browse the marketplace <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Modern Oasis Villa", sqft: "3,200", price: "$49" },
              { name: "Sunlit Courtyard House", sqft: "2,150", price: "$39" },
              { name: "Timber Ridge Cabin", sqft: "1,480", price: "$29" },
            ].map((p) => (
              <Card key={p.name} className="group overflow-hidden rounded-2xl border-[#1E2A22]/10">
                <div className="relative h-64 overflow-hidden">
                  <img src={market1Img} alt={p.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-[#1E2A22] py-28 text-[#FAF8F3]">
        <BlueprintGrid className="opacity-20 [&_path]:stroke-[#FAF8F3]" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <h2 className="mb-6 font-serif text-4xl font-medium tracking-tight md:text-6xl">
            Your dream home is one draft away.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#FAF8F3]/70">
            Join 120,000+ homeowners and pros already designing on Dream2Build.
          </p>
          <Button size="lg" className="rounded-full bg-[#D97A3F] px-8 text-base font-semibold text-white hover:bg-[#c66a30]">
            Start drafting, free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-[#FAF8F3]/50">No card required · 3 free projects</p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ img, icon: Icon, title, copy }: { img: string; icon: any; title: string; copy: string }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-[#FAF8F3]">
      <div className="relative h-48 overflow-hidden">
        <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F6F4E]/10">
          <Icon className="h-5 w-5 text-[#2F6F4E]" />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-sm text-[#1E2A22]/60">{copy}</p>
      </div>
    </Card>
  )
}

function Step({ img, n, title, copy }: { img: string; n: string; title: string; copy: string }) {
  return (
    <div className="relative">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2F6F4E] font-mono text-sm font-bold text-[#2F6F4E]">
          {n}
        </span>
        <div className="h-px flex-1 bg-[#2F6F4E]/20 md:hidden" />
      </div>
      <div className="mb-6 aspect-[4/3] overflow-hidden rounded-2xl border border-[#1E2A22]/10 shadow-md">
        <img src={img} alt={title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
      </div>
      <h3 className="mb-3 font-serif text-2xl font-medium">{title}</h3>
      <p className="text-[#1E2A22]/60">{copy}</p>
    </div>
  )
}