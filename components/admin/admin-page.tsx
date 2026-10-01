import type { ReactNode } from "react"

export function AdminPage({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <div className="flex flex-col gap-6"><div><h1 className="font-display text-2xl font-semibold text-zinc-100">{title}</h1>{description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}</div>{children}</div>
}

export function AdminStatGrid({ stats }: { stats: { label: string; value: string; detail?: string }[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"><p className="text-sm text-zinc-500">{stat.label}</p><p className="mt-2 text-2xl font-semibold text-zinc-100">{stat.value}</p>{stat.detail && <p className="mt-1 text-xs text-zinc-500">{stat.detail}</p>}</div>)}</div>
}

export function AdminTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-hidden rounded-2xl border border-zinc-800"><table className="w-full text-left text-sm"><thead className="bg-zinc-900/80"><tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-medium text-zinc-500">{header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index} className="border-t border-zinc-800/70"><>{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-zinc-300">{cell}</td>)}</></tr>) : <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-zinc-500">Nenhum registro encontrado.</td></tr>}</tbody></table></div>
}
