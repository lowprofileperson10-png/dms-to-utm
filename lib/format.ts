export type ProjectStatus = "draft" | "processing" | "ready" | "error"

export const statusLabels: Record<ProjectStatus, string> = {
  draft: "Rascunho",
  processing: "Processando",
  ready: "Pronto",
  error: "Erro",
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "UTC" }).format(new Date(value))
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
}

export function formatMonth(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit", timeZone: "UTC" }).format(new Date(value))
}

export function formatArea(m2: number | string | null | undefined) {
  if (m2 === null || m2 === undefined) return "—"
  const value = Number(m2)
  const ha = value / 10_000
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m² (${ha.toLocaleString("pt-BR", { maximumFractionDigits: 4 })} ha)`
}

export function formatLength(m: number | string | null | undefined) {
  if (m === null || m === undefined) return "—"
  return `${Number(m).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m`
}

export function formatCurrency(cents: number | null | undefined, currency = "BRL") {
  if (cents === null || cents === undefined) return "—"
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100)
}
