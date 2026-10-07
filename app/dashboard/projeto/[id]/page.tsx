import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { ProjectView } from "@/components/dashboard/project-view"
import { RetryProjectButton } from "@/components/dashboard/retry-project-button"
import { SetupNotice } from "@/components/setup-notice"
import { requireUser } from "@/lib/auth"
import { formatDate, statusLabels, type ProjectStatus } from "@/lib/format"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createServerClient } from "@/lib/supabase/server"
import { linhaParaVertice } from "@/lib/topocad-db/mapeamento"

export const metadata: Metadata = { title: "Projeto — TopoCAD" }

export default async function ProjetoPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUser()
  const { id } = await params

  if (!isSupabaseConfigured()) {
    return <SetupNotice variables={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]} />
  }

  const supabase = createServerClient()
  const { data: project } = await supabase
    .from("projects")
    .select("id,name,status,utm_zone,datum,error_message,created_at")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle()

  if (!project) notFound()

  const { data: rows, error: verticesError } = await supabase
    .from("project_vertices")
    .select("project_id,seq,code,lon_dms,lat_dms,lon_dec,lat_dec,altitude_m,vante_code,azimuth_dms,distance_m,confrontacao,easting,northing,edited")
    .eq("project_id", id)
    .order("seq", { ascending: true })

  const vertices = (rows ?? []).map(linhaParaVertice)

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Projetos
      </Link>
      <div>
        <h1 className="font-display text-2xl font-semibold text-zinc-100">{project.name}</h1>
        <p className="text-sm text-zinc-500">
          {statusLabels[project.status as ProjectStatus] ?? project.status} · criado em {formatDate(project.created_at)}
        </p>
      </div>
      {(project.error_message || verticesError) && (
        <DashboardCard>
          <div role="alert" className="flex items-start gap-3 rounded-2xl bg-amber-500/10 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <p className="font-medium text-zinc-100">
                {verticesError ? "Não foi possível carregar os vértices" : "Não foi possível processar este memorial"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {verticesError ? "Tente atualizar a página. Se o problema persistir, entre em contato com o suporte." : project.error_message}
              </p>
              {!verticesError && (project.status === "error" || project.status === "draft") && (
                <RetryProjectButton projectId={project.id} />
              )}
            </div>
          </div>
        </DashboardCard>
      )}
      <ProjectView
        projectId={project.id}
        initialVertices={vertices}
        initialZone={project.utm_zone}
        initialDatum={project.datum}
      />
    </div>
  )
}
