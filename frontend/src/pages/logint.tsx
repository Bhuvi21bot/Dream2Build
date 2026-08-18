import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Ruler,
  Star,
} from "lucide-react"
import { signIn, signUp } from "@/lib/auth-client"


/**
 * Login — "Blueprint & Paper" design system, extended (not reinvented).
 * Background #FAF8F3 · Ink #1E2A22 · Primary #2F6F4E · Accent #D97A3F
 * Display: Fraunces (serif, font-serif) · Body: Plus Jakarta Sans (font-sans)
 * Data: JetBrains Mono (font-mono)
 *
 * UI ONLY — no auth, no backend, no validation logic. The form has local
 * state and a fake ~900ms "loading" state on submit purely so the button
 * doesn't feel dead, but nothing is actually sent anywhere. Wire up your
 * own submit handler in place of the setTimeout in handleSubmit.
 *
 * Layout mirrors the homepage hero's convention: copy + form on the left,
 * a product visual on the right. The signature element is the title-block
 * stamp in the corner of the visual panel — a small nod to actual
 * architectural drawings, which every other page's "dimension tag" /
 * "pinned flag" details have been building toward.
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lg-grid)" />
    </svg>
  )
}

/** A tiny, schematic Google "G" — approximated, not the official asset, just enough
 *  to signal "Google" on a generic OAuth button without reproducing exact brand art. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.9-2.26c-.8.55-1.84.86-3.06.86-2.35 0-4.34-1.58-5.05-3.71H.9v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.9a9 9 0 0 0 0 8.06l3.05-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.57-2.57A8.6 8.6 0 0 0 9 0 9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.16 6.65 3.58 9 3.58Z" />
    </svg>
  )
}

/** The signature element — a corner title-block, like the annotation on a real
 *  architectural drawing sheet. */
