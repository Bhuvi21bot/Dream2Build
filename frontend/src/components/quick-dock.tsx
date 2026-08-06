import { useState } from "react"
import { Link } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import {
  Compass,
  BookOpen,
  Building2,
  LifeBuoy,
  CircleUser,
  HelpCircle,
  MessageSquareText,
  Activity,
  FolderKanban,
  Settings,
  LogOut,
} from "lucide-react"

/**
 * QuickDock — a second floating nav, ported from the Aceternity
 * "navbar-menu" hover-menu (MenuItem / Menu / HoveredLink) but:
 *   - de-Next.js'd: `next/link` → wouter `Link`, `next/image` dropped
 *     (no product-card thumbnails needed anymore), "use client" dropped
 *   - turned vertical: `flex-col` instead of the original horizontal row
 *   - flyouts open to the LEFT (this dock is pinned to the right edge)
 *   - restyled to Blueprint & Paper: #FAF8F3 / #1E2A22 / #2F6F4E / #D97A3F
 *
 * v2: "Explore" (Community feed / Marketplace) replaced with three real
 * content sections — Use cases, Resources, Enterprise — mirroring the
 * exact same data as the top navbar's mega menus, so the dock is a quick
 * shortcut to the same destinations rather than its own separate content.
 * Each of these gets a wide, multi-column flyout since the underlying
 * data has many items; Support/Account stay narrow single-column flyouts
 * since they're just a handful of utility links.
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

/* ---------- real site content, same data as the top navbar's mega menus ---------- */

type LinkItem = { title: string; href: string; isNew?: boolean }
type Group = { title: string; items: LinkItem[] }

function NewBadge() {
  return (
    <span className="ml-2 shrink-0 rounded-full bg-[#2F6F4E] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-wide text-white">
      New
    </span>
  )
}

