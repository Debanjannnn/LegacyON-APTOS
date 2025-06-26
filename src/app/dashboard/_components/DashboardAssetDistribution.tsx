"use client"
import React from "react"

export default function DashboardAssetDistribution() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <h3 className="text-white text-xl font-thin mb-8 text-center">Asset Distribution</h3>
      <div className="flex items-center justify-center gap-12">
        {/* Enhanced Donut Chart */}
        <div className="relative">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 rounded-full border-8 border-white/30 border-t-white border-r-white/20 transform rotate-45" />
            <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl text-white font-thin">73%</div>
                <div className="text-xs text-white/60">Allocated</div>
              </div>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-white/40 rounded-full inline-block"></span>
            <div>
              <div className="text-white text-sm font-medium">Digital Assets</div>
              <div className="text-white/60 text-xs">45% • $3,780</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-white/20 rounded-full inline-block"></span>
            <div>
              <div className="text-white text-sm font-medium">Smart Contracts</div>
              <div className="text-white/60 text-xs">28% • $2,350</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-white/10 rounded-full inline-block"></span>
            <div>
              <div className="text-white text-sm font-medium">Reserved</div>
              <div className="text-white/60 text-xs">27% • $2,270</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 