"use server"

import { requireUser } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { getUsageStatus, incrementUsage } from "@/lib/usage"
import { processMemorial } from "@/lib/engine"
import { z } from "zod"

const MAX_SIZE = 10 * 1024 * 1024
const projectInput = z.object({ name: z.string().trim().min(1).max(120) })

type CreateProjectResult =
  | { ok: true; projectId: string }
  | { ok: false; error: string; limitReached?: boolean }

export async function createProject(formData: FormData): Promise<CreateProjectResult> {
  const userId = await requireUser()
  const parsed = projectInput.safeParse({ name: formData.get("name") })
  const file = formData.get("file")
  if (!parsed.success) return { ok: false, error: "Informe um nome para o projeto." }
  if (!(file instanceof File)) return { ok: false, error: "Selecione um arquivo PDF." }
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "O arquivo precisa ser um PDF válido." }
  }
  if (file.size > MAX_SIZE) return { ok: false, error: "O arquivo deve ter no máximo 10 MB." }
  const magic = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  if (String.fromCharCode(...magic) !== "%PDF") return { ok: false, error: "O conteúdo do arquivo não é um PDF válido." }

  const usage = await getUsageStatus(userId)
  if (!usage.canCreate) return { ok: false, error: "Você atingiu o limite do plano Grátis neste mês.", limitReached: true }

  const supabase = createAdminClient()
  const projectId = crypto.randomUUID()
  const storagePath = `${userId}/${projectId}.pdf`
  const { error: uploadError } = await supabase.storage.from("memoriais").upload(storagePath, file, { contentType: "application/pdf", upsert: false })
  if (uploadError) return { ok: false, error: "Não foi possível enviar o PDF. Tente novamente." }

  const { error: insertError } = await supabase.from("projects").insert({ id: projectId, user_id: userId, name: parsed.data.name, status: "draft", source_pdf_path: storagePath, original_filename: file.name })
  if (insertError) {
    await supabase.storage.from("memoriais").remove([storagePath])
    return { ok: false, error: "Não foi possível criar o projeto. Tente novamente." }
  }

  try {
    await incrementUsage(userId)
  } catch {
    await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId)
    await supabase.storage.from("memoriais").remove([storagePath])
    return { ok: false, error: "Não foi possível registrar o uso. Tente novamente." }
  }

  return { ok: true, projectId }
}

export async function retryProject(projectId: string) {
  const userId = await requireUser()
  const supabase = createAdminClient()
  const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", userId).maybeSingle()
  if (!data) return { ok: false as const, error: "Projeto não encontrado." }
  return processMemorial(projectId)
}
