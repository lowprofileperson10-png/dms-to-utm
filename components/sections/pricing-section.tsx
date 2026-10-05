import { Check } from "lucide-react"
import Link from "next/link"
import BorderGlow from "@/components/BorderGlow"

const plans = [
  {
    name: "Grátis",
    description: "Para conhecer a ferramenta e projetos ocasionais",
    price: "R$ 0",
    period: "/mês",
    features: ["3 memoriais por mês", "Exportação XLSX e DXF", "Histórico de projetos"],
    cta: "Começar grátis",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "Para quem processa memoriais todos os dias",
    price: "R$ XX",
    period: "/mês",
    features: ["Memoriais ilimitados", "Suporte prioritário", "Histórico completo"],
    cta: "Assinar Pro",
    href: "/dashboard/planos",
    highlighted: true,
  },
]

export function PricingSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel

  return (
    <section id="precos" className="px-6 py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Preços</p>
          <Heading className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Preços simples e transparentes
          </Heading>
          <p className="text-zinc-500 max-w-xl mx-auto text-balance text-lg">
            Sem taxas escondidas. Comece grátis e assine quando precisar de mais.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <BorderGlow
              key={plan.name}
              className="h-full"
              backgroundColor={plan.highlighted ? "#f4f4f5" : "#18181b"}
              borderRadius={24}
              glowRadius={36}
              glowIntensity={1.15}
              colors={plan.highlighted ? ["#f59e0b", "#fb7185", "#a78bfa"] : ["#38bdf8", "#818cf8", "#c084fc"]}
            >
            <div className="flex h-full flex-col p-8">
              {/* Plan Header */}
              <div className="mb-6">
                <h3
                  className={`font-heading text-xl font-semibold mb-2 ${
                    plan.highlighted ? "text-zinc-900" : "text-zinc-100"
                  }`}
                >
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? "text-zinc-600" : "text-zinc-500"}`}>{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`font-display text-4xl font-bold ${plan.highlighted ? "text-zinc-900" : "text-zinc-100"}`}
                >
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-zinc-600" : "text-zinc-500"}`}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? "text-zinc-900" : "text-zinc-400"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-zinc-700" : "text-zinc-400"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full py-3 px-6 text-center rounded-full font-medium text-sm transition-colors mt-auto ${
                  plan.highlighted
                    ? "bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                    : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  )
}
