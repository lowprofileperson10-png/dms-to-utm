"use client"

import { motion } from "framer-motion"
import { Upload, ListChecks, FileDown } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "1. Envie o PDF",
    description: "Arraste o memorial descritivo SIGEF/INCRA. A leitura dos vértices é automática.",
  },
  {
    icon: ListChecks,
    title: "2. Revise e ajuste",
    description: "Confira coordenadas, fuso e datum na tabela e valide o fechamento no preview 2D.",
  },
  {
    icon: FileDown,
    title: "3. Exporte XLSX/DXF",
    description: "Baixe a planilha e o desenho com camadas prontas para abrir no AutoCAD.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="px-6 py-24 bg-zinc-900/20 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Como funciona</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-4">Três passos. Nenhuma fórmula.</h2>
          <p className="text-zinc-500 max-w-lg mx-auto text-balance">
            Do memorial descritivo ao arquivo pronto para o CAD em poucos minutos.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-zinc-300" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-zinc-100 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
