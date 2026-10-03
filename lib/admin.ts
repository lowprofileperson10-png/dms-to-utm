import "server-only"

import { createAdminClient } from "@/lib/supabase/server"

export async function writeAuditLog(actorId: string, action: string, targetUserId?: string | null, metadata: Record<string, unknown> = {}) {
  const { error } = await createAdminClient().from("audit_logs").insert({
    actor_id: actorId,
    target_user_id: targetUserId ?? null,
    action,
    metadata,
  })
  if (error) throw new Error("Falha ao registrar auditoria")
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json(
    { ok: false, error: message, ...(details === undefined ? {} : { details }) },
    { status, headers: { "content-type": "application/json" } },
  )
}

export function isSelfMutation(actorId: string, targetUserId: string) {
  return actorId === targetUserId
}
