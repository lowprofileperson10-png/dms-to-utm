import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Mantém páginas públicas renderizáveis quando as chaves ainda não foram
// disponibilizadas no preview. Rotas autenticadas continuam exigindo Clerk.
const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
)

export default hasClerkKeys
  ? clerkMiddleware()
  : function proxyWithoutClerk() {
      return NextResponse.next()
    }

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
