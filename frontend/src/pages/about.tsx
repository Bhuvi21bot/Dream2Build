import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="relative py-24 md:py-32 overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
              We believe great architecture belongs to <span className="text-primary">everyone.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl">
              For too long, the tools to design beautiful, sustainable, and structurally sound homes have been locked behind years of training and expensive software. We're changing that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-6 text-foreground/80 text-lg leading-relaxed">
                <p>
                  Dream2Build was born out of a simple frustration: building a home is one of the most emotional, expensive, and stressful journeys a person can take. The gap between "I want a home like this" and holding a blueprint ready for construction is filled with friction.
                </p>
                <p>
                  We built an AI engine that understands architecture the way a master builder does. It doesn't just draw pretty pictures — it calculates load paths, sun angles, material costs, and local building codes.
                </p>
                <p>
                  Our goal is to give every homeowner the confidence of a seasoned architect, and every architect the speed of a supercomputer.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card p-8 rounded-3xl border border-border">
                <div className="text-4xl font-display font-bold text-primary mb-2">2023</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Founded</div>
              </div>
              <div className="bg-card p-8 rounded-3xl border border-border">
                <div className="text-4xl font-display font-bold text-primary mb-2">SF</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Headquarters</div>
              </div>
              <div className="bg-card p-8 rounded-3xl border border-border">
                <div className="text-4xl font-display font-bold text-primary mb-2">$42M</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Funding</div>
              </div>
              <div className="bg-card p-8 rounded-3xl border border-border">
                <div className="text-4xl font-display font-bold text-primary mb-2">40+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Team Members</div>
              </div>
            </div>
          </div>

          <div className="mt-32 p-12 md:p-16 bg-card border border-border rounded-[3rem] text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Join the movement.</h2>
            <p className="text-xl text-muted-foreground mb-10">
              We're always looking for brilliant engineers, architects, and designers to help us build the future of shelter.
            </p>
            <Button size="xl" variant="premium" className="rounded-xl px-10">
              View Open Roles
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
