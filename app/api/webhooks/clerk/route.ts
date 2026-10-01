import { Webhook } from "svix"
import type { UserJSON, DeletedObjectJSON, WebhookEvent } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/server"

function profileFromUser(user: UserJSON) {
  const primaryEmail =
    user.email_addresses.find((email) => email.id === user.primary_email_address_id) ?? user.email_addresses[0]
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || null
  const role = (user.public_metadata as { role?: string } | null)?.role === "admin" ? "admin" : "user"

  return {
    user_id: user.id,
    email: primaryEmail?.email_address ?? null,
    full_name: fullName,
    role,
  }
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET
  if (!secret) {
    return Response.json({ error: "CLERK_WEBHOOK_SIGNING_SECRET não configurado" }, { status: 500 })
  }

  const svixId = req.headers.get("svix-id")
  const svixTimestamp = req.headers.get("svix-timestamp")
  const svixSignature = req.headers.get("svix-signature")
  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Cabeçalhos svix ausentes" }, { status: 400 })
  }

  const payload = await req.text()
  let event: WebhookEvent
  try {
    event = new Webhook(secret).verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent
  } catch {
    return Response.json({ error: "Assinatura inválida" }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === "user.created" || event.type === "user.updated") {
    const { error } = await supabase
      .from("profiles")
      .upsert(profileFromUser(event.data as UserJSON), { onConflict: "user_id" })
    if (error) return Response.json({ error: error.message }, { status: 500 })
  }

  if (event.type === "user.deleted") {
    const { id } = event.data as DeletedObjectJSON
    if (id) {
      const { error } = await supabase.from("profiles").delete().eq("user_id", id)
      if (error) return Response.json({ error: error.message }, { status: 500 })
    }
  }

  return Response.json({ received: true })
}
