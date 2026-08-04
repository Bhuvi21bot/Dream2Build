import { useEffect, useState } from "react"
import { Link, useLocation } from "wouter"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Home as HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

/**
 * Floating "drafting pin" navbar — Blueprint & Paper design system.
 * - Pill-shaped, glassy, sits a fixed distance from the top like a pinned
 *   ruler on a drawing board, gains a soft shadow once you've scrolled.
 * - Active route gets a small green dot (layoutId animated, like a pin
 *   sliding along a ruler) instead of a color change alone.
 * - Same paper/ink/green/clay tokens as the rest of the site.
 */

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Pricing", path: "/pricing" },
  { name: "Community", path: "/community" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "About", path: "/about" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [location] = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-1/2 top-4 z-50 w-[94%] max-w-5xl -translate-x-1/2 sm:top-5"
      >
        <div
          className={`flex items-center justify-between gap-4 rounded-full border border-[#1E2A22]/10 bg-[#FAF8F3]/75 px-4 py-2.5 backdrop-blur-xl transition-shadow duration-300 sm:px-5 ${scrolled ? "shadow-[0_8px_28px_-8px_rgba(30,42,34,0.25)]" : "shadow-[0_2px_10px_-4px_rgba(30,42,34,0.12)]"
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

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = location === link.path
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${active ? "text-[#1E2A22]" : "text-[#1E2A22]/55 hover:text-[#1E2A22]"
                    }`}
                >
                  {link.name}
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D97A3F]"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
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
            <Button variant="ghost" className="rounded-full font-medium text-[#1E2A22]/75 hover:text-[#1E2A22]">
              Log in
            </Button>
            <Button className="rounded-full bg-[#D97A3F] px-5 text-white hover:bg-[#c66a30]">
              Start free
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-full p-2 text-[#1E2A22]/75 md:hidden"
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-[4.75rem] z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-3xl border border-[#1E2A22]/10 bg-[#FAF8F3]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = location === link.path
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-xl px-3 py-2.5 font-mono text-sm uppercase tracking-wide ${active ? "bg-[#2F6F4E]/10 text-[#1E2A22]" : "text-[#1E2A22]/65"
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-3 flex items-center justify-between border-t border-[#1E2A22]/10 p-2 pt-4">
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

            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" className="w-full rounded-full border-[#1E2A22]/15">
                Log in
              </Button>
              <Button className="w-full rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]">
                Start free
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}