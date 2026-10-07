import Link from "next/link"
import { FolderOpen } from "lucide-react"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { formatArea, formatDate, statusLabels, type ProjectStatus } from "@/lib/format"

export type ProjectRow = {
  id: string
  name: string
  status: ProjectStatus
  area_m2: number | null
  created_at: string
}

const projectGrid = "sm:grid-cols-[minmax(0,2fr)_minmax(110px,1fr)_minmax(110px,1fr)_minmax(130px,1fr)]"

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) {
    return (
      <DashboardCard>
        <div className="p-12 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-zinc-600" aria-hidden="true" />
          <p className="mt-3 font-medium text-zinc-300">Nenhum projeto ainda</p>
          <p className="mt-1 text-sm text-zinc-500">Envie seu primeiro memorial descritivo para começar.</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <div className="space-y-3">
      <div className={`hidden grid-cols-4 gap-4 px-5 text-xs font-medium text-zinc-500 ${projectGrid} sm:grid`} aria-hidden="true">
        <span>Nome</span>
        <span>Status</span>
        <span>Área</span>
        <span>Criado em</span>
      </div>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/projeto/${project.id}`}
          aria-label={`Abrir memorial ${project.name}`}
          className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <DashboardCard>
            <div className={`grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-4 sm:items-center sm:gap-4 ${projectGrid}`}>
              <div className="col-span-2 min-w-0 sm:col-span-1">
                <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Nome</span>
                <p className="truncate font-medium text-zinc-100">{project.name}</p>
              </div>
              <div>
                <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Status</span>
                <p className="text-sm text-zinc-400">{statusLabels[project.status] ?? project.status}</p>
              </div>
              <div>
                <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Área</span>
                <p className="text-sm text-zinc-400">{formatArea(project.area_m2)}</p>
              </div>
              <div>
                <span className="mb-1 block text-xs text-zinc-500 sm:hidden">Criado em</span>
                <p className="text-sm text-zinc-400">{formatDate(project.created_at)}</p>
              </div>
            </div>
          </DashboardCard>
        </Link>
      ))}
    </div>
  )
}
