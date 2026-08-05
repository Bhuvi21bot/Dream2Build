import { useEffect, useState } from "react"
import { Link, useLocation } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import {
    Moon, Sun, Menu, X, Home as HomeIcon, ChevronRight, Globe,
    Hammer, Sofa, ChefHat, Bath, Trees, Flower2, Briefcase, Warehouse,
    GraduationCap, BookOpen, HelpCircle, Video, Swords,
    Store, Users, Images, Building2, Plug, Handshake, School, ScanLine,
    Sparkles, Layers3, Wand2, PencilRuler, Apple, Smartphone, Monitor,
    Laptop, Glasses, Baby, RectangleHorizontal, Ruler, Boxes, Calculator,
    LayoutGrid, UserSearch, Award, DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

/**
 * Navbar — "Blueprint & Paper" design system.
 *
 * VERTICAL, LEFT-DOCKED SIDEBAR.
 * - Fixed to the left edge of the viewport, full height.
 * - Top-level items (Products, Use cases, Resources, Enterprise, Design
 *   Battle, Pricing) are stacked vertically.
 * - Clicking a top-level item with sub-items opens a flyout panel that
 *   slides out to the RIGHT of the sidebar (still left-anchored — its own
 *   left edge is fixed at the sidebar's right edge, same idea as before,
 *   just rotated 90° into the vertical layout).
 * - Collapsible to icon-only rail on desktop; becomes an off-canvas drawer
 *   on mobile.
 *
 * IMPORTANT: this component must actually be rendered inside your page
 * (e.g. <Navbar /> at the top of home.tsx's return). Also render
 * <NavbarSpacer /> as a sibling right after it (or add the exported
 * SIDEBAR_WIDTH as left padding/margin on your main content) so page
 * content doesn't sit underneath the fixed sidebar.
 */

type Item = { title: string; href: string; icon: React.ComponentType<{ className?: string }>; isNew?: boolean }
type Group = { title?: string; items: Item[] }

const PRODUCTS_GROUPS: Group[] = [
    {
        title: "Products", items: [
            { title: "AI Studio", href: "/products/ai-studio", icon: Sparkles, isNew: true },
            { title: "Interior Design Software", href: "/products/interior-design", icon: Sofa },
            { title: "Planner 5D Pro", href: "/products/pro", icon: Wand2, isNew: true },
            { title: "AI Interior Design Tools", href: "/products/ai-tools", icon: Layers3 },
            { title: "Collaboration tool", href: "/products/collaboration", icon: Users, isNew: true },
            { title: "Mood Boards", href: "/products/mood-boards", icon: LayoutGrid },
            { title: "360 Walkthrough", href: "/products/walkthrough", icon: Glasses },
            { title: "AI Floor Plan Converter", href: "/products/floor-plan-converter", icon: PencilRuler },
            { title: "Hire a Designer", href: "/products/hire-a-designer", icon: UserSearch, isNew: true },
            { title: "Import 3D Models", href: "/products/import-3d", icon: Boxes },
        ]
    },
    {
        title: "Platforms", items: [
            { title: "iOS", href: "/platforms/ios", icon: Apple },
            { title: "Android", href: "/platforms/android", icon: Smartphone },
            { title: "Windows", href: "/platforms/windows", icon: Monitor },
            { title: "macOS", href: "/platforms/macos", icon: Laptop },
            { title: "VisionOS", href: "/platforms/visionos", icon: Glasses },
        ]
    },
]

const USE_CASE_GROUPS: Group[] = [
    {
        title: "House", items: [
            { title: "Home Design", href: "/use-cases/home-design", icon: HomeIcon },
            { title: "Home Remodeling", href: "/use-cases/home-remodeling", icon: Hammer },
        ]
    },
    {
        title: "Floor plan", items: [
            { title: "Floor Plan Creator", href: "/use-cases/floor-plan-creator", icon: PencilRuler },
            { title: "2D Floor Plan", href: "/use-cases/2d-floor-plan", icon: RectangleHorizontal },
            { title: "3D Floor Plan", href: "/use-cases/3d-floor-plan", icon: Boxes },
            { title: "Real Estate Floor Plan", href: "/use-cases/real-estate", icon: Building2 },
        ]
    },
    {
        title: "Kitchen", items: [
            { title: "Kitchen Planner", href: "/use-cases/kitchen", icon: ChefHat },
        ]
    },
    {
        title: "Bathroom", items: [
            { title: "Bathroom Planner", href: "/use-cases/bathroom", icon: Bath },
            { title: "Bathroom Remodeling", href: "/use-cases/bathroom-remodeling", icon: Hammer },
        ]
    },
    {
        title: "Room", items: [
            { title: "Room Planner", href: "/use-cases/room-planner", icon: Sofa },
            { title: "AI Room Design", href: "/use-cases/ai-room-design", icon: Sparkles },
            { title: "Kids Room Layout", href: "/use-cases/kids-room", icon: Baby },
        ]
    },
    {
        title: "Exterior", items: [
            { title: "Landscape Design Software", href: "/use-cases/landscape", icon: Trees },
            { title: "Deck Design", href: "/use-cases/deck", icon: Warehouse },
            { title: "Garden Planner", href: "/use-cases/garden", icon: Flower2 },
            { title: "Garage Planner", href: "/use-cases/garage", icon: Warehouse },
        ]
    },
    {
        title: "Architecture", items: [
            { title: "Architecture Design Software", href: "/use-cases/architecture", icon: Building2 },
            { title: "Blueprint Maker", href: "/use-cases/blueprint-maker", icon: Ruler },
        ]
    },
    {
        title: "Office", items: [
            { title: "Office Planner", href: "/use-cases/office-planner", icon: Briefcase },
            { title: "Home Office Design", href: "/use-cases/home-office", icon: Briefcase },
        ]
    },
]

const RESOURCE_GROUPS: Group[] = [
    {
        title: "Learn", items: [
            { title: "Online Interior Design School", href: "/resources/academy", icon: GraduationCap },
            { title: "Interior Design Blog", href: "/resources/blog", icon: BookOpen },
            { title: "Design Battle", href: "/resources/design-battle", icon: Swords },
            { title: "Webinars", href: "/resources/webinars", icon: Video, isNew: true },
            { title: "Help Center", href: "/resources/help", icon: HelpCircle },
        ]
    },
    {
        title: "Explore", items: [
            { title: "Hire an Interior Designer", href: "/resources/hire-a-designer", icon: Users },
            { title: "Top Interior Designers", href: "/resources/top-designers", icon: Award },
            { title: "Floor Plans Gallery", href: "/resources/gallery", icon: Images },
            { title: "Furniture Shop", href: "/resources/furniture-shop", icon: Store },
            { title: "Home Repair Estimator", href: "/resources/repair-estimator", icon: Calculator },
            { title: "Home Plans", href: "/resources/home-plans", icon: HomeIcon },
        ]
    },
]

const ENTERPRISE_GROUPS: Group[] = [
    {
        items: [
            { title: "Enterprise Solutions", href: "/enterprise", icon: Building2 },
            { title: "3D Product Configurator", href: "/enterprise/3d-configurator", icon: Boxes },
            { title: "Solutions for Schools", href: "/enterprise/schools", icon: School },
            { title: "Partner Program", href: "/enterprise/partners", icon: Handshake },
            { title: "API Integration", href: "/enterprise/api", icon: Plug, isNew: true },
            { title: "Property Scan", href: "/enterprise/property-scan", icon: ScanLine },
        ]
    },
]

const MENUS = [
    { key: "products", label: "Products", groups: PRODUCTS_GROUPS, seeAll: undefined },
    { key: "use-cases", label: "Use cases", groups: USE_CASE_GROUPS, seeAll: "/use-cases" },
    { key: "resources", label: "Resources", groups: RESOURCE_GROUPS, seeAll: undefined },
    { key: "enterprise", label: "Enterprise", groups: ENTERPRISE_GROUPS, seeAll: undefined },
] as const

const SIMPLE_LINKS = [
    { label: "Design Battle", href: "/design-battle", icon: Swords },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
] as const

/** Width the fixed sidebar occupies — export it so pages can offset content. */
export const SIDEBAR_WIDTH = 248 // px, expanded
export const SIDEBAR_RAIL_WIDTH = 72 // px, collapsed rail

/* ---------- shared row/group primitives ---------- */

function NewBadge() {
    return (
        <span className="ml-auto shrink-0 rounded-full bg-[#2F6F4E] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-wide text-white">
            New
        </span>
    )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-3 pb-1 pt-1 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/35">
            {children}
        </div>
    )
}

