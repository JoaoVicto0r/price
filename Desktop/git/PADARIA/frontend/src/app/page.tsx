"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import  LoginForm  from "@/components/auth/loginform"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/receitas")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-500/50">
        <div className="text-white text-xl tracking-wider">Carregando...</div>
      </div>
    )
  }

  return <LoginForm />
}
