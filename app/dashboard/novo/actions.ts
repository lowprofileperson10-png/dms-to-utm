"use server"

import { requireUser } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { getUsageStatus, incrementUsage } from "@/lib/usage"

type CreateProjectResult =
  | { ok: true; projectId: string; storagePath: string }
  | { ok: false; error: string; limitReached?: boolean }

export async function createProject(input: { name: string; fileName: string }): Promise<CreateProjectResult> {
  const userId = await requireUser()

  const name = input.name.trim().slice(0, 120)
  if (!name) return { ok: false, error: "Informe um nome para o projeto." }
  if (!input.fileName.toLowerCase().endsWith(".pdf")) return { ok: false, error: "Envie um arquivo PDF." }

  const usage = await getUsageStatus(userId)
  if (!usage.canCreate) {
    return { ok: false, error: "Você atingiu o limite do plano Grátis neste mês.", limitReached: true }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: userId, name, status: "draft" })
    .select("id")
    .single()
  if (error || !data) return { ok: false, error: error?.message ?? "Falha ao criar projeto." }

  await incrementUsage(userId)

  return { ok: true, projectId: data.id, storagePath: `${userId}/${data.id}.pdf` }
}

export async function attachSourcePdf(projectId: string, storagePath: string) {
  const userId = await requireUser()
  if (!storagePath.startsWith(`${userId}/`)) return { ok: false as const, error: "Caminho inválido." }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("projects")
    .update({ source_pdf_path: storagePath, status: "processing" })
    .eq("id", projectId)
    .eq("user_id", userId)
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}
