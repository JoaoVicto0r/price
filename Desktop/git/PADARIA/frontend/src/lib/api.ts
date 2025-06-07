export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://price-d26o.onrender.com"

class ApiClient {
  private baseURL: string
  private token: string | null = null
  private timeoutMs = 10000

  constructor(baseURL: string, token?: string | null) {
    this.baseURL = baseURL
    this.token = token || null

    // Carrega token do localStorage na inicialização
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token")
      if (savedToken) {
        this.token = savedToken
        console.log("Token carregado do localStorage:", savedToken.substring(0, 20) + "...")
      }
    }
  }

  setToken(token: string) {
    console.log("Token setado:", token ? token.substring(0, 20) + "..." : "undefined")
    this.token = token

    // Persiste no localStorage
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token)
      } else {
        localStorage.removeItem("token")
      }
    }
  }

  removeToken() {
    console.log("Token removido")
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  getToken(): string | null {
    return this.token
  }

  // Método principal para fazer as requisições
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Remove barra dupla se existir
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
    const url = `${this.baseURL}/${cleanEndpoint}`

    console.log(`Fazendo requisição para: ${url}`)
    console.log(`Token atual: ${this.token ? this.token.substring(0, 20) + "..." : "Nenhum"}`)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs)

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers as Record<string, string>),
    }

    console.log("Headers da requisição:", headers)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
        signal: controller.signal,
      })

      clearTimeout(timeout)

      console.log(`Resposta recebida - Status: ${response.status}`)

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData?.message) errorMessage = errorData.message
          console.error("Erro da API:", errorData)
        } catch (parseError) {
          console.error("Erro ao parsear resposta de erro:", parseError)
        }

        // Se for 401, remove o token inválido
        if (response.status === 401) {
          console.log("Token inválido (401), removendo...")
          this.removeToken()
        }

        throw new Error(errorMessage)
      }

      if (response.status === 204) {
        return {} as T
      }

      const data = await response.json()
      console.log("Dados recebidos:", data)
      return data
    } catch (error: any) {
      clearTimeout(timeout)
      console.error("Erro na requisição:", error)

      if (error.name === "AbortError") {
        throw new Error("Request timeout")
      }
      throw error
    }
  }

  // === Auth methods ===
  async login(email: string, password: string) {
    console.log("Tentando fazer login...")
    const data = await this.request<{
      access_token: string
      user: User
    }>("api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Define o token automaticamente após login bem-sucedido
    if (data.access_token) {
      this.setToken(data.access_token)
    }

    return data
  }

  async register(userData: {
    name: string
    email: string
    password: string
    role?: string
  }) {
    const data = await this.request<{
      access_token: string
      user: User
    }>("api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (data.access_token) {
      this.setToken(data.access_token)
    }

    return data
  }

  async logout() {
    try {
      await this.request<{ message: string }>("api/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.log("Erro no logout (ignorado):", error)
    } finally {
      this.removeToken()
    }
  }

  async getProfile() {
    return this.request<User>("api/users/profile")
  }

  // === Recipes methods ===
  async getRecipes(categoryId?: string) {
    const params = new URLSearchParams()
    if (categoryId) params.append("categoryId", categoryId)
    const queryString = params.toString()
    return this.request<any[]>(`api/recipes${queryString ? `?${queryString}` : ""}`)
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string }>("api/health")
  }

  // Método para testar autenticação
  async testAuth() {
    try {
      const profile = await this.getProfile()
      return { success: true, user: profile }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
    }
  }
}

export const api = new ApiClient(API_BASE_URL)

// Exporta uma instância global
export default api


// -- Os tipos podem continuar iguais --


// Types



export interface Recipe {
  id: string
  name: string
  description?: string
  servings: number
  preparationTime?: number
  difficulty?: string
  instructions?: string
  totalCost: number
  operationalCost: number
  finalCost: number
  sellingPrice: number
  profitMargin: number
  netProfit: number
  isActive: boolean
  categoryId?: string
  category?: Category
  recipeIngredients?: RecipeIngredient[]
  createdAt: string
  updatedAt: string
}

export interface Ingredient {
  id: string
  name: string
  description?: string
  unit: string
  unitCost: number
  stock: number
  minStock: number
  expirationDate?: string
  isActive: boolean
  categoryId?: string
  supplierId?: string
  category?: Category
  supplier?: Supplier
  recipeIngredients?: RecipeIngredient[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    recipes: number
    ingredients: number
  }
}

export interface Supplier {
  id: string
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RecipeIngredient {
  id: string
  quantity: number
  cost: number
  recipeId: string
  ingredientId: string
  ingredient: Ingredient
  recipe?: Recipe
}

export interface CreateRecipeData {
  name: string
  description?: string
  servings: number
  preparationTime?: number
  difficulty?: string
  instructions?: string
  operationalCost?: number
  sellingPrice?: number
  categoryId?: string
  ingredients?: { ingredientId: string; quantity: number }[]
}

export interface CreateIngredientData {
  name: string
  description?: string
  unit: string
  unitCost: number
  stock: number
  minStock: number
  expirationDate?: string
  categoryId?: string
  supplierId?: string
}

export interface CreateSupplierData {
  name: string
  contact?: string
  email?: string
  phone?: string
  address?: string
}
