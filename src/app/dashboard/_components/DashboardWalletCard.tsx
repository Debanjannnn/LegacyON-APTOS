"use client"
import { useState, useRef, useEffect } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { WalletSelector } from "@/components/WalletSelector"
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance"
import { User, Shield, Wallet, Wifi, QrCode } from "lucide-react"
import { motion } from "framer-motion"

const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export default function DashboardWalletCard({ aptosData }: { aptosData: any }) {
  const { account, connected } = useWallet()
  const [aptBalance, setAptBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const walletDropdownRef = useRef<HTMLDivElement>(null)


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



  // Not connected state
  if (!connected) {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-[#C0C0C0]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
          <User className="w-8 h-8 text-[#C0C0C0]" />
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
    )
  }

  // Connected state: Modern Card UI
  return (
    <div className="min-h-[18rem] flex items-center justify-center p-0">
      <motion.div
        className="relative w-96 h-60 rounded-2xl overflow-hidden cursor-pointer"
        initial={{ scale: 1.20 }}
        // whileHover={{
        //   scale: 1.05,
        //   transition: { duration: 0.6, ease: "easeOut" },
        // }}
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #2a2a2a 70%, #f5f5f7 100%)",
        }}
      >
        {/* Matte texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/20" />

        {/* Subtle noise texture for satin finish */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft spotlight effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/15 via-white/5 to-transparent opacity-0"
          style={{
            background:
              "radial-gradient(circle 200px at var(--x, 50%) var(--y, 50%), rgba(245,245,247,0.15) 0%, rgba(245,245,247,0.05) 40%, transparent 70%)",
          }}
          whileHover={{
            opacity: 1,
            transition: { duration: 0.8, ease: "easeInOut" },
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            e.currentTarget.style.setProperty("--x", `${x}%`)
            e.currentTarget.style.setProperty("--y", `${y}%`)
          }}
        />

        {/* Card content */}
        <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white font-inter">
          {/* Top row */}
          <div className="flex justify-between items-start">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-wider uppercase">APTOS WALLET</span>
            </div>

            {/* NFC/Chip symbol */}
            <div className="w-10 h-8 rounded border border-white/30 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white/70" />
            </div>
          </div>

          {/* Middle section - Balance and Network info */}
          <div className="flex flex-col space-y-1">
            <span className="text-xs font-medium tracking-widest uppercase text-white/70">APTOS NETWORK</span>
            <span className="text-lg font-semibold tracking-wider">
              {balanceLoading ? (
                <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> Loading...</span>
              ) : aptBalance !== null ? (
                `${aptBalance.toFixed(4)} APT`
              ) : (
                "0.0000 APT"
              )}
            </span>
            {aptosData && aptBalance && (
              <span className="text-xs text-white/60">
                ≈ {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(aptBalance * aptosData.current_price.usd)}
              </span>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-end">
            {/* User info */}
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-widest uppercase text-white/70 mb-1">CARDHOLDER</span>
              <span className="text-sm font-semibold tracking-wider uppercase">{account?.address ? truncateAddress(account.address.toStringLong()) : "-"}</span>
              <span className="text-xs text-white/60 tracking-wide">{account?.address ? `@aptos` : ""}</span>
            </div>

            {/* QR/Address */}
            <div className="flex flex-col items-end">
              <QrCode className="w-6 h-6 text-white/70 mb-1" />
              <span className="text-xs text-white/60 tracking-wider font-mono">{account?.address ? truncateAddress(account.address.toStringLong()) : ""}</span>
            </div>
          </div>
        </div>

        {/* Hover shadow */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-br from-gray-300/10 to-black/30 rounded-3xl -z-10 blur-xl"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
        />
      </motion.div>
    </div>
  )
} 