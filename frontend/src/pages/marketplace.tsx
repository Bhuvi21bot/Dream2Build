import { useState } from "react"
import { useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, Star } from "lucide-react"
import { PLANS, type MarketPlan } from "./marketplace-data"

/**
 * Marketplace — "Blueprint & Paper" design system.
 * Same tokens as Home/Navbar: paper #FAF8F3, ink #1E2A22, primary #2F6F4E,
 * accent #D97A3F, highlight #F2C14E. No stock photography — every plan gets
 * an abstract floor-plan glyph generated from its OWN real room data, so the
 * grid reads as a set of actual blueprints rather than a stock-photo gallery.
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="mp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mp-grid)" />
    </svg>
  )
}

const PALETTES = [
  ["#2F6F4E", "#D97A3F", "#F2C14E", "#7A93A8"],
  ["#D97A3F", "#2F6F4E", "#B25D5D", "#F2C14E"],
  ["#7A93A8", "#F2C14E", "#2F6F4E", "#D97A3F"],
  ["#B25D5D", "#2F6F4E", "#7A93A8", "#F2C14E"],
]

// Generates the thumbnail directly from a plan's real room polygons — normalizes
// their bounding box into a 0-100 x 0-70 viewBox so it always fits, regardless
// of the plan's actual real-world scale.
function PlanGlyph({ plan }: { plan: MarketPlan }) {
  const rooms = plan.planData.rooms
  const palette = PALETTES[plan.id % PALETTES.length]

  const allPts = rooms.flatMap(r => r.points)
  const minX = Math.min(...allPts.map(p => p.x)), maxX = Math.max(...allPts.map(p => p.x))
  const minY = Math.min(...allPts.map(p => p.y)), maxY = Math.max(...allPts.map(p => p.y))
  const spanX = Math.max(1, maxX - minX), spanY = Math.max(1, maxY - minY)
  const pad = 4

  const norm = (x: number, y: number) => ({
    x: pad + ((x - minX) / spanX) * (100 - pad * 2),
    y: pad + ((y - minY) / spanY) * (70 - pad * 2),
  })

  return (
    <svg viewBox="0 0 100 70" className="h-28 w-44 opacity-90">
      {rooms.map((room, i) => {
        const pts = room.points.map(p => norm(p.x, p.y))
        const d = `M ${pts.map(p => `${p.x},${p.y}`).join(" L ")} Z`
        const color = palette[i % palette.length]
        return <path key={room.id} d={d} fill={color} fillOpacity="0.18" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
      })}
    </svg>
  )
}

const TABS = ["House Plans", "Interiors", "Furniture Packs"]

export default function Marketplace() {
  const [tab, setTab] = useState(TABS[0])
  const [, setLocation] = useLocation()

  return (
    <div className="min-h-screen w-full bg-[#FAF8F3] pb-24 text-[#1E2A22]">
      {/* HEADER */}
      <div className="relative overflow-hidden border-b border-[#1E2A22]/10 bg-white py-20">
        <BlueprintGrid className="opacity-60" />
        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Marketplace</span>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight md:text-6xl">
              Blueprints, drafted by the community.
            </h1>
            <p className="mt-5 text-lg text-[#1E2A22]/65">
              Thousands of house plans, interior sets, and furniture bundles from designers worldwide —
              buy one, drop it into the editor, and make it yours.
            </p>
          </div>

          {/* Search & filter */}
          <div className="mt-10 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1 rounded-2xl border-2 border-dashed border-[#2F6F4E]/40 bg-[#FAF8F3] p-1.5">
              <div className="flex items-center rounded-xl bg-white px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[#1E2A22]/40" />
                <input
                  type="text"
                  placeholder="Search styles, designers, or keywords…"
                  className="w-full flex-1 border-none bg-transparent px-3 py-1 text-base outline-none placeholder:text-[#1E2A22]/40"
                />
              </div>
            </div>
            <Button size="lg" variant="outline" className="shrink-0 gap-2 rounded-full border-[#1E2A22]/20 font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-6 pt-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight">Trending this week</h2>
          <div className="flex gap-1 rounded-full border border-[#1E2A22]/10 bg-white p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${tab === t ? "bg-[#2F6F4E] text-white" : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => setLocation(`/marketplace/${plan.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl border-[#1E2A22]/10 bg-white transition-colors hover:border-[#2F6F4E]/40"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-[#DCEFE6] to-[#F4F1EA]">
                <BlueprintGrid className="opacity-40" />
                <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <PlanGlyph plan={plan} />
                </div>
                <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-sm font-bold shadow-sm">
                  {plan.price}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{plan.title}</h3>
                <p className="mb-4 mt-1 text-sm text-[#1E2A22]/50">{plan.creator}</p>
                <div className="flex items-center justify-between border-t border-[#1E2A22]/10 pt-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-[#2F6F4E]">
                      <Star className="h-3.5 w-3.5 fill-current" /> {plan.rating}
                    </span>
                    <span className="text-[#1E2A22]/45">({plan.reviews})</span>
                  </div>
                  <span className="rounded-md bg-[#FAF8F3] px-2 py-1 font-mono text-xs text-[#1E2A22]/55">
                    {plan.size}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" className="rounded-full border-[#1E2A22]/20 px-8 font-semibold">
            Load more designs
          </Button>
        </div>
      </div>
    </div>
  )
}