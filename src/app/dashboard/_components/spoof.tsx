// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   ArrowLeft,
//   Wallet,
//   FileText,
//   Shield,
//   TrendingUp,
//   Plus,
//   RefreshCw,
//   LogOut,
//   Copy,
//   CheckCircle,
//   User,
//   Activity,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Poppins } from "next/font/google"
// import { cn } from "@/lib/utils"
// import { useWallet } from "@aptos-labs/wallet-adapter-react"
// import { WalletSelector } from "@/components/WalletSelector"
// import { getAccountAPTBalance } from "@/view-functions/getAccountBalance"

// const poppins = Poppins({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-poppins",
// })

// interface AptosData {
//   current_price: { usd: number }
//   price_change_percentage_24h: number
//   price_change_percentage_7d: number
//   market_cap: { usd: number }
//   total_volume: { usd: number }
//   high_24h: { usd: number }
//   low_24h: { usd: number }
// }

// export default function DashboardPage() {
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [aptosData, setAptosData] = useState<AptosData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
//   const [copied, setCopied] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const router = useRouter()
//   const { account, connected, disconnect } = useWallet()
//   const [aptBalance, setAptBalance] = useState<number | null>(null)
//   const [balanceLoading, setBalanceLoading] = useState(false)
//   const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
//   const walletDropdownRef = useRef<HTMLDivElement>(null)

//   const fetchAptosData = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("https://api.coingecko.com/api/v3/coins/aptos")
//       const data = await response.json()
//       setAptosData(data.market_data)
//       setLastUpdated(new Date())
//     } catch (error) {
//       console.error("Error fetching Aptos data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchAptosData()
//     // Update every 30 seconds
//     const interval = setInterval(fetchAptosData, 30000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false)
//       }
//     }
//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [dropdownOpen])

//   useEffect(() => {
//     if (connected && account?.address) {
//       setBalanceLoading(true)
//       getAccountAPTBalance({ accountAddress: account.address.toStringLong() })
//         .then((bal) => setAptBalance(bal / 1e8))
//         .finally(() => setBalanceLoading(false))
//     } else {
//       setAptBalance(null)
//     }
//   }, [connected, account])

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
//         setWalletDropdownOpen(false)
//       }
//     }
//     if (walletDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [walletDropdownOpen])

//   const copyAddress = async () => {
//     if (account?.address) {
//       await navigator.clipboard.writeText(account.address.toStringLong())
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }
//   }

//   const transactions = [
//     {
//       name: "Will Creation",
//       date: "Dec 15, 2:30 PM",
//       amount: "-$0.01",
//       type: "sent",
//       status: "Completed",
//       icon: FileText,
//     },
//     {
//       name: "Asset Distribution",
//       date: "Dec 12, 10:15 AM",
//       amount: "+$2,500.00",
//       type: "received",
//       status: "Executed",
//       icon: TrendingUp,
//     },
//     {
//       name: "Smart Contract Update",
//       date: "Dec 10, 4:45 PM",
//       amount: "-$0.01",
//       type: "sent",
//       status: "Completed",
//       icon: Shield,
//     },
//     {
//       name: "Legacy Verification",
//       date: "Dec 8, 9:20 AM",
//       amount: "-$0.01",
//       type: "sent",
//       status: "Verified",
//       icon: CheckCircle,
//     },
//   ]

//   // Generate price history simulation based on current price
//   const generatePriceHistory = () => {
//     if (!aptosData) return [60, 40, 80, 50, 70, 30, 50, 65, 45, 75, 55, 85, 40, 70, 60, 90, 35, 65, 80, 45]

//     const currentPrice = aptosData.current_price.usd
//     const change24h = aptosData.price_change_percentage_24h
//     const change7d = aptosData.price_change_percentage_7d

//     // Simulate 20 data points for wider chart
//     const baseHeight = 50
//     const variation = 30

//     return Array.from({ length: 20 }, (_, i) => {
//       const dayProgress = i / 19
//       const trendFactor = change7d > 0 ? dayProgress * 0.3 + 0.7 : (1 - dayProgress) * 0.3 + 0.7
//       const randomVariation = (Math.random() - 0.5) * 0.4
//       return Math.max(20, Math.min(80, baseHeight + variation * trendFactor + variation * randomVariation))
//     })
//   }

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 4,
//     }).format(price)
//   }

