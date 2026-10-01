import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl font-bold text-zinc-700">404</p>
      <h1 className="font-display text-2xl font-semibold text-zinc-100">Página não encontrada</h1>
      <p className="text-zinc-500 max-w-sm">O endereço que você acessou não existe ou foi removido.</p>
      <Link
        href="/"
        className="mt-2 px-5 py-2 rounded-full bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
      >
        Voltar ao início
      </Link>
    </main>
  )
}
