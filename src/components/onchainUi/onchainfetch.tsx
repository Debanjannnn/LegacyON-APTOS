"use client"

import { useState } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { WILL_ABI } from "@/utils/will_abi"
import { motion } from "framer-motion"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
 // @ts-ignore
import { FileText, Wallet, RefreshCw, Shield, Gift, AlertCircle, CheckCircle, Loader2, Activity, Users, UserCheck, UserPlus, ListOrdered, ClipboardCopy, Globe2 } from "lucide-react"
import { WalletSelector } from "@/components/WalletSelector"
import { surfClient } from "@/utils/surfClient"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export default function WillManager() {
  const { connected, account } = useWallet()
  const { client } = useWalletClient()
  const [tab, setTab] = useState("yourWill")
  const [recipient, setRecipient] = useState("")
  const [owner, setOwner] = useState("")
  const [amount, setAmount] = useState("")
  const [timeout, setTimeout] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
   // @ts-ignore
  const [copied, setCopied] = useState(false)
   // @ts-ignore
  const [will, setWill] = useState<any>(null)
   // @ts-ignore
  const [willsForRecipient, setWillsForRecipient] = useState<any[]>([]) // @ts-ignore
  const [claimableWills, setClaimableWills] = useState<any[]>([])
   // @ts-ignore
  const [willCount, setWillCount] = useState<number | null>(null)
   // @ts-ignore
  const abiClient = client?.useABI(WILL_ABI)
  const ownerAddress = account?.address?.toStringLong() || ""

  // Utility 
 // @ts-ignore
  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
     // @ts-ignore
    setTimeout(() => setCopied(false), 2000)
  }
  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }
  const formatAmount = (amt: string | number) => {
    const num = typeof amt === "string" ? Number.parseFloat(amt) : amt
    return (num / 1e8).toFixed(4)
  }
  const formatTimestamp = (timestamp: string | number) => {
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString()
  }

  // View Functions
  const fetchWill = async () => {
    if (!ownerAddress) return
    setLoading(true)
    setError(null)
    try {
      // @ts-ignore
      const result = await surfClient().useABI(WILL_ABI).view.get_will({
        functionArguments: [ownerAddress as `0x${string}`],
        typeArguments: [],
      })
      setWill(result[0]?.vec || [])
    } catch (e: any) {
      setWill([])
      setError("No will found or error fetching will.")
    } finally {
      setLoading(false)
    }
  }
  // @ts-ignore
  const fetchWillsForRecipient = async () => {
    if (!owner || !recipient) return setError("Owner and recipient required.")
    setLoading(true)
    setError(null)
    try {
       // @ts-ignore
      const result = await surfClient().useABI(WILL_ABI).view.get_wills_for_recipient({
        functionArguments: [owner as `0x${string}`, recipient as `0x${string}`],
        typeArguments: [],
      })
      setWillsForRecipient(result[0] || [])
    } catch (e: any) {
      setWillsForRecipient([])
      setError("Error fetching wills for recipient.")
    } finally {
      setLoading(false)
    }
  }
  // @ts-ignore
  const fetchClaimableWills = async () => {
    if (!owner || !recipient) return setError("Owner and recipient required.")
    setLoading(true)
    setError(null)
    try {
      // @ts-ignore
      const result = await surfClient().useABI(WILL_ABI).view.get_claimable_wills_for_recipient({
        functionArguments: [owner as `0x${string}`, recipient as `0x${string}`],
        typeArguments: [],
      })
      setClaimableWills(result[0] || [])
    } catch (e: any) {
      setClaimableWills([])
      setError("Error fetching claimable wills.")
    } finally {
      setLoading(false)
    }
  }
  // @ts-ignore
  const fetchWillCount = async () => {
    if (!owner || !recipient) return setError("Owner and recipient required.")
    setLoading(true)
    setError(null)
    try {
       // @ts-ignore
      const result = await surfClient().useABI(WILL_ABI).view.get_will_count_for_recipient({
        functionArguments: [owner as `0x${string}`, recipient as `0x${string}`],
        typeArguments: [],
      })
      setWillCount(Number(result[0]))
    } catch (e: any) {
      setWillCount(null)
      setError("Error fetching will count.")
    } finally {
      setLoading(false)
    }
  }

  // Entry Functions
  const handleInitialize = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
       // @ts-ignore
      await abiClient.initialize({ type_arguments: [], arguments: [] })
      setStatus("Will contract initialized!")
      fetchWill()
    } catch (e: any) {
      setError(e.message || "Error initializing will.")
    } finally {
      setLoading(false)
    }
  }
  const handleInitializeGlobalRegistry = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
       // @ts-ignore
      await abiClient.initialize_global_registry({ type_arguments: [], arguments: [] })
      setStatus("Global registry initialized!")
    } catch (e: any) {
      setError(e.message || "Error initializing global registry.")
    } finally {
      setLoading(false)
    }
  }
  const handleCreateWill = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    if (!recipient || !amount || !timeout) return setError("Recipient, amount, and timeout required.")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
       // @ts-ignore
      await abiClient.create_will({
        type_arguments: [],
        arguments: [recipient as `0x${string}`, BigInt(amount), ownerAddress as `0x${string}`],
      })
      setStatus("Will created!")
      fetchWill()
    } catch (e: any) {
      setError(e.message || "Error creating will.")
    } finally {
      setLoading(false)
    }
  }
  const handlePing = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
       // @ts-ignore
      await abiClient.ping({ type_arguments: [], arguments: [] })
      setStatus("Pinged successfully!")
      fetchWill()
    } catch (e: any) {
      setError(e.message || "Error pinging.")
    } finally {
      setLoading(false)
    }
  }
  const handleClaim = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    if (!owner || !amount) return setError("Owner and amount required.")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
       // @ts-ignore
      await abiClient.claim({ type_arguments: [], arguments: [owner as `0x${string}`, BigInt(amount)] })
      setStatus("Claimed successfully!")
      fetchWill()
    } catch (e: any) {
      setError(e.message || "Error claiming.")
    } finally {
      setLoading(false)
    }
  }
  const handleClaimSingle = async () => {
    if (!abiClient) return setError("Wallet client not ready")
    if (!owner) return setError("Owner required.")
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
      // @ts-ignore
      await abiClient.claim_single({ type_arguments: [], arguments: [owner as `0x${string}`] })
      setStatus("Claimed single will successfully!")
      fetchWill()
    } catch (e: any) {
      setError(e.message || "Error claiming single will.")
    } finally {
      setLoading(false)
    }
  }

  // UI
  return (
    <div className={cn("min-h-screen bg-black p-8 relative", poppins.className)} style={{ backgroundImage: "url('/images/gradient.png')", backgroundPosition: "top center", backgroundRepeat: "no-repeat", backgroundSize: "100% auto" }}>
      <div className="absolute left-0 right-0" style={{ top: "30%", bottom: 0, pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 80%, #000 100%)" }}></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-thin text-white">On-chain Will</h2>
          </div>
          <p className="text-white/60 text-lg font-light">Manage your digital legacy on the blockchain</p>
        </motion.div>
        <motion.div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          {!connected ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Wallet className="w-8 h-8 text-[#df500f]" />
              </div>
              <p className="text-white/60 text-lg mb-6">Please connect your wallet.</p>
              <WalletSelector />
            </div>
          ) : (
            <div className="p-8 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button className={`px-4 py-2 rounded-lg ${tab === "yourWill" ? "bg-[#df500f] text-white" : "bg-white/10 text-white/60"}`} onClick={() => setTab("yourWill")}>Your Will</button>
              </div>
              {/* Tab Content */}
              {tab === "yourWill" && (
                <div className="space-y-4">
                  <motion.button onClick={fetchWill} disabled={loading} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {loading ? <Loader2 className="w-5 h-5 text-[#df500f] animate-spin" /> : <RefreshCw className="w-5 h-5 text-[#df500f]" />}
                    <span className="text-white font-medium">Refresh Will</span>
                  </motion.button>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-[#df500f]" />
                      <h4 className="text-white font-medium">Your Will:</h4>
                    </div>
                    {will && will.length > 0 ? (
                      will.map((w: any, idx: number) => (
                        <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/10 mb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                              <span className="text-white/60 text-xs">Amount:</span>
                              <div className="text-white font-mono">{formatAmount(w.amount)} APT</div>
                            </div>
                            <div>
                              <span className="text-white/60 text-xs">Timeout:</span>
                              <div className="text-white font-mono">{w.timeout_secs} sec</div>
                            </div>
                            <div>
                              <span className="text-white/60 text-xs">Owner:</span>
                              <div className="text-white font-mono">{truncateAddress(w.owner)}</div>
                            </div>
                            <div>
                              <span className="text-white/60 text-xs">Recipient:</span>
                              <div className="text-white font-mono">{truncateAddress(w.recipient)}</div>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-white/60 text-xs">Last Ping:</span>
                              <div className="text-white font-mono">{formatTimestamp(w.last_ping_time)}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/60">No will found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Entry Functions Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Initialize Will</span></div>
                  <motion.button onClick={handleInitialize} disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}Initialize</motion.button>
                  <div className="flex items-center gap-2 mb-2"><Globe2 className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Initialize Global Registry</span></div>
                  <motion.button onClick={handleInitializeGlobalRegistry} disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}Init Global Registry</motion.button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2"><Gift className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Create Will</span></div>
                  <input type="text" placeholder="Recipient address" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <input type="number" placeholder="Amount (u64)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <input type="number" placeholder="Timeout (secs)" value={timeout} onChange={e => setTimeout(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <motion.button onClick={handleCreateWill} disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}Create Will</motion.button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Ping</span></div>
                  <motion.button onClick={handlePing} disabled={loading} className="w-full py-2 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}Ping</motion.button>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 mb-2"><Gift className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Claim</span></div>
                  <input type="text" placeholder="Owner address" value={owner} onChange={e => setOwner(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <input type="number" placeholder="Amount (u64)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <motion.button onClick={handleClaim} disabled={loading} className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}Claim</motion.button>
                  <div className="flex items-center gap-2 mb-2"><Gift className="w-4 h-4 text-[#df500f]" /><span className="text-white font-medium">Claim Single</span></div>
                  <input type="text" placeholder="Owner address" value={owner} onChange={e => setOwner(e.target.value)} className="w-full p-2 rounded bg-white/10 text-white mb-2" />
                  <motion.button onClick={handleClaimSingle} disabled={loading} className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}Claim Single</motion.button>
                </div>
              </div>
              {/* Status/Error */}
              {loading && (
                <motion.div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                  <div className="text-blue-400 text-sm">Loading...</div>
                </motion.div>
              )}
              {status && (
                <motion.div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="text-green-400 text-sm">{status}</div>
                </motion.div>
              )}
              {error && (
                <motion.div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="text-red-400 text-sm">{error}</div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
