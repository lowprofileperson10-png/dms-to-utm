import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/planos",
  "/api/health",
  "/api/webhooks(.*)",
])
const isAdminPage = createRouteMatcher(["/admin(.*)"])
const isAdminApi = createRouteMatcher(["/api/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  if (isAdminApi(req)) {
    const { userId, sessionClaims } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }
    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }
    return
  }

  const { sessionClaims } = await auth.protect()

  if (isAdminPage(req) && sessionClaims?.metadata?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
