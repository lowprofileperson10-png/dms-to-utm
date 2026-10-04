import type React from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell/app-shell"
import { isAdmin } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin()

  return (
    <AppShell
      variant="dashboard"
      sidebarFooter={
        admin ? (
          <Link href="/admin" className="flex items-center justify-center rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100">
            Seção administrativa
          </Link>
        ) : null
      }
      topbarExtra={null}
    >
      {children}
    </AppShell>
  )
}
