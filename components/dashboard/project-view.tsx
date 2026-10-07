"use client"

import { useMemo, useState, useTransition } from "react"
import { Download, Map as MapIcon, Plus, Save, Trash2 } from "lucide-react"
import { saveProjectVertices } from "@/app/dashboard/novo/actions"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { recalcularGeometria, type Vertice } from "@/lib/topocad"
import { formatArea, formatLength } from "@/lib/format"

export type Vertex = Vertice

function computeMetrics(vertices: Vertex[]) {
  return vertices.length < 3 ? null : recalcularGeometria(vertices).geometria
}

function PolygonPreview({ points }: { points: Pick<Vertex, "este" | "norte">[] }) {
  const minE = Math.min(...points.map((point) => point.este))
  const maxE = Math.max(...points.map((point) => point.este))
  const minN = Math.min(...points.map((point) => point.norte))
  const maxN = Math.max(...points.map((point) => point.norte))
  const span = Math.max(maxE - minE, maxN - minN) || 1
  const padding = 20
  const size = 400
  const scale = (size - padding * 2) / span
  const toXY = (point: Pick<Vertex, "este" | "norte">) => [
    padding + (point.este - minE) * scale,
    size - padding - (point.norte - minN) * scale,
  ]
  const path = points.map((point) => toXY(point).join(",")).join(" ")

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Pré-visualização do polígono" className="max-h-[420px] w-full">
      <polygon points={path} className="fill-zinc-100/10 stroke-zinc-100" strokeWidth={1.5} />
      {points.map((point, index) => {
        const [x, y] = toXY(point)
        return <circle key={`${point.este}-${point.norte}-${index}`} cx={x} cy={y} r={3} className="fill-zinc-100" />
      })}
    </svg>
  )
}

