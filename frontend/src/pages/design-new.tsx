import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, FileImage, Image as ImageIcon, LayoutTemplate, Square, ArrowLeft } from "lucide-react";

export default function DesignNew() {
  const [, setLocation] = useLocation();

  const options = [
    {
      id: "blank",
      title: "Blank Canvas",
      description: "Start from scratch with an empty planner",
      icon: <Square className="w-8 h-8 text-primary" />,
      onClick: () => setLocation("/planner")
    },
    {
      id: "ai",
      title: "AI Generate",
      description: "Describe your dream space and let AI build it",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      onClick: () => setLocation("/ai-floor-planner")
    },
    {
      id: "blueprint",
      title: "Import Blueprint",
      description: "Convert a PDF or image of a blueprint into a 3D model",
      icon: <FileImage className="w-8 h-8 text-primary" />,
      onClick: () => setLocation("/import")
    },
    {
      id: "image",
      title: "Upload Image",
      description: "Convert an image or hand-drawn sketch",
      icon: <ImageIcon className="w-8 h-8 text-primary" />,
      onClick: () => setLocation("/import")
    },
    {
      id: "template",
      title: "Start from Template",
      description: "Use a ready-made template from our gallery",
      icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
      onClick: () => setLocation("/templates")
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-8 lg:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <Link href="/design">
          <Button variant="ghost" className="gap-2 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Button>
        </Link>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Create New Space</h1>
          <p className="text-muted-foreground mt-2 text-lg">How would you like to start your project?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {options.map((option) => (
            <Card 
              key={option.id} 
              className="cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.02] bg-card/50 backdrop-blur-sm"
              onClick={option.onClick}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/10">
                  {option.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                  <CardDescription className="text-base mt-1">{option.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
