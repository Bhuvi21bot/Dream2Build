import { useState } from "react"
import { Link, useLocation } from "wouter"
import { motion } from "framer-motion"
import { Moon, Sun, Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [location] = useLocation()

  const navLinks = [
    { name: "Products", path: "/products" },
    { name: "Pricing", path: "/pricing" },
    { name: "Community", path: "/community" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "About", path: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors">
            <Home className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dream2Build
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.path ? "text-primary" : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground/80 hover:text-foreground"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" className="font-medium hidden lg:inline-flex">Log In</Button>
          <Button variant="premium">Start Free</Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-foreground/80"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg p-4"
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="text-base font-medium text-foreground/80 hover:text-primary p-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between p-2 border-t border-border mt-2 pt-4">
              <span className="text-sm font-medium text-foreground/80">Theme</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="outline" className="w-full">Log In</Button>
              <Button variant="premium" className="w-full">Start Free</Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}
