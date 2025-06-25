"use client"
import { useState, useRef, useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { WalletSelector } from "@/components/WalletSelector"
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance"
import { Plus, LogOut, Copy, CheckCircle, User, Shield } from "lucide-react"
import { motion } from "framer-motion"

const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export default function DashboardWalletCard({ aptosData }: { aptosData: any }) {
  const { account, connected, disconnect } = useWallet()
  const [aptBalance, setAptBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const walletDropdownRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (connected && account?.address) {
      setBalanceLoading(true)
      getAccountAPTBalance({ accountAddress: account.address.toStringLong() })
        .then((bal) => setAptBalance(bal / 1e8))
        .finally(() => setBalanceLoading(false))
    } else {
      setAptBalance(null)
    }
  }, [connected, account])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setWalletDropdownOpen(false)
      }
    }
    if (walletDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [walletDropdownOpen])

  const copyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address.toStringLong())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return !connected ? (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[#df500f]/20 to-[#ff6b35]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
        <User className="w-8 h-8 text-[#df500f]" />
      </div>
      <h3 className="text-white text-xl font-thin mb-3">Connect Your Wallet</h3>
      <p className="text-white/60 text-sm mb-6 leading-relaxed">
        Connect your wallet.
      </p>
      <WalletSelector />
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-white/40">
          <Shield className="w-4 h-4" />
          <span>Secured by Aptos Blockchain</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-br from-[#df500f] to-[#ff6b35] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        {/* Wallet Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium">Wallet Details</div>
              <div className="text-xs opacity-80">Connected</div>
            </div>
          </div>
          <div className="relative" ref={walletDropdownRef}>
            <motion.button
              className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
            {walletDropdownOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 transition-colors flex items-center gap-3"
                  onClick={copyAddress}
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? "Copied!" : "Copy Address"}</span>
                </button>
                <div className="border-t border-white/10"></div>
                <button
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                  onClick={() => {
                    disconnect()
                    setWalletDropdownOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
        {/* Balance Display */}
        <div className="mb-4">
          <div className="text-3xl font-thin mb-2">
            {balanceLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-lg">Loading...</span>
              </div>
            ) : aptBalance !== null ? (
              `${aptBalance.toFixed(4)} APT`
            ) : (
              "0.0000 APT"
            )}
          </div>
          {aptosData && aptBalance && (
            <div className="text-sm opacity-80">
              ≈ {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(aptBalance * aptosData.current_price.usd)}
            </div>
          )}
        </div>
        {/* Address Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-60 mb-1">Wallet Address</div>
              <div className="text-sm font-mono">
                {account?.address ? truncateAddress(account.address.toStringLong()) : ""}
              </div>
            </div>
            <motion.button
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyAddress}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-300" />
              ) : (
                <Copy className="w-4 h-4 text-white/60" />
              )}
            </motion.button>
          </div>
        </div>
        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Aptos Blockchain • Active</span>
          </div>
          {aptosData && (
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                aptosData.price_change_percentage_24h >= 0
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {aptosData.price_change_percentage_24h >= 0 ? "+" : ""}
              {aptosData.price_change_percentage_24h.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
} 