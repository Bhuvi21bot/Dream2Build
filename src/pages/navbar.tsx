import { useEffect, useState } from "react"
import { Link, useLocation } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import {
    Moon, Sun, Menu, X, Home as HomeIcon, ChevronDown,
    Hammer, Sofa, ChefHat, Bath, Trees, Flower2, Briefcase,
    GraduationCap, BookOpen, HelpCircle, Video, MessageSquare,
    Store, Users, Images, Building2, Plug, Handshake, School,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
    NavigationMenu, NavigationMenuList, NavigationMenuItem,
    NavigationMenuTrigger, NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import { home } from "@/components/home.tsx"
/**
 * Navbar — "Blueprint & Paper" design system.
 *
 * Two menu mechanisms, both vertical (no Planner5D-style horizontal grids):
 *  1. Per-item dropdowns — "Use Cases" / "Resources" / "Enterprise" each open
 *     a narrow, single-column panel directly under the trigger (Radix
 *     NavigationMenu, viewport={false} so each item positions its own panel
 *     instead of sharing one full-width bar).
 *  2. A persistent hamburger — opens a full off-canvas sidebar containing
 *     everything, available on every breakpoint (not just mobile), since
 *     that's occasionally faster than hunting through three separate
 *     dropdowns.
 *
 * "Products" stays a plain link to /products — no dropdown, per direction.
 */

type Item = { title: string; href: string; icon: React.ComponentType<{ className?: string }>; isNew?: boolean }
type Group = { title?: string; items: Item[] }

const USE_CASE_GROUPS: Group[] = [
    {
        title: "House", items: [
            { title: "Home design", href: "/use-cases/home-design", icon: HomeIcon },
            { title: "Home remodeling", href: "/use-cases/home-remodeling", icon: Hammer },
        ]
    },
    {
        title: "Room", items: [
            { title: "Room planner", href: "/use-cases/room-planner", icon: Sofa },
        ]
    },
    {
        title: "Kitchen", items: [
            { title: "Kitchen planner", href: "/use-cases/kitchen", icon: ChefHat },
        ]
    },
    {
        title: "Bathroom", items: [
            { title: "Bathroom planner", href: "/use-cases/bathroom", icon: Bath },
        ]
    },
    {
        title: "Exterior", items: [
            { title: "Landscape design", href: "/use-cases/landscape", icon: Trees },
            { title: "Garden planner", href: "/use-cases/garden", icon: Flower2 },
        ]
    },
    {
        title: "Office", items: [
            { title: "Home office design", href: "/use-cases/home-office", icon: Briefcase },
        ]
    },
]

const RESOURCE_GROUPS: Group[] = [
    {
        title: "Learn", items: [
            { title: "Design academy", href: "/resources/academy", icon: GraduationCap, isNew: true },
            { title: "Blueprint blog", href: "/resources/blog", icon: BookOpen },
            { title: "Help center", href: "/resources/help", icon: HelpCircle },
            { title: "Webinars", href: "/resources/webinars", icon: Video, isNew: true },
        ]
    },
    {
        title: "Explore", items: [
            { title: "Community feed", href: "/community", icon: MessageSquare },
            { title: "Marketplace", href: "/marketplace", icon: Store },
            { title: "Hire a designer", href: "/resources/hire-a-designer", icon: Users },
            { title: "Floor plan gallery", href: "/resources/gallery", icon: Images },
        ]
    },
]

const ENTERPRISE_GROUPS: Group[] = [
    {
        items: [
            { title: "Enterprise solutions", href: "/enterprise", icon: Building2 },
            { title: "API access", href: "/enterprise/api", icon: Plug, isNew: true },
            { title: "Partner program", href: "/enterprise/partners", icon: Handshake },
            { title: "Solutions for firms & schools", href: "/enterprise/schools", icon: School },
        ]
    },
]

const MENUS = [
    { key: "use-cases", label: "Use cases", groups: USE_CASE_GROUPS, seeAll: "/use-cases" },
    { key: "resources", label: "Resources", groups: RESOURCE_GROUPS, seeAll: undefined },
    { key: "enterprise", label: "Enterprise", groups: ENTERPRISE_GROUPS, seeAll: undefined },
] as const

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
        <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-[#1E2A22]/35 first:pt-1">
            {children}
        </div>
    )
}

function MenuRow({ item, onClick }: { item: Item; onClick?: () => void }) {
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1E2A22]/75 transition-colors hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22]"
        >
            <item.icon className="h-4 w-4 shrink-0 text-[#1E2A22]/40 transition-colors group-hover:text-[#2F6F4E]" />
            <span className="flex-1">{item.title}</span>
            {item.isNew && <NewBadge />}
        </Link>
    )
}

function VerticalGroups({ groups, onNavigate }: { groups: Group[]; onNavigate?: () => void }) {
    return (
        <>
            {groups.map((g, gi) => (
                <div key={g.title ?? gi}>
                    {g.title && <GroupLabel>{g.title}</GroupLabel>}
                    {g.items.map((item) => (
                        <MenuRow key={item.href} item={item} onClick={onNavigate} />
                    ))}
                </div>
            ))}
        </>
    )
}

