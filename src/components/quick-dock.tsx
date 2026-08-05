import { useState } from "react"
import { Link } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import {
  Compass,
  LifeBuoy,
  CircleUser,
  Store,
  Users,
  MessageSquareText,
  HelpCircle,
  Activity,
  FolderKanban,
  Settings,
  LogOut,
} from "lucide-react"

/**
 * QuickDock — a second floating nav, ported from the Aceternity
 * "navbar-menu" hover-menu (MenuItem / Menu / HoveredLink / ProductItem)
 * but:
 *   - de-Next.js'd: `next/link` → wouter `Link`, `next/image` → plain <img>,
 *     "use client" dropped (this is a Vite app, no server components)
 *   - turned vertical: the original `Menu` was a horizontal
 *     `flex justify-center space-x-4`; this one is `flex-col space-y-2`
 *   - the flyout now opens to the LEFT of the trigger instead of below it,
 *     since this dock is pinned to the right edge of the viewport — opening
 *     downward/rightward would push the panel off-screen
 *   - restyled from Aceternity's black/white dark-mode palette to
 *     Blueprint & Paper: bg #FAF8F3, ink #1E2A22, primary #2F6F4E, accent #D97A3F
 *
 * This is a secondary, lightweight dock — utility/discovery links (explore,
 * support, account) — not the primary site nav, which already lives in the
 * left rail (`Navbar.tsx`). Desktop-only (`sm:flex`), same as the left rail,
 * so the two never both appear as awkward stacked mobile bars.
 */

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href)
}

/** <a> for external URLs, wouter <Link> for internal paths — same split as the left rail's ItemLink. */
function DockLink({
  href,
  onClick,
  className,
  children,
}: {
  href: string
  onClick?: () => void
  className?: string
  children: React.ReactNode
}) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}

function HoveredLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <DockLink
      href={href}
      onClick={onClick}
      className="block rounded-lg px-2 py-1.5 text-sm text-[#1E2A22]/70 transition-colors hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
    >
      {children}
    </DockLink>
  )
}

function ProductItem({
  title,
  description,
  href,
  src,
  onClick,
}: {
  title: string
  description: string
  href: string
  src: string
  onClick?: () => void
}) {
  return (
    <DockLink href={href} onClick={onClick} className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-[#2F6F4E]/8">
      <img src={src} alt={title} className="h-16 w-24 shrink-0 rounded-lg object-cover shadow-sm" />
      <div className="min-w-0">
        <h4 className="mb-0.5 truncate font-serif text-base font-medium text-[#1E2A22]">{title}</h4>
        <p className="max-w-[10rem] text-xs leading-snug text-[#1E2A22]/55">{description}</p>
      </div>
    </DockLink>
  )
}

/** A single dock button. Hovering opens its flyout to the LEFT of the dock. */
function MenuItem({
  setActive,
  active,
  item,
  icon: Icon,
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  icon: React.ComponentType<{ className?: string }>
  children?: React.ReactNode
}) {
  const isOpen = active === item
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <button
        aria-expanded={isOpen}
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${isOpen ? "bg-[#2F6F4E]/12 text-[#2F6F4E]" : "text-[#1E2A22]/55 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
          }`}
      >
        <Icon className="h-[18px] w-[18px]" />
        <span className="sr-only">{item}</span>
      </button>

      <AnimatePresence>
        {isOpen && children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: 8 }}
            transition={transition}
            className="absolute right-[calc(100%+0.9rem)] top-1/2 -translate-y-1/2"
          >
            <div className="w-max min-w-[220px] overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] shadow-2xl">
              <div className="p-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Vertical floating shell — the "Menu" primitive, turned into a column instead of a row. */
function Menu({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="flex flex-col items-center gap-1 rounded-3xl border border-[#1E2A22]/10 bg-[#FAF8F3]/95 p-2 shadow-2xl backdrop-blur-xl"
    >
      {children}
    </nav>
  )
}

export function QuickDock() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-auto fixed right-4 top-1/2 z-[900] hidden -translate-y-1/2 sm:flex"
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Explore" icon={Compass}>
          <div className="space-y-1">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
              Explore
            </div>
            <HoveredLink href="/community" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-[#2F6F4E]" /> Community feed
              </span>
            </HoveredLink>
            <HoveredLink href="/marketplace" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#2F6F4E]" /> Marketplace
              </span>
            </HoveredLink>
            <HoveredLink href="/resources/hire-a-designer" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#2F6F4E]" /> Hire a designer
              </span>
            </HoveredLink>
            <div className="my-2 border-t border-[#1E2A22]/10" />
            <ProductItem
              title="Sunlit Courtyard House"
              description="A top-rated community plan, 2,150 sqft."
              href="/marketplace/sunlit-courtyard-house"
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop"
              onClick={() => setActive(null)}
            />
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Support" icon={LifeBuoy}>
          <div className="space-y-1">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
              Support
            </div>
            <HoveredLink href="/resources/help" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#2F6F4E]" /> Help center
              </span>
            </HoveredLink>
            <HoveredLink href="/resources/blog" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-[#2F6F4E]" /> Contact support
              </span>
            </HoveredLink>
            <HoveredLink href="https://status.dream2build.app" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#2F6F4E]" /> System status
              </span>
            </HoveredLink>
          </div>
        </MenuItem>

        <div className="my-1 h-px w-8 bg-[#1E2A22]/10" />

        <MenuItem setActive={setActive} active={active} item="Account" icon={CircleUser}>
          <div className="space-y-1">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
              Account
            </div>
            <HoveredLink href="/account/projects" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-[#2F6F4E]" /> Your projects
              </span>
            </HoveredLink>
            <HoveredLink href="/account/settings" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#2F6F4E]" /> Settings
              </span>
            </HoveredLink>
            <div className="my-2 border-t border-[#1E2A22]/10" />
            <HoveredLink href="/logout" onClick={() => setActive(null)}>
              <span className="flex items-center gap-2 text-[#D97A3F]">
                <LogOut className="h-4 w-4" /> Log out
              </span>
            </HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </motion.div>
  )
}