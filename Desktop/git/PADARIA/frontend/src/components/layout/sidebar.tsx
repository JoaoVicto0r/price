"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChefHat, Package, DollarSign, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { 
      href: "/receitas", 
      label: "Receitas", 
      icon: <ChefHat className="w-5 h-5" />,
      matchPattern: "/receitas"
    },
    { 
      href: "/insumos", 
      label: "Insumos", 
      icon: <Package className="w-5 h-5" />,
      matchPattern: "/insumos"
    },
    { 
      href: "/financeiro", 
      label: "Financeiro", 
      icon: <DollarSign className="w-5 h-5" />,
      matchPattern: "/financeiro"
    },
    { 
      href: "/suporte", 
      label: "Suporte", 
      icon: <MessageSquare className="w-5 h-5" />,
      matchPattern: "/suporte"
    },
  ];

  const isActive = (path: string, matchPattern?: string) => {
    return matchPattern ? pathname.startsWith(matchPattern) : pathname === path;
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      logout();
    }
  };

  return (
    <aside 
      aria-label="Navegação principal"
      className="w-80 h-screen bg-white rounded-r-[50px] p-8 fixed left-0 top-0 z-50"
    >
      {/* Cabeçalho */}
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

      {/* Navegação */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 w-full text-left p-4 rounded-lg tracking-wider transition-all ${
              isActive(item.href, item.matchPattern)
                ? "bg-indigo-500 text-white font-extrabold"
                : "text-neutral-600 hover:bg-indigo-50"
            }`}
            aria-current={isActive(item.href, item.matchPattern) ? "page" : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left p-4 rounded-lg tracking-wider transition-all text-red-600 hover:bg-red-50"
          aria-label="Sair do sistema"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </nav>

      {/* Elemento decorativo */}
      <div className="absolute bottom-8 left-8 right-8">
        <div 
          className="w-32 h-32 bg-indigo-500 rounded-tr-[40px] rounded-br-[40px] relative"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center text-indigo-300 text-6xl font-extrabold tracking-[8px]">
            C
          </div>
        </div>
      </div>
    </aside>
  );
}