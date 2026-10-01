import Link from "next/link"
import { FolderOpen } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatArea, formatDate, statusLabels, type ProjectStatus } from "@/lib/format"

export type ProjectRow = {
  id: string
  name: string
  status: ProjectStatus
  area_m2: number | null
  created_at: string
}

export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
        <FolderOpen className="mx-auto h-8 w-8 text-zinc-600" aria-hidden="true" />
        <p className="mt-3 font-medium text-zinc-300">Nenhum projeto ainda</p>
        <p className="mt-1 text-sm text-zinc-500">Envie seu primeiro memorial descritivo para começar.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-500">Nome</TableHead>
            <TableHead className="text-zinc-500">Status</TableHead>
            <TableHead className="text-zinc-500">Área</TableHead>
            <TableHead className="text-zinc-500">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="border-zinc-800/60 hover:bg-zinc-900/60">
              <TableCell>
                <Link href={`/dashboard/projeto/${project.id}`} className="font-medium text-zinc-100 hover:underline">
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="text-zinc-400">{statusLabels[project.status] ?? project.status}</TableCell>
              <TableCell className="text-zinc-400">{formatArea(project.area_m2)}</TableCell>
              <TableCell className="text-zinc-400">{formatDate(project.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
