"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { WalletSelector } from "@/components/WalletSelector"
import { motion } from "framer-motion"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import {
  FileText,
  Wallet,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Lock,
  Copy,
  RefreshCw,
  Gift,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { surfClient } from "@/utils/surfClient"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export const WILL_ABI = {
  address: "0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9",
  name: "will",
  friends: [],
  exposed_functions: [
    {
      name: "initialize",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer"],
      return: [],
    },
    {
      name: "claim",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer", "address"],
      return: [],
    },
    {
      name: "create_will",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer", "address", "u64"],
      return: [],
    },
    {
      name: "get_will",
      visibility: "public",
      is_entry: false,
      is_view: true,
      generic_type_params: [],
      params: ["address"],
      return: ["0x1::option::Option<0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9::will::Will>"],
    },
    {
      name: "ping",
      visibility: "public",
      is_entry: true,
      is_view: false,
      generic_type_params: [],
      params: ["&signer"],
      return: [],
    },
  ],
  structs: [
    {
      name: "Will",
      is_native: false,
      is_event: false,
      abilities: ["copy", "drop", "store"],
      generic_type_params: [],
      fields: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "last_ping_time",
          type: "u64",
        },
        {
          name: "timeout_secs",
          type: "u64",
        },
      ],
    },
    {
      name: "WillState",
      is_native: false,
      is_event: false,
      abilities: ["key"],
      generic_type_params: [],
      fields: [
        {
          name: "wills",
          type: "0x1::table::Table<address, 0x937faeae1a19e86a0b35bf99ce606e02b9d223a37fb1189e33bee708324345e9::will::Will>",
        },
        {
          name: "balances",
          type: "0x1::table::Table<address, 0x1::coin::Coin<0x1::aptos_coin::AptosCoin>>",
        },
      ],
    },
  ],
} as const

