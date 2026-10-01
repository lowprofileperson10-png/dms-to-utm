import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">Carregando...</span>
      <Skeleton className="h-8 w-48 bg-zinc-900" />
      <Skeleton className="h-28 w-full max-w-sm bg-zinc-900" />
      <Skeleton className="h-64 w-full bg-zinc-900" />
    </div>
  )
}
