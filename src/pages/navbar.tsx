import { useEffect, useState } from "react"
import { Link, useLocation } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import {
    Moon, Sun, Menu, X, Home as HomeIcon, ChevronRight,
    Boxes, Compass, BookOpen, Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

/**
 * Navbar — "Blueprint & Paper" design system, FLOATING vertical rail.
 *
 * The rail is a floating card offset from the viewport edge (inset-y-4
 * left-4, rounded-3xl, shadow-2xl) — not flush/attached to the edge —
 * plus a matching floating flyout panel that appears to its right when a
 * section is clicked.
 *
 * Visibility note: the desktop rail only renders at `sm:` (640px) and up;
 * below that, a mobile top bar + off-canvas drawer takes over. If the rail
 * seems to "not appear," check the viewport width first — a narrow preview
 * pane will always show the mobile version instead.
 *
 * Content:
 *   Products      → Products / Platforms
 *   Use cases     → House / Floor plan / Kitchen / Bathroom /
 *                    Room / Exterior / Architecture / Office
 *   Resources     → Learn / Explore
 *   Enterprise    → single group
 *   Pricing, Design Battle → plain links
 *
 * Resources, Enterprise, and Use cases now use the real planner5d.com URLs
 * supplied by the user — these are external links and open in a new tab.
 * Products still uses internal placeholder paths (no real URLs were given
 * for that section) — swap those in the same way if/when you have them.
 */

type LinkItem = { title: string; href: string; isNew?: boolean }
type Group = { title: string; items: LinkItem[] }
type MegaMenu = {
    key: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    groups: Group[]
    seeAll?: { label: string; href: string }
}

function isExternal(href: string) {
    return /^https?:\/\//.test(href)
}

/** Renders an <a> for absolute/external URLs, a wouter <Link> for internal paths. */
function ItemLink({
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
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className={className}
            >
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

const PRODUCTS_MENU: MegaMenu = {
    key: "products",
    label: "Products",
    icon: Boxes,
    groups: [
        {
            title: "Products",
            items: [
                { title: "AI Studio", href: "/products/ai-studio", isNew: true },
                { title: "Interior Design Software", href: "/products/interior-design-software" },
                { title: "Planner 5D Pro", href: "/products/pro", isNew: true },
                { title: "AI Interior Design Tools", href: "/products/ai-interior-design" },
                { title: "Collaboration Tool", href: "/products/collaboration", isNew: true },
                { title: "Mood Boards", href: "/products/mood-boards" },
                { title: "360 Walkthrough", href: "/products/360-walkthrough" },
                { title: "AI Floor Plan Converter", href: "/products/floor-plan-converter" },
                { title: "Hire a Designer", href: "/products/hire-a-designer", isNew: true },
                { title: "Import 3D Models", href: "/products/import-3d-models" },
            ],
        },
        {
            title: "Platforms",
            items: [
                { title: "iOS", href: "/platforms/ios" },
                { title: "Android", href: "/platforms/android" },
                { title: "Windows", href: "/platforms/windows" },
                { title: "macOS", href: "/platforms/macos" },
                { title: "VisionOS", href: "/platforms/visionos" },
            ],
        },
    ],
}

const USE_CASES_MENU: MegaMenu = {
    key: "use-cases",
    label: "Use cases",
    icon: Compass,
    groups: [
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
    ],
}

const RESOURCES_MENU: MegaMenu = {
    key: "resources",
    label: "Resources",
    icon: BookOpen,
    groups: [
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
    ],
}

const ENTERPRISE_MENU: MegaMenu = {
    key: "enterprise",
    label: "Enterprise",
    icon: Building2,
    groups: [
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
    ],
}

const MEGA_MENUS: MegaMenu[] = [PRODUCTS_MENU, USE_CASES_MENU, RESOURCES_MENU, ENTERPRISE_MENU]

const PLAIN_LINKS = [
    { label: "Pricing", href: "/pricing" },
    { label: "Design Battle", href: "https://planner5d.com/contests" },
]

const RAIL_WIDTH = 240 // px — keep in sync with `sm:pl-64` (240 + 16px offset) on the page wrapper
const RAIL_OFFSET = 16 // px — matches left-4 / top-4 / bottom-4

/* ---------- shared bits ---------- */

function NewBadge() {
    return (
        <span className="ml-2 shrink-0 rounded-full bg-[#2F6F4E] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-wide text-white">
            New
        </span>
    )
}

function GroupBlock({ group, onNavigate }: { group: Group; onNavigate?: () => void }) {
    return (
        <div className="min-w-[188px]">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/40">
                {group.title}
            </div>
            <ul className="space-y-0.5">
                {group.items.map((item) => (
                    <li key={item.href}>
                        <ItemLink
                            href={item.href}
                            onClick={onNavigate}
                            className="flex items-center rounded-lg px-2 py-1.5 text-sm text-[#1E2A22]/75 transition-colors hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
                        >
                            {item.title}
                            {item.isNew && <NewBadge />}
                        </ItemLink>
                    </li>
                ))}
            </ul>
        </div>
    )
}

/* ---------- desktop: floating vertical rail + floating flyout ---------- */

function DesktopRail() {
    const [location] = useLocation()
    const [openKey, setOpenKey] = useState<string | null>(null)
    const { theme, setTheme } = useTheme()

    const activeMenu = MEGA_MENUS.find((m) => m.key === openKey) ?? null

    // Close on outside click / Escape
    useEffect(() => {
        function onPointerDown(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (target.closest("[data-rail]") || target.closest("[data-flyout]")) return
            setOpenKey(null)
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpenKey(null)
        }
        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [])

    return (
        <>
            <motion.nav
                data-rail
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: RAIL_WIDTH, top: RAIL_OFFSET, bottom: RAIL_OFFSET, left: RAIL_OFFSET }}
                className="pointer-events-auto fixed z-[999] hidden flex-col rounded-3xl border border-[#1E2A22]/10 bg-[#FAF8F3]/95 shadow-2xl backdrop-blur-xl sm:flex"
            >
                {/* Logo */}
                <Link href="/" className="group flex shrink-0 items-center gap-2 border-b border-[#1E2A22]/10 px-5 py-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10 transition-colors group-hover:bg-[#2F6F4E]/20">
                        <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                    </div>
                    <span className="font-serif text-lg font-medium tracking-tight text-[#1E2A22]">
                        Dream2Build<span className="text-[#D97A3F]">.</span>
                    </span>
                </Link>

                {/* Nav items */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                    {MEGA_MENUS.map((menu) => {
                        const isOpen = openKey === menu.key
                        return (
                            <button
                                key={menu.key}
                                onClick={() => setOpenKey(isOpen ? null : menu.key)}
                                aria-expanded={isOpen}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-mono text-xs uppercase tracking-wide transition-colors ${isOpen
                                        ? "bg-[#2F6F4E]/10 text-[#1E2A22]"
                                        : "text-[#1E2A22]/60 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
                                    }`}
                            >
                                <menu.icon className={`h-4 w-4 shrink-0 ${isOpen ? "text-[#2F6F4E]" : "text-[#1E2A22]/40"}`} />
                                <span className="flex-1">{menu.label}</span>
                                <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-[#1E2A22]/30 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                            </button>
                        )
                    })}

                    <div className="my-2 border-t border-[#1E2A22]/10" />

                    {PLAIN_LINKS.map((link) => (
                        <ItemLink
                            key={link.href}
                            href={link.href}
                            className={`rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${location === link.href
                                    ? "bg-[#2F6F4E]/10 text-[#1E2A22]"
                                    : "text-[#1E2A22]/60 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
                                }`}
                        >
                            {link.label}
                        </ItemLink>
                    ))}
                </div>

                {/* Footer: theme + auth */}
                <div className="shrink-0 space-y-2 border-t border-[#1E2A22]/10 p-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/50">Theme</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="relative h-8 w-8 rounded-full text-[#1E2A22]/70 hover:bg-[#1E2A22]/5 hover:text-[#1E2A22]"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                    <Button variant="outline" className="w-full rounded-full border-[#1E2A22]/15">
                        Log in
                    </Button>
                    <Button className="w-full rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]">
                        Start free
                    </Button>
                </div>
            </motion.nav>

            {/* Floating flyout panel */}
            <AnimatePresence>
                {activeMenu && (
                    <motion.div
                        data-flyout
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        style={{ left: RAIL_OFFSET + RAIL_WIDTH + 12, top: RAIL_OFFSET }}
                        className="pointer-events-auto fixed z-[999] hidden max-h-[calc(100vh-32px)] max-w-[860px] overflow-y-auto rounded-3xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-6 shadow-2xl sm:block"
                    >
                        <div className="flex flex-wrap gap-x-10 gap-y-6">
                            {activeMenu.groups.map((group) => (
                                <GroupBlock key={group.title} group={group} onNavigate={() => setOpenKey(null)} />
                            ))}
                        </div>
                        {activeMenu.seeAll && (
                            <ItemLink
                                href={activeMenu.seeAll.href}
                                onClick={() => setOpenKey(null)}
                                className="mt-5 flex w-fit items-center gap-1 border-t border-[#1E2A22]/10 pt-4 font-semibold text-[#2F6F4E]"
                            >
                                {activeMenu.seeAll.label} <ChevronRight className="h-4 w-4" />
                            </ItemLink>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

/* ---------- mobile: top bar + off-canvas ---------- */

function MobileBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [openSection, setOpenSection] = useState<string | null>("products")
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [sidebarOpen])

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-[999] flex items-center justify-between border-b border-[#1E2A22]/10 bg-[#FAF8F3]/95 px-4 py-3 backdrop-blur-xl sm:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10">
                        <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                    </div>
                    <span className="font-serif text-lg font-medium text-[#1E2A22]">
                        Dream2Build<span className="text-[#D97A3F]">.</span>
                    </span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                    className="rounded-full p-2 text-[#1E2A22]/75 hover:bg-[#1E2A22]/5"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-[1060] bg-[#1E2A22]/40 backdrop-blur-sm sm:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed left-0 top-0 z-[1070] flex h-full w-[88%] max-w-sm flex-col border-r border-[#1E2A22]/10 bg-[#FAF8F3] shadow-2xl sm:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-[#1E2A22]/10 p-4">
                                <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10">
                                        <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                                    </div>
                                    <span className="font-serif text-lg font-medium text-[#1E2A22]">
                                        Dream2Build<span className="text-[#D97A3F]">.</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close menu"
                                    className="rounded-full p-2 text-[#1E2A22]/60 hover:bg-[#1E2A22]/5"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-1 pb-2">
                                    {MEGA_MENUS.map((menu) => {
                                        const isOpen = openSection === menu.key
                                        return (
                                            <div key={menu.key} className="overflow-hidden rounded-xl">
                                                <button
                                                    onClick={() => setOpenSection(isOpen ? null : menu.key)}
                                                    aria-expanded={isOpen}
                                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                                >
                                                    <menu.icon className="h-4 w-4 text-[#2F6F4E]" />
                                                    <span className="flex-1 text-left">{menu.label}</span>
                                                    <ChevronRight className={`h-3.5 w-3.5 text-[#1E2A22]/40 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.22, ease: "easeInOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="space-y-4 py-2 pl-2">
                                                                {menu.groups.map((group) => (
                                                                    <GroupBlock
                                                                        key={group.title}
                                                                        group={group}
                                                                        onNavigate={() => setSidebarOpen(false)}
                                                                    />
                                                                ))}
                                                                {menu.seeAll && (
                                                                    <ItemLink
                                                                        href={menu.seeAll.href}
                                                                        onClick={() => setSidebarOpen(false)}
                                                                        className="mt-1 block border-t border-[#1E2A22]/10 pt-3 font-semibold text-[#2F6F4E]"
                                                                    >
                                                                        {menu.seeAll.label}
                                                                    </ItemLink>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="space-y-1 border-t border-[#1E2A22]/10 pt-2">
                                    {PLAIN_LINKS.map((link) => (
                                        <ItemLink
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className="block rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                        >
                                            {link.label}
                                        </ItemLink>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 border-t border-[#1E2A22]/10 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs uppercase tracking-wide text-[#1E2A22]/55">Theme</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full border-[#1E2A22]/15"
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                    >
                                        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                    </Button>
                                </div>
                                <Button variant="outline" className="w-full rounded-full border-[#1E2A22]/15">
                                    Log in
                                </Button>
                                <Button className="w-full rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]">
                                    Start free
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export function Navbar() {
    return (
        <>
            <DesktopRail />
            <MobileBar />
        </>
    )
}