//   const formatPercentage = (percentage: number) => {
//     const sign = percentage >= 0 ? "+" : ""
//     return `${sign}${percentage.toFixed(2)}%`
//   }

//   const truncateAddress = (address: string) => {
//     return `${address.slice(0, 6)}...${address.slice(-4)}`
//   }

//   return (
//     <div
//       className={cn("min-h-screen bg-black p-0 m-0 relative", poppins.className)}
//       style={{
//         backgroundImage: "url('/images/gradient.png')",
//         backgroundPosition: "top center",
//         backgroundRepeat: "no-repeat",
//         backgroundSize: "100% auto",
//       }}
//     >
//       {/* Gradient overlay */}
//       <div
//         className="absolute left-0 right-0"
//         style={{
//           top: "30%",
//           bottom: 0,
//           pointerEvents: "none",
//           background:
//             "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 80%, #000 100%)",
//         }}
//       ></div>

//       <div className="w-full h-full rounded-none bg-black/50 backdrop-blur-sm shadow-xl flex flex-row p-8 gap-8 min-h-screen relative z-10">
//         {/* Enhanced Sidebar */}
//         <motion.aside
//           className="flex flex-col items-center gap-4 py-6 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl relative"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           {/* Logo */}
//           <div className="w-12 h-12 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-2xl flex items-center justify-center mb-4 shadow-lg relative">
//             <FileText className="w-6 h-6 text-white" />
//             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
//               <div className="w-2 h-2 bg-white rounded-full"></div>
//             </div>
//           </div>

//           {/* Navigation Icons */}
//           <motion.div
//             className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Wallet className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
//           </motion.div>

//           <motion.div
//             className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Shield className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
//           </motion.div>

//           <motion.div
//             className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 hover:bg-white/20 transition-colors cursor-pointer group"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <TrendingUp className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
//           </motion.div>

//           <div className="flex-1" />

//           {/* Back Button */}
//           <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="mb-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 rounded-xl"
//               onClick={() => router.push("/")}
//               aria-label="Back to Home"
//             >
//               <ArrowLeft className="w-5 h-5 text-white" />
//             </Button>
//           </motion.div>
//         </motion.aside>

//         {/* Main Content */}
//         <main className="flex-1 grid grid-cols-3 gap-6">
//           {/* Enhanced Digital Legacy Card & Transactions */}
//           <motion.section
//             className="col-span-1 flex flex-col gap-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             {/* Enhanced Wallet Connection Card */}
//             {!connected ? (
//               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
//                 <div className="w-16 h-16 bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
//                   <Wallet className="w-8 h-8 text-[#df500f]" />
//                 </div>
//                 <h3 className="text-white text-xl font-thin mb-3">Connect Your Wallet</h3>
//                 <p className="text-white/60 text-sm mb-6 leading-relaxed">
//                   Connect your Aptos wallet to access your digital legacy dashboard and manage your assets securely.
//                 </p>
//                 <WalletSelector />
//                 <div className="mt-6 pt-6 border-t border-white/10">
//                   <div className="flex items-center justify-center gap-2 text-xs text-white/40">
//                     <Shield className="w-4 h-4" />
//                     <span>Secured by Aptos Blockchain</span>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
//                 <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="relative z-10">
//                   {/* Wallet Header */}
//                   <div className="flex items-center justify-between mb-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
//                         <User className="w-5 h-5 text-white" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium">Digital Legacy Wallet</div>
//                         <div className="text-xs opacity-80">Connected</div>
//                       </div>
//                     </div>
//                     <div className="relative" ref={walletDropdownRef}>
//                       <motion.button
//                         className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
//                       >
//                         <Plus className="w-4 h-4" />
//                       </motion.button>
//                       {walletDropdownOpen && (
//                         <motion.div
//                           className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
//                           initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                           animate={{ opacity: 1, scale: 1, y: 0 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           <button
//                             className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 transition-colors flex items-center gap-3"
//                             onClick={copyAddress}
//                           >
//                             {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
//                             <span className="text-sm">{copied ? "Copied!" : "Copy Address"}</span>
//                           </button>
//                           <div className="border-t border-white/10"></div>
//                           <button
//                             className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
//                             onClick={() => {
//                               disconnect()
//                               setWalletDropdownOpen(false)
//                             }}
//                           >
//                             <LogOut className="w-4 h-4" />
//                             <span className="text-sm">Disconnect</span>
//                           </button>
//                         </motion.div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Balance Display */}
//                   <div className="mb-4">
//                     <div className="text-3xl font-thin mb-2">
//                       {balanceLoading ? (
//                         <div className="flex items-center gap-2">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                           <span className="text-lg">Loading...</span>
//                         </div>
//                       ) : aptBalance !== null ? (
//                         `${aptBalance.toFixed(4)} APT`
//                       ) : (
//                         "0.0000 APT"
//                       )}
//                     </div>
//                     {aptosData && aptBalance && (
//                       <div className="text-sm opacity-80">
//                         ≈ {formatPrice(aptBalance * aptosData.current_price.usd)}
//                       </div>
//                     )}
//                   </div>