function MenuRow({ item, onClick }: { item: Item; onClick?: () => void }) {
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#1E2A22]/75 transition-colors hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
        >
            <item.icon className="h-4 w-4 shrink-0 text-[#1E2A22]/40 transition-colors group-hover:text-[#2F6F4E]" />
            <span className="flex-1 whitespace-nowrap">{item.title}</span>
            {item.isNew && <NewBadge />}
        </Link>
    )
}

/** Flyout panel: columns laid out left-to-right, anchored to the sidebar's right edge. */
function Flyout({
    groups,
    seeAll,
    left,
    onNavigate,
}: {
    groups: Group[]
    seeAll?: string
    left: number
    onNavigate: () => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ left }}
            className="fixed top-4 bottom-4 z-40 flex items-start"
        >
            <div className="flex max-h-full gap-8 overflow-y-auto rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-6 shadow-2xl">
                {groups.map((g, gi) => (
                    <div key={g.title ?? gi} className="w-52 shrink-0">
                        {g.title && <GroupLabel>{g.title}</GroupLabel>}
                        <div className="space-y-0.5">
                            {g.items.map((item) => (
                                <MenuRow key={item.href} item={item} onClick={onNavigate} />
                            ))}
                        </div>
                    </div>
                ))}
                {seeAll && (
                    <div className="flex w-40 shrink-0 items-end pb-2">
                        <Link
                            href={seeAll}
                            onClick={onNavigate}
                            className="font-semibold text-[#2F6F4E] hover:underline"
                        >
                            See all solutions
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
    const { theme, setTheme } = useTheme()
    const [location] = useLocation()

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [mobileOpen])

    const activeMenuData = MENUS.find((m) => m.key === activeMenu)
    const railWidth = collapsed ? SIDEBAR_RAIL_WIDTH : SIDEBAR_WIDTH

    return (
        <>
            {/* Click-away layer for the flyout */}
            {activeMenu && (
                <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
            )}

            {/* DESKTOP: vertical sidebar, fixed to the LEFT edge, full height */}
            <motion.aside
                initial={{ x: -32, opacity: 0 }}
                animate={{ x: 0, opacity: 1, width: railWidth }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                onMouseLeave={() => setActiveMenu(null)}
                className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-[#1E2A22]/10 bg-[#FAF8F3]/95 backdrop-blur-xl md:flex"
            >
                {/* Logo / collapse toggle */}
                <div className="flex items-center justify-between gap-2 border-b border-[#1E2A22]/10 px-4 py-4">
                    <Link href="/" className="group flex min-w-0 items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10 transition-colors group-hover:bg-[#2F6F4E]/20">
                            <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                        </div>
                        {!collapsed && (
                            <span className="truncate font-serif text-lg font-medium tracking-tight text-[#1E2A22]">
                                Dream2Build<span className="text-[#D97A3F]">.</span>
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setCollapsed((c) => !c)}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="shrink-0 rounded-full p-1.5 text-[#1E2A22]/50 transition-colors hover:bg-[#1E2A22]/5 hover:text-[#1E2A22]"
                    >
                        <ChevronRight className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`} />
                    </button>
                </div>

                {/* Primary nav — vertical stack */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    <Link
                        href="/products"
                        onMouseEnter={() => setActiveMenu(null)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${location === "/products" ? "bg-[#2F6F4E]/10 text-[#1E2A22]" : "text-[#1E2A22]/55 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"}`}
                    />
                    {MENUS.map((menu) => (
                        <button
                            key={menu.key}
                            onMouseEnter={() => setActiveMenu(menu.key)}
                            onClick={() => setActiveMenu(activeMenu === menu.key ? null : menu.key)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${activeMenu === menu.key ? "bg-[#2F6F4E]/10 text-[#1E2A22]" : "text-[#1E2A22]/55 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
                                }`}
                        >
                            <Layers3 className="h-4 w-4 shrink-0 opacity-0" aria-hidden />
                            {!collapsed && <span className="flex-1 text-left">{menu.label}</span>}
                            {!collapsed && <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${activeMenu === menu.key ? "rotate-90" : ""}`} />}
                        </button>
                    ))}

                    <div className="my-2 border-t border-[#1E2A22]/10" />

                    {SIMPLE_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide transition-colors ${location === link.href ? "bg-[#2F6F4E]/10 text-[#1E2A22]" : "text-[#1E2A22]/55 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
                                }`}
                        >
                            <link.icon className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{link.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Footer actions */}
                <div className="space-y-2 border-t border-[#1E2A22]/10 p-3">
                    <div className={`flex items-center gap-1.5 ${collapsed ? "flex-col" : "justify-between"}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[#1E2A22]/70 hover:bg-[#1E2A22]/5 hover:text-[#1E2A22]">
                            <Globe className="h-[1.1rem] w-[1.1rem]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="relative h-9 w-9 rounded-full text-[#1E2A22]/70 hover:bg-[#1E2A22]/5 hover:text-[#1E2A22]"
                        >
                            <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                    {!collapsed && (
                        <>
                            <Button variant="outline" className="w-full rounded-full border-[#1E2A22]/15 font-medium text-[#1E2A22]/75 hover:text-[#1E2A22]">
                                Sign in
                            </Button>
                            <Button className="w-full rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]">
                                Start free
                            </Button>
                        </>
                    )}
                </div>
            </motion.aside>

            {/* Flyout panel for whichever top-level item is active */}
            <AnimatePresence>
                {activeMenuData && (
                    <Flyout
                        groups={activeMenuData.groups}
                        seeAll={activeMenuData.seeAll}
                        left={railWidth + 12}
                        onNavigate={() => setActiveMenu(null)}
                    />
                )}
            </AnimatePresence>

            {/* MOBILE: top bar with hamburger, opens off-canvas drawer from the left */}
            <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[#1E2A22]/10 bg-[#FAF8F3]/95 px-4 py-3 backdrop-blur-xl md:hidden">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10">
                        <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                    </div>
                    <span className="font-serif text-lg font-medium tracking-tight text-[#1E2A22]">
                        Dream2Build<span className="text-[#D97A3F]">.</span>
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="rounded-full p-2 text-[#1E2A22]/75 transition-colors hover:bg-[#1E2A22]/5"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-[60] bg-[#1E2A22]/40 backdrop-blur-sm md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed left-0 top-0 z-[70] flex h-full w-[88%] max-w-sm flex-col border-r border-[#1E2A22]/10 bg-[#FAF8F3] shadow-2xl md:hidden"
                        >
                            <div className="flex items-center justify-between border-b border-[#1E2A22]/10 p-4">
                                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10">
                                        <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                                    </div>
                                    <span className="font-serif text-lg font-medium text-[#1E2A22]">
                                        Dream2Build<span className="text-[#D97A3F]">.</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    aria-label="Close menu"
                                    className="rounded-full p-2 text-[#1E2A22]/60 transition-colors hover:bg-[#1E2A22]/5"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mb-2 space-y-1">
                                    {SIMPLE_LINKS.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                        >
                                            <link.icon className="h-4 w-4" />
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="space-y-1 border-t border-[#1E2A22]/10 pt-2">
                                    {MENUS.map((menu) => {
                                        const isOpen = openMobileSection === menu.key
                                        return (
                                            <div key={menu.key} className="overflow-hidden rounded-xl">
                                                <button
                                                    onClick={() => setOpenMobileSection(isOpen ? null : menu.key)}
                                                    aria-expanded={isOpen}
                                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                                >
                                                    {menu.label}
                                                    <ChevronRight className={`h-4 w-4 text-[#1E2A22]/40 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="space-y-3 pb-2 pl-1">
                                                                {menu.groups.map((g, gi) => (
                                                                    <div key={g.title ?? gi}>
                                                                        {g.title && <GroupLabel>{g.title}</GroupLabel>}
                                                                        {g.items.map((item) => (
                                                                            <MenuRow key={item.href} item={item} onClick={() => setMobileOpen(false)} />
                                                                        ))}
                                                                    </div>
                                                                ))}
                                                                {menu.seeAll && (
                                                                    <Link
                                                                        href={menu.seeAll}
                                                                        onClick={() => setMobileOpen(false)}
                                                                        className="mx-3 mt-1 block border-t border-[#1E2A22]/10 pt-3 font-semibold text-[#2F6F4E]"
                                                                    >
                                                                        See all {menu.label.toLowerCase()}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
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
                                    Sign in
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