import "server-only"

import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import { supabasePublishableKey, supabaseSecretKey, supabaseUrl } from "./config"

/** Respects RLS: requests are authenticated with the current Clerk session token. */
export function createServerClient() {
  return createClient(supabaseUrl!, supabasePublishableKey!, {
    accessToken: async () => (await auth()).getToken(),
  })
}

/** Bypasses RLS. Server-only: never import from a Client Component. */
export function createAdminClient() {
  return createClient(supabaseUrl!, supabaseSecretKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
