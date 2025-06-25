"use client"
import { motion } from "framer-motion"
import { Activity } from "lucide-react"

export interface DashboardTransaction {
  name: string
  date: string
  amount: string
  type: string
  status: string
  icon: any
}

export default function DashboardTransactions({ transactions }: { transactions: DashboardTransaction[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-5 h-5 text-[#df500f]" />
        <h3 className="text-white text-lg font-thin">Recent Activity</h3>
      </div>
      <ul className="space-y-3">
        {transactions.map((transaction, index) => {
          const IconComponent = transaction.icon
          return (
            <motion.li
              key={index}
              className="group p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5 text-[#df500f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-white text-sm truncate">{transaction.name}</div>
                    <div
                      className={`text-sm font-medium ${
                        transaction.type === "sent" ? "text-[#df500f]" : "text-green-400"
                      }`}
                    >
                      {transaction.amount}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/50">{transaction.date}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "Completed" || transaction.status === "Executed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {transaction.status}
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
} 