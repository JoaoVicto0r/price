"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, error } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Usando window.location para garantir limpeza completa do estado
      window.location.href = "/"
      return
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Verificando autenticação...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">
          Erro de autenticação: {error}
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}