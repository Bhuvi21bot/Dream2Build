import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Filter, Star, Download, TrendingUp } from "lucide-react"

export default function Marketplace() {
  const plans = [
    {
      id: 1,
      title: "The Glass House",
      creator: "@studiomodern",
      price: "$199",
      rating: "4.9",
      reviews: "1.2k",
      size: "4,200 sqft",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Desert Pavilion",
      creator: "@arid_arch",
      price: "$149",
      rating: "4.8",
      reviews: "850",
      size: "2,800 sqft",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Nordic Minimalist",
      creator: "@scandi_design",
      price: "$89",
      rating: "4.7",
      reviews: "2.4k",
      size: "1,850 sqft",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Urban Loft",
      creator: "@citybuilds",
      price: "$129",
      rating: "4.9",
      reviews: "3k+",
      size: "2,100 sqft",
      image: "https://images.unsplash.com/photo-1600566753086-00f18efc2291?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Coastal Retreat",
      creator: "@pacific_homes",
      price: "$249",
      rating: "5.0",
      reviews: "450",
      size: "3,500 sqft",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Eco Cabin",
      creator: "@green_living",
      price: "$59",
      rating: "4.6",
      reviews: "1.1k",
      size: "950 sqft",
      image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
    }
  ]

  return (
    <div className="w-full bg-background min-h-screen pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Marketplace</h1>
            <p className="text-xl text-muted-foreground">
              Discover thousands of premium architectural plans, interior design templates, and material bundles created by top designers worldwide.
            </p>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="mt-12 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search styles, architects, or keywords..." 
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              />
            </div>
            <Button size="xl" variant="outline" className="shrink-0 rounded-xl gap-2 font-semibold">
              <Filter className="w-5 h-5" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Trending This Week
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="font-semibold text-foreground">House Plans</Button>
            <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground">Interiors</Button>
            <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground">Furniture Packs</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer bg-card/50">
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                <img 
                  src={plan.image} 
                  alt={plan.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-lg z-20 text-foreground">
                  {plan.price}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{plan.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.creator}</p>
                <div className="flex items-center justify-between text-sm pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-primary font-bold">
                      <Star className="w-4 h-4 mr-1 fill-primary" /> {plan.rating}
                    </span>
                    <span className="text-muted-foreground font-medium">({plan.reviews})</span>
                  </div>
                  <span className="font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md text-xs">{plan.size}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" className="rounded-full px-8 font-bold">
            Load More Designs
          </Button>
        </div>
      </div>
    </div>
  )
}
