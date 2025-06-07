"use client"

import type React from "react"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Usuário não autenticado, redirecionando para login...")
      router.push("/")
      return
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Verificando autenticação...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider text-center">
          <div className="mb-4">Erro de autenticação:</div>
          <div className="text-lg">{error}</div>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-4 px-6 py-2 bg-white text-indigo-500 rounded-lg hover:bg-gray-100 transition"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
