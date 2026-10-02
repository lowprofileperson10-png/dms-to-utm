import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const clerkIsConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    (process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY_4),
)

// Permite que páginas públicas continuem renderizando quando as variáveis do
// Clerk ainda não foram adicionadas ao ambiente do deployment.
export default clerkIsConfigured
  ? clerkMiddleware()
  : () => NextResponse.next()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
