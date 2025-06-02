"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth"; // Importe seu hook de autenticação

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Redireciona baseado no estado de autenticação
      const targetRoute = isAuthenticated ? "/receitas" : "/login";
      router.push(targetRoute);
      
      // Temporizador de fallback caso o redirecionamento falhe
      const timeout = setTimeout(() => {
        setRedirecting(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, loading, router]);

  if (!redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-500/50 p-4">
        <div className="text-white text-xl mb-4 tracking-wider">
          Redirecionamento falhou
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-500/50 p-4">
      <div className="text-white text-xl mb-4 tracking-wider">
        Carregando aplicação...
      </div>
      <div className="w-8 h-8 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}