export function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [openSection, setOpenSection] = useState<string | null>("use-cases")
    const [scrolled, setScrolled] = useState(false)
    const { theme, setTheme } = useTheme()
    const [location] = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24)
        onScroll()
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Lock body scroll while the off-canvas sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [sidebarOpen])

    return (
        <>
            <motion.header
                initial={{ y: -32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed left-1/2 top-4 z-50 w-[94%] max-w-6xl -translate-x-1/2 sm:top-5"
            >
                <div
                    className={`flex items-center justify-between gap-3 rounded-full border border-[#1E2A22]/10 bg-[#FAF8F3]/75 px-4 py-2.5 backdrop-blur-xl transition-shadow duration-300 sm:px-5 ${scrolled ? "shadow-[0_8px_28px_-8px_rgba(30,42,34,0.25)]" : "shadow-[0_2px_10px_-4px_rgba(30,42,34,0.12)]"
                        }`}
                >
                    {/* Logo */}
                    <Link href="/" className="group flex shrink-0 items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2F6F4E]/30 bg-[#2F6F4E]/10 transition-colors group-hover:bg-[#2F6F4E]/20">
                            <HomeIcon className="h-4 w-4 text-[#2F6F4E]" />
                        </div>
                        <span className="font-serif text-lg font-medium tracking-tight text-[#1E2A22]">
                            Dream2Build<span className="text-[#D97A3F]">.</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <NavigationMenu viewport={false} className="hidden max-w-none flex-1 justify-center md:flex">
                        <NavigationMenuList className="gap-1">
                            <NavigationMenuItem>
                                <Link
                                    href="/products"
                                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${location === "/products" ? "text-[#1E2A22]" : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                                        }`}
                                >
                                    Products
                                </Link>
                            </NavigationMenuItem>

                            {MENUS.map((menu) => (
                                <NavigationMenuItem key={menu.key}>
                                    <NavigationMenuTrigger className="rounded-full bg-transparent px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22]/55 hover:bg-[#2F6F4E]/8 hover:text-[#1E2A22] data-[state=open]:bg-[#2F6F4E]/8 data-[state=open]:text-[#1E2A22]">
                                        {menu.label}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="rounded-2xl border border-[#1E2A22]/10 bg-[#FAF8F3] p-2 shadow-2xl data-[motion=from-end]:slide-in-from-right-8 data-[motion=from-start]:slide-in-from-left-8">
                                        <div className="w-[280px]">
                                            <div className="max-h-[65vh] overflow-y-auto">
                                                <VerticalGroups groups={menu.groups} />
                                            </div>
                                            {menu.seeAll && (
                                                <Link
                                                    href={menu.seeAll}
                                                    className="mt-1 flex items-center justify-between rounded-xl border-t border-[#1E2A22]/10 px-3 pt-3 font-semibold text-[#2F6F4E]"
                                                >
                                                    See all {menu.label.toLowerCase()}
                                                </Link>
                                            )}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}

                            <NavigationMenuItem>
                                <Link
                                    href="/pricing"
                                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${location === "/pricing" ? "text-[#1E2A22]" : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                                        }`}
                                >
                                    Pricing
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right actions */}
                    <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="relative hidden h-9 w-9 rounded-full text-[#1E2A22]/70 hover:bg-[#1E2A22]/5 hover:text-[#1E2A22] sm:inline-flex"
                        >
                            <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Button variant="ghost" className="hidden rounded-full font-medium text-[#1E2A22]/75 hover:text-[#1E2A22] lg:inline-flex">
                            Log in
                        </Button>
                        <Button className="hidden rounded-full bg-[#D97A3F] px-5 text-white hover:bg-[#c66a30] sm:inline-flex">
                            Start free
                        </Button>

                        {/* Persistent hamburger — opens the full sidebar on every breakpoint */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                            className="rounded-full p-2 text-[#1E2A22]/75 transition-colors hover:bg-[#1E2A22]/5"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Full off-canvas sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-[60] bg-[#1E2A22]/40 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed right-0 top-0 z-[70] flex h-full w-[88%] max-w-sm flex-col border-l border-[#1E2A22]/10 bg-[#FAF8F3] shadow-2xl"
                        >
                            {/* Sidebar header */}
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
                                    className="rounded-full p-2 text-[#1E2A22]/60 transition-colors hover:bg-[#1E2A22]/5"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Sidebar body — fully vertical: top-level links, then accordioned groups */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mb-2 space-y-1">
                                    <Link
                                        href="/products"
                                        onClick={() => setSidebarOpen(false)}
                                        className="block rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        onClick={() => setSidebarOpen(false)}
                                        className="block rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                    >
                                        Pricing
                                    </Link>
                                </div>

                                <div className="space-y-1 border-t border-[#1E2A22]/10 pt-2">
                                    {MENUS.map((menu) => {
                                        const isOpen = openSection === menu.key
                                        return (
                                            <div key={menu.key} className="overflow-hidden rounded-xl">
                                                <button
                                                    onClick={() => setOpenSection(isOpen ? null : menu.key)}
                                                    aria-expanded={isOpen}
                                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 font-mono text-xs uppercase tracking-wide text-[#1E2A22] hover:bg-[#2F6F4E]/8"
                                                >
                                                    {menu.label}
                                                    <ChevronDown className={`h-4 w-4 text-[#1E2A22]/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
                                                            <div className="pb-2 pl-1">
                                                                <VerticalGroups groups={menu.groups} onNavigate={() => setSidebarOpen(false)} />
                                                                {menu.seeAll && (
                                                                    <Link
                                                                        href={menu.seeAll}
                                                                        onClick={() => setSidebarOpen(false)}
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

                            {/* Sidebar footer */}
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