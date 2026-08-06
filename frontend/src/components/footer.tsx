import { Link } from "wouter"
import { Home, Twitter, Github, Linkedin, Instagram } from "lucide-react"


export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <Home className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dream2Build
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The intelligent architect that lives in your browser. Design, plan, and estimate your dream home with the power of AI.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display text-lg">Product</h4>
          <ul className="space-y-3">
            <li><Link href="/products" className="text-muted-foreground hover:text-primary text-sm transition-colors">AI Floor Planner</Link></li>
            <li><Link href="/products" className="text-muted-foreground hover:text-primary text-sm transition-colors">Interior Designer</Link></li>
            <li><Link href="/products" className="text-muted-foreground hover:text-primary text-sm transition-colors">Cost Estimator</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display text-lg">Resources</h4>
          <ul className="space-y-3">
            <li><Link href="/community" className="text-muted-foreground hover:text-primary text-sm transition-colors">Community</Link></li>
            <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary text-sm transition-colors">Marketplace</Link></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Documentation</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 font-display text-lg">Company</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Careers</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Dream2Build. All rights reserved.</p>
        <p className="mt-4 md:mt-0 flex items-center gap-1">
          Made with love by <span className="text-primary">♥</span> in Noida
        </p>
      </div>
    </footer>
  )
}
