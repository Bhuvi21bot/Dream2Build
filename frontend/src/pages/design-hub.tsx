import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Search, LayoutTemplate, Home, Building, Box, ShoppingBag, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DesignHub() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-8 lg:p-12">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">What will you build today?</h1>
            <p className="text-muted-foreground mt-2 text-lg">Design your space. Visualize the future.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/design/my-spaces">
              <Button variant="outline" className="gap-2">
                <Box className="w-4 h-4" /> My Spaces
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              👤
            </div>
          </div>
        </div>

        {/* Hero CTA - Create New */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 p-1">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-primary" /> Create New Space
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Start with a completely blank canvas or use AI to generate your dream space.
            </p>
            <Link href="/design/new">
              <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                Start Designing
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Continue Designing */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Continue Designing</h3>
              <Link href="/design/my-spaces">
                <Button variant="ghost" className="text-primary gap-1">View all <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Dummy Recent Projects */}
              {[
                { name: "Modern Villa", time: "2h ago", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop&q=60" },
                { name: "My Bedroom", time: "Yesterday", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60" },
                { name: "Startup Office", time: "Aug 24", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60" }
              ].map((project, i) => (
                <Card key={i} className="group overflow-hidden cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img src={project.img} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm">Open</Button>
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.time}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions / Marketplace */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Explore</h3>
            <div className="space-y-4">
              <Link href="/marketplace">
                <Card className="hover:border-primary/50 cursor-pointer transition-colors block">
                  <CardHeader className="p-4 flex flex-row items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Templates</CardTitle>
                      <CardDescription>Ready-made designs</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/marketplace">
                <Card className="hover:border-primary/50 cursor-pointer transition-colors block">
                  <CardHeader className="p-4 flex flex-row items-center gap-4">
                    <div className="p-3 rounded-lg bg-secondary/20 text-secondary-foreground">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Marketplace</CardTitle>
                      <CardDescription>Premium creations</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6 pt-8 border-t border-border/50">
          <h3 className="text-2xl font-semibold">Start with a category</h3>
          <div className="flex flex-wrap gap-3">
            {["Home", "Apartment", "Office", "Shop", "Restaurant", "Bedroom"].map((cat) => (
              <Button key={cat} variant="secondary" className="rounded-full px-6">
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
