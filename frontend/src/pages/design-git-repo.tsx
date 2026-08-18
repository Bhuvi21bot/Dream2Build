import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles, GitFork, Star, FolderPlus, FileText, ChevronRight,
  GitBranch, GitCommit, ArrowRight, ArrowDownToLine, BookOpen,
  Plus, Search, User, ShieldAlert, History
} from "lucide-react"

export function DesignGitRepo() {
  const [activeView, setActiveView] = useState<"explore" | "create" | "detail">("explore")
  const [selectedRepo, setSelectedRepo] = useState<any>(null)
  const [repos, setRepos] = useState<any[]>([
    {
      id: 1,
      owner: "marcus_arch",
      name: "modular-adu-core",
      description: "Optimized 400 sq ft Accessory Dwelling Unit with integrated solar dynamics.",
      stars: 87,
      forks: 23,
      commits: [
        { msg: "Optimize window overhangs for passive heating", author: "marcus_arch", time: "2 hours ago" },
        { msg: "Integrate plumbing route diagrams", author: "marcus_arch", time: "1 day ago" },
        { msg: "Initial CAD structure outline", author: "marcus_arch", time: "3 days ago" }
      ],
      readme: "# Modular ADU Core\n\nA space-efficient Accessory Dwelling Unit template designed using the passive solar principles.\n\n## Specifications\n- **Area:** 400 sq ft\n- **Rooms:** Lofted Bedroom, 1 Full Bath\n- **Sustainability:** Zero-thermal transfer windows",
      files: ["core-layout.json", "structural-elevations.dwg", "material-boq.csv"]
    },
    {
      id: 2,
      owner: "elena_designs",
      name: "timber-ridge-loft",
      description: "A cozy modern cabin draft featuring double height windows and stone fireplace hearth.",
      stars: 124,
      forks: 41,
      commits: [
        { msg: "Refine interior furniture placement", author: "elena_designs", time: "4 hours ago" },
        { msg: "Add electrical outlet map", author: "elena_designs", time: "2 days ago" }
      ],
      readme: "# Timber Ridge Loft\n\nA cabin blueprints package optimal for cold weather zones.",
      files: ["cabin-loft.json", "foundation-footings.dwg"]
    }
  ])

  const [newRepo, setNewRepo] = useState({
    name: "",
    description: "",
    readme: "# Project Name\n\nEdit description here...",
    files: [] as string[]
  })

  const { toast } = useToast()

  const handleCreate = () => {
    if (!newRepo.name.trim()) return
    const created = {
      id: repos.length + 1,
      owner: "current_user",
      name: newRepo.name.toLowerCase().replace(/\s+/g, "-"),
      description: newRepo.description,
      stars: 0,
      forks: 0,
      commits: [{ msg: "Initial repository commit", author: "current_user", time: "Just now" }],
      readme: newRepo.readme,
      files: ["main-floorplan.json"]
    }
    setRepos([created, ...repos])
    setNewRepo({ name: "", description: "", readme: "# Project Name\n\nEdit description here...", files: [] })
    setActiveView("explore")
    toast({ title: "Repository Created!", description: "Your blueprint project is now live for others to fork and clone." })
  }

  const handleFork = (repo: any) => {
    toast({ title: "Repository Forked!", description: `Created a copy of '${repo.owner}/${repo.name}' in your projects.` })
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-28 px-6 text-[#1E2A22]">
      <div className="mx-auto max-w-5xl">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2A22]/10 pb-6 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#d4a276]">COLLABORATIVE CODE FOR ARCHITECTURE</span>
            <h1 className="font-serif text-4xl font-medium tracking-tight mt-1">Design Repository Hub</h1>
            <p className="text-sm text-[#1E2A22]/60">Share floor plans, track layout iterations, and fork community designs.</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setSelectedRepo(null)
                setActiveView("explore")
              }}
              variant={activeView === "explore" ? "default" : "outline"}
              className="rounded-full"
            >
              Explore Repos
            </Button>
            <Button
              onClick={() => setActiveView("create")}
              variant={activeView === "create" ? "default" : "outline"}
              className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] flex gap-1.5"
            >
              <Plus className="h-4 w-4" /> Create Repo
            </Button>
          </div>
        </div>

        {/* Explore View */}
        {activeView === "explore" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <Card key={repo.id} className="overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-[#a47148]/30 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#1E2A22]/55">
                    <User className="h-3.5 w-3.5 text-[#a47148]" />
                    <span>{repo.owner}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold mt-2 text-[#a47148] cursor-pointer hover:underline" onClick={() => {
                    setSelectedRepo(repo)
                    setActiveView("detail")
                  }}>
                    {repo.name}
                  </h3>
                  <p className="text-sm text-[#1E2A22]/70 mt-3 leading-relaxed">{repo.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E2A22]/8 flex items-center justify-between text-xs font-mono text-[#1E2A22]/50">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[#d4a276] text-[#d4a276]" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5 text-[#bc8a5f]" /> {repo.forks}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRepo(repo)
                      setActiveView("detail")
                    }}
                    className="flex items-center gap-1 font-semibold text-[#a47148] hover:underline"
                  >
                    View Repo <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Repo View */}
        {activeView === "create" && (
          <div className="mx-auto max-w-xl rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-xl space-y-6">
            <h2 className="font-serif text-2xl font-medium">Create New Design Repository</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#1E2A22]/60 font-mono uppercase">Repository Name</label>
                <Input
                  placeholder="e.g. sunlit-lofted-cabin"
                  value={newRepo.name}
                  onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                  className="mt-1 bg-[#FAF8F3] border-[#1E2A22]/15 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs text-[#1E2A22]/60 font-mono uppercase font-semibold">Short Description</label>
                <Input
                  placeholder="Briefly describe the layout style or scope..."
                  value={newRepo.description}
                  onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                  className="mt-1 bg-[#FAF8F3] border-[#1E2A22]/15 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs text-[#1E2A22]/60 font-mono uppercase font-semibold">README.md Markdown Documentation</label>
                <textarea
                  value={newRepo.readme}
                  onChange={(e) => setNewRepo({ ...newRepo, readme: e.target.value })}
                  className="mt-2 min-h-[140px] w-full rounded-2xl border border-[#1E2A22]/15 bg-[#FAF8F3] p-4 text-sm font-mono outline-none focus:border-[#a47148]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t border-[#1E2A22]/10 pt-6">
              <Button variant="outline" className="rounded-full" onClick={() => setActiveView("explore")}>Cancel</Button>
              <Button className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d]" onClick={handleCreate}>Create Repository</Button>
            </div>
          </div>
        )}

        {/* Repository Detail Page */}
        {activeView === "detail" && selectedRepo && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Repository Readme Panel */}
              <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#1E2A22]/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#a47148]" />
                    <span className="font-mono text-xs text-[#1E2A22]/55">README.md</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full flex gap-1 items-center" onClick={() => handleFork(selectedRepo)}>
                      <GitFork className="h-3.5 w-3.5" /> Fork
                    </Button>
                    <Button size="sm" className="rounded-full bg-[#a47148] text-white hover:bg-[#8e603d] flex gap-1 items-center" onClick={() => toast({ title: "Design files downloaded!" })}>
                      <ArrowDownToLine className="h-3.5 w-3.5" /> Clone
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none text-[#1E2A22]/85 text-sm whitespace-pre-line font-mono">
                  {selectedRepo.readme}
                </div>
              </Card>

              {/* Version Iteration (Commits) */}
              <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-[#bc8a5f]" />
                  <h3 className="font-serif text-lg font-medium">Version History (Commits)</h3>
                </div>
                <div className="space-y-4">
                  {selectedRepo.commits.map((commit: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start bg-[#FAF8F3] p-3 rounded-xl border border-[#1E2A22]/5">
                      <GitCommit className="h-4 w-4 shrink-0 text-[#a47148] mt-1" />
                      <div>
                        <p className="text-sm font-medium">{commit.msg}</p>
                        <p className="text-xs text-[#1E2A22]/50 font-mono mt-1">by @{commit.author} · {commit.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Repository Files */}
              <Card className="rounded-3xl border border-[#1E2A22]/10 bg-white p-6 shadow-sm">
                <h3 className="font-mono text-xs uppercase tracking-wider text-[#1E2A22]/50 mb-4">Repository Files</h3>
                <div className="space-y-2">
                  {selectedRepo.files.map((file: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-lg bg-[#FAF8F3] p-2.5 border border-[#1E2A22]/5 text-sm">
                      <FileText className="h-4 w-4 text-[#bc8a5f]" />
                      <span className="font-mono text-xs truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
