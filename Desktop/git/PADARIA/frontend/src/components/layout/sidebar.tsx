"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChefHat, Package, DollarSign, MessageSquare, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getActiveTab = () => {
    if (pathname.includes("/receitas")) return "receitas"
    if (pathname.includes("/insumos")) return "insumos"
    if (pathname.includes("/financeiro")) return "financeiro"
    if (pathname.includes("/suporte")) return "suporte"
    return ""
  }

  const activeTab = getActiveTab()

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      logout()
    }
  }

  return (
    <div className="w-80 h-screen bg-white rounded-r-[50px] p-8 fixed left-0 top-0 z-50">
      <div className="mb-12">
        <h1 className="text-2xl font-extrabold text-indigo-500 tracking-widest">CulinaryCalc</h1>
        <p className="text-neutral-400 text-sm tracking-wider mt-2">Dashboard Culinário</p>
        {user && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-xs font-extrabold text-indigo-600 tracking-wider">Bem-vindo!</p>
            <p className="text-xs text-indigo-500 tracking-wider">{user.name}</p>
          </div>
        )}
      </div>

      <nav className="space-y-4">
        <Link
          href="/receitas"
          className={`block w-full text-left p-4 rounded-lg tracking-wider transition-all ${
            activeTab === "receitas" ? "bg-indigo-500 text-white font-extrabold" : "text-neutral-600 hover:bg-indigo-50"
          }`}
        >
          <ChefHat className="inline mr-3 w-5 h-5" />
          Receitas
        </Link>
        <Link
          href="/insumos"
          className={`block w-full text-left p-4 rounded-lg tracking-wider transition-all ${
            activeTab === "insumos" ? "bg-indigo-500 text-white font-extrabold" : "text-neutral-600 hover:bg-indigo-50"
          }`}
        >
          <Package className="inline mr-3 w-5 h-5" />
          Insumos
        </Link>
        <Link
          href="/financeiro"
          className={`block w-full text-left p-4 rounded-lg tracking-wider transition-all ${
            activeTab === "financeiro"
              ? "bg-indigo-500 text-white font-extrabold"
              : "text-neutral-600 hover:bg-indigo-50"
          }`}
        >
          <DollarSign className="inline mr-3 w-5 h-5" />
          Financeiro
        </Link>
        <Link
          href="/suporte"
          className={`block w-full text-left p-4 rounded-lg tracking-wider transition-all ${
            activeTab === "suporte" ? "bg-indigo-500 text-white font-extrabold" : "text-neutral-600 hover:bg-indigo-50"
          }`}
        >
          <MessageSquare className="inline mr-3 w-5 h-5" />
          Suporte
        </Link>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="block w-full text-left p-4 rounded-lg tracking-wider transition-all text-red-600 hover:bg-red-50"
        >
          <LogOut className="inline mr-3 w-5 h-5" />
          Sair
        </button>
      </nav>

      <div className="absolute bottom-8 left-8 right-8">
        <div className="w-32 h-32 bg-indigo-500 rounded-tr-[40px] rounded-br-[40px] relative">
          <div className="absolute inset-0 flex items-center justify-center text-indigo-300 text-6xl font-extrabold tracking-[8px]">
            C
          </div>
        </div>
      </div>
    </div>
  )
}
