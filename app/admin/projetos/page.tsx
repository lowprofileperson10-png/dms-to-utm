import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminProjectsPage() { const { data } = await createAdminClient().from("projects").select("id,user_id,name,status,area_m2,created_at").order("created_at", { ascending: false }).limit(100); return <AdminPage title="Projetos" description="Todos os memoriais enviados à plataforma."><AdminTable headers={["Nome","Usuário","Status","Área","Criado em"]} rows={(data ?? []).map((p) => [p.name, p.user_id, p.status, p.area_m2 ? `${Number(p.area_m2).toLocaleString("pt-BR")} m²` : "—", new Date(p.created_at).toLocaleDateString("pt-BR")])} /></AdminPage> }
