import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"

export default async function AdminSettingsPage() { const { data } = await createAdminClient().from("app_settings").select("key,value,updated_at").order("key"); return <AdminPage title="Configurações" description="Valores operacionais editáveis no Supabase."><AdminTable headers={["Chave","Valor","Atualizado em"]} rows={(data ?? []).map((s) => [s.key, JSON.stringify(s.value), new Date(s.updated_at).toLocaleString("pt-BR")])}/></AdminPage> }
