import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminUsagePage() { const { data } = await createAdminClient().from("usage").select("user_id,month,memorials_used").order("month", { ascending: false }).limit(100); return <AdminPage title="Uso" description="Consumo mensal de memoriais por usuário."><AdminTable headers={["Usuário","Mês","Memoriais usados"]} rows={(data ?? []).map((u) => [u.user_id, new Date(u.month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }), String(u.memorials_used)])}/></AdminPage> }
