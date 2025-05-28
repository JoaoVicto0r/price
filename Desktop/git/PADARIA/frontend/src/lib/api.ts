const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private timeoutMs = 10000;

  constructor(baseURL: string, token?: string | null) {
    this.baseURL = baseURL;
    this.token = token || null;
  }

  setToken(token: string) {
     console.log("Salvando token:", token);
    this.token = token;
  }

  removeToken() {
    this.token = null;
  }

  async logout() {
    this.removeToken();
    try {
      await this.request<{ message: string }>("/auth/logout", { method: "POST" });
    } catch {
      // Ignora erros de logout
    }
  }

  async healthCheck() {
    return this.request<{ status: string }>("/health");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const defaultHeaders: Record<string, string> = {};

    if (this.token) {
      defaultHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const hasBody = ["POST", "PUT", "PATCH"].includes((options.method || "GET").toUpperCase());
    if (hasBody && !defaultHeaders["Content-Type"]) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        let message = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData?.message) message = errorData.message;
        } catch {}
        throw new Error(message);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeout);
      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  // === Auth ===

  async login(email: string, password: string) {
    const data = await this.request<{
      access_token: string;
      user: { id: string; email: string; name: string; role: string };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.setToken(data.access_token);
    return data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) {
    const data = await this.request<{
      access_token: string;
      user: { id: string; email: string; name: string; role: string };
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    this.setToken(data.access_token);
    return data;
  }

  // === Users ===

  async getProfile() {
    return this.request<{
      id: string;
      email: string;
      name: string;
      role: string;
    }>("/users/profile");
  }

  async getUserStats() {
    return this.request<{
      recipesCount: number;
      ingredientsCount: number;
      suppliersCount: number;
    }>("/users/stats");
  }

  // === Recipes ===

  async getRecipes(categoryId?: string) {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    const query = params.toString();
    return this.request<Recipe[]>(`/recipes${query ? `?${query}` : ""}`);
  }

  async getRecipe(id: string) {
    return this.request<Recipe>(`/recipes/${id}`);
  }

  async createRecipe(data: CreateRecipeData) {
    return this.request<Recipe>("/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateRecipe(id: string, data: Partial<CreateRecipeData>) {
    return this.request<Recipe>(`/recipes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteRecipe(id: string) {
    return this.request<{ message: string }>(`/recipes/${id}`, {
      method: "DELETE",
    });
  }

  async getRecipeStats() {
    return this.request<{
      totalRecipes: number;
      activeRecipes: number;
      inactiveRecipes: number;
      averageMargin: number;
      totalValue: number;
    }>("/recipes/stats");
  }

  // === Ingredients ===

  async getIngredients(categoryId?: string, lowStock?: boolean) {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (lowStock) params.append("lowStock", "true");
    const query = params.toString();
    return this.request<Ingredient[]>(`/ingredients${query ? `?${query}` : ""}`);
  }

  async getIngredient(id: string) {
    return this.request<Ingredient>(`/ingredients/${id}`);
  }

  async createIngredient(data: CreateIngredientData) {
    return this.request<Ingredient>("/ingredients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateIngredient(id: string, data: Partial<CreateIngredientData>) {
    return this.request<Ingredient>(`/ingredients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteIngredient(id: string) {
    return this.request<{ message: string }>(`/ingredients/${id}`, {
      method: "DELETE",
    });
  }

  async updateStock(id: string, quantity: number, operation: "add" | "subtract") {
    return this.request<Ingredient>(`/ingredients/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, operation }),
    });
  }

  async getIngredientStats() {
    return this.request<{
      totalIngredients: number;
      lowStockCount: number;
      totalStockValue: number;
      categoriesCount: number;
    }>("/ingredients/stats");
  }

  async getStockAlerts() {
    return this.request<{
      lowStock: Ingredient[];
      expiringSoon: Ingredient[];
      alerts: {
        lowStockCount: number;
        expiringSoonCount: number;
      };
    }>("/ingredients/alerts");
  }

  // === Categories ===

  async getCategories() {
    return this.request<Category[]>("/categories");
  }

  async createCategory(data: { name: string; description?: string }) {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // === Suppliers ===

  async getSuppliers() {
    return this.request<Supplier[]>("/suppliers");
  }

  async createSupplier(data: CreateSupplierData) {
    return this.request<Supplier>("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // === Calculator ===

  async calculateRecipeCosts(recipeId: string) {
    return this.request<{
      totalCost: number;
      operationalCost: number;
      finalCost: number;
      sellingPrice: number;
      profitMargin: number;
      netProfit: number;
      costPerServing: number;
      pricePerServing: number;
    }>(`/calculator/recipe/${recipeId}/calculate`, {
      method: "POST",
    });
  }

  async simulateRecipeCost(data: {
    ingredients: { ingredientId: string; quantity: number }[];
    operationalCost?: number;
    servings?: number;
  }) {
    return this.request<{
      ingredients: Array<{
        ingredientId: string;
        name: string;
        quantity: number;
        unitCost: number;
        totalCost: number;
      }>;
      totalIngredientsCost: number;
      operationalCost: number;
      finalCost: number;
      costPerServing: number;
    }>("/calculator/simulate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMarginAnalysis() {
    return this.request<{
      analysis: {
        totalRecipes: number;
        averageMargin: number;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        bestMargin: number;
        worstMargin: number;
        profitableRecipes: number;
      };
      recipes: Array<{
        id: string;
        name: string;
        finalCost: number;
        sellingPrice: number;
        profitMargin: number;
        netProfit: number;
      }>;
    }>("/calculator/margin-analysis");
  }
}

export const api = new ApiClient(API_BASE_URL);

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
