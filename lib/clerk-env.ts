import "server-only"

function requiredEnv(name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" | "CLERK_SECRET_KEY") {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}. Configure-a nas Vars do v0.`)
  }
  return value
}

export const clerkPublishableKey = requiredEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")
export const clerkSecretKey = requiredEnv("CLERK_SECRET_KEY")

void clerkSecretKey
