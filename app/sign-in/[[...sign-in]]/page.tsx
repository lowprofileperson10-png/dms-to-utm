import type { Metadata } from "next"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"

export const metadata: Metadata = { title: "Entrar — TopoCAD" }

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-8 px-6 py-12">
      <Link href="/" className="font-display text-2xl font-semibold text-zinc-100">
        TopoCAD
      </Link>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </main>
  )
}
