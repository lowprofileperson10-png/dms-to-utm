"use server"

import { requireUser } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { getUsageStatus, incrementUsage } from "@/lib/usage"
import { processMemorial } from "@/lib/engine"
import { z } from "zod"

const MAX_SIZE = 10 * 1024 * 1024
const projectInput = z.object({ name: z.string().trim().min(1).max(120) })

type CreateProjectResult =
  | { ok: true; projectId: string; storagePath: string }
  | { ok: false; error: string; limitReached?: boolean }

type CreateProjectInput = FormData | { name: string; fileName: string }

export async function createProject(input: CreateProjectInput): Promise<CreateProjectResult> {
  const userId = await requireUser()
  const isFormData = input instanceof FormData
  const parsed = projectInput.safeParse({ name: isFormData ? input.get("name") : input.name })
  const file = isFormData ? input.get("file") : null
  if (!parsed.success) return { ok: false, error: "Informe um nome para o projeto." }
  if (isFormData && !(file instanceof File)) return { ok: false, error: "Selecione um arquivo PDF." }
  const fileName = isFormData && file instanceof File ? file.name : (input as { name: string; fileName: string }).fileName
  if (!fileName.toLowerCase().endsWith(".pdf")) return { ok: false, error: "O arquivo precisa ser um PDF válido." }
  if (isFormData && file instanceof File) {
    if (file.type !== "application/pdf" || file.size > MAX_SIZE) return { ok: false, error: "O arquivo precisa ser um PDF válido de até 10 MB." }
    const magic = new Uint8Array(await file.slice(0, 4).arrayBuffer())
    if (String.fromCharCode(...magic) !== "%PDF") return { ok: false, error: "O conteúdo do arquivo não é um PDF válido." }
  }
  const usage = await getUsageStatus(userId)
  if (!usage.canCreate) return { ok: false, error: "Você atingiu o limite do plano Grátis neste mês.", limitReached: true }
  const supabase = createAdminClient()
  const projectId = crypto.randomUUID()
  const storagePath = `${userId}/${projectId}.pdf`
  if (isFormData && file instanceof File) {
    const { error } = await supabase.storage.from("memoriais").upload(storagePath, file, { contentType: "application/pdf", upsert: false })
    if (error) return { ok: false, error: "Não foi possível enviar o PDF. Tente novamente." }
  }
  const { error: insertError } = await supabase.from("projects").insert({ id: projectId, user_id: userId, name: parsed.data.name, status: "draft", source_pdf_path: storagePath, original_filename: fileName })
  if (insertError) { if (isFormData) await supabase.storage.from("memoriais").remove([storagePath]); return { ok: false, error: "Não foi possível criar o projeto. Tente novamente." } }
  const { error: fileRecordError } = await supabase.from("project_files").insert({ project_id: projectId, kind: "memorial_pdf", storage_path: storagePath, original_filename: fileName, mime_type: "application/pdf", size_bytes: isFormData && file instanceof File ? file.size : null })
  if (fileRecordError) { await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId); if (isFormData) await supabase.storage.from("memoriais").remove([storagePath]); return { ok: false, error: "Não foi possível registrar o memorial. Tente novamente." } }
  try { await incrementUsage(userId) } catch { await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId); if (isFormData) await supabase.storage.from("memoriais").remove([storagePath]); return { ok: false, error: "Não foi possível registrar o uso. Tente novamente." } }
  const processed = await processMemorial(projectId)
  if (!processed.ok) return { ok: false, error: processed.error === "PDF_SEM_TEXTO" ? "O PDF não contém texto extraível." : "O memorial foi enviado, mas não foi possível processá-lo." }
  return { ok: true, projectId, storagePath }
}

export async function attachSourcePdf(projectId: string, storagePath: string) {
  const userId = await requireUser()
  if (!storagePath.startsWith(`${userId}/`)) return { ok: false as const, error: "Caminho de arquivo inválido." }
  const { error } = await createAdminClient().from("projects").update({ source_pdf_path: storagePath }).eq("id", projectId).eq("user_id", userId)
  return error ? { ok: false as const, error: "Não foi possível anexar o PDF." } : { ok: true as const }
}

export async function retryProject(projectId: string) {
  const userId = await requireUser()
  const supabase = createAdminClient()
  const { data } = await supabase.from("projects").select("id").eq("id", projectId).eq("user_id", userId).maybeSingle()
  if (!data) return { ok: false as const, error: "Projeto não encontrado." }
  return processMemorial(projectId)
}

const vertexSchema = z.object({
  id: z.string().trim().min(1).max(40),
  e: z.number().finite().nullable(),
  n: z.number().finite().nullable(),
  azimuth: z.string().max(80).nullable().optional(),
  distance: z.number().finite().nonnegative().nullable().optional(),
})

const saveVerticesSchema = z.object({
  projectId: z.string().uuid(),
  zone: z.string().regex(/^(1[89]|2[0-5])S$/),
  datum: z.literal("SIRGAS2000"),
  vertices: z.array(vertexSchema).max(500),
})

export async function saveProjectVertices(input: unknown) {
  const userId = await requireUser()
  const parsed = saveVerticesSchema.safeParse(input)
  if (!parsed.success) return { ok: false as const, error: "Confira os dados dos vértices e tente novamente." }

  const supabase = createAdminClient()
  const { data: project } = await supabase.from("projects").select("id").eq("id", parsed.data.projectId).eq("user_id", userId).maybeSingle()
  if (!project) return { ok: false as const, error: "Projeto não encontrado." }

  const { error } = await supabase.from("projects").update({
    vertices: parsed.data.vertices,
    utm_zone: parsed.data.zone,
    datum: parsed.data.datum,
  }).eq("id", parsed.data.projectId).eq("user_id", userId)
  if (error) return { ok: false as const, error: "Não foi possível salvar os vértices." }
  return { ok: true as const }
}
