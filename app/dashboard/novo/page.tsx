import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireUser } from "@/lib/auth"
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase/config"
import { getUsageStatus } from "@/lib/usage"
import { UploadDropzone } from "@/components/dashboard/upload-dropzone"
import { SetupNotice } from "@/components/setup-notice"

export const metadata: Metadata = { title: "Novo projeto — TopoCAD" }

export default async function NovoProjetoPage() {
  const userId = await requireUser()

  if (!isSupabaseConfigured() || !isSupabaseAdminConfigured()) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-semibold text-zinc-100">Novo projeto</h1>
        <SetupNotice
          variables={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SECRET_KEY"]}
        />
      </div>
    )
  }

  const usage = await getUsageStatus(userId)
  if (!usage.canCreate) redirect("/planos")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-zinc-100">Novo projeto</h1>
        <p className="text-sm text-zinc-500">
          Envie o memorial descritivo em PDF.
          {usage.limit !== null && ` Você usou ${usage.used} de ${usage.limit} memoriais este mês.`}
        </p>
      </div>
      <UploadDropzone />
    </div>
  )
}
