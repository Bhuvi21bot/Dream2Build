import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Antigravity from "@/components/Antigravity"
import { useToast } from '@/hooks/use-toast';

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
  ArrowRight,
} from "lucide-react"

/**
 * Community — "Blueprint & Paper" design system, matched to the
 * hero/pricing pages. Posts read as "build logs" pinned to a drafting
 * board rather than a generic social feed: dashed borders, a corner
 * stamp for verified architects, and a blueprint grid backdrop.
 *
 * This pass adds a proper hero banner (mirrors the homepage hero's
 * structure — eyebrow, serif headline, CTAs, stat row — but swaps the
 * product screenshot for a "pinned photo board" collage built from
 * real community images, since this page is about people, not the editor)
 * and fixes two layout bugs from the previous version:
 *   - the feed tabs were rendered outside the `container` wrapper with an
 *     invalid `mt-25` class, so they had no top spacing and lost the
 *     page's side padding
 *   - the sidebar had `lg:ml-60 lg:w-100`, an unintended 240px left
 *     margin plus a width class outside Tailwind's default scale
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#a47148" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cm-grid)" />
    </svg>
  )
}

function Avatar({ initials, ring = false }: { initials: string; ring?: boolean }) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-serif text-sm font-semibold ${ring ? "border-[#a47148] bg-[#a47148]/10 text-[#a47148]" : "border-[#1E2A22]/15 bg-[#D97A3F]/10 text-[#D97A3F]"
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

/** Hero banner — eyebrow, serif headline, CTAs, stat row (same rhythm as the homepage
 *  hero) paired with a pinned-photo-board collage instead of a product screenshot. */
