import type { Metadata } from "next"
import { PricingSection } from "@/components/sections/pricing-section"

export const metadata: Metadata = {
  title: "Planos — TopoCAD",
  description: "Compare os planos Grátis e Pro do TopoCAD.",
}

export default function DashboardPlanosPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">Conta</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-zinc-100">Planos</h1>
        <p className="mt-2 text-sm text-zinc-500">Escolha o plano ideal para processar seus memoriais.</p>
      </div>
      <PricingSection />
    </div>
  )
}
