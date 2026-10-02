import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

// O proxy precisa continuar respondendo mesmo quando o deployment ainda não
// recebeu as credenciais do Clerk. A falha de inicialização não pode derrubar
// as páginas públicas com MIDDLEWARE_INVOCATION_FAILED.
export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  try {
    const handleClerk = clerkMiddleware()
    return await handleClerk(request, event)
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
