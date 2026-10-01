"use client"

import { motion } from "framer-motion"
import { FileText, Compass, Table2, Map, Ruler, Download, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features: { icon: LucideIcon; title: string; description: string; span: string }[] = [
  {
    icon: FileText,
    title: "Leitura de PDF",
    description: "Extrai vértices, azimutes e distâncias do memorial SIGEF/INCRA.",
    span: "md:col-span-3",
  },
  {
    icon: Compass,
    title: "Conversão DMS → UTM",
    description: "SIRGAS 2000, fusos 18S a 25S, sem fórmulas manuais.",
    span: "md:col-span-2",
  },
  {
    icon: Table2,
    title: "Tabela editável",
    description: "Corrija leituras incorretas direto na tabela.",
    span: "md:col-span-2",
  },
  {
    icon: Map,
    title: "Preview 2D",
    description: "Visualize o polígono com zoom, pan e tooltip por vértice.",
    span: "md:col-span-3",
  },
  {
    icon: Ruler,
    title: "Área e perímetro",
    description: "Validação automática de fechamento, em m² e hectares.",
    span: "md:col-span-3",
  },
  {
    icon: Download,
    title: "Exportação",
    description: "Baixe XLSX e DXF com camadas prontas para o AutoCAD.",
    span: "md:col-span-2",
  },
]

const sampleRows = [
  { id: "V-01", e: "512.348,21", n: "7.456.902,88" },
  { id: "V-02", e: "512.611,04", n: "7.456.874,13" },
  { id: "V-03", e: "512.590,77", n: "7.456.621,40" },
]

function FeaturePreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-500 leading-relaxed">
        <p>
          Do vértice <span className="text-zinc-200">V-01</span>, segue com azimute de{" "}
          <span className="text-zinc-200">{"92°14'08\""}</span> e distância de{" "}
          <span className="text-zinc-200">264,31 m</span>...
        </p>
      </div>
    )
  }
  if (index === 3) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <svg viewBox="0 0 200 90" className="w-full h-24" role="img" aria-label="Exemplo de polígono">
          <motion.polygon
            points="20,70 70,15 150,10 185,55 120,82"
            fill="rgba(161,161,170,0.08)"
            stroke="#a1a1aa"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {[
            [20, 70],
            [70, 15],
            [150, 10],
            [185, 55],
            [120, 82],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#e4e4e7" />
          ))}
        </svg>
      </div>
    )
  }
  if (index === 2) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono">
        {sampleRows.map((row) => (
          <div key={row.id} className="grid grid-cols-3 gap-2 px-3 py-2 border-b border-zinc-900 last:border-0">
            <span className="text-zinc-300">{row.id}</span>
            <span className="text-zinc-500">{row.e}</span>
            <span className="text-zinc-500">{row.n}</span>
          </div>
        ))}
      </div>
    )
  }
  if (index === 5) {
    return (
      <div className="flex gap-2">
        {[".xlsx", ".dxf"].map((ext) => (
          <span
            key={ext}
            className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 font-mono text-sm"
          >
            {ext}
          </span>
        ))}
      </div>
    )
  }
  return null
}

export function FeaturesSection() {
  return (
    <section id="recursos" className="px-6 py-24 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Recursos</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Tudo o que você precisa, do memorial ao CAD
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-balance">
            Automatize a etapa mais repetitiva do levantamento e ganhe tempo para o que importa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className={feature.span}
              >
                <Card className="group h-full overflow-hidden border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6 flex flex-col h-full gap-5">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                        </motion.div>
                        <h3 className="font-heading font-semibold text-zinc-100">{feature.title}</h3>
                      </div>
                      <p className="text-zinc-500 text-sm">{feature.description}</p>
                    </div>
                    <div className="mt-auto">
                      <FeaturePreview index={i} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
