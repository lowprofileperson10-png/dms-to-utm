import { AdminPage, AdminStatGrid } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export default async function AdminPageRoute() {
  await requireAdmin()
  const supabase = createAdminClient()
  const [{ count: users }, { count: projects }, { count: memorials }, { count: subscriptions }] = await Promise.all([
    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("usage").select("user_id", { count: "exact", head: true }).gte("month", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
  ])
  return <AdminPage title="Visão geral" description="Acompanhe a operação do TopoCAD."><AdminStatGrid stats={[{ label: "Usuários", value: String(users ?? 0) }, { label: "Projetos", value: String(projects ?? 0) }, { label: "Memoriais no mês", value: String(memorials ?? 0) }, { label: "Pro assinaturas", value: String(subscriptions ?? 0) }]} /></AdminPage>
}
