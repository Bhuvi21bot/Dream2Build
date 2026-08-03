import { Button } from "@/components/ui/button"
import { CheckCircle2, X } from "lucide-react"

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for exploring ideas and simple projects.",
      features: [
        "Up to 3 projects",
        "Basic AI Floor Planner",
        "Standard resolution renders",
        "Community support"
      ],
      notIncluded: [
        "Cost estimation",
        "CAD exports",
        "Commercial rights"
      ],
      cta: "Start Free",
      variant: "outline"
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      desc: "For serious homeowners and independent designers.",
      features: [
        "Unlimited projects",
        "Advanced Interior AI",
        "Live cost estimation",
        "4K photorealistic renders",
        "Basic climate analysis",
        "Priority support"
      ],
      notIncluded: [
        "White-label exports",
        "API access"
      ],
      cta: "Get Pro",
      variant: "premium",
      popular: true
    },
    {
      name: "Studio",
      price: "$99",
      period: "/month",
      desc: "For architecture firms and home builders.",
      features: [
        "Everything in Pro",
        "Full CAD & BOQ exports",
        "White-label client presentations",
        "Advanced structural analysis",
        "Team collaboration (5 seats)",
        "Dedicated success manager"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      variant: "outline"
    }
  ]

  return (
    <div className="w-full">
      <div className="bg-background py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            {tiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`relative rounded-3xl p-8 border ${
                  tier.popular 
                    ? 'border-primary shadow-2xl shadow-primary/20 bg-card' 
                    : 'border-border bg-card/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">{tier.desc}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground font-medium">{tier.period}</span>}
                </div>
                
                <Button variant={tier.variant as any} className="w-full mb-8 font-bold" size="lg">
                  {tier.cta}
                </Button>
                
                <div className="space-y-4">
                  <div className="font-semibold text-sm">What's included:</div>
                  <ul className="space-y-3">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {tier.notIncluded.length > 0 && (
                    <>
                      <div className="font-semibold text-sm pt-4 text-muted-foreground">Not included:</div>
                      <ul className="space-y-3">
                        {tier.notIncluded.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <X className="w-5 h-5 opacity-50 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
