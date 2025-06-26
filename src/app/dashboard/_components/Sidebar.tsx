"use client";
import type React from "react";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WalletSelector } from "@/components/WalletSelector";
import { FileText, Shield } from "lucide-react";

export function SidebarDemo({ children, onSectionChange }: { children: React.ReactNode, onSectionChange?: (section: string) => void }) {
  const links = [
    {
      label: "Dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white/70" />,
      section: "dashboard",
    },
    {
      label: "create will",
      section: "profile",
      icon: <FileText className="h-5 w-5 shrink-0 text-white/70" />,
    },
    {
      label: "check will",
      section: "settings",
      icon: <Shield className="h-5 w-5 shrink-0 text-white/70" />,
    },
    {
      label: "Logout",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white/70" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("flex w-screen h-screen flex-row overflow-hidden bg-[#120b03]")}
    >
      <div
        className="absolute left-0 right-0"
        style={{
          top: "30%",
          bottom: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.85) 80%, #000 100%)",
        }}
      ></div>
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 border-r border-white/10 shadow-2xl min-h-screen px-4 py-8 relative z-10 bg-transparent">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
            {/* @ts-ignore */}
              {links.filter(link => link.section).map((link, idx) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => onSectionChange && link.section && onSectionChange(link.section)}
                  className="text-left w-full"
                >
                  <SidebarLink
                    link={{ label: link.label, href: '#', icon: link.icon }}
                    className="rounded-xl px-3 py-3 transition-all duration-300 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white text-white/70 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-transparent hover:border-white/10"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            {/* Enhanced Wallet Section */}
            <div className="relative">
              {/* Main wallet container */}
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl hover:shadow-[0_0_30px_rgba(223,80,15,0.3)] transition-all duration-300 hover:border-white/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-white/10 to-[#C0C0C0]/30 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-[#C0C0C0]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Wallet</div>
                      <div className="text-white/50 text-xs">Connect to start</div>
                    </div>
                  </div>
                  {/* Status indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-white/60">Ready</span>
                  </div>
                </div>
                {/* Wallet Selector */}
                <div className="space-y-3">
                  <div className="w-full flex justify-center">
                    <WalletSelector className="w-full max-w-xs text-base font-semibold rounded-xl shadow-lg bg-gradient-to-r from-white/10 to-[#C0C0C0]/30 text-white py-3 px-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl" />
                  </div>
                  {/* Additional info */}
                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10 w-full">
                    <svg className="w-3 h-3 text-[#C0C0C0]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-white/50">Secured by EDU Chain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 min-h-screen overflow-y-auto bg-black/50 backdrop-blur-sm p-8 relative z-10">
        {children}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-3 py-4 px-4 mb-6 rounded-2xl bg-gradient-to-r from-[#df500f] to-[#ff6b35] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/10"
    >
      <div className="h-7 w-8 shrink-0 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-thin text-xl whitespace-pre text-white drop-shadow-md tracking-wide"
      >
        Qubik Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <div className="h-5 w-6 shrink-0 rounded-xl bg-gradient-to-r from-[#df500f] to-[#ff6b35] border border-white/10" />
    </a>
  );
};