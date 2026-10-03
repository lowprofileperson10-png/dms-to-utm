import { clerkMiddleware } from "@clerk/nextjs/server"

// O Clerk precisa envolver todas as rotas que chamam auth() ou currentUser(),
// mesmo quando a autorização final é feita pelo Server Component.
export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
