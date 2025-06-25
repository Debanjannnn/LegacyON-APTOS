"use client"
import React, { useState } from "react"
import { motion, AnimatePresence, useScroll } from "motion/react"
import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"

import { ShimmerButton } from "../magicui/shimmer-button"
import { BorderBeam } from "../magicui/border-beam"
import { useWallet, WalletItem, groupAndSortWallets } from "@aptos-labs/wallet-adapter-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Copy, LogOut, User } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { truncateAddress } from "@aptos-labs/wallet-adapter-react"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: any
  }[]
  className?: string
}) => {
  const { scrollYProgress } = useScroll()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { connected, account, disconnect, wallets } = useWallet()
  const { toast } = useToast()

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1

    if (index === hoveredIndex) {
      return 1.2 // Scale up the hovered item
    }

    return 1 // Keep other items at normal size
  }

  const copyAddress = async () => {
    if (!account?.address.toStringLong()) return
    try {
      await navigator.clipboard.writeText(account.address.toStringLong())
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 50,
          damping: 15,
        }}
        className={cn(
          "flex max-w-4xl mx-auto border border-white/20 dark:border-gray-300/20 rounded-3xl bg-white/10 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(255,255,255,0.1),0px_0px_0px_1px_rgba(255,255,255,0.05)] anim z-[5000] px-4 py-2 items-center justify-between space-x-2 relative overflow-hidden",
          className,
        )}
      >
        {/* Animated gradient background - now transparent */}
        <motion.div
          className="absolute inset-0 z-[-1] bg-gradient-to-r from-white/5 via-gray-100/10 to-white/5 rounded-3xl"
          animate={{
            scale: [1, 1.03, 0.97, 1.02, 1],
            y: [0, -2, 3, -2, 0],
            rotate: [0, 0.5, -0.5, 0.3, 0],
            opacity: [0.3, 0.5, 0.4, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />

        <div className="flex items-center space-x-2">
            <img src="https://i.pinimg.com/736x/49/b3/4c/49b34c656d327c34137701edfc7bc6ae.jpg" alt="Fork Work" width={32} height={32} className="rounded-full" />
          <span className={cn("text-xl font-semibold text-black dark:text-white", poppins.className)}>Qubik</span>
        </div>

        <div className="flex items-center space-x-6 ">
          {navItems.map((navItem: any, idx: number) => (
            <motion.a
              key={`link=${idx}`}
              href={navItem.link}
              className={cn("relative text-black dark:text-black  items-center flex space-x-1", poppins.className)}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Wallet Connection Section */}
        <div className="flex items-center space-x-2">
          {connected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 text-black dark:text-white hover:bg-white/20">
                  {account?.ansName || truncateAddress(account?.address.toStringLong()) || "Unknown"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border-white/20">
                <DropdownMenuItem onSelect={copyAddress} className="gap-2">
                  <Copy className="h-4 w-4" /> Copy address
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={disconnect} className="gap-2">
                  <LogOut className="h-4 w-4" /> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            (() => {
              const { availableWallets } = groupAndSortWallets(wallets)
              const firstWallet = availableWallets[0]
              
              if (!firstWallet) {
                return (
                  <ShimmerButton onClick={() => {
                    toast({
                      variant: "destructive",
                      title: "No wallets available",
                      description: "Please install a wallet extension first.",
                    })
                  }}>
                    <BorderBeam duration={8} colorFrom="#df500f" size={40} colorTo="#8c2744" />
                    Connect Wallet
                  </ShimmerButton>
                )
              }

              return (
                <WalletItem wallet={firstWallet}>
                  <WalletItem.ConnectButton asChild>
                    <ShimmerButton>
                      <BorderBeam duration={8} colorFrom="#df500f" size={40} colorTo="#8c2744" />
                      Connect Wallet
                    </ShimmerButton>
                  </WalletItem.ConnectButton>
                </WalletItem>
              )
            })()
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
