import "server-only"

import { createAdminClient } from "@/lib/supabase/server"

export type ProcessResult = { ok: boolean; error?: string }

export async function processMemorial(projectId: string): Promise<ProcessResult> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("projects")
    .update({ status: "error", error_message: "Motor de conversão ainda não disponível" })
    .eq("id", projectId)
  return error ? { ok: false, error: "Não foi possível atualizar o projeto." } : { ok: true }
}

export async function processMemorialForUser(projectId: string, userId: string): Promise<ProcessResult> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", userId).maybeSingle()
  if (!data) return { ok: false, error: "Projeto não encontrado." }
  return processMemorial(projectId)
}

export const memorialEngineMessage = "Motor de conversão ainda não disponível"
