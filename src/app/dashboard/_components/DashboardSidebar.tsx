"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, FileText, Shield, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"


export default function DashboardSidebar() {
  const router = useRouter()
  return (
    <motion.aside
      className="flex flex-col items-center gap-4 py-6 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-2xl flex items-center justify-center mb-4 shadow-lg relative">
        <FileText className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      {/* Navigation Icons */}
      <motion.div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard/wallet')}>
        <Wallet className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>
      <motion.div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard/security')}>
        <Shield className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>
      <motion.div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard/analytics')}>
        <TrendingUp className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>
      {/* New: Check Will */}
      <motion.div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard/checkwill')}>
        <FileText className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>
      {/* New: Create Will */}
      <motion.div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => router.push('/dashboard/createwill')}>
        <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors rotate-180" />
      </motion.div>
      <div className="flex-1" />
      {/* Back Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          className="mb-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl"
          onClick={() => router.push("/")}
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
      </motion.div>
    </motion.aside>
  )
} 