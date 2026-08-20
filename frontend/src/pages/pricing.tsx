import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Minus, ChevronDown, Ruler } from "lucide-react"

/**
 * Pricing — "Blueprint & Paper" design system.
 * Extends the drafting-table language from the hero: dimension lines,
 * a corner title-block stamp on the recommended plan, and a hairline
 * comparison table that reads like a spec sheet rather than a generic
 * SaaS grid.
 */

function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="pr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#2F6F4E" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pr-grid)" />
    </svg>
  )
}

// A small hand-drawn-style dimension line, the kind you'd see annotating
// a floor plan — used here instead of a generic "popular" ribbon.
function DimensionTag() {
  return (
    <div className="absolute -top-5 left-8 flex items-center gap-2 rounded-full border border-[#1E2A22] bg-[#F4EFE4] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#1E2A22] shadow-[3px_3px_0_0_#1E2A22]">
      <Ruler className="h-3 w-3 text-[#D97A3F]" />
      Recommended spec
    </div>
  )
}

const TIERS = [
  {
    name: "Sketch",
    tagline: "Free",
    monthly: 0,
    annual: 0,
    desc: "For exploring a first draft before you commit to a plan.",
    features: [
      { label: "Up to 3 active projects", included: true },
      { label: "Basic AI floor planner", included: true },
      { label: "Standard-resolution renders", included: true },
      { label: "Community support", included: true },
      { label: "Live cost estimation", included: false },
      { label: "CAD & BOQ exports", included: false },
      { label: "Commercial usage rights", included: false },
    ],
    cta: "Start sketching",
    popular: false,
  },
  {
    name: "Drafting",
    tagline: "Pro",
    monthly: 29,
    annual: 23,
    desc: "For homeowners and independent designers taking a project to completion.",
    features: [
      { label: "Unlimited projects", included: true },
      { label: "Advanced interior AI", included: true },
      { label: "Live cost estimation", included: true },
      { label: "4K photorealistic renders", included: true },
      { label: "Basic climate & sun-path analysis", included: true },
      { label: "Priority support, 24h response", included: true },
      { label: "White-label client exports", included: false },
    ],
    cta: "Get Drafting",
    popular: true,
  },
  {
    name: "Studio",
    tagline: "Firm",
    monthly: 99,
    annual: 79,
    desc: "For architecture firms and builders running multiple clients at once.",
    features: [
      { label: "Everything in Drafting", included: true },
      { label: "Full CAD & BOQ exports", included: true },
      { label: "White-label client presentations", included: true },
      { label: "Advanced structural analysis", included: true },
      { label: "Team collaboration, 5 seats", included: true },
      { label: "Dedicated success manager", included: true },
      { label: "API access", included: true },
    ],
    cta: "Talk to sales",
    popular: false,
  },
]

const COMPARISON_ROWS = [
  { label: "Active projects", sketch: "3", drafting: "Unlimited", studio: "Unlimited" },
  { label: "Render resolution", sketch: "Standard", drafting: "4K photorealistic", studio: "4K photorealistic" },
  { label: "Live cost estimation", sketch: false, drafting: true, studio: true },
  { label: "Climate & sun-path analysis", sketch: false, drafting: "Basic", studio: "Advanced" },
  { label: "Structural analysis", sketch: false, drafting: false, studio: true },
  { label: "CAD & BOQ exports", sketch: false, drafting: false, studio: true },
  { label: "White-label exports", sketch: false, drafting: false, studio: true },
  { label: "Team seats", sketch: "1", drafting: "1", studio: "5" },
  { label: "API access", sketch: false, drafting: false, studio: true },
  { label: "Support", sketch: "Community", drafting: "Priority, 24h", studio: "Dedicated manager" },
]

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Yes. Move between Sketch, Drafting, and Studio whenever your project needs change — differences are prorated on your next invoice, and downgrades take effect at the end of the current billing period.",
  },
  {
    q: "What happens to my projects if I downgrade?",
    a: "Every project stays intact. If a downgrade puts you over a plan's project limit, the extra projects are kept read-only until you archive some or upgrade again.",
  },
  {
    q: "Do unused seats on Studio roll over?",
    a: "Seats are billed per active month, not banked. You can add or remove seats at any time and we'll adjust the next invoice to match.",
  },
  {
    q: "Is there a discount for students or educators?",
    a: "Yes — accredited students and studio instructors get 50% off Drafting with a verified school email. Reach out to support once you're signed up and we'll apply it.",
  },
  {
    q: "What's your refund policy?",
    a: "If Drafting or Studio isn't working out, contact us within 14 days of any charge for a full refund, no questions asked.",
  },
]

