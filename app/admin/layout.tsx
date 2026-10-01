import type React from "react"

export const dynamic = "force-dynamic"

import { AppShell } from "@/components/app-shell/app-shell"
import { requireAdmin } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <AppShell variant="admin">{children}</AppShell>
}
