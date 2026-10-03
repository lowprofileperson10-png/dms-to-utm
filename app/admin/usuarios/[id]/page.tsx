import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { AdminPage, AdminTable } from "@/components/admin/admin-page"

export const dynamic = "force-dynamic"

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const supabase = createAdminClient()
  const [profileResult, usageResult, projectsResult, logsResult] = await Promise.all([
    supabase.from("profiles").select("user_id,email,full_name,plan,role,bonus_credits,created_at").eq("user_id", id).maybeSingle(),
    supabase.from("usage").select("month,memorials_used").eq("user_id", id).order("month", { ascending: false }).limit(12),
    supabase.from("projects").select("id,name,status,area_m2,created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    supabase.from("audit_logs").select("actor_id,action,target_user_id,created_at,metadata").eq("target_user_id", id).order("created_at", { ascending: false }).limit(50),
  ])
  if (profileResult.error || usageResult.error || projectsResult.error || logsResult.error) {
    throw new Error("Falha ao carregar os dados do usuário")
  }
  const profile = profileResult.data
  const usage = usageResult.data
  const projects = projectsResult.data
  const logs = logsResult.data
  if (!profile) notFound()
  return <AdminPage title={profile.email ?? id} description={`${profile.full_name ?? "Usuário"} · ${profile.role} · plano ${profile.plan}`}>
    <div className="grid gap-4 md:grid-cols-4"><div>Função<strong className="block">{profile.role}</strong></div><div>Plano<strong className="block">{profile.plan}</strong></div><div>Créditos bônus<strong className="block">{profile.bonus_credits}</strong></div><div>Criado em<strong className="block">{new Date(profile.created_at).toLocaleDateString("pt-BR")}</strong></div></div>
    <AdminTable headers={["Mês", "Memoriais usados"]} rows={(usage ?? []).map((item) => [new Date(item.month).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }), String(item.memorials_used)])} />
    <AdminTable headers={["Projeto", "Status", "Área", "Criado em"]} rows={(projects ?? []).map((item) => [item.name, item.status, item.area_m2 ? `${Number(item.area_m2).toLocaleString("pt-BR")} m²` : "—", new Date(item.created_at).toLocaleDateString("pt-BR")])} />
    <AdminTable headers={["Ator", "Ação", "Data"]} rows={(logs ?? []).map((item) => [item.actor_id ?? "sistema", item.action, new Date(item.created_at).toLocaleString("pt-BR")])} />
  </AdminPage>
}
