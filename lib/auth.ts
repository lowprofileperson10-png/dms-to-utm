import "server-only"

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  return userId
}

export async function hasAdminEmail() {
  const user = await currentUser()
  const email = user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress
  return Boolean(email && adminEmails.has(email.toLowerCase()))
}

export async function isAdmin() {
  return hasAdminEmail()
}

export async function requireAdmin() {
  const userId = await requireUser()
  if (!(await hasAdminEmail())) redirect("/dashboard")
  return userId
}

type AdminApiResult = { ok: true; userId: string } | { ok: false; response: Response }

export async function requireAdminApi(): Promise<AdminApiResult> {
  const { userId } = await auth()
  if (!userId) return { ok: false, response: Response.json({ error: "Não autenticado." }, { status: 401 }) }
  if (!(await hasAdminEmail())) return { ok: false, response: Response.json({ error: "Acesso negado." }, { status: 403 }) }
  return { ok: true, userId }
}
