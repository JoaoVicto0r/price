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
  const token = localStorage.getItem('token')
  
  if (!token) {
    setLoading(false)
    return
  }

  try {
    api.setToken(token)
    const userProfile = await api.getProfile()
    setUser(userProfile)
    
    // Verificação adicional do token
    if (!userProfile || !userProfile.id) {
      throw new Error("Perfil de usuário inválido")
    }
  } catch (err: any) {
    console.error("Erro ao carregar usuário:", err)
    localStorage.removeItem('token')
    api.removeToken()
    setUser(null)
  } finally {
    setLoading(false)
  }
}

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.login(email, password);
    
    // Armazenamento consistente do token
    localStorage.setItem('token', response.access_token);
    api.setToken(response.access_token);
    setUser(response.user);
    
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
    router.push("/");
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
}"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { api } from "@/lib/api-fixed"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const clearError = () => setError(null)

  useEffect(() => {
    const loadUser = async () => {
      console.log("Carregando usuário...")

      const token = localStorage.getItem("token")
      console.log("Token encontrado no localStorage:", token ? "Sim" : "Não")

      if (!token) {
        console.log("Nenhum token encontrado, usuário não autenticado")
        setLoading(false)
        return
      }

      try {
        // Garante que o token está definido na instância da API
        api.setToken(token)

        console.log("Tentando obter perfil do usuário...")
        const userProfile = await api.getProfile()
        console.log("Perfil obtido:", userProfile)

        if (!userProfile || !userProfile.id) {
          throw new Error("Perfil de usuário inválido")
        }

        setUser(userProfile)
        console.log("Usuário autenticado com sucesso")
      } catch (err: any) {
        console.error("Erro ao carregar usuário:", err)

        // Remove token inválido
        localStorage.removeItem("token")
        api.removeToken()
        setUser(null)
        setError("Sessão expirada. Faça login novamente.")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Iniciando processo de login...")
    setLoading(true)
    setError(null)

    try {
      const response = await api.login(email, password)
      console.log("Resposta do login:", response)

      if (!response.access_token) {
        throw new Error("Token de acesso não recebido")
      }

      if (!response.user) {
        throw new Error("Dados do usuário não recebidos")
      }

      // O token já foi definido automaticamente no api.login()
      setUser(response.user)
      console.log("Login realizado com sucesso")

      // Redireciona para dashboard
      router.push("/dashboard")

      return true
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err.message || "Falha no login")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
  }): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.register(userData)

      if (!response.access_token) {
        throw new Error("Token de acesso não recebido")
      }

      setUser(response.user)
      return true
    } catch (err: any) {
      setError(err.message || "Falha no registro")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log("Iniciando logout...")
    setLoading(true)

    try {
      await api.logout()
      setUser(null)
      console.log("Logout realizado com sucesso")
      router.push("/")
    } catch (err: any) {
      console.error("Erro no logout:", err)
      setError(err.message || "Falha ao sair")
    } finally {
      setLoading(false)
    }
  }

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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
