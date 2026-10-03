import "server-only"

process.env.CLERK_SECRET_KEY ??= process.env.CLERK_SECRET_KEY_2

import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

const ADMIN_EMAILS = new Set([
  "luizcarlosilvasaccoman@gmail.com",
  "lowprofileperson10@gmail.com",
  "Rafaelbarantes18@gmail.com",
].map((email) => email.toLowerCase()))

export async function hasAdminEmail() {
  const user = await currentUser()
  return Boolean(
    user?.emailAddresses.some((email) => ADMIN_EMAILS.has(email.emailAddress.toLowerCase())),
  )
}

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  return userId
}

export async function isAdmin() {
  const { userId } = await auth()
  return Boolean(userId && (await hasAdminEmail()))
}

/** For admin Server Components: re-checks identity and the server-side email allowlist. */
export async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  if (!(await hasAdminEmail())) redirect("/dashboard")
  return userId
}

type AdminApiResult = { ok: true; userId: string } | { ok: false; response: NextResponse }

/** For /api/admin/* handlers: returns a 401/403 response when not allowed. */
export async function requireAdminApi(): Promise<AdminApiResult> {
  const { userId } = await auth()
  if (!userId) {
    return { ok: false, response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) }
  }
  if (!(await hasAdminEmail())) {
    return { ok: false, response: NextResponse.json({ error: "Acesso negado" }, { status: 403 }) }
  }
  return { ok: true, userId }
}
