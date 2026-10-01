import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center" aria-live="polite">
      <Spinner className="size-6 text-zinc-400" />
      <span className="sr-only">Carregando...</span>
    </div>
  )
}
