import "server-only"

const LOCAL_USER_ID = "local-user"

export async function requireUser() {
  return LOCAL_USER_ID
}

export async function hasAdminEmail() {
  return false
}

export async function isAdmin() {
  return false
}

export async function requireAdmin() {
  return LOCAL_USER_ID
}

type AdminApiResult = { ok: true; userId: string } | { ok: false; response: Response }

export async function requireAdminApi(): Promise<AdminApiResult> {
  return {
    ok: false,
    response: Response.json({ error: "Painel administrativo indisponível no modo local." }, { status: 403 }),
  }
}

export { LOCAL_USER_ID }
