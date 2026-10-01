import { AlertTriangle } from "lucide-react"

export function SetupNotice({ variables }: { variables: string[] }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
      <div>
        <p className="font-medium text-amber-200">Supabase não configurado</p>
        <p className="mt-1 text-amber-200/80">
          Adicione as variáveis <span className="font-mono">{variables.join(", ")}</span> em Settings → Vars e execute{" "}
          <span className="font-mono">supabase/schema.sql</span> no SQL Editor do Supabase.
        </p>
      </div>
    </div>
  )
}
