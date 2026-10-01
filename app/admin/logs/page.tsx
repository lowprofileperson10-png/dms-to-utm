import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminLogsPage() { const { data } = await createAdminClient().from("audit_logs").select("actor_id,target_user_id,action,created_at").order("created_at", { ascending: false }).limit(100); return <AdminPage title="Logs de auditoria" description="Ações administrativas registradas no sistema."><AdminTable headers={["Ator","Alvo","Ação","Data"]} rows={(data ?? []).map((l) => [l.actor_id ?? "sistema", l.target_user_id ?? "—", l.action, new Date(l.created_at).toLocaleString("pt-BR")])}/></AdminPage> }
