// Arquivos .env não resolvem referências a outras variáveis, então os aliases
// para as chaves *_2 são aplicados aqui, antes de qualquer requisição.
const aliases: Record<string, string | undefined> = {
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY_2,
  SUPABASE_URL: process.env.SUPABASE_URL_2,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY_2,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY_2,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY_2,
}

export function register() {
  for (const [name, value] of Object.entries(aliases)) {
    if (value) process.env[name] = value
  }
}
