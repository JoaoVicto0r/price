"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    api.setToken(token); // Configura o token no ApiClient antes da requisição
    const userProfile = await api.getProfile();
    setUser(userProfile);
  } catch (err: any) {
    // Limpa tudo se houver erro 401
    if (err.message.includes('401')) {
      localStorage.removeItem('token');
      api.removeToken();
      setUser(null);
    }
  } finally {
    setLoading(false);
  }
};

    loadUser();
  }, []);

 const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.login(email, password);
    
    // Armazena em 3 lugares para consistência
    localStorage.setItem('token', response.access_token);
    api.setToken(response.access_token);
    setUser(response.user);
    
    // Redireciona aqui mesmo após login bem-sucedido
    router.push('/receitas');
    return true;
  } catch (err: any) {
    setError(err.message || "Falha no login");
    return false;
  } finally {
    setLoading(false);
  }
};

  const register = async (userData: { 
    name: string; 
    email: string; 
    password: string 
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.register(userData);
      setUser(response.user);
      return true;
    } catch (err: any) {
      setError(err.message || "Falha no registro");
      return false;
    } finally {
      setLoading(false);
    }
  };

 const logout = async () => {
  setLoading(true);
  try {
    await api.logout();
    setUser(null);
    // Adicione esta linha para remover o token
    api.removeToken();
    router.push("/login");
  } catch (err: any) {
    setError(err.message || "Falha ao sair");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: Boolean(user),
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}