import { AdminPage, AdminTable } from "@/components/admin/admin-page"
import { createAdminClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

export default async function AdminSubscriptionsPage() { await requireAdmin(); const { data } = await createAdminClient().from("subscriptions").select("provider,status,amount_cents,plan,current_period_end").order("created_at", { ascending: false }).limit(100); return <AdminPage title="Assinaturas" description="Status de planos pagos e períodos ativos."><AdminTable headers={["Provedor","Status","Plano","Valor","Período"]} rows={(data ?? []).map((s) => [s.provider, s.status, s.plan, s.amount_cents == null ? "—" : `R$ ${(s.amount_cents / 100).toFixed(2)}`, s.current_period_end ? new Date(s.current_period_end).toLocaleDateString("pt-BR") : "—"])}/></AdminPage> }
