import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Share2,
  MessageSquare,
  GitFork,
  BadgeCheck,
  Image as ImageIcon,
  FileUp,
  Trophy,
  TrendingUp,
  X,
  FolderPlus,
  FileText,
  Users,
  CalendarDays,
  BookOpen,
} from "lucide-react"

/**
 * Community — "Blueprint & Paper" design system, matched to the
 * pricing/hero pages. Posts read as "build logs" pinned to a drafting
 * board rather than a generic social feed: dashed borders, a corner
 * stamp for verified architects, and a blueprint grid backdrop.
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cm-grid)" />
    </svg>
  )
}

function Avatar({ initials, ring = false }: { initials: string; ring?: boolean }) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-sm font-semibold ${ring ? "border-[#2F6F4E] bg-[#2F6F4E]/10 text-[#2F6F4E]" : "border-[#1E2A22]/15 bg-[#D97A3F]/10 text-[#D97A3F]"
        }`}
    >
      {initials}
    </div>
  )
}

const HIGHLIGHTS = [
  { tag: "Passive House", count: "1.2k builds", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
  { tag: "Tiny Home", count: "980 builds", img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=800&auto=format&fit=crop" },
  { tag: "Desert Modern", count: "640 builds", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" },
  { tag: "Modern Barn", count: "410 builds", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop" },
  { tag: "Cabin Life", count: "1.5k builds", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop" },
]

const POSTS = [
  {
    id: 1,
    user: "Sarah Jenkins",
    handle: "@sarah_designs",
    avatar: "SJ",
    verified: false,
    time: "2h ago",
    tag: "Build log",
    content:
      "Just finalized the floor plan for our mountain cabin using the AI generator. It optimized solar gain for winter automatically — south-facing glazing shifted 6° on its own.",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop",
    likes: 342,
    comments: 28,
    clones: 15,
    topComment: { user: "Marcus Chen", text: "The overhang sizing on the south wall is exactly right for your latitude." },
  },
  {
    id: 2,
    user: "Marcus Chen",
    handle: "@mchen_arch",
    avatar: "MC",
    verified: true,
    time: "5h ago",
    tag: "Case study",
    content:
      "Challenged the AI to design a minimal mid-century living room on an extremely tight budget. Full BOQ attached below — came in 8% under target.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop",
    likes: 890,
    comments: 112,
    clones: 304,
    topComment: { user: "Elena Rodriguez", text: "Forked this for a client pitch — the material list saved us a full day." },
  },
  {
    id: 3,
    user: "Elena Rodriguez",
    handle: "@elena_builds",
    avatar: "ER",
    verified: true,
    time: "1d ago",
    tag: "Milestone",
    content:
      "First structural export went straight to our engineers. Passed code review with zero revisions needed. This is the first project where the AI draft was the final draft.",
    image: null,
    likes: 1205,
    comments: 89,
    clones: 0,
    topComment: null,
  },
]

const TOP_DESIGNERS = [
  { name: "Kengo Kuma", followers: "45k", initials: "KK" },
  { name: "Studio Gang", followers: "32k", initials: "SG" },
  { name: "BIG Architects", followers: "28k", initials: "BA" },
]

const TAGS = [
  { name: "#MidCentury", count: "2.1k" },
  { name: "#TinyHome", count: "980" },
  { name: "#PassiveHouse", count: "1.2k" },
  { name: "#ModernBarn", count: "410" },
  { name: "#CabinLife", count: "1.5k" },
  { name: "#DesertModern", count: "640" },
]

const MY_PROJECTS = [
  { name: "Ridgeline Cabin — v3.dwg", status: "Draft" },
  { name: "Elm Street ADU — BOQ.pdf", status: "Shared" },
]

export default function Community() {
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [postText, setPostText] = useState("")
  const [activeTab, setActiveTab] = useState<"For you" | "Following" | "Trending">("For you")
  const [attachedImage, setAttachedImage] = useState<{ name: string; url: string } | null>(null)
  const [attachedPlan, setAttachedPlan] = useState<{ name: string } | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const planInputRef = useRef<HTMLInputElement>(null)

  const toggleLike = (id: number) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachedImage({ name: file.name, url: URL.createObjectURL(file) })
  }

  const handlePlanSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachedPlan({ name: file.name })
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F3] text-[#1E2A22]">
      <BlueprintGrid className="opacity-40" />

      {/* Feed sub-header — no search/bell/avatar here, the site nav above already owns those */}
      <div className="relative z-10 border-b border-[#1E2A22]/10 bg-[#FAF8F3]/90 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Community</span>
            <h1 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">Builder Feed</h1>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-[#1E2A22]/10 bg-white p-1">
            {(["For you", "Following", "Trending"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeTab === tab
                    ? "bg-[#2F6F4E] text-white"
                    : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto flex flex-col gap-8 px-4 py-10 lg:flex-row lg:items-start">
        {/* Main feed */}
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-8 lg:mx-0">
          {/* Highlights strip */}
          <div className="-mx-1 flex gap-4 overflow-x-auto pb-2">
            {HIGHLIGHTS.map((h) => (
              <button key={h.tag} className="group shrink-0 text-left">
                <div
                  className="h-20 w-20 rounded-2xl border-2 border-[#1E2A22] bg-cover bg-center shadow-[3px_3px_0_0_#1E2A22] transition-transform group-hover:-translate-y-0.5"
                  style={{ backgroundImage: `url(${h.img})` }}
                />
                <div className="mt-2 w-20 truncate font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/70">
                  {h.tag}
                </div>
                <div className="w-20 truncate text-[10px] text-[#1E2A22]/40">{h.count}</div>
              </button>
            ))}
          </div>

          {/* Featured build spotlight */}
          <div className="overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center md:aspect-auto"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop)",
                }}
              />
              <div className="flex flex-col p-6 md:p-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#D97A3F]">
                  Featured build
                </span>
                <h2 className="mt-2 font-serif text-2xl font-medium leading-snug">
                  A courtyard house that cut cooling costs by 30%
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#1E2A22]/65">
                  Priya Nair used the AI planner's climate module to orient every room around a shaded central
                  courtyard — no mechanical cooling needed for six months of the year.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar initials="PN" ring />
                  <div>
                    <div className="text-sm font-semibold">Priya Nair</div>
                    <div className="text-xs text-[#1E2A22]/45">@priya_builds · Studio plan</div>
                  </div>
                </div>
                <Button className="mt-6 w-fit rounded-full bg-[#1E2A22] px-6 font-semibold text-white hover:bg-[#1E2A22]/85">
                  View the full build
                </Button>
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <div className="flex gap-4">
              <Avatar initials="ME" />
              <div className="min-w-0 flex-1">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="min-h-[70px] w-full resize-none border-none bg-transparent text-base outline-none placeholder:text-[#1E2A22]/35"
                  placeholder="Share your latest build, ask a question, or post an update…"
                />

                {/* Attachment previews */}
                {(attachedImage || attachedPlan) && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachedImage && (
                      <div className="flex items-center gap-2 rounded-xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-2 pr-3">
                        <img
                          src={attachedImage.url}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="max-w-[140px] truncate text-xs text-[#1E2A22]/70">
                          {attachedImage.name}
                        </span>
                        <button
                          onClick={() => setAttachedImage(null)}
                          className="text-[#1E2A22]/40 hover:text-[#D97A3F]"
                          aria-label="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    {attachedPlan && (
                      <div className="flex items-center gap-2 rounded-xl border border-[#1E2A22]/10 bg-[#FAF8F3] px-3 py-2">
                        <FileText className="h-4 w-4 shrink-0 text-[#2F6F4E]" />
                        <span className="max-w-[140px] truncate text-xs text-[#1E2A22]/70">
                          {attachedPlan.name}
                        </span>
                        <button
                          onClick={() => setAttachedPlan(null)}
                          className="text-[#1E2A22]/40 hover:text-[#D97A3F]"
                          aria-label="Remove file"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
                <input
                  ref={planInputRef}
                  type="file"
                  accept=".dwg,.dxf,.pdf,.skp"
                  className="hidden"
                  onChange={handlePlanSelect}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1E2A22]/10 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-[#1E2A22]/55 hover:text-[#1E2A22]"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4" /> Image
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-[#1E2A22]/55 hover:text-[#1E2A22]"
                      onClick={() => planInputRef.current?.click()}
                    >
                      <FileUp className="h-4 w-4" /> Attach plan
                    </Button>
                  </div>
                  <Button className="rounded-full bg-[#D97A3F] px-6 font-semibold text-white hover:bg-[#c66a30]">
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {POSTS.map((post) => (
              <div key={post.id} className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar initials={post.avatar} ring={post.verified} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <span className="font-semibold">{post.user}</span>
                        {post.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#2F6F4E]" />}
                        <span className="truncate text-sm text-[#1E2A22]/45">{post.handle}</span>
                        <span className="shrink-0 text-sm text-[#1E2A22]/45">· {post.time}</span>
                      </div>
                      <span className="shrink-0 rounded-full border border-[#1E2A22]/15 bg-[#FAF8F3] px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/55">
                        {post.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#1E2A22]/85">{post.content}</p>

                    {post.image && (
                      <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3]">
                        <img src={post.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[#1E2A22]/55">
                      <div className="flex gap-6">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors hover:text-[#D97A3F] ${liked[post.id] ? "text-[#D97A3F]" : ""
                            }`}
                        >
                          <Heart className={`h-5 w-5 ${liked[post.id] ? "fill-[#D97A3F]" : ""}`} />
                          <span className="text-sm font-medium">{post.likes + (liked[post.id] ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 transition-colors hover:text-[#2F6F4E]">
                          <MessageSquare className="h-5 w-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 transition-colors hover:text-[#2F6F4E]">
                          <GitFork className="h-5 w-5" />
                          <span className="text-sm font-medium">{post.clones}</span>
                        </button>
                      </div>
                      <button className="transition-colors hover:text-[#2F6F4E]">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>

                    {post.topComment && (
                      <div className="mt-4 rounded-xl bg-[#FAF8F3] p-4 text-sm">
                        <span className="font-semibold">{post.topComment.user}</span>{" "}
                        <span className="text-[#1E2A22]/70">{post.topComment.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-[#1E2A22]/20 px-8 text-[#1E2A22] hover:bg-white"
            >
              Load more builds
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full space-y-6 lg:sticky lg:top-6 lg:w-80">
          {/* Weekly challenge */}
          <div className="rounded-3xl border border-[#1E2A22] bg-[#1E2A22] p-6 text-[#FAF8F3] shadow-[4px_4px_0_0_#D97A3F]">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#D97A3F]">
              <Trophy className="h-3.5 w-3.5" /> This week's challenge
            </div>
            <h3 className="mt-3 font-serif text-xl font-medium">Design a 400 sq ft ADU</h3>
            <p className="mt-2 text-sm text-[#FAF8F3]/70">
              Submit a build by Sunday for a chance to be featured on the front page.
            </p>
            <Button className="mt-4 w-full rounded-full bg-[#D97A3F] font-semibold text-white hover:bg-[#c66a30]">
              Join challenge
            </Button>
          </div>

          {/* Trending tags */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#2F6F4E]" />
              <h3 className="font-serif text-lg font-medium">Trending tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag.name}
                  className="cursor-pointer rounded-full bg-[#FAF8F3] px-3 py-1.5 text-sm font-medium text-[#1E2A22]/75 transition-colors hover:bg-[#2F6F4E]/10 hover:text-[#2F6F4E]"
                >
                  {tag.name} <span className="text-[#1E2A22]/35">· {tag.count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Top designers */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif text-lg font-medium">Top designers</h3>
            <div className="space-y-4">
              {TOP_DESIGNERS.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials={d.initials} />
                    <div>
                      <div className="text-sm font-semibold">{d.name}</div>
                      <div className="text-xs text-[#1E2A22]/45">{d.followers} followers</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-[#1E2A22]/20 text-[#1E2A22]"
                  >
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Your projects */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium">Your projects</h3>
              <button
                onClick={() => planInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-full border border-[#1E2A22]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[#2F6F4E] hover:bg-[#2F6F4E]/10"
              >
                <FolderPlus className="h-3.5 w-3.5" /> Add file
              </button>
            </div>
            <div className="space-y-3">
              {MY_PROJECTS.map((p) => (
                <div key={p.name} className="flex items-center gap-3 rounded-xl bg-[#FAF8F3] p-3">
                  <FileText className="h-4 w-4 shrink-0 text-[#D97A3F]" />
                  <span className="min-w-0 flex-1 truncate text-sm text-[#1E2A22]/80">{p.name}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/40">
                    {p.status}
                  </span>
                </div>
              ))}
              {attachedPlan && (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#2F6F4E]/40 bg-[#2F6F4E]/5 p-3">
                  <FileText className="h-4 w-4 shrink-0 text-[#2F6F4E]" />
                  <span className="min-w-0 flex-1 truncate text-sm text-[#1E2A22]/80">{attachedPlan.name}</span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[#2F6F4E]">
                    New
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Community stats */}
          <div className="rounded-3xl border border-dashed border-[#1E2A22]/25 bg-white/60 p-6">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wide text-[#1E2A22]/45">Community, right now</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                ["6,200+", "Active builders"],
                ["1,840", "Builds this month"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <div className="font-serif text-2xl font-medium text-[#2F6F4E]">{stat}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wide text-[#1E2A22]/45">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently active */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#2F6F4E]" />
              <h3 className="font-serif text-lg font-medium">Recently active</h3>
            </div>
            <div className="flex -space-x-2">
              {["JL", "RT", "AM", "QK", "VS", "+12"].map((initials) => (
                <div
                  key={initials}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#D97A3F]/10 font-serif text-xs font-semibold text-[#D97A3F]"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#1E2A22]/45">17 builders posted in the last hour</p>
          </div>

          {/* Upcoming events */}
          <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#2F6F4E]" />
              <h3 className="font-serif text-lg font-medium">Upcoming events</h3>
            </div>
            <div className="space-y-4">
              {[
                { date: "AUG 12", title: "Live critique: passive cooling", time: "6:00 PM" },
                { date: "AUG 19", title: "Studio AMA with BIG Architects", time: "11:00 AM" },
              ].map((ev) => (
                <div key={ev.title} className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-[#1E2A22]/10 bg-[#FAF8F3] font-mono text-[9px] uppercase text-[#2F6F4E]">
                    {ev.date.split(" ").map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{ev.title}</div>
                    <div className="text-xs text-[#1E2A22]/45">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community guidelines */}
          <button className="flex w-full items-center gap-3 rounded-3xl border border-[#1E2A22]/10 bg-white p-6 text-left shadow-sm transition-colors hover:bg-[#FAF8F3]">
            <BookOpen className="h-4 w-4 shrink-0 text-[#2F6F4E]" />
            <div className="min-w-0">
              <div className="text-sm font-semibold">Community guidelines</div>
              <div className="truncate text-xs text-[#1E2A22]/45">How we keep build logs honest and useful</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}