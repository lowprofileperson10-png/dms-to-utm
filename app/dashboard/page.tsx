import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { requireUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getUsageStatus } from "@/lib/usage"
import { UsageCard } from "@/components/dashboard/usage-card"
import { ProjectsTable, type ProjectRow } from "@/components/dashboard/projects-table"
import { SetupNotice } from "@/components/setup-notice"

export const metadata: Metadata = { title: "Projetos — TopoCAD" }

export default async function DashboardPage() {
  const userId = await requireUser()

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-zinc-100">Projetos</h1>
        <SetupNotice variables={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]} />
      </div>
    )
  }

  const supabase = createServerClient()
  const [{ data: projects, error }, usage] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, status, area_m2, created_at")
      .order("created_at", { ascending: false }),
    getUsageStatus(userId),
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-zinc-100">Projetos</h1>
          <p className="text-sm text-zinc-500">Histórico dos seus memoriais processados.</p>
        </div>
        <Link
          href={usage.canCreate ? "/dashboard/novo" : "/planos"}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo projeto
        </Link>
      </div>

      <UsageCard usage={usage} />

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          Não foi possível carregar os projetos: {error.message}
        </p>
      ) : (
        <ProjectsTable projects={(projects ?? []) as ProjectRow[]} />
      )}
    </div>
  )
}
