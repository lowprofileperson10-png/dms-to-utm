"use client"

import { useRef, useState, type DragEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileUp, FileText, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { createProject } from "@/app/dashboard/novo/actions"

const MAX_SIZE = 10 * 1024 * 1024

type Stage = "idle" | "creating" | "uploading" | "done" | "error"

const stageProgress: Record<Stage, number> = { idle: 0, creating: 25, uploading: 65, done: 100, error: 0 }
const stageLabel: Record<Stage, string> = {
  idle: "",
  creating: "Criando projeto...",
  uploading: "Enviando PDF...",
  done: "Concluído! Redirecionando...",
  error: "",
}

export function UploadDropzone() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [dragging, setDragging] = useState(false)
  const [stage, setStage] = useState<Stage>("idle")
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const busy = stage === "creating" || stage === "uploading" || stage === "done"

  function selectFile(selected: File | undefined) {
    setError(null)
    if (!selected) return
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Envie um arquivo PDF.")
      return
    }
    if (selected.size > MAX_SIZE) {
      setError("O arquivo deve ter no máximo 10 MB.")
      return
    }
    setFile(selected)
    if (!name) setName(selected.name.replace(/\.pdf$/i, ""))
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    setDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!file || busy) return
    setError(null)
    setStage("creating")

    const formData = new FormData()
    formData.set("name", name)
    formData.set("file", file)
    setStage("uploading")

    const created = await createProject(formData)
    if (!created.ok) {
      setStage("error")
      setError(created.error)
      setLimitReached(Boolean(created.limitReached))
      return
    }

    setStage("done")
    router.push(`/dashboard/projeto/${created.projectId}`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <DashboardCard>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        disabled={busy}
        className={cn(
          "w-full rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-3 text-center transition-colors",
          dragging ? "border-zinc-400 bg-zinc-900" : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/40",
        )}
      >
        <FileUp className="h-8 w-8 text-zinc-500" aria-hidden="true" />
        <span className="font-medium text-zinc-200">Arraste o PDF do memorial aqui</span>
        <span className="text-sm text-zinc-500">ou clique para selecionar · máx. 10 MB</span>
      </button>
      </DashboardCard>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        aria-label="Selecionar PDF"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />

      {file && (
        <DashboardCard>
        <div className="flex items-center gap-3 px-4 py-3">
          <FileText className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          <span className="flex-1 truncate text-sm text-zinc-200">{file.name}</span>
          <span className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
          {!busy && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-zinc-500 hover:text-zinc-200"
              aria-label="Remover arquivo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        </DashboardCard>
      )}

      <div className="space-y-2">
        <Label htmlFor="project-name" className="text-zinc-300">
          Nome do projeto
        </Label>
        <Input
          id="project-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Fazenda Boa Vista — Gleba 2"
          maxLength={120}
          required
          disabled={busy}
          className="bg-zinc-900 border-zinc-800 text-zinc-100"
        />
      </div>

      {busy && (
        <div className="space-y-2" aria-live="polite">
          <Progress value={stageProgress[stage]} className="bg-zinc-800" aria-label="Progresso do envio" />
          <p className="text-sm text-zinc-400">{stageLabel[stage]}</p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}{" "}
          {limitReached && (
            <Link href="/dashboard/planos" className="text-zinc-100 underline underline-offset-4">
              Ver planos
            </Link>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={!file || !name.trim() || busy}
        className="rounded-full bg-zinc-100 px-6 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
      >
        Processar memorial
      </button>
    </form>
  )
}
