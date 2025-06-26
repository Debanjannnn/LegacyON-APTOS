// "use client"
// import { RefreshCw } from "lucide-react"
// import { motion } from "framer-motion"

// interface DashboardPriceChartProps {
//   aptosData: any
//   loading: boolean
//   lastUpdated: Date | null
//   fetchAptosData: () => void
//   generatePriceHistory: () => number[]
//   formatPrice: (price: number) => string
//   formatPercentage: (percentage: number) => string
// }

// export default function DashboardPriceChart({ aptosData, loading, lastUpdated, fetchAptosData, generatePriceHistory, formatPrice, formatPercentage }: DashboardPriceChartProps) {
//   return (
//     <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <h3 className="text-white text-2xl font-thin">Aptos Price</h3>
//           <motion.button
//             onClick={fetchAptosData}
//             disabled={loading}
//             className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <RefreshCw className={`w-5 h-5 text-white/70 ${loading ? "animate-spin" : ""}`} />
//           </motion.button>
//         </div>
//         {aptosData && (
//           <span
//             className={`text-sm px-4 py-2 rounded-full border ${
//               aptosData.price_change_percentage_7d >= 0
//                 ? "bg-green-500/20 text-green-400 border-green-500/20"
//                 : "bg-red-500/20 text-red-400 border-red-500/20"
//             }`}
//           >
//             7d: {formatPercentage(aptosData.price_change_percentage_7d)}
//           </span>
//         )}
//       </div>
//       {loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-2 gap-8 mb-8">
//             <div>
//               <div className="text-4xl text-white font-thin mb-3">
//                 {aptosData ? formatPrice(aptosData.current_price.usd) : "$4.90"}
//               </div>
//               {aptosData && (
//                 <div className="flex flex-col gap-2 text-sm text-white/60">
//                   <div className="flex items-center gap-6">
//                     <span>24h High: {formatPrice(aptosData.high_24h.usd)}</span>
//                     <span>24h Low: {formatPrice(aptosData.low_24h.usd)}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="text-right">
//               {aptosData && (
//                 <div className="flex flex-col gap-2 text-sm text-white/60">
//                   <span>Market Cap: ${(aptosData.market_cap.usd / 1e9).toFixed(2)}B</span>
//                   <span>Volume: ${(aptosData.total_volume.usd / 1e6).toFixed(1)}M</span>
//                 </div>
//               )}
//               {lastUpdated && (
//                 <div className="text-xs text-white/40 mt-2">
//                   Last updated: {lastUpdated.toLocaleTimeString()}
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Enhanced Price History Chart */}
//           <div className="flex items-end gap-1 h-64 mb-4">
//             {generatePriceHistory().map((height, index) => (
//               <motion.div
//                 key={index}
//                 className="flex-1 bg-[#5B8930] rounded-sm hover:opacity-80 transition-opacity cursor-pointer"
//                 style={{ height: `${height}%` }}
//                 initial={{ height: 0 }}
//                 animate={{ height: `${height}%` }}
//                 transition={{ duration: 0.8, delay: 0.5 + index * 0.03 }}
//                 whileHover={{ scale: 1.02 }}
//               />
//             ))}
//           </div>
//           {/* Chart Labels */}
//           <div className="flex justify-between text-sm text-white/40">
//             <span>20d ago</span>
//             <span>10d ago</span>
//             <span>Today</span>
//           </div>
//         </>
//       )}
//     </div>
//   )
// } 
"use client"
import { RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface DashboardPriceChartProps {
  aptosData: any
  loading: boolean
  lastUpdated: Date | null
  fetchAptosData: () => void
  generatePriceHistory: () => number[]
  formatPrice: (price: number) => string
  formatPercentage: (percentage: number) => string
}

export default function DashboardPriceChart({
  aptosData,
  loading,
  lastUpdated,
  fetchAptosData,
  generatePriceHistory,
  formatPrice,
  formatPercentage,
}: DashboardPriceChartProps) {
  return (
    <div className="relative flex-1">
      {/* Subtle outer glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl blur-sm opacity-60"></div>

      {/* Main card with solid black background */}
      <motion.div
        className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 20px 40px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05)
          `,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Spotlight sweep effect */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, 
              transparent 0%, 
              transparent 40%, 
              rgba(255, 255, 255, 0.1) 50%, 
              transparent 60%, 
              transparent 100%
            )`,
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-white text-2xl font-light tracking-wide">Aptos Price</h3>
              <motion.button
                onClick={fetchAptosData}
                disabled={loading}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 border border-white/10"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 text-white/80 ${loading ? "animate-spin" : ""}`} />
              </motion.button>
            </div>
            {aptosData && (
              <motion.span
                className={`text-sm px-4 py-2 rounded-full border font-light ${
                  aptosData.price_change_percentage_7d >= 0
                    ? "bg-white/5 text-white/90 border-white/20"
                    : "bg-white/5 text-white/70 border-white/10"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                7d: {formatPercentage(aptosData.price_change_percentage_7d)}
              </motion.span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-2 gap-8 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <div className="text-5xl text-white font-extralight mb-4 tracking-tight">
                    {aptosData ? formatPrice(aptosData.current_price.usd) : "$4.90"}
                  </div>
                  {aptosData && (
                    <div className="flex flex-col gap-3 text-sm text-white/60 font-light">
                      <div className="flex items-center gap-8">
                        <span>24h High: {formatPrice(aptosData.high_24h.usd)}</span>
                        <span>24h Low: {formatPrice(aptosData.low_24h.usd)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {aptosData && (
                    <div className="flex flex-col gap-3 text-sm text-white/60 font-light">
                      <span>Market Cap: ${(aptosData.market_cap.usd / 1e9).toFixed(2)}B</span>
                      <span>Volume: ${(aptosData.total_volume.usd / 1e6).toFixed(1)}M</span>
                    </div>
                  )}
                  {lastUpdated && (
                    <div className="text-xs text-white/40 mt-4 font-light">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Premium chart with platinum gradient bars */}
              <motion.div
                className="flex items-end gap-1 h-64 mb-6 p-6 rounded-2xl bg-black/40 border border-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {generatePriceHistory().map((height, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 rounded-sm hover:opacity-90 transition-all duration-500 cursor-pointer relative overflow-hidden"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, 
                        #f5f5f7 0%,
                        #e8e8ed 20%,
                        #d1d1d6 40%,
                        #8e8e93 60%,
                        #3a3a3c 80%,
                        #0a0a0a 100%
                      )`,
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
                        0 2px 8px rgba(0, 0, 0, 0.3)
                      `,
                    }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${height}%`, opacity: 1 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.6 + index * 0.02,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                        0 4px 16px rgba(255, 255, 255, 0.1)
                      `,
                    }}
                  >
                    {/* Metallic highlight sweep */}
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      style={{
                        background: `linear-gradient(45deg, 
                          transparent 30%, 
                          rgba(255, 255, 255, 0.4) 50%, 
                          transparent 70%
                        )`,
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Minimalist chart labels */}
              <motion.div
                className="flex justify-between text-sm text-white/50 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span>20d ago</span>
                <span>10d ago</span>
                <span>Today</span>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
