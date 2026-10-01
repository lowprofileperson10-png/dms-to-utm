import type { Metadata } from "next"
import { Navbar } from "@/components/ui/navbar"
import { PricingSection } from "@/components/sections/pricing-section"
import { FooterSection } from "@/components/sections/footer-section"

export const metadata: Metadata = {
  title: "Planos — TopoCAD",
  description: "Compare os planos Grátis e Pro do TopoCAD.",
}

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-16">
      <Navbar />
      <PricingSection headingLevel="h1" />
      <FooterSection />
    </main>
  )
}
