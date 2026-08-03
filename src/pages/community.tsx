import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Heart, Share2, MessageSquare, GitFork } from "lucide-react"

export default function Community() {
  const posts = [
    {
      id: 1,
      user: "Sarah Jenkins",
      handle: "@sarah_designs",
      avatar: "SJ",
      time: "2h ago",
      content: "Just finalized the floor plan for our mountain cabin using the AI generator. It totally optimized the solar gain for winter! 🏔️☀️",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop",
      likes: 342,
      comments: 28,
      clones: 15
    },
    {
      id: 2,
      user: "Marcus Chen",
      handle: "@mchen_arch",
      avatar: "MC",
      time: "5h ago",
      content: "I challenged the AI to design a minimal mid-century living room with an extremely tight budget. Here's the result with the BOQ attached. Blown away. 🤯",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop",
      likes: 890,
      comments: 112,
      clones: 304
    },
    {
      id: 3,
      user: "Elena Rodriguez",
      handle: "@elena_builds",
      avatar: "ER",
      time: "1d ago",
      content: "First structural export from Dream2Build went straight to our engineers. Passed code with zero revisions needed. The future is here.",
      image: null,
      likes: 1205,
      comments: 89,
      clones: 0
    }
  ]

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Main Feed */}
        <div className="flex-1 max-w-3xl mx-auto lg:mx-0 w-full space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Builder Feed</h1>
            <p className="text-muted-foreground">See what the community is designing today.</p>
          </div>

          {/* Create Post */}
          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                  ME
                </div>
                <div className="flex-1">
                  <textarea 
                    className="w-full bg-transparent border-none outline-none resize-none min-h-[80px] text-lg placeholder:text-muted-foreground mb-4" 
                    placeholder="Share your latest design, ask a question, or post an update..."
                  />
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">Image</Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">Attach Plan</Button>
                    </div>
                    <Button variant="premium" size="sm" className="font-bold px-6">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 border border-accent/20">
                      {post.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post.user}</span>
                        <span className="text-muted-foreground text-sm">{post.handle}</span>
                        <span className="text-muted-foreground text-sm">· {post.time}</span>
                      </div>
                      <p className="mt-2 text-foreground/90 text-[15px] leading-relaxed">{post.content}</p>
                    </div>
                  </div>

                  {post.image && (
                    <div className="ml-16 rounded-xl overflow-hidden mb-4 border border-border">
                      <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-[400px] object-cover" />
                    </div>
                  )}

                  <div className="ml-16 flex items-center justify-between text-muted-foreground">
                    <div className="flex gap-6">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                        <Heart className="w-5 h-5 group-hover:fill-primary/20" /> 
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <MessageSquare className="w-5 h-5" /> 
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <GitFork className="w-5 h-5" /> 
                        <span className="text-sm font-medium">{post.clones}</span>
                      </button>
                    </div>
                    <button className="hover:text-primary transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-card">
            <CardContent className="p-6">
              <h3 className="font-bold font-display text-lg mb-4">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["#MidCentury", "#TinyHome", "#PassiveHouse", "#ModernBarn", "#CabinLife", "#DesertModern"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-muted rounded-md text-sm font-medium text-foreground/80 hover:bg-primary/20 hover:text-primary cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <h3 className="font-bold font-display text-lg mb-4">Top Designers</h3>
              <div className="space-y-4">
                {[
                  { name: "Kengo Kuma", followers: "45k" },
                  { name: "Studio Gang", followers: "32k" },
                  { name: "BIG Architects", followers: "28k" }
                ].map((designer, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                        {designer.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{designer.name}</div>
                        <div className="text-xs text-muted-foreground">{designer.followers} followers</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Follow</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
