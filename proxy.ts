import { clerkMiddleware } from "@clerk/nextjs/server"

// A autenticação e a autorização são validadas nas páginas e rotas do servidor.
// O middleware fica apenas responsável por inicializar o Clerk, evitando que
// callbacks de rota causem falhas de invocação no proxy do Next.js 16.
export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
