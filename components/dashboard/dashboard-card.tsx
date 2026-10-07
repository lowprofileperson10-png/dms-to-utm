import type { ReactNode } from "react"
import BorderGlow from "@/components/BorderGlow"

export type DashboardCardProps = {
  children: ReactNode
  className?: string
  backgroundColor?: string
  borderRadius?: number
  glowIntensity?: number
}

export function DashboardCard({
  children,
  className = "w-full",
  backgroundColor = "#18181b",
  borderRadius = 20,
  glowIntensity = 1.05,
}: DashboardCardProps) {
  return (
    <BorderGlow
      className={className}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      glowRadius={28}
      glowIntensity={glowIntensity}
      colors={["#38bdf8", "#818cf8", "#c084fc"]}
      fillOpacity={0.24}
    >
      {children}
    </BorderGlow>
  )
}