export function ProjectView({
  projectId,
  initialVertices,
  initialZone,
  initialDatum,
}: {
  projectId: string
  initialVertices: Vertex[]
  initialZone: string | null
  initialDatum: string | null
}) {
  const [vertices, setVertices] = useState(initialVertices)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const metrics = useMemo(() => computeMetrics(vertices), [vertices])

  function save() {
    setMessage(null)
    startTransition(async () => {
      const result = await saveProjectVertices({ projectId, vertices })
      setMessage(result.ok ? "Vértices salvos." : result.error)
    })
  }

  function addVertex() {
    setVertices((current) => {
      const code = `MANUAL-${current.length + 1}`
      const next = current.map((vertex, index) => ({
        ...vertex,
        vante: index === current.length - 1 ? code : vertex.vante,
        editado: true,
      }))

      return [
        ...next,
        {
          seq: current.length + 1,
          codigo: code,
          lonDms: "",
          latDms: "",
          lon: 0,
          lat: 0,
          altitude: null,
          vante: current[0]?.codigo ?? code,
          azimuteDms: "",
          distancia: 0,
          confrontacao: "",
          este: 0,
          norte: 0,
          editado: true,
        },
      ]
    })
  }

  function removeVertex(index: number) {
    setVertices((current) => {
      const remaining = current.filter((_, currentIndex) => currentIndex !== index)
      return remaining.map((vertex, sequence) => ({
        ...vertex,
        seq: sequence + 1,
        vante: remaining[sequence + 1]?.codigo ?? remaining[0]?.codigo ?? vertex.vante,
        editado: true,
      }))
    })
  }

  function updateVertex(index: number, field: "este" | "norte", value: string) {
    const normalized = value.trim().replace(",", ".")
    if (!normalized) return
    const parsed = Number(normalized)
    if (!Number.isFinite(parsed)) return

    setVertices((current) =>
      current.map((vertex, currentIndex) =>
        currentIndex === index ? { ...vertex, [field]: parsed, editado: true } : vertex,
      ),
    )
  }

  const metricsCards = [
    { label: "Área", value: metrics ? formatArea(metrics.areaM2) : "—" },
    { label: "Perímetro na grade", value: metrics ? formatLength(metrics.perimetroGradeM) : "—" },
    { label: "Perímetro do memorial", value: metrics ? formatLength(metrics.perimetroMemorialM) : "—" },
    { label: "Polígono", value: metrics ? (metrics.poligonoFechado ? "Fechado" : "Aberto") : "—" },
  ]

  return (
    <Tabs defaultValue="dados" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TabsList className="bg-zinc-900">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/projetos/${projectId}/exportar?formato=xlsx`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Exportar XLSX
          </a>
          <a
            href={`/api/projetos/${projectId}/exportar?formato=dxf`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Exportar DXF
          </a>
        </div>
      </div>

      <TabsContent value="dados" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <DashboardCard>
          <div className="w-full overflow-x-auto">
            {vertices.length === 0 ? (
              <p className="p-10 text-center text-sm text-zinc-500">
                Os vértices aparecerão aqui assim que o memorial for processado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-500">Vértice</TableHead>
                    <TableHead className="text-zinc-500">E (m)</TableHead>
                    <TableHead className="text-zinc-500">N (m)</TableHead>
                    <TableHead className="text-zinc-500">Azimute</TableHead>
                    <TableHead className="text-zinc-500">Distância</TableHead>
                    <TableHead className="sr-only">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vertices.map((vertex, index) => (
                    <TableRow key={`${vertex.codigo}-${index}`} className="border-zinc-800/60">
                      <TableCell className="font-mono text-zinc-200">{vertex.codigo}</TableCell>
                      {(["este", "norte"] as const).map((field) => (
                        <TableCell key={field}>
                          <input
                            type="text"
                            inputMode="decimal"
                            defaultValue={vertex[field]}
                            onBlur={(event) => updateVertex(index, field, event.target.value)}
                            aria-label={`${field === "este" ? "E" : "N"} do vértice ${vertex.codigo}`}
                            className="w-32 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-100"
                          />
                        </TableCell>
                      ))}
                      <TableCell className="font-mono text-zinc-400">{vertex.azimuteDms || "—"}</TableCell>
                      <TableCell className="text-zinc-400">{formatLength(vertex.distancia)}</TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => removeVertex(index)}
                          className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                          aria-label={`Remover vértice ${vertex.codigo}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/60 p-4">
              <button
                type="button"
                onClick={addVertex}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-zinc-800 px-3 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                <Plus className="h-4 w-4" aria-hidden="true" /> Adicionar vértice
              </button>
              <div className="flex items-center gap-3">
                {message && <span role="status" className="text-sm text-zinc-400">{message}</span>}
                <button
                  type="button"
                  onClick={save}
                  disabled={isPending}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-60"
                >
                  <Save className="h-4 w-4" aria-hidden="true" /> {isPending ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard className="h-fit">
          <aside className="flex flex-col gap-4 p-5">
            <h2 className="text-sm font-medium text-zinc-300">Parâmetros</h2>
            <dl className="flex flex-col gap-4 text-sm">
              <div>
                <dt className="text-zinc-500">Fuso UTM</dt>
                <dd className="mt-1 font-medium text-zinc-200">{initialZone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Datum</dt>
                <dd className="mt-1 font-medium text-zinc-200">
                  {initialDatum?.replace(/^SIRGAS\s*2000$/i, "SIRGAS 2000") ?? "—"}
                </dd>
              </div>
            </dl>
          </aside>
        </DashboardCard>
      </TabsContent>

      <TabsContent value="mapa" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricsCards.map((card) => (
            <DashboardCard key={card.label} className="h-full">
              <div className="p-5">
                <p className="text-sm text-zinc-500">{card.label}</p>
                <p className="mt-1 font-display text-lg font-semibold text-zinc-100">{card.value}</p>
              </div>
            </DashboardCard>
          ))}
        </div>
        <DashboardCard>
          <div className="flex min-h-[320px] items-center justify-center p-6">
            {metrics ? (
              <PolygonPreview points={vertices} />
            ) : (
              <div className="text-center">
                <MapIcon className="mx-auto h-8 w-8 text-zinc-600" aria-hidden="true" />
                <p className="mt-3 text-sm text-zinc-500">A pré-visualização aparece quando o memorial tiver ao menos 3 vértices.</p>
              </div>
            )}
          </div>
        </DashboardCard>
      </TabsContent>
    </Tabs>
  )
}
