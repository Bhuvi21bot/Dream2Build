import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Box, PlusCircle, Search, MoreVertical, Copy, Edit2, Trash2, Share2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DesignMySpaces() {
  const spaces = [
    { id: 1, name: "Modern Villa", lastModified: "2 hours ago", floors: 2, rooms: 8, img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&auto=format&fit=crop&q=60" },
    { id: 2, name: "My Bedroom", lastModified: "3 days ago", floors: 1, rooms: 1, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60" },
    { id: 3, name: "Startup Office", lastModified: "Aug 24, 2023", floors: 1, rooms: 5, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-8 lg:p-12">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <Link href="/design">
          <Button variant="ghost" className="gap-2 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Spaces</h1>
            <p className="text-muted-foreground mt-2 text-lg">Your personal project dashboard.</p>
          </div>
          <Link href="/design/new">
            <Button size="lg" className="gap-2 rounded-full">
              <PlusCircle className="w-5 h-5" /> Create New
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 py-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 rounded-full bg-secondary/50" placeholder="Search spaces..." />
          </div>
          <Button variant="outline" className="rounded-full">All ▼</Button>
        </div>

        {spaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-secondary/20">
            <Box className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No spaces yet</h3>
            <p className="text-muted-foreground mt-2 mb-6 max-w-md">You haven't created any spaces. Start by creating a new blank canvas or use a template.</p>
            <Link href="/design/new">
              <Button>Create your first space</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card key={space.id} className="overflow-hidden group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img src={space.img} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Edit2 className="w-4 h-4 mr-2" /> Rename</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem><Share2 className="w-4 h-4 mr-2" /> Share</DropdownMenuItem>
                        <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Export</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-2 left-2 flex gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded backdrop-blur-sm">2D</span>
                    <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded backdrop-blur-sm">3D</span>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{space.name}</CardTitle>
                  <CardDescription>Updated {space.lastModified}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{space.floors} {space.floors === 1 ? 'Floor' : 'Floors'}</span>
                    <span>•</span>
                    <span>{space.rooms} {space.rooms === 1 ? 'Room' : 'Rooms'}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50">
                  <Link href={`/planner`} className="w-full">
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Open Project
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