//                   {/* Address Display */}
//                   <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-xs opacity-60 mb-1">Wallet Address</div>
//                         <div className="text-sm font-mono">
//                           {account?.address ? truncateAddress(account.address.toStringLong()) : ""}
//                         </div>
//                       </div>
//                       <motion.button
//                         className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={copyAddress}
//                       >
//                         {copied ? (
//                           <CheckCircle className="w-4 h-4 text-green-300" />
//                         ) : (
//                           <Copy className="w-4 h-4 text-white/60" />
//                         )}
//                       </motion.button>
//                     </div>
//                   </div>

//                   {/* Status Indicators */}
//                   <div className="flex items-center justify-between text-xs">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                       <span>EDU Blockchain • Active</span>
//                     </div>
//                     {aptosData && (
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           aptosData.price_change_percentage_24h >= 0
//                             ? "bg-green-500/20 text-green-300"
//                             : "bg-red-500/20 text-red-300"
//                         }`}
//                       >
//                         {formatPercentage(aptosData.price_change_percentage_24h)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Enhanced Transactions */}
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1">
//               <div className="flex items-center gap-3 mb-6">
//                 <Activity className="w-5 h-5 text-[#df500f]" />
//                 <h3 className="text-white text-lg font-thin">Recent Activity</h3>
//               </div>
//               <ul className="space-y-3">
//                 {transactions.map((transaction, index) => {
//                   const IconComponent = transaction.icon
//                   return (
//                     <motion.li
//                       key={index}
//                       className="group p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
//                           <IconComponent className="w-5 h-5 text-[#df500f]" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between mb-1">
//                             <div className="font-medium text-white text-sm truncate">{transaction.name}</div>
//                             <div
//                               className={`text-sm font-medium ${
//                                 transaction.type === "sent" ? "text-[#df500f]" : "text-green-400"
//                               }`}
//                             >
//                               {transaction.amount}
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-between">
//                             <div className="text-xs text-white/50">{transaction.date}</div>
//                             <div
//                               className={`text-xs px-2 py-1 rounded-full ${
//                                 transaction.status === "Completed" || transaction.status === "Executed"
//                                   ? "bg-green-500/20 text-green-400"
//                                   : "bg-blue-500/20 text-blue-400"
//                               }`}
//                             >
//                               {transaction.status}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.li>
//                   )
//                 })}
//               </ul>
//             </div>
//           </motion.section>

