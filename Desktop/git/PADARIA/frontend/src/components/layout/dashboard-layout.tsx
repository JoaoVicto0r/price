"use client"

import type React from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-indigo-500/50 font-['Inter']">
      <div className="flex">
        <Sidebar />
        {/* Main Content */}
        <div className="ml-80 flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
