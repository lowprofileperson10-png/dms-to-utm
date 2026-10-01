import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminUsersPage() { const { data } = await createAdminClient().from("profiles").select("user_id,email,plan,role,bonus_credits,created_at").order("created_at", { ascending: false }).limit(100); return <AdminPage title="Usuários" description="Perfis sincronizados pelo Clerk."><AdminTable headers={["E-mail","Plano","Perfil","Créditos","Criado em"]} rows={(data ?? []).map((u) => [u.email ?? "—", u.plan, u.role, String(u.bonus_credits), new Date(u.created_at).toLocaleDateString("pt-BR")])} /></AdminPage> }
