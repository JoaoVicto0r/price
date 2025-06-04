"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking")
/*
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isOnline = await api.healthCheck()
        setStatus(isOnline ? "online" : "offline")
      } catch {
        setStatus("offline")
      }
    }

    checkStatus()

    // Verificar a cada 30 segundos
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])
*/
/*
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "API Online"
      case "offline":
        return "API Offline"
      default:
        return "Verificando..."
    }
  }

  */
  return /* (
   
   <div className="bg-white rounded-lg shadow-lg px-3 py-2 flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === "checking" ? "animate-pulse" : ""}`}></div>
      <span className="text-xs font-extrabold text-neutral-600 tracking-wider">{getStatusText()}</span>
    </div>
  )
    */
}
