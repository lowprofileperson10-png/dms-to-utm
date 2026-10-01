import "server-only"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function requireUser() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  return userId
}

export async function isAdmin() {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata?.role === "admin"
}

/** For admin Server Components: re-checks the role server-side. */
export async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect("/sign-in")
  if (sessionClaims?.metadata?.role !== "admin") redirect("/dashboard")
  return userId
}

type AdminApiResult = { ok: true; userId: string } | { ok: false; response: NextResponse }

/** For /api/admin/* handlers: returns a 401/403 response when not allowed. */
export async function requireAdminApi(): Promise<AdminApiResult> {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return { ok: false, response: NextResponse.json({ error: "Não autenticado" }, { status: 401 }) }
  }
  if (sessionClaims?.metadata?.role !== "admin") {
    return { ok: false, response: NextResponse.json({ error: "Acesso negado" }, { status: 403 }) }
  }
  return { ok: true, userId }
}
