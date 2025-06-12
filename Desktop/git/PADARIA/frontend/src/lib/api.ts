export interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt?: string
  updatedAt?: string
  // Adicione outros campos que seu usuário possa ter
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://price-d26o.onrender.com/api";

class ApiClient {
  private baseURL: string;
  private timeoutMs = 10000;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Não é mais necessário setToken/removeToken, pois o token é enviado via cookie

  async logout() {
    try {
      await this.request<{ message: string }>("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');

    // Só adiciona Content-Type para métodos com corpo
    if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Importante para enviar cookies
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 401) {
          this.handleUnauthorizedError();
          throw new Error('Sessão expirada');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return response.status === 204 ? {} as T : await response.json();
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite excedido');
      }
      throw error;
    }
  }

  private handleUnauthorizedError() {
    console.error('Acesso não autorizado - redirecionando');
  //  if (typeof window !== 'undefined') {
  //    window.location.href = '/'; // Ajuste para sua rota de login
 //   }
  }

  // Métodos de autenticação
  async login(email: string, password: string) {
    // O cookie será setado automaticamente pelo navegador
    return this.request<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    // O cookie será setado automaticamente pelo navegador
    return this.request<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // === User methods ===

  async getProfile() {
    return this.request<{
      id: string
      email: string
      name: string
      role: string
    }>("/auth/profile")
  }

  async getUserStats() {
    return this.request<{
      recipesCount: number
      ingredientsCount: number
      suppliersCount: number
    }>("/users/stats")
  }

  // === Recipes methods ===

  async getRecipes(categoryId?: string) {
    const params = new URLSearchParams()
    if (categoryId) params.append("categoryId", categoryId)
    const queryString = params.toString()
    return this.request<Recipe[]>(`/recipes${queryString ? `?${queryString}` : ""}`)
  }

  async getRecipe(id: string) {
    return this.request<Recipe>(`/recipes/${id}`)
  }

  async createRecipe(data: CreateRecipeData) {
    return this.request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateRecipe(id: string, data: Partial<CreateRecipeData>) {
    return this.request<Recipe>(`/recipes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteRecipe(id: string) {
    return this.request<{ message: string }>(`/recipes/${id}`, {
      method: "DELETE",
    })
  }

  async getRecipeStats() {
    return this.request<{
      totalRecipes: number
      activeRecipes: number
      inactiveRecipes: number
      averageMargin: number
      totalValue: number
    }>("/recipes/stats")
  }

  // === Ingredients methods ===

  async getIngredients(categoryId?: string, lowStock?: boolean) {
    const params = new URLSearchParams()
    if (categoryId) params.append("categoryId", categoryId)
    if (lowStock) params.append("lowStock", "true")
    const queryString = params.toString()

    return this.request<Ingredient[]>(`/ingredients${queryString ? `?${queryString}` : ""}`)
  }

  async getIngredient(id: string) {
    return this.request<Ingredient>(`/ingredients/${id}`)
  }

  async createIngredient(data: CreateIngredientData) {
    return this.request<Ingredient>("/ingredients", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateIngredient(id: string, data: Partial<CreateIngredientData>) {
    return this.request<Ingredient>(`/ingredients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteIngredient(id: string) {
    return this.request<{ message: string }>(`/ingredients/${id}`, {
      method: "DELETE",
    })
  }

  async updateStock(id: string, quantity: number, operation: "add" | "subtract") {
    return this.request<Ingredient>(`/ingredients/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, operation }),
    })
  }

  async getIngredientStats() {
    return this.request<{
      totalIngredients: number
      lowStockCount: number
      totalStockValue: number
      categoriesCount: number
    }>("/ingredients/stats")
  }

  async getStockAlerts() {
    return this.request<{
      lowStock: Ingredient[]
      expiringSoon: Ingredient[]
      alerts: {
        lowStockCount: number
        expiringSoonCount: number
      }
    }>("/ingredients/alerts")
  }

  // === Categories methods ===

  async getCategories() {
    return this.request<Category[]>("/categories")
  }

  async createCategory(data: { name: string; description?: string }) {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // === Suppliers methods ===

  async getSuppliers() {
    return this.request<Supplier[]>("/suppliers")
  }

  async createSupplier(data: CreateSupplierData) {
    return this.request<Supplier>("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // === Calculator methods ===

  async calculateRecipeCosts(recipeId: string) {
    return this.request<{
      totalCost: number
      operationalCost: number
      finalCost: number
      sellingPrice: number
      profitMargin: number
      netProfit: number
      costPerServing: number
      pricePerServing: number
    }>(`/calculator/recipe/${recipeId}/calculate`, {
      method: "POST",
    })
  }

  async simulateRecipeCost(data: {
    ingredients: { ingredientId: string; quantity: number }[]
    operationalCost?: number
    servings?: number
  }) {
    return this.request<{
      ingredients: Array<{
        ingredientId: string
        name: string
        quantity: number
        unitCost: number
        totalCost: number
      }>
      totalIngredientsCost: number
      operationalCost: number
      finalCost: number
      costPerServing: number
    }>("/calculator/simulate", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getMarginAnalysis() {
    return this.request<{
      analysis: {
        totalRecipes: number
        averageMargin: number
        totalRevenue: number
        totalCost: number
        totalProfit: number
        bestMargin: number
        worstMargin: number
        profitableRecipes: number
      }
      recipes: Array<{
        id: string
        name: string
        finalCost: number
        sellingPrice: number
        profitMargin: number
        netProfit: number
      }>
    }>("/calculator/margin-analysis")
  }
}

export const api = new ApiClient(API_BASE_URL)

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