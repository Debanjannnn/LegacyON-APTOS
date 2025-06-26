"use client"
import { useState, useRef, useEffect } from "react"
//@ts-ignore
import { Button } from "@/components/ui/button"
//@ts-ignore
import {
  FileText,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
//@ts-ignore
import { WalletSelector } from "@/components/WalletSelector"
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance"
import DashboardWalletCard from "./_components/DashboardWalletCard"
import DashboardTransactions, { DashboardTransaction } from "./_components/DashboardTransactions"
import { SidebarDemo } from "./_components/Sidebar"
import DashboardAssetDistribution from "./_components/DashboardAssetDistribution"
import DashboardPriceChart from "./_components/DashboardPriceChart"
import DashboardCreateWill from "./createwill/CreateWillPage"
import CheckWillPage from "./checkwill/CheckWillPage"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
})

interface AptosData {
  current_price: { usd: number }
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  market_cap: { usd: number }
  total_volume: { usd: number }
  high_24h: { usd: number }
  low_24h: { usd: number }
}

export default function DashboardPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [aptosData, setAptosData] = useState<AptosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  //@ts-ignore
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  //@ts-ignore
  const router = useRouter()
  //@ts-ignore
  const { account, connected, disconnect } = useWallet()
  //@ts-ignore
  const [aptBalance, setAptBalance] = useState<number | null>(null)
  //@ts-ignore
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false)
  const walletDropdownRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<string>("dashboard")

  const fetchAptosData = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://api.coingecko.com/api/v3/coins/aptos")
      const data = await response.json()
      setAptosData(data.market_data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching Aptos data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAptosData()
    // Update every 30 seconds
    const interval = setInterval(fetchAptosData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

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
  //@ts-ignore 
  const copyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address.toStringLong())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const transactions = [
    {
      name: "Will Creation",
      date: "Dec 15, 2:30 PM",
      amount: "-$0.01",
      type: "sent",
      status: "Completed",
      icon: FileText,
    },
    {
      name: "Asset Distribution",
      date: "Dec 12, 10:15 AM",
      amount: "+$2,500.00",
      type: "received",
      status: "Executed",
      icon: TrendingUp,
    },
    {
      name: "Smart Contract Update",
      date: "Dec 10, 4:45 PM",
      amount: "-$0.01",
      type: "sent",
      status: "Completed",
      icon: Shield,
    },
    {
      name: "Legacy Verification",
      date: "Dec 8, 9:20 AM",
      amount: "-$0.01",
      type: "sent",
      status: "Verified",
      icon: CheckCircle,
    },
  ]

  // Generate price history simulation based on current price
  const generatePriceHistory = () => {
    if (!aptosData) return [60, 40, 80, 50, 70, 30, 50, 65, 45, 75, 55, 85, 40, 70, 60, 90, 35, 65, 80, 45]
    //@ts-ignore
    const currentPrice = aptosData.current_price.usd
    //@ts-ignore
    const change24h = aptosData.price_change_percentage_24h
    const change7d = aptosData.price_change_percentage_7d

    // Simulate 20 data points for wider chart
    const baseHeight = 50
    const variation = 30

    return Array.from({ length: 20 }, (_, i) => {
      const dayProgress = i / 19
      const trendFactor = change7d > 0 ? dayProgress * 0.3 + 0.7 : (1 - dayProgress) * 0.3 + 0.7
      const randomVariation = (Math.random() - 0.5) * 0.4
      return Math.max(20, Math.min(80, baseHeight + variation * trendFactor + variation * randomVariation))
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price)
  }

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? "+" : ""
    return `${sign}${percentage.toFixed(2)}%`
  }
  //@ts-ignore
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div
      className={cn("min-h-screen bg-[#120b03] p-0 m-0 relative", poppins.className)}
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

      <div className="w-screen h-screen flex flex-row">
        <SidebarDemo onSectionChange={setActiveSection}>
          {activeSection === "dashboard" && (
            <main className="flex-1 grid grid-cols-3 gap-6">
              <motion.section className="col-span-1 flex flex-col gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <DashboardWalletCard aptosData={aptosData} />
                <DashboardTransactions transactions={transactions as DashboardTransaction[]} />
              </motion.section>
              <motion.section className="col-span-2 flex flex-col gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <DashboardAssetDistribution />
                <DashboardPriceChart
                  aptosData={aptosData}
                  loading={loading}
                  lastUpdated={lastUpdated}
                  fetchAptosData={fetchAptosData}
                  generatePriceHistory={generatePriceHistory}
                  formatPrice={formatPrice}
                  formatPercentage={formatPercentage}
                />
              </motion.section>
            </main>
          )}
          {activeSection === "profile" && (
            <DashboardCreateWill />
          )}
          {activeSection === "settings" && (
            <CheckWillPage />
          )}
        </SidebarDemo>
      </div>
    </div>
  )
}