function GroupBlock({ group, onNavigate }: { group: Group; onNavigate?: () => void }) {
  return (
    <div className="min-w-[168px]">
      <div className="mb-2 border-b border-[#1E2A22]/8 pb-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
        {group.title}
      </div>
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.href}>
            <DockLink
              href={item.href}
              onClick={onNavigate}
              className="flex items-center rounded-lg px-2 py-1.5 text-sm text-[#1E2A22]/75 transition-colors hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
            >
              {item.title}
              {item.isNew && <NewBadge />}
            </DockLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

const USE_CASES_GROUPS: Group[] = [
  {
    title: "House", items: [
      { title: "Home Design", href: "https://planner5d.com/use/home-design-software" },
      { title: "Home Remodeling", href: "https://planner5d.com/use/home-remodeling-software" },
    ]
  },
  {
    title: "Floor plan", items: [
      { title: "Floor Plan Creator", href: "https://planner5d.com/use/free-floor-plan-creator" },
      { title: "2D Floor Plan", href: "https://planner5d.com/use/2d-floor-plan" },
      { title: "3D Floor Plan", href: "https://planner5d.com/use/3D-floor-plan" },
      { title: "Real Estate Floor Plan", href: "https://planner5d.com/use/real-estate-floor-plan" },
    ]
  },
  {
    title: "Kitchen", items: [
      { title: "Kitchen Planner", href: "https://planner5d.com/use/kitchen-planner-tool" },
    ]
  },
  {
    title: "Bathroom", items: [
      { title: "Bathroom Planner", href: "https://planner5d.com/use/bathroom-planner-tool" },
      { title: "Bathroom Remodeling", href: "https://planner5d.com/use/bathroom-remodeling-tool" },
    ]
  },
  {
    title: "Room", items: [
      { title: "Room Planner", href: "https://planner5d.com/use/room-planner-tool" },
      { title: "AI Room Design", href: "https://planner5d.com/use/ai-room-design" },
      { title: "Kids Room Layout", href: "https://planner5d.com/use/kids-room-layout" },
    ]
  },
  {
    title: "Exterior", items: [
      { title: "Landscape Design Software", href: "https://planner5d.com/use/landscape-design-software" },
      { title: "Deck Design", href: "https://planner5d.com/use/deck-design" },
      { title: "Garden Planner", href: "https://planner5d.com/use/garden-planner" },
      { title: "Garage Planner", href: "https://planner5d.com/use/garage-plans" },
    ]
  },
  {
    title: "Architecture", items: [
      { title: "Architecture Design Software", href: "https://planner5d.com/use/architecture-design-software" },
      { title: "Blueprint Maker", href: "https://planner5d.com/use/blueprint-maker" },
    ]
  },
  {
    title: "Office", items: [
      { title: "Office Planner", href: "https://planner5d.com/use/office-design" },
      { title: "Home Office Design", href: "https://planner5d.com/use/home-office-design" },
    ]
  },
]

const RESOURCES_GROUPS: Group[] = [
  {
    title: "Learn", items: [
      { title: "Online Interior Design School", href: "https://planner5d.com/interior-design-courses" },
      { title: "Interior Design Blog", href: "https://planner5d.com/blog" },
      { title: "Design Battle", href: "https://planner5d.com/contests" },
      { title: "Webinars", href: "https://planner5d.com/webinars", isNew: true },
      { title: "Help Center", href: "https://support.planner5d.com/" },
    ]
  },
  {
    title: "Explore", items: [
      { title: "Hire an Interior Designer", href: "https://planner5d.com/experts" },
      { title: "Top Interior Designers", href: "https://planner5d.com/gallery#top-designers" },
      { title: "Floor Plans Gallery", href: "https://planner5d.com/gallery/floorplans" },
      { title: "Furniture Shop", href: "https://shop.planner5d.com/" },
      { title: "Home Repair Estimator", href: "https://planner5d.com/repairestimator" },
      { title: "Home Plans", href: "https://planner5d.com/homeplans" },
    ]
  },
]

const ENTERPRISE_GROUPS: Group[] = [
  {
    title: "Enterprise", items: [
      { title: "Enterprise Solutions", href: "https://planner5d.com/business" },
      { title: "3D Product Configurator", href: "https://planner5d.com/configurator" },
      { title: "Solutions for Schools", href: "https://planner5d.com/education" },
      { title: "Partner Program", href: "https://planner5d.com/partners" },
      { title: "API Integration", href: "https://planner5d.com/business/api-integrations", isNew: true },
      { title: "Property Scan", href: "https://planner5d.com/property-scan" },
    ]
  },
]

/** Multi-column grid of groups, used inside the wider flyouts. */
function GroupGrid({ groups, columns, onNavigate }: { groups: Group[]; columns: number; onNavigate?: () => void }) {
  return (
    <div
      className="grid gap-x-8 gap-y-5"
      style={{ gridTemplateColumns: `repeat(${Math.min(columns, groups.length)}, minmax(0, 1fr))` }}
    >
      {groups.map((g) => (
        <GroupBlock key={g.title} group={g} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

/* ---------- dock primitives ---------- */

/** A single dock button. Hovering opens its flyout to the LEFT of the dock.
 *  `panelClassName` controls the flyout's width — narrow for Support/Account,
 *  wide for the multi-column content sections. */
function MenuItem({
  setActive,
  active,
  item,
  icon: Icon,
  panelClassName = "min-w-[220px]",
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  icon: React.ComponentType<{ className?: string }>
  panelClassName?: string
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
            <div className={`w-max overflow-hidden rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] shadow-2xl ${panelClassName}`}>
              <div className="max-h-[80vh] overflow-y-auto p-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
  const close = () => setActive(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-auto fixed right-4 top-1/2 z-[900] hidden -translate-y-1/2 sm:flex"
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Use cases" icon={Compass} panelClassName="min-w-[640px]">
          <GroupGrid groups={USE_CASES_GROUPS} columns={4} onNavigate={close} />
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Resources" icon={BookOpen} panelClassName="min-w-[380px]">
          <GroupGrid groups={RESOURCES_GROUPS} columns={2} onNavigate={close} />
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Enterprise" icon={Building2} panelClassName="min-w-[220px]">
          <GroupGrid groups={ENTERPRISE_GROUPS} columns={1} onNavigate={close} />
        </MenuItem>

        <div className="my-1 h-px w-8 bg-[#1E2A22]/10" />

        <MenuItem setActive={setActive} active={active} item="Support" icon={LifeBuoy}>
          <div className="space-y-1">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
              Support
            </div>
            <HoveredLink href="/resources/help" onClick={close}>
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#2F6F4E]" /> Help center
              </span>
            </HoveredLink>
            <HoveredLink href="/resources/blog" onClick={close}>
              <span className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-[#2F6F4E]" /> Contact support
              </span>
            </HoveredLink>
            <HoveredLink href="https://status.dream2build.app" onClick={close}>
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#2F6F4E]" /> System status
              </span>
            </HoveredLink>
          </div>
        </MenuItem>

        <MenuItem setActive={setActive} active={active} item="Account" icon={CircleUser}>
          <div className="space-y-1">
            <div className="mb-1 px-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
              Account
            </div>
            <HoveredLink href="/account/projects" onClick={close}>
              <span className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-[#2F6F4E]" /> Your projects
              </span>
            </HoveredLink>
            <HoveredLink href="/account/settings" onClick={close}>
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#2F6F4E]" /> Settings
              </span>
            </HoveredLink>
            <div className="my-2 border-t border-[#1E2A22]/10" />
            <HoveredLink href="/logout" onClick={close}>
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