import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import type { UsageStatus } from "@/lib/usage"

export function UsageCard({ usage }: { usage: UsageStatus }) {
  const isPro = usage.plan === "pro"
  const percent = usage.limit ? Math.min(100, (usage.used / usage.limit) * 100) : 0

  return (
    <section
      aria-labelledby="usage-title"
      className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5 w-full max-w-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 id="usage-title" className="text-sm font-medium text-zinc-400">
          Uso do mês
        </h2>
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
          {isPro ? "Pro" : "Grátis"}
        </span>
      </div>
      {isPro ? (
        <p className="text-zinc-100">
          <span className="font-display text-2xl font-semibold">{usage.used}</span> memoriais processados · ilimitado
        </p>
      ) : (
        <>
          <p className="text-zinc-100 mb-3">
            <span className="font-display text-2xl font-semibold">{usage.used}</span> de {usage.limit} memoriais usados
          </p>
          <Progress value={percent} aria-label="Memoriais usados" className="bg-zinc-800" />
          {!usage.canCreate && (
            <p className="mt-3 text-sm text-zinc-400">
              Limite atingido.{" "}
              <Link href="/planos" className="text-zinc-100 underline underline-offset-4">
                Assine o Pro
              </Link>
            </p>
          )}
        </>
      )}
    </section>
  )
}
