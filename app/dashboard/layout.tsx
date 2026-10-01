import type React from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell/app-shell"
import { isAdmin } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()

  return (
    <AppShell
      variant="dashboard"
      topbarExtra={
        admin ? (
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            Painel admin
          </Link>
        ) : null
      }
    >
      {children}
    </AppShell>
  )
}
