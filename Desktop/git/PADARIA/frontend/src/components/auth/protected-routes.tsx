"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    {/* console.log({ isAuthenticated, loading, user }) */}
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Redirecionando para login...</div>
      </div>
    )
  }

  return <>{children}</>
}
