import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Entrar — TopoCAD" }

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 px-6 py-12">
      <Link href="/" className="font-display text-2xl font-semibold text-zinc-100">TopoCAD</Link>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-100">Modo local</h1>
        <p className="mt-2 text-sm text-zinc-400">A autenticação externa foi removida. Continue para testar a conversão sem Clerk.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900">Continuar</Link>
      </div>
    </main>
  )
}
