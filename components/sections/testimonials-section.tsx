"use client"

import { motion } from "motion/react"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

// TODO real testimonials
const testimonials = [
  {
    text: "Eu digitava vértice por vértice no Excel. Agora envio o PDF e em um minuto tenho a planilha conferida.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Mariana Costa",
    role: "Topógrafa autônoma",
  },
  {
    text: "A conversão para UTM SIRGAS 2000 bate com o nosso software de campo e o DXF já abre organizado no AutoCAD.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Rafael Almeida",
    role: "Engenheiro Agrimensor",
  },
  {
    text: "O preview 2D mostra na hora quando o polígono não fecha. Economiza horas de retrabalho.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Juliana Ribeiro",
    role: "Analista de Georreferenciamento",
  },
]

const firstColumn = testimonials
const secondColumn = [testimonials[1], testimonials[2], testimonials[0]]
const thirdColumn = [testimonials[2], testimonials[0], testimonials[1]]

const logos = ["SIGEF", "INCRA", "SIRGAS 2000", "UTM", "AutoCAD", "DXF"]

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="px-6 py-24 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-xl mx-auto mb-12"
        >
          <div className="border border-zinc-800 py-1.5 px-4 rounded-full text-sm text-zinc-400">Depoimentos</div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mt-6 text-center tracking-tight">
            Quem usa, recomenda
          </h2>
          <p className="text-center mt-4 text-zinc-500 text-lg text-balance">
            Topógrafos e engenheiros que deixaram a digitação manual para trás.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

        <div className="mt-16 pt-16 border-t border-zinc-800/50">
          <p className="text-center text-sm text-zinc-500 mb-8">Compatível com os padrões que você já usa</p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              className="flex gap-12 md:gap-16"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <span
                  key={`${logo}-${index}`}
                  className="text-xl font-semibold text-zinc-700 whitespace-nowrap flex-shrink-0"
                >
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
