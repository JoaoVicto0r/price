"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/receitas")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-500/50">
      <div className="text-white text-xl tracking-wider">Redirecionando...</div>
    </div>
  )
}
