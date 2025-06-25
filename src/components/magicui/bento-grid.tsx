"use client"

import { ArrowRight, ChevronRight, Clock, Code, Leaf, Database, FileText } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { AuroraText } from "@/components/magicui/aurora-text"
import Link from "next/link"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export default function BentoGrid() {
  // Animation variants
  const cardVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * index,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className={cn("relative text-white py-16 px-4 md:px-6 z-10", poppins.className)}>
      <div className="max-w-7xl mx-auto grid grid-cols-12 grid-rows-6 gap-4 h-[800px]">
        <motion.h1
          className={cn("text-3xl md:text-4xl lg:text-5xl font-thin text-center mb-8 col-span-12", poppins.className)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <AuroraText colors={["#df500f", "#ff6b35", "#ffffff", "#c4460d"]}>
            <span className="text-transparent">Aptos Blockchain Features</span>
          </AuroraText>
          <br />
          <span className="text-xl md:text-2xl font-light text-white/80">
            Secure, Fast, and Eco-Friendly Digital Legacy Management
          </span>
        </motion.h1>

        {/* Fast Transactions - Top Left (Large) */}
        <Link href="/fast-transactions" className="col-span-12 md:col-span-4 row-span-3 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-2xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={0}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-thin leading-tight mb-2">
                    Lightning Fast
                    <br />
                    Transactions
                  </h2>
                  <p className="text-white/80 text-sm font-light">0.5 second block time</p>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Clock className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Speed Display */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10">
                  <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Block Time</p>
                  <p className="text-3xl font-bold">0.5s</p>
                  <p className="text-green-300 text-sm">Ultra Fast Execution</p>
                </div>
                <p className="text-white/70 text-sm font-light">
                  Execute wills and distribute assets instantly with Aptos's lightning-fast blockchain.
                </p>
              </div>

              <div className="flex justify-end">
                <ArrowRight
                  className="text-white w-6 h-6 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2}
                />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Low-Cost Operations - Top Center */}
        <Link href="/low-cost" className="col-span-12 md:col-span-4 row-span-3 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={1}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-thin text-white mb-2">Low-Cost Operations</h3>
                <p className="text-white/60 text-sm font-light">Minimal transaction fees</p>
              </div>

              {/* Cost Comparison Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                  <div className="text-red-400 text-xs mb-1">Traditional</div>
                  <div className="text-white font-bold text-lg">$50-200</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                  <div className="text-green-400 text-xs mb-1">Aptos Chain</div>
                  <div className="text-white font-bold text-lg">$0.01</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                  <div className="text-blue-400 text-xs mb-1">Speed</div>
                  <div className="text-white font-bold text-sm">Instant</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                  <div className="text-purple-400 text-xs mb-1">Security</div>
                  <div className="text-white font-bold text-sm">Bank-Level</div>
                </div>
              </div>

              <div className="flex justify-end mt-auto">
                <ChevronRight
                  className="text-[#df500f] w-6 h-6 group-hover:translate-x-1 transition-transform"
                  strokeWidth={2}
                />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* EVM Compatibility - Top Right */}
        <Link href="/evm-compatibility" className="col-span-12 md:col-span-4 row-span-2 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={2}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-thin text-white">EVM Compatible</h3>
                  <p className="text-white/60 text-sm font-light">Ethereum ecosystem</p>
                </div>
                <Code className="w-6 h-6 text-purple-400" />
              </div>

              {/* Compatibility Indicators */}
              <div className="flex-1 flex items-end space-x-1 mb-4">
                {[
                  { name: "Solidity", height: 90 },
                  { name: "Web3.js", height: 75 },
                  { name: "MetaMask", height: 85 },
                  { name: "Truffle", height: 70 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-[#df500f] to-[#ff6b35] rounded-t opacity-70"
                      style={{ height: `${item.height}%` }}
                    ></div>
                    <div className="text-xs text-white/50 mt-1">{item.name}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">100%</p>
                  <p className="text-green-400 text-xs">Compatible</p>
                </div>
                <ChevronRight className="text-[#df500f] w-5 h-5" strokeWidth={2} />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Data Transparency - Middle Right */}
        <Link href="/data-transparency" className="col-span-12 md:col-span-4 row-span-1 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={3}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex items-center justify-between">
              <div>
                <h3 className="text-lg font-thin text-white">Data</h3>
                <p className="text-lg font-thin text-white">Transparency</p>
              </div>
              <div className="w-10 h-10 bg-[#df500f]/20 rounded-xl flex items-center justify-center border border-white/10">
                <Database className="w-5 h-5 text-[#df500f]" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Will Creation - Bottom Left */}
        <Link href="/create-will" className="col-span-12 md:col-span-3 row-span-3 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={4}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/10">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border border-white/20">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 bg-[#df500f] rounded-full opacity-60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                      delay: dot * 0.3,
                    }}
                  />
                ))}
              </div>

              <h3 className="text-xl font-thin text-white mb-3">Create Digital Will</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-light">
                Set up your digital legacy with smart contract automation
              </p>

              <div className="mt-auto">
                <ChevronRight className="text-[#df500f] w-6 h-6" strokeWidth={2} />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Eco-Friendly Features - Bottom Center */}
        <Link href="/eco-friendly" className="col-span-12 md:col-span-5 row-span-3 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={5}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#df500f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-thin text-white mb-2">Eco-Friendly Blockchain</h3>
                <p className="text-white/60 text-sm font-light">Sustainable digital legacy management</p>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  {
                    metric: "Energy Efficiency",
                    value: "99% Less",
                    detail: "vs Traditional Banks",
                    color: "text-green-400",
                  },
                  {
                    metric: "Carbon Footprint",
                    value: "0.001 kWh",
                    detail: "per transaction",
                    color: "text-blue-400",
                  },
                  {
                    metric: "Sustainability",
                    value: "100% Green",
                    detail: "renewable powered",
                    color: "text-emerald-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#df500f]/20 rounded-full flex items-center justify-center border border-white/10">
                        <Leaf className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.metric}</div>
                        <div className="text-xs text-white/50">{item.detail}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <ChevronRight className="text-[#df500f] w-6 h-6" strokeWidth={2} />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Smart Contract Features - Bottom Right */}
        <Link href="/smart-contracts" className="col-span-12 md:col-span-4 row-span-3 group cursor-pointer">
          <motion.div
            className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 shadow-xl"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            custom={6}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Smart Contract Cards */}
              <div className="mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">SC</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Will Contract</div>
                        <div className="text-white/60 text-xs">Active & Secure</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">✓ Active</div>
                      <div className="text-green-400 text-xs">Verified</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AS</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">Asset Distribution</div>
                        <div className="text-white/60 text-xs">Automated</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">Ready</div>
                      <div className="text-blue-400 text-xs">Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-xl font-thin text-white mb-2">Smart Contracts</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4 font-light">
                  Automated execution with blockchain security and transparency
                </p>

                <div className="flex justify-end">
                  <ArrowRight
                    className="text-white w-6 h-6 group-hover:translate-x-1 transition-transform"
                    strokeWidth={2}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
