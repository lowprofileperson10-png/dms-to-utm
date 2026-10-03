import { z } from "zod"
import { requireAdminApi } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { jsonError } from "@/lib/admin"

export async function GET() { const access = await requireAdminApi(); if (!access.ok) return access.response; const { data, error } = await createAdminClient().from("profiles").select("user_id,email,full_name,plan,role,bonus_credits,created_at").order("created_at", { ascending: false }); if (error) return jsonError("Não foi possível carregar usuários", 500); return Response.json({ ok: true, data }) }

const patchSchema = z.object({ userId: z.string().min(1), plan: z.enum(["free", "pro"]).optional(), role: z.enum(["user", "admin"]).optional() }).refine((value) => value.plan || value.role, "Informe plano ou função")
export async function PATCH(request: Request) { const access = await requireAdminApi(); if (!access.ok) return access.response; const parsed = patchSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return jsonError("Dados inválidos"); if (parsed.data.userId === access.userId && parsed.data.role === "user") return jsonError("Você não pode remover seu próprio acesso", 403); const { userId, ...changes } = parsed.data; const supabase = createAdminClient(); const { data, error } = await supabase.from("profiles").update(changes).eq("user_id", userId).select("user_id,email,plan,role,bonus_credits").maybeSingle(); if (error) return jsonError("Não foi possível atualizar usuário", 500); if (!data) return jsonError("Usuário não encontrado", 404); const { writeAuditLog } = await import("@/lib/admin"); await writeAuditLog(access.userId, "user.updated", userId, changes); return Response.json({ ok: true, data }) }