function TitleBlockStamp() {
  const rows: [string, string][] = [
    ["Project", "Your next home"],
    ["Drawn by", "You"],
    ["Scale", "1 : 1"],
    ["Sheet", "01 of ∞"],
  ]
  return (
    <div className="w-[220px] rotate-[-2deg] rounded-2xl border border-[#1E2A22] bg-[#FAF8F3] p-4 shadow-[4px_4px_0_0_#1E2A22]">
      <div className="mb-2 flex items-center gap-1.5 border-b border-[#1E2A22]/20 pb-2">
        <Ruler className="h-3.5 w-3.5 text-[#D97A3F]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]">Title block</span>
      </div>
      <dl className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <dt className="font-mono text-[9px] uppercase tracking-wide text-[#1E2A22]/45">{k}</dt>
            <dd className="truncate font-serif text-xs text-[#1E2A22]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Minimal floor-plan sketch, echoes the hero's EditorMock but scaled down for
 *  a side panel rather than the main focal image. */
function FloorPlanSketch() {
  const rooms = [
    { x: 8, y: 8, w: 50, h: 42, fill: "#DCEFE6", label: "Living" },
    { x: 62, y: 8, w: 30, h: 20, fill: "#FBE7D3", label: "Kitchen" },
    { x: 8, y: 54, w: 34, h: 38, fill: "#E4E9F7", label: "Bed" },
    { x: 46, y: 54, w: 46, h: 38, fill: "#F6E3B4", label: "Bath" },
  ]
  return (
    <svg viewBox="0 0 100 100" className="w-full">
      {rooms.map((r) => (
        <g key={r.label}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} stroke="#1E2A22" strokeOpacity="0.15" strokeWidth="0.6" rx="1.5" />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" fontSize="4.4" fill="#1E2A22" fillOpacity="0.5" fontFamily="monospace">
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)

  // UI-only stand-in for a real submit handler — swap this for your actual
  // auth call. Kept as a brief fake delay so the button doesn't feel dead.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isRegister) {
        const { data, error } = await signUp.email({
          email,
          password,
          name: email.split("@")[0]
        })
        if (error) {
          alert(error.message || "Failed to sign up")
        } else {
          window.location.href = "/"
        }
      } else {
        const { data, error } = await signIn.email({
          email,
          password
        })
        if (error) {
          alert(error.message || "Failed to log in")
        } else {
          window.location.href = "/"
        }
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-stretch bg-[#FAF8F3] text-[#1E2A22]">
      <BlueprintGrid className="opacity-40" />

      <div className="relative z-10 grid w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT — form */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <motion.a
              href="/"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group mb-10 flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10 transition-colors group-hover:bg-[#2F6F4E]/20">
                <Ruler className="h-4 w-4 text-[#2F6F4E]" />
              </div>
              <span className="font-serif text-lg font-medium tracking-tight">
                Dream2Build<span className="text-[#D97A3F]">.</span>
              </span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Welcome back</span>
              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
                {isRegister ? (
                  <>Create your <span className="italic text-[#2F6F4E]">account</span>.</>
                ) : (
                  <>Pick up where you <span className="italic text-[#2F6F4E]">left off</span>.</>
                )}
              </h1>
              <p className="mt-3 text-[#1E2A22]/60">
                {isRegister 
                  ? "Sign up to start saving your projects, drafts, and floor plans." 
                  : "Log in to get back to your projects, drafts, and saved plans."}
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="mt-9 space-y-4"
            >
              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/50">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[#1E2A22]/15 bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#2F6F4E]/50 focus-within:ring-2 focus-within:ring-[#2F6F4E]/15">
                  <Mail className="h-4 w-4 shrink-0 text-[#1E2A22]/35" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#1E2A22]/35"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="block font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/50">
                    Password
                  </label>
                  <a href="#" className="font-mono text-[10px] uppercase tracking-wide text-[#2F6F4E] hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#1E2A22]/15 bg-white px-3.5 py-2.5 transition-colors focus-within:border-[#2F6F4E]/50 focus-within:ring-2 focus-within:ring-[#2F6F4E]/15">
                  <Lock className="h-4 w-4 shrink-0 text-[#1E2A22]/35" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#1E2A22]/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="shrink-0 text-[#1E2A22]/35 transition-colors hover:text-[#1E2A22]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-[#D97A3F] font-semibold text-white hover:bg-[#c66a30] disabled:opacity-70"
              >
                {loading ? (isRegister ? "Signing up…" : "Logging in…") : (isRegister ? "Sign up" : "Log in")}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-[#1E2A22]/10" />
                <span className="font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/40">or</span>
                <div className="h-px flex-1 bg-[#1E2A22]/10" />
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                size="lg"
                className="w-full gap-2 rounded-full border-[#1E2A22]/20 bg-white font-medium hover:bg-[#FAF8F3]"
              >
                <GoogleGlyph /> Continue with Google
              </Button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-center text-sm text-[#1E2A22]/55"
            >
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setIsRegister(false)} className="font-semibold text-[#2F6F4E] hover:underline">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  New to Dream2Build?{" "}
                  <button type="button" onClick={() => setIsRegister(true)} className="font-semibold text-[#2F6F4E] hover:underline">
                    Start free
                  </button>
                </>
              )}
            </motion.p>
          </div>
        </div>

        {/* RIGHT — visual panel, hidden below lg since there's no room to do it justice */}
        <div className="relative hidden overflow-hidden border-l border-[#1E2A22]/10 bg-[#F4F1EA] lg:block">
          <BlueprintGrid className="opacity-60" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-10 p-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-white shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-[#1E2A22]/10 bg-[#F4F1EA] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D97A3F]/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F2C14E]/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2F6F4E]/50" />
                <span className="ml-3 font-mono text-[11px] text-[#1E2A22]/40">dream2build.app/editor</span>
              </div>
              <div className="p-6">
                <FloorPlanSketch />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-sm rounded-2xl border border-[#1E2A22]/10 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex text-[#F2C14E]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-sm text-[#1E2A22]/75">
                "Drew our kitchen renovation in an afternoon, sent the plan straight to our contractor."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2F6F4E]/15 font-mono text-[10px] font-bold text-[#2F6F4E]">
                  PN
                </div>
                <span className="text-xs text-[#1E2A22]/50">Priya N., first-time homeowner</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="self-end"
            >
              <TitleBlockStamp />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}