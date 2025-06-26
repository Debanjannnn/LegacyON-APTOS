"use client"

import { useState } from "react"
import { WILL_ABI } from "@/utils/will_abi"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { WalletSelector } from "@/components/WalletSelector"
import { motion } from "framer-motion"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import {
  FileText,
  Wallet,
  User,
  DollarSign,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Lock,
  Copy,
} from "lucide-react"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

export default function OnchainWill() {
  const { connected, account } = useWallet()
  const { client } = useWalletClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)

  // Form states
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [willInitialized, setWillInitialized] = useState(false)

  // Step completion states
  const [recipientSet, setRecipientSet] = useState(false)
  const [fundsDeposited, setFundsDeposited] = useState(false)

  const ownerAddress = account?.address?.toStringLong() || ""

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
//@ts-ignore
  const clearMessages = () => {
    setError("")
    setSuccess("")
  }
//@ts-ignore
  const setRecipientFn = async () => {
    setLoading(true)
    setError("")
    try {
      //@ts-ignore
      await client.set_recipient({
        type_arguments: [],
        arguments: [recipient as `0x${string}`],
      })
      setRecipientSet(true)
      setSuccess("Recipient set successfully! You can now deposit funds.")
    } catch (e: any) {
      setError(e.message || "Failed to set recipient")
    } finally {
      setLoading(false)
    }
  }
//@ts-ignore
  const depositFunds = async () => {
    setLoading(true)
    setError("")
    try {
      //@ts-ignore
      await client.deposit({
        type_arguments: [],
        arguments: [BigInt(Number.parseFloat(amount) * 1e8)], // Convert to octas
      })
      setFundsDeposited(true)
      setSuccess("Funds deposited successfully! You can now initialize your will.")
    } catch (e: any) {
      setError(e.message || "Failed to deposit funds")
    } finally {
      setLoading(false)
    }
  }
//@ts-ignore
  const initializeWill = async () => {
    setLoading(true)
    setError("")
    try {
      //@ts-ignore
      await client.initialize_will({
        type_arguments: [],
        arguments: [],
      })
      setWillInitialized(true)
      setSuccess("Will initialized successfully! Your digital legacy is now secured.")
    } catch (e: any) {
      setError(e.message || "Failed to initialize will")
    } finally {
      setLoading(false)
    }
  }

  const isValidAddress = (addr: string) => {
    return addr.startsWith("0x") && addr.length >= 10
  }