function CommunityHero() {
  return (

    <section className="relative overflow-hidden border-b border-[#1E2A22]/10 bg-gradient-to-b from-[#E4F0E9] via-[#EFF6F0] to-[#FAF8F3]">
      <BlueprintGrid className="opacity-40" />
      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-14 px-4 py-20 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a47148]/30 bg-white px-3 py-1.5 text-[#a47148]"
          >
            <Users className="h-3.5 w-3.5" />
            <span className="font-mono text-xs uppercase tracking-wider">6,200+ builders posting live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl font-medium leading-[1.08] tracking-tight md:text-6xl"
          >
            See what people are <span className="italic text-[#a47148]">building</span>, today.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-lg text-lg text-[#1E2A22]/70"
          >
            Build logs, case studies, and finished floor plans from homeowners, designers, and firms.
            Post your own, or fork someone else's draft to start yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button size="lg" className="rounded-full bg-[#D97A3F] px-7 text-white hover:bg-[#c66a30]">
              Share your build <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-[#1E2A22]/20 bg-white px-7">
              Browse the feed
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide text-[#1E2A22]/55"
          >
            <span>6,200+ active builders</span>
            <span>180k+ builds shared</span>
            <span>42 countries</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto h-[340px] w-full max-w-md"
        >
          <div className="absolute left-2 top-0 h-40 w-48 -rotate-6 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
            <img src={HIGHLIGHTS[0].img} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute right-0 top-16 h-40 w-44 rotate-3 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
            <img src={HIGHLIGHTS[1].img} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-2 left-16 h-36 w-52 -rotate-2 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
            <img src={HIGHLIGHTS[2].img} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <Heart className="h-4 w-4 fill-[#D97A3F] text-[#D97A3F]" />
            <span className="font-mono text-xs font-semibold">890 likes</span>
          </div>
          <div className="absolute left-0 top-0 flex items-center gap-2 rounded-full bg-[#1E2A22] px-3 py-1.5 text-[#FAF8F3] shadow-lg">
            <BadgeCheck className="h-3.5 w-3.5 text-[#7FCBA4]" />
            <span className="font-mono text-[10px] uppercase tracking-wide">Verified build</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function Community() {
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [postText, setPostText] = useState("")
  const [activeTab, setActiveTab] = useState<"For you" | "Following" | "Trending">("For you")
  const [attachedImage, setAttachedImage] = useState<{ name: string; url: string } | null>(null)
  const [attachedPlan, setAttachedPlan] = useState<{ name: string } | null>(null)
  const [feedPosts, setFeedPosts] = useState(POSTS)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const planInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }))
    setFeedPosts(posts => posts.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + (liked[id] ? -1 : 1) }
      }
      return p
    }))
  }

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

  const handlePost = () => {
    if (!postText.trim() && !attachedImage && !attachedPlan) return
    const newPost = {
      id: Date.now(),
      user: "Current Builder",
      handle: "@me",
      avatar: "ME",
      verified: true,
      time: "Just now",
      tag: "Build log",
      content: postText,
      image: attachedImage ? attachedImage.url : null,
      likes: 0,
      comments: 0,
      clones: 0,
      topComment: null
    }
    setFeedPosts([newPost, ...feedPosts])
    setPostText("")
    setAttachedImage(null)
    setAttachedPlan(null)
    toast({
      title: "Post published!",
      description: "Your build log update has been added to the live feed.",
    })
  }

  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F3] text-[#1E2A22]">
      <CommunityHero />

      {/* Feed sub-header: just the tabs + a live indicator. The page title now lives in
          the hero above, so this row doesn't repeat it. Everything sits inside `container`
          this time, so it keeps the page's side padding at every breakpoint. */}
      <div className="relative z-10 border-b border-[#1E2A22]/10 bg-[#FAF8F3]/90 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#1E2A22]/50">
            <span className="h-2 w-2 rounded-full bg-[#a47148]" />
            Live feed
          </div>
          <div className="flex items-center gap-1 rounded-full border border-[#1E2A22]/10 bg-white p-1">
            {(["For you", "Following", "Trending"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative rounded-full px-4 py-1.5 text-sm font-medium"
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-[#a47148]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <span
                  className={`relative z-10 transition-colors duration-300 ${activeTab === tab
                    ? "text-white"
                    : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                    }`}
                >
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full overflow-hidden">
        <BlueprintGrid className="opacity-20" />
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

                  {(attachedImage || attachedPlan) && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {attachedImage && (
                        <div className="flex items-center gap-2 rounded-xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-2 pr-3">
                          <img src={attachedImage.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
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
                          <FileText className="h-4 w-4 shrink-0 text-[#a47148]" />
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

                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
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
                    <Button onClick={handlePost} className="rounded-full bg-[#D97A3F] px-6 font-semibold text-white hover:bg-[#c66a30]">
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <div key={post.id} className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Avatar initials={post.avatar} ring={post.verified} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span className="font-semibold">{post.user}</span>
                          {post.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#a47148]" />}
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
                            <span className="text-sm font-medium">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 transition-colors hover:text-[#a47148]" onClick={() => toast({ title: "Comments Section", description: "Comments are disabled for this draft archive." })}>
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 transition-colors hover:text-[#a47148]" onClick={() => toast({ title: "Blueprint cloned!", description: "This layout has been added to your draft repositories." })}>
                            <GitFork className="h-5 w-5" />
                            <span className="text-sm font-medium">{post.clones}</span>
                          </button>
                        </div>
                        <button className="transition-colors hover:text-[#a47148]" onClick={() => toast({ title: "Share Link", description: "Design project URL copied to clipboard." })}>
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
              <Button variant="outline" className="rounded-full border-[#1E2A22]/20 px-8 text-[#1E2A22] hover:bg-white" onClick={() => toast({ title: "Loading builds...", description: "Pulling design feeds from open-source repository streams." })}>
                Load more builds
              </Button>
            </div>
          </div>

          {/* Sidebar — fixed width, sticky, no stray margin */}
          <div className="ml-50 w-full space-y-6 lg:sticky lg:top-6 lg:w-90">
            {/* Weekly challenge */}
            <div className="rounded-3xl border border-[#1E2A22] bg-[#1E2A22] p-6 text-[#FAF8F3] shadow-[4px_4px_0_0_#D97A3F]">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#D97A3F]">
                <Trophy className="h-3.5 w-3.5" /> This week's challenge
              </div>
              <h3 className="mt-3 font-serif text-xl font-medium">Design a 400 sq ft ADU</h3>
              <p className="mt-2 text-sm text-[#FAF8F3]/70">
                Submit a build by Sunday for a chance to be featured on the front page.
              </p>
              <Button className="mt-4 w-full rounded-full bg-[#D97A3F] font-semibold text-white hover:bg-[#c66a30]" onClick={() => toast({ title: "Joined Challenge!", description: "Your sandbox layout is active. Upload a draft file to submit." })}>
                Join challenge
              </Button>
            </div>

            {/* Trending tags */}
            <div className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#a47148]" />
                <h3 className="font-serif text-lg font-medium">Trending tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span
                    key={tag.name}
                    onClick={() => toast({ title: "Tag Selected", description: `Filtering feed by ${tag.name}...` })}
                    className="cursor-pointer rounded-full bg-[#FAF8F3] px-3 py-1.5 text-sm font-medium text-[#1E2A22]/75 transition-colors hover:bg-[#a47148]/10 hover:text-[#a47148]"
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
                    <Button variant="outline" size="sm" className="h-8 rounded-full border-[#1E2A22]/20 text-[#1E2A22]" onClick={() => toast({ title: "User followed", description: `You will now receive updates from ${d.name}.` })}>
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
                  className="flex items-center gap-1.5 rounded-full border border-[#1E2A22]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-[#a47148] hover:bg-[#a47148]/10"
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
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[#2F6F4E]">New</span>
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
    </div>
  )
}