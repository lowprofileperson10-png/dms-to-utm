"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"

type ExportFormat = "xlsx" | "dxf"

function fileNameFrom(disposition: string | null, fallback: string) {
  const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  return match ? decodeURIComponent(match[1]) : fallback
}

export function ExportButton({
  projectId,
  format,
  disabled,
  onError,
}: {
  projectId: string
  format: ExportFormat
  disabled?: boolean
  onError: (message: string | null) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const label = `Exportar ${format.toUpperCase()}`

  async function download() {
    onError(null)
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projetos/${projectId}/exportar?formato=${format}`)
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        onError(body?.erro?.mensagem ?? "Não foi possível exportar o arquivo.")
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileNameFrom(response.headers.get("Content-Disposition"), `projeto.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch {
      onError("Não foi possível exportar o arquivo. Verifique sua conexão.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={disabled || isLoading}
      title={disabled ? "Processe o memorial antes de exportar." : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {isLoading ? "Gerando..." : label}
    </button>
  )
}
