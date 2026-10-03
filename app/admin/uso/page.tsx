import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export default async function AdminUsagePage() { await requireAdmin(); const { data } = await createAdminClient().from("usage").select("user_id,month,memorials_used").order("month", { ascending: false }).limit(100); return <AdminPage title="Uso" description="Consumo mensal de memoriais por usuário."><AdminTable headers={["Usuário","Mês","Memoriais usados"]} rows={(data ?? []).map((u) => [u.user_id, new Date(u.month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }), String(u.memorials_used)])}/></AdminPage> }
