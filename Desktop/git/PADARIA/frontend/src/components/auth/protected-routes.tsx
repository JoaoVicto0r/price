// components/protected-route.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">
          {loading ? "Carregando..." : "Redirecionando para login..."}
        </div>
      </div>
    )
  }

  return <>{children}</>
}