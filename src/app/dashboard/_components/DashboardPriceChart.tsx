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

export default function DashboardPriceChart({ aptosData, loading, lastUpdated, fetchAptosData, generatePriceHistory, formatPrice, formatPercentage }: DashboardPriceChartProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-white text-2xl font-thin">Aptos Price</h3>
          <motion.button
            onClick={fetchAptosData}
            disabled={loading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-5 h-5 text-white/70 ${loading ? "animate-spin" : ""}`} />
          </motion.button>
        </div>
        {aptosData && (
          <span
            className={`text-sm px-4 py-2 rounded-full border ${
              aptosData.price_change_percentage_7d >= 0
                ? "bg-green-500/20 text-green-400 border-green-500/20"
                : "bg-red-500/20 text-red-400 border-red-500/20"
            }`}
          >
            7d: {formatPercentage(aptosData.price_change_percentage_7d)}
          </span>
        )}
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-4xl text-white font-thin mb-3">
                {aptosData ? formatPrice(aptosData.current_price.usd) : "$4.90"}
              </div>
              {aptosData && (
                <div className="flex flex-col gap-2 text-sm text-white/60">
                  <div className="flex items-center gap-6">
                    <span>24h High: {formatPrice(aptosData.high_24h.usd)}</span>
                    <span>24h Low: {formatPrice(aptosData.low_24h.usd)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              {aptosData && (
                <div className="flex flex-col gap-2 text-sm text-white/60">
                  <span>Market Cap: ${(aptosData.market_cap.usd / 1e9).toFixed(2)}B</span>
                  <span>Volume: ${(aptosData.total_volume.usd / 1e6).toFixed(1)}M</span>
                </div>
              )}
              {lastUpdated && (
                <div className="text-xs text-white/40 mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          {/* Enhanced Price History Chart */}
          <div className="flex items-end gap-1 h-64 mb-4">
            {generatePriceHistory().map((height, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-[#5B8930] rounded-sm hover:opacity-80 transition-opacity cursor-pointer"
                style={{ height: `${height}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.03 }}
                whileHover={{ scale: 1.02 }}
              />
            ))}
          </div>
          {/* Chart Labels */}
          <div className="flex justify-between text-sm text-white/40">
            <span>20d ago</span>
            <span>10d ago</span>
            <span>Today</span>
          </div>
        </>
      )}
    </div>
  )
} 