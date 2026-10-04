import type { Metadata } from "next"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"

export const metadata: Metadata = { title: "Entrar — TopoCAD" }

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 px-6 py-12">
      <Link href="/" className="font-display text-2xl font-semibold text-zinc-100">TopoCAD</Link>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
<h1 className="text-xl font-semibold text-zinc-100">Entrar no TopoCAD</h1>
      <p className="mt-2 text-sm text-zinc-400">Use sua conta para acessar seus projetos e conversões.</p>
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="/dashboard" />
      </div>
    </main>
  )
}
