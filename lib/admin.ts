import "server-only"

import { requireAdminApi } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function writeAuditLog(actorId: string, action: string, targetUserId?: string, metadata: Record<string, unknown> = {}) {
  const { error } = await createAdminClient().from("audit_logs").insert({
    actor_id: actorId,
    target_user_id: targetUserId ?? null,
    action,
    metadata,
  })
  if (error) throw new Error("Não foi possível registrar a auditoria")
}

export function adminError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export { requireAdminApi }

export function isSameUser(actorId: string, targetUserId: string) {
  return actorId === targetUserId
}

export function getRequestJsonError() {
  return adminError("Corpo da requisição inválido", 400)
}

export function handleAdminError() {
  return adminError("Não foi possível concluir a operação", 500)
}

export function getAdminClient() {
  return createAdminClient()
}

export function ok<T>(data: T) {
  return NextResponse.json(data)
}

export function missingResource(message = "Registro não encontrado") {
  return adminError(message, 404)
}

export function forbidden(message = "Operação não permitida") {
  return adminError(message, 403)
}

export function parseAdminAuth(result: Awaited<ReturnType<typeof requireAdminApi>>) {
  return result.ok ? result.userId : null
}

export function unauthorized() {
  return adminError("Não autenticado", 401)
}

export function safeErrorResponse() {
  return adminError("Não foi possível concluir a operação", 500)
}
