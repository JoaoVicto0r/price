"use client"

import type React from "react"
import  Sidebar  from "./sidebar"
import { ApiStatus } from "../common/api-status"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-indigo-500/50 font-['Telegraf']">
      <div className="flex">
        <Sidebar />
        {/* Main Content */}
        <div className="ml-80 flex-1 p-8">
          {/* Status da API no canto superior direito */}
          <div className="fixed top-8 right-8 z-50">
            
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