//           {/* Large Aptos Price Chart - Spans 2 columns */}
//           <motion.section
//             className="col-span-2 flex flex-col gap-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             {/* Top Row - Asset Distribution */}
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
//               <h3 className="text-white text-xl font-thin mb-8 text-center">Asset Distribution</h3>
//               <div className="flex items-center justify-center gap-12">
//                 {/* Enhanced Donut Chart */}
//                 <div className="relative">
//                   <div className="relative w-40 h-40">
//                     <div className="absolute inset-0 rounded-full border-8 border-[#df500f] border-t-[#ff6b35] border-r-white/20 transform rotate-45" />
//                     <div className="absolute inset-4 rounded-full bg-black/50 backdrop-blur-sm" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="text-3xl text-white font-thin">73%</div>
//                         <div className="text-xs text-white/60">Allocated</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Legend */}
//                 <div className="flex flex-col gap-4">
//                   <div className="flex items-center gap-3">
//                     <span className="w-4 h-4 bg-[#df500f] rounded-full inline-block"></span>
//                     <div>
//                       <div className="text-white text-sm font-medium">Digital Assets</div>
//                       <div className="text-white/60 text-xs">45% • $3,780</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="w-4 h-4 bg-[#ff6b35] rounded-full inline-block"></span>
//                     <div>
//                       <div className="text-white text-sm font-medium">Smart Contracts</div>
//                       <div className="text-white/60 text-xs">28% • $2,350</div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="w-4 h-4 bg-white/20 rounded-full inline-block"></span>
//                     <div>
//                       <div className="text-white text-sm font-medium">Reserved</div>
//                       <div className="text-white/60 text-xs">27% • $2,270</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom Row - Full Width Aptos Price Chart */}
//             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex-1">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-4">
//                   <h3 className="text-white text-2xl font-thin">Aptos Price</h3>
//                   <motion.button
//                     onClick={fetchAptosData}
//                     disabled={loading}
//                     className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <RefreshCw className={`w-5 h-5 text-white/70 ${loading ? "animate-spin" : ""}`} />
//                   </motion.button>
//                 </div>
//                 {aptosData && (
//                   <span
//                     className={`text-sm px-4 py-2 rounded-full border ${
//                       aptosData.price_change_percentage_7d >= 0
//                         ? "bg-green-500/20 text-green-400 border-green-500/20"
//                         : "bg-red-500/20 text-red-400 border-red-500/20"
//                     }`}
//                   >
//                     7d: {formatPercentage(aptosData.price_change_percentage_7d)}
//                   </span>
//                 )}
//               </div>

//               {loading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#df500f]"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-2 gap-8 mb-8">
//                     <div>
//                       <div className="text-4xl text-white font-thin mb-3">
//                         {aptosData ? formatPrice(aptosData.current_price.usd) : "$4.90"}
//                       </div>
//                       {aptosData && (
//                         <div className="flex flex-col gap-2 text-sm text-white/60">
//                           <div className="flex items-center gap-6">
//                             <span>24h High: {formatPrice(aptosData.high_24h.usd)}</span>
//                             <span>24h Low: {formatPrice(aptosData.low_24h.usd)}</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-right">
//                       {aptosData && (
//                         <div className="flex flex-col gap-2 text-sm text-white/60">
//                           <span>Market Cap: ${(aptosData.market_cap.usd / 1e9).toFixed(2)}B</span>
//                           <span>Volume: ${(aptosData.total_volume.usd / 1e6).toFixed(1)}M</span>
//                         </div>
//                       )}
//                       {lastUpdated && (
//                         <div className="text-xs text-white/40 mt-2">
//                           Last updated: {lastUpdated.toLocaleTimeString()}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Enhanced Price History Chart */}
//                   <div className="flex items-end gap-1 h-64 mb-4">
//                     {generatePriceHistory().map((height, index) => (
//                       <motion.div
//                         key={index}
//                         className="flex-1 bg-gradient-to-t from-[#df500f] to-[#ff6b35] rounded-sm hover:opacity-80 transition-opacity cursor-pointer"
//                         style={{ height: `${height}%` }}
//                         initial={{ height: 0 }}
//                         animate={{ height: `${height}%` }}
//                         transition={{ duration: 0.8, delay: 0.5 + index * 0.03 }}
//                         whileHover={{ scale: 1.02 }}
//                       />
//                     ))}
//                   </div>

//                   {/* Chart Labels */}
//                   <div className="flex justify-between text-sm text-white/40">
//                     <span>20d ago</span>
//                     <span>10d ago</span>
//                     <span>Today</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </motion.section>
//         </main>
//       </div>
//     </div>
//   )
// }