import { useSession } from "@/lib/auth-client"
import { useToast } from "@/hooks/use-toast"

function formatPrice(n: number) {
  return n === 0 ? "$0" : `$${n}`
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleCheckout = async (tierName: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your plan.",
        variant: "destructive",
      })
      return
    }

    const plan = tierName.toLowerCase() === 'drafting' ? 'pro' : tierName.toLowerCase() === 'studio' ? 'enterprise' : null;
    if (!plan) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:5000'}/api/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      
      const order = await response.json()
      if (order.error) throw new Error(order.error)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RlAeT39pT8YV7E",
        amount: order.amount,
        currency: order.currency,
        name: "Dream2Build",
        description: `Upgrade to ${tierName} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          toast({
            title: "Payment Successful",
            description: `You have successfully upgraded to the ${tierName} plan!`,
          })
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
        },
        theme: {
          color: "#2F6F4E",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      toast({
        title: "Payment Error",
        description: err.message || "Failed to initiate payment.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8F3] py-24 text-[#1E2A22]">
      <BlueprintGrid className="opacity-50" />
      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Pricing</span>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight md:text-6xl">
            Simple pricing, drafted plainly.
          </h1>
          <p className="mt-5 text-lg text-[#1E2A22]/65">
            Pick the plan that fits how you build. Upgrade, downgrade, or cancel any time — no lock-in, no fine print.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-16 flex items-center justify-center gap-4">
          <span className={`font-mono text-xs uppercase tracking-wide ${!annual ? "text-[#1E2A22]" : "text-[#1E2A22]/40"}`}>
            Monthly
          </span>
          <button
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual((a) => !a)}
            className="relative h-8 w-14 shrink-0 rounded-full border border-[#1E2A22]/20 bg-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6F4E]"
          >
            <span
              className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-[#2F6F4E] transition-transform duration-200 ${annual ? "translate-x-7" : "translate-x-1"
                }`}
            />
          </button>
          <span className={`font-mono text-xs uppercase tracking-wide ${annual ? "text-[#1E2A22]" : "text-[#1E2A22]/40"}`}>
            Annual
          </span>
          <span className="rounded-full bg-[#2F6F4E]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-[#2F6F4E]">
            Save 20%
          </span>
        </div>

        {/* Tier cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {TIERS.map((tier) => {
            const price = annual ? tier.annual : tier.monthly
            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl border bg-white p-8 ${tier.popular ? "border-[#2F6F4E] shadow-[6px_6px_0_0_#1E2A22]" : "border-[#1E2A22]/10 shadow-sm"
                  }`}
              >
                {tier.popular && <DimensionTag />}

                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl font-medium">{tier.name}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/40">{tier.tagline}</span>
                </div>
                <p className="mb-6 mt-2 min-h-[40px] text-sm text-[#1E2A22]/60">{tier.desc}</p>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-medium">{formatPrice(price)}</span>
                  {price > 0 && <span className="font-mono text-sm text-[#1E2A22]/50">/month</span>}
                </div>
                <div className="mb-8 h-4 font-mono text-xs text-[#2F6F4E]">
                  {annual && price > 0 ? `Billed annually · ${formatPrice(price * 12)}/yr` : "\u00A0"}
                </div>

                <Button
                  size="lg"
                  onClick={() => handleCheckout(tier.name)}
                  className={`mb-8 w-full rounded-full font-semibold ${tier.popular
                      ? "bg-[#D97A3F] text-white hover:bg-[#c66a30]"
                      : "border border-[#1E2A22]/20 bg-white text-[#1E2A22] hover:bg-[#FAF8F3]"
                    }`}
                >
                  {tier.cta}
                </Button>

                <div className="space-y-4">
                  <div className="font-mono text-xs uppercase tracking-wide text-[#1E2A22]/45">What's included</div>
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li
                        key={f.label}
                        className={`flex items-start gap-3 text-sm ${!f.included ? "text-[#1E2A22]/35" : ""}`}
                      >
                        {f.included ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2F6F4E]" />
                        ) : (
                          <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                        )}
                        <span>{f.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center font-mono text-xs uppercase tracking-wide text-[#1E2A22]/45">
          All plans include unlimited exports to standard file formats · No hidden fees
        </p>

        {/* Trust strip */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 border-y border-[#1E2A22]/10 py-8 text-center md:grid-cols-4">
          {[
            ["6,200+", "Studios & homeowners"],
            ["180k+", "Floor plans drafted"],
            ["42", "Countries with active teams"],
            ["4.8/5", "Average customer rating"],
          ].map(([stat, label]) => (
            <div key={label}>
              <div className="font-serif text-3xl font-medium text-[#2F6F4E]">{stat}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-[#1E2A22]/50">{label}</div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-24 max-w-5xl">
          <div className="mb-8 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Full specification</span>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Compare every line item.
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#1E2A22]/10 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E2A22]/10">
                  <th className="p-5 text-left font-mono text-xs uppercase tracking-wide text-[#1E2A22]/45">
                    Feature
                  </th>
                  {TIERS.map((t) => (
                    <th
                      key={t.name}
                      className={`p-5 text-left font-serif text-lg font-medium ${t.popular ? "bg-[#2F6F4E]/5 text-[#2F6F4E]" : ""
                        }`}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "" : "bg-[#FAF8F3]/60"}>
                    <td className="p-5 text-[#1E2A22]/75">{row.label}</td>
                    {[row.sketch, row.drafting, row.studio].map((val, idx) => (
                      <td key={TIERS[idx].name} className={`p-5 ${TIERS[idx].popular ? "bg-[#2F6F4E]/5" : ""}`}>
                        {typeof val === "boolean" ? (
                          val ? (
                            <CheckCircle2 className="h-4 w-4 text-[#2F6F4E]" />
                          ) : (
                            <Minus className="h-4 w-4 text-[#1E2A22]/25" />
                          )
                        ) : (
                          <span className="text-[#1E2A22]/85">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <div className="mb-8 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Questions</span>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              Before you sign the drawing set.
            </h2>
          </div>

          <div className="divide-y divide-[#1E2A22]/10 rounded-2xl border border-[#1E2A22]/10 bg-white">
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i
              const panelId = `faq-panel-${i}`
              const buttonId = `faq-button-${i}`
              return (
                <div key={item.q}>
                  <button
                    id={buttonId}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6F4E]"
                  >
                    <span className="font-serif text-lg font-medium">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#1E2A22]/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-6 pb-6 text-sm leading-relaxed text-[#1E2A22]/65"
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Enterprise banner */}
        <div className="mx-auto mt-24 max-w-5xl rounded-3xl border border-[#1E2A22] bg-[#1E2A22] p-10 text-[#FAF8F3] shadow-[6px_6px_0_0_#D97A3F] md:p-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#D97A3F]">Custom scope</span>
              <h3 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Running more than 5 seats?
              </h3>
              <p className="mt-3 max-w-md text-[#FAF8F3]/70">
                Firms with larger teams get volume pricing, SSO, an onboarding architect, and a contract built around
                your workflow — not ours.
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-[#D97A3F] px-8 font-semibold text-white hover:bg-[#c66a30]">
              Talk to our team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}