//@ts-ignore
  const abiClient = client.useABI(WILL_ABI)

  return (
    <div
      className={cn("min-h-screen  p-8 relative", poppins.className)}
    >
      {/* Gradient overlay */}
      <div
        className="absolute left-0 right-0"></div>

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
          <p className="text-white/60 text-lg font-light">Secure your digital legacy in 3 simple steps</p>
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
                recipientSet
                  ? "bg-green-500/20 border border-green-500/30"
                  : connected
                    ? "bg-[#df500f]/20 border border-[#df500f]/30"
                    : "bg-white/5 border border-white/10"
              }`}
            >
              {recipientSet ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <User className="w-4 h-4 text-white/70" />
              )}
              <span className="text-sm text-white/80">Set Recipient</span>
            </div>

            <ArrowRight className="w-4 h-4 text-white/40" />

            {/* Step 2 */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                fundsDeposited
                  ? "bg-green-500/20 border border-green-500/30"
                  : recipientSet
                    ? "bg-[#df500f]/20 border border-[#df500f]/30"
                    : "bg-white/5 border border-white/10"
              }`}
            >
              {fundsDeposited ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <DollarSign className="w-4 h-4 text-white/70" />
              )}
              <span className="text-sm text-white/80">Deposit Funds</span>
            </div>

            <ArrowRight className="w-4 h-4 text-white/40" />

            {/* Step 3 */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                willInitialized
                  ? "bg-green-500/20 border border-green-500/30"
                  : fundsDeposited
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
                  <div className="w-10 h-10 bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-xl flex items-center justify-center">
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

              {/* Step 1: Set Recipient */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      recipientSet ? "bg-green-500/20" : "bg-[#df500f]/20"
                    }`}
                  >
                    {recipientSet ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <User className="w-5 h-5 text-[#df500f]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-medium">Step 1: Set Recipient</h3>
                    <p className="text-white/60 text-sm">Choose who will inherit your digital assets</p>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm font-light mb-2">Recipient Address</label>
                      <input
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[#df500f]/50 focus:ring-2 focus:ring-[#df500f]/20 transition-all duration-300 disabled:opacity-50"
                        placeholder="Enter recipient address (0x...)"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={recipientSet || loading}
                      />
                    </div>

                    {!recipientSet && (
                      <motion.button
                        className="w-full py-4 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={() =>
                          abiClient
                            .set_recipient({
                              type_arguments: [],
                              arguments: [recipient as `0x${string}`],
                            })
                            .then(() => {
                              setRecipientSet(true)
                              setSuccess("Recipient set successfully! You can now deposit funds.")
                            })
                            .catch((e: any) => {
                              setError(e.message || "Failed to set recipient")
                            })
                            .finally(() => {
                              setLoading(false)
                            })
                        }
                        disabled={loading || !isValidAddress(recipient)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                        Set Recipient
                      </motion.button>
                    )}

                    {recipientSet && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Recipient set successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Deposit Funds */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      fundsDeposited ? "bg-green-500/20" : recipientSet ? "bg-[#df500f]/20" : "bg-white/10"
                    }`}
                  >
                    {fundsDeposited ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : recipientSet ? (
                      <DollarSign className="w-5 h-5 text-[#df500f]" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-medium transition-colors ${
                        recipientSet ? "text-white" : "text-white/40"
                      }`}
                    >
                      Step 2: Deposit Funds
                    </h3>
                    <p className={`text-sm ${recipientSet ? "text-white/60" : "text-white/40"}`}>
                      Add APT tokens to your will
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                    !recipientSet ? "opacity-50" : ""
                  }`}
                >
                  <div className="space-y-4">
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
                        disabled={!recipientSet || fundsDeposited || loading}
                      />
                    </div>

                    {recipientSet && !fundsDeposited && (
                      <motion.button
                        className="w-full py-4 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={() =>
                          abiClient
                            .deposit({
                              type_arguments: [],
                              arguments: [BigInt(Number.parseFloat(amount) * 1e8)], // Convert to octas
                            })
                            .then(() => {
                              setFundsDeposited(true)
                              setSuccess("Funds deposited successfully! You can now initialize your will.")
                            })
                            .catch((e: any) => {
                              setError(e.message || "Failed to deposit funds")
                            })
                            .finally(() => {
                              setLoading(false)
                            })
                        }
                        disabled={loading || !amount || Number.parseFloat(amount) <= 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                        Deposit {amount} APT
                      </motion.button>
                    )}

                    {!recipientSet && (
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Complete Step 1 to unlock</span>
                      </div>
                    )}

                    {fundsDeposited && (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Funds deposited successfully</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Initialize Will */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      willInitialized ? "bg-green-500/20" : fundsDeposited ? "bg-[#df500f]/20" : "bg-white/10"
                    }`}
                  >
                    {willInitialized ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : fundsDeposited ? (
                      <Shield className="w-5 h-5 text-[#df500f]" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-medium transition-colors ${
                        fundsDeposited ? "text-white" : "text-white/40"
                      }`}
                    >
                      Step 3: Initialize Will
                    </h3>
                    <p className={`text-sm ${fundsDeposited ? "text-white/60" : "text-white/40"}`}>
                      Finalize and secure your digital will
                    </p>
                  </div>
                </div>

                <div
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                    !fundsDeposited ? "opacity-50" : ""
                  }`}
                >
                  {fundsDeposited && !willInitialized && (
                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-[#df500f] to-[#ff6b35] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(223,80,15,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      onClick={() =>
                        abiClient
                          .initialize_will({
                            type_arguments: [],
                            arguments: [],
                          })
                          .then(() => {
                            setWillInitialized(true)
                            setSuccess("Will initialized successfully! Your digital legacy is now secured.")
                          })
                          .catch((e: any) => {
                            setError(e.message || "Failed to initialize will")
                          })
                          .finally(() => {
                            setLoading(false)
                          })
                      }
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      Initialize Will
                    </motion.button>
                  )}

                  {!fundsDeposited && (
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Lock className="w-4 h-4" />
                      <span>Complete Steps 1 & 2 to unlock</span>
                    </div>
                  )}

                  {willInitialized && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-green-400 text-lg mb-2">
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Will Initialized Successfully!</span>
                      </div>
                      <p className="text-white/60 text-sm">Your digital legacy is now secured on the blockchain</p>
                    </div>
                  )}
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
      </div>
    </div>
  )
}
