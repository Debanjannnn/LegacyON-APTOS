"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Zap, ChevronRight } from "lucide-react"
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar"

const metrics = [
  {
    label: "Energy Efficiency",
    icon: Zap,
    traditional: 100,
    ecoFriendly: 1,
    color: "rgb(34 197 94)",
    improvement: "99% Less",
  }
]

export function EcoFriendlyComparison() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setTimeout(() => setStarted(true), 500)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-96 group cursor-pointer hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-white font-medium text-lg">Eco-Friendly Legacy</h3>
          <p className="text-white/50 text-sm">Traditional vs Sustainable</p>
        </div>

        <div className="space-y-6">
          {metrics.map((metric, i) => {
            const Icon = metric.icon
            return (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-[#df500f]" />
                  <span className="text-white text-sm font-medium">{metric.label}</span>
                </div>

                <div className="flex items-center justify-between">
                  {/* Traditional */}
                  <div className="text-center">
                    <AnimatedCircularProgressBar
                      max={100}
                      min={0}
                      value={started ? metric.traditional : 0}
                      gaugePrimaryColor="rgb(239 68 68)"
                      gaugeSecondaryColor="rgba(239, 68, 68, 0.1)"
                      className="size-12 text-xs mb-2"
                    />
                    <div className="text-white/40 text-xs">Traditional</div>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center mx-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: started ? 1 : 0 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="bg-gradient-to-r from-red-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-1"
                    >
                      VS
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: started ? 1 : 0 }}
                      transition={{ delay: 1.2 }}
                      className="text-green-400 text-xs font-semibold"
                    >
                      {metric.improvement}
                    </motion.div>
                  </div>

                  {/* Eco-Friendly */}
                  <div className="text-center">
                    <AnimatedCircularProgressBar
                      max={100}
                      min={0}
                      value={started ? metric.ecoFriendly : 0}
                      gaugePrimaryColor={metric.color}
                      gaugeSecondaryColor={`${metric.color.replace("rgb", "rgba").replace(")", ", 0.1)")}`}
                      className="size-12 text-xs mb-2"
                    />
                    <div className="text-white/40 text-xs">Eco-Friendly</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center mt-6">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-2 text-green-400 text-sm"
          >
            <span>Leave a mark, not a footprint</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
