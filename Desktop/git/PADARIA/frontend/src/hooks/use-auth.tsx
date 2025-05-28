"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        // Aqui não busca token no localStorage
        // Presume que backend vai autenticar via cookie HttpOnly
        const userProfile = await api.getProfile();
        if (isMounted) setUser(userProfile);
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // api.login faz fetch com credentials: 'include', backend seta cookie HttpOnly
      const response = await api.login(email, password);
      // não precisa guardar token no localStorage nem setar no api
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await api.register(userData);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout(); // ideal que o backend limpe o cookie da sessão
    setUser(null);
    setLoading(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be usado dentro de um AuthProvider");
  }
  return context;
}