export default function OnchainWill() {
  const { connected, account } = useWallet()
  const { client } = useWalletClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)
  const [detailedError, setDetailedError] = useState("")

  // Form states
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [willInitialized, setWillInitialized] = useState(false)
  const [willCreated, setWillCreated] = useState(false)
  const [pinged, setPinged] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const ownerAddress = account?.address?.toStringLong() || ""
  const abiClient = client?.useABI(WILL_ABI) || (null as any)

  const copyAddress = async () => {
    if (ownerAddress) {
      await navigator.clipboard.writeText(ownerAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  const isValidAddress = (addr: string) => {
    return addr.startsWith("0x") && addr.length >= 10
  }

  const isValidAmount = (amt: string) => {
    return amt && Number.parseFloat(amt) > 0
  }

  const handleError = (error: any) => {
    let msg = error?.message || "Unknown error"
    if (error?.status && error?.status.includes("Move abort")) {
      msg += ` (Move abort: ${error.status})`
    }
    setError(msg)
    setDetailedError(JSON.stringify(error, null, 2))
  }

  // Step 1: Initialize Will
  const handleInitialize = async () => {
    if (!abiClient) {
      setError("Wallet client not ready")
      return
    }
    setLoading(true)
    clearMessages()
    try {
      await abiClient["initialize"]({
        type_arguments: [],
        arguments: [],
      })
      setWillInitialized(true)
      setSuccess("Will contract initialized for your account!")
    } catch (e: any) {
      console.error(e)
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Create Will
  const handleCreateWill = async () => {
    if (!abiClient) {
      setError("Wallet client not ready")
      return
    }
    setLoading(true)
    clearMessages()
    try {
      await abiClient["create_will"]({
        type_arguments: [],
        arguments: [recipient as `0x${string}`, BigInt(Number.parseFloat(amount) * 1e8)],
      })
      setWillCreated(true)
      setSuccess("Will created successfully! Your digital legacy is set.")
    } catch (e: any) {
      console.error(e)
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Ping (optional)
  const handlePing = async () => {
    if (!abiClient) {
      setError("Wallet client not ready")
      return
    }
    setLoading(true)
    clearMessages()
    try {
      await abiClient["ping"]({
        type_arguments: [],
        arguments: [],
      })
      setPinged(true)
      setSuccess("Pinged successfully! Your will is kept alive.")
    } catch (e: any) {
      console.error(e)
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  // Step 4: Claim (optional, for recipient)
  const handleClaim = async () => {
    if (!abiClient) {
      setError("Wallet client not ready")
      return
    }
    setLoading(true)
    clearMessages()
    try {
      await abiClient["claim"]({
        type_arguments: [],
        arguments: [recipient as `0x${string}`],
      })
      setClaimed(true)
      setSuccess("Claimed successfully! Assets transferred.")
    } catch (e: any) {
      console.error(e)
      handleError(e)
    } finally {
      setLoading(false)
    }
  }

  // Check if will is already initialized for the connected user
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-will", ownerAddress],
    enabled: !!ownerAddress && connected,
    queryFn: async () => {
      try {
        const result = await surfClient().useABI(WILL_ABI).view.get_will({
          functionArguments: [ownerAddress as `0x${string}`],
          typeArguments: [],
        })
        return result
      } catch (err: any) {
        console.error("Error fetching will:", err)
        return null // Return null on error to indicate no will exists
      }
    },
    refetchInterval: 10000, // Poll every 10 seconds
    retry: 2, // Retry failed requests twice
    staleTime: 0, // Ensure fresh data on each fetch
  })

  useEffect(() => {
    // Check if data is an Option<Will> and contains a valid Will
    if (data && Array.isArray(data) && data[0] && typeof data[0] === "object" && "owner" in data[0]) {
      setWillInitialized(true)
      setWillCreated(true) // Assume will is created if it exists
    } else {
      setWillInitialized(false)
      setWillCreated(false)
    }
  }, [data])

  const canCreateWill =
    connected &&
    !loading &&
    isValidAddress(recipient) &&
    isValidAmount(amount) &&
    !willCreated

  return (
    <div
      className={cn("min-h-screen bg-black p-8 relative", poppins.className)}
      style={{
        backgroundImage: "url('/images/gradient.png')",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% auto",
      }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "30%",
          bottom: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.85) 80%, #000 100%)",
        }}
      ></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-thin text-white">Create Digital Will</h1>
          </div>
          <p className="text-white/60 text-lg font-light">Secure your digital legacy in 2 simple steps</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="flex items-center justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                willInitialized
                  ? "bg-green-500/20 border border-green-500/30"
                  : connected
                    ? "bg-[#df500f]/20 border border-[#df500f]/30"
                    : "bg-white/5 border border-white/10"
              }`}
            >
              {willInitialized ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Shield className="w-4 h-4 text-white/70" />
              )}
              <span className="text-sm text-white/80">Initialize Will</span>
            </div>

            <ArrowRight className="w-4 h-4 text-white/40" />

            {/* Step 2 */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                willCreated
                  ? "bg-green-500/20 border border-green-500/30"
                  : willInitialized
                    ? "bg-[#df500f]/20 border border-[#df500f]/30"
                    : "bg-white/5 border border-white/10"
              }`}
            >
              {willCreated ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Gift className="w-4 h-4 text-white/70" />
              )}
              <span className="text-sm text-white/80">Create Will</span>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Wallet Connection Section */}
          {!connected && (
            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#df500f]/10 to-[#ff6b35]/10">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Wallet className="w-8 h-8 text-[#df500f]" />
                </div>
                <h3 className="text-white text-xl font-thin mb-3">Connect Your Wallet</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed max-w-md mx-auto">
                  Connect your Aptos wallet to start creating your digital will.
                </p>
                <WalletSelector />
              </div>
            </div>
          )}

          {connected && (
            <div className="p-8">
              {/* Owner Address Display */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">Will Owner (Your Wallet)</h3>
                    <p className="text-white/60 text-sm">This will be created for your connected wallet</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Owner Address</div>
                      <div className="text-white text-sm font-mono">{truncateAddress(ownerAddress)}</div>
                    </div>
                    <motion.button
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyAddress}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/60" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Step 1: Initialize Will */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      willInitialized ? "bg-green-500/20" : "bg-[#df500f]/20"
                    }`}
                  >
                    {willInitialized ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Shield className="w-5 h-5 text-[#df500f]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">Step 1: Initialize Will</h3>
                    <p className="text-white/60 text-sm">Initialize your will contract on Aptos</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  {!willInitialized && (
                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={handleInitialize}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Initialize Will
                    </motion.button>
                  )}

                  {willInitialized && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Will initialized successfully</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Create Will */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      willCreated ? "bg-green-500/20" : willInitialized ? "bg-[#df500f]/20" : "bg-white/10"
                    }`}
                  >
                    {willCreated ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : willInitialized ? (
                      <Gift className="w-5 h-5 text-[#df500f]" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-medium transition-colors ${
                        willInitialized ? "text-white" : "text-white/40"
                      }`}
                    >
                      Step 2: Create Will
                    </h3>
                    <p className={`text-sm ${willInitialized ? "text-white/60" : "text-white/40"}`}>
                      Set recipient and amount for your will
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                    !willInitialized ? "opacity-50" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm font-light mb-2">Recipient Address</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#df500f]/50 focus:ring-2 focus:ring-[#df500f]/20 transition-all duration-300 disabled:opacity-50"
                        placeholder="Enter recipient address (0x...)"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={willCreated || !willInitialized || loading}
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm font-light mb-2">Amount (APT)</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#df500f]/50 focus:ring-2 focus:ring-[#df500f]/20 transition-all duration-300 disabled:opacity-50"
                        placeholder="Enter amount in APT"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        step="0.01"
                        min="0"
                        disabled={willCreated || !willInitialized || loading}
                      />
                    </div>

                    {willInitialized && !willCreated && (
                      <motion.button
                        className="w-full py-4 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={handleCreateWill}
                        disabled={!canCreateWill}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                        Create Will
                      </motion.button>
                    )}

                    {!willInitialized && (
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Complete Step 1 to unlock</span>
                      </div>
                    )}

                    {willCreated && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Will created successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional: Ping and Claim */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ping */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-5 h-5 text-[#df500f]" />
                    <span className="text-white font-medium">Ping (Keep Alive)</span>
                  </div>
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                    onClick={handlePing}
                    disabled={loading || !willCreated}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Ping
                  </motion.button>
                  {pinged && <div className="text-green-400 text-sm">Pinged successfully!</div>}
                </div>

                {/* Claim */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Gift className="w-5 h-5 text-[#df500f]" />
                    <span className="text-white font-medium">Claim (Recipient)</span>
                  </div>
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-2"
                    onClick={handleClaim}
                    disabled={loading || !isValidAddress(recipient)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                    Claim
                  </motion.button>
                  {claimed && <div className="text-green-400 text-sm">Claimed successfully!</div>}
                </div>
              </div>

              {/* Messages */}
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="text-red-400 text-sm">{error}</div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="text-green-400 text-sm">{success}</div>
                </motion.div>
              )}

              {detailedError && (
                <motion.div
                  className="p-4 bg-red-900/10 border border-red-900/20 rounded-2xl mt-2 text-xs text-red-300 whitespace-pre-wrap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {detailedError}
                </motion.div>
              )}

              {/* Security Notice */}
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#df500f]" />
                  <h4 className="text-white font-medium">Security Notice</h4>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Your digital will is secured by the Aptos blockchain. All transactions are immutable and transparent.
                  Make sure to verify the recipient address carefully before proceeding.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ABI Dev Section */}
        <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <h4 className="text-white font-bold mb-2">ABI Functions (Dev/Advanced)</h4>
          <ul className="text-white/70 text-xs space-y-1">
            {WILL_ABI.exposed_functions.map(fn => (
              <li key={fn.name}>
                <span className="font-mono">{fn.name}</span> (
                {fn.params.filter(p => p !== "&signer").join(", ")})
                {fn.is_entry && (
                  <button
                    className="ml-2 px-2 py-1 bg-blue-700/30 rounded text-white/80 hover:bg-blue-700/60"
                    onClick={() => alert(`Call this function via UI or code: ${fn.name}`)}
                  >
                    Call
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
