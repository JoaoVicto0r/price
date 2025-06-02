"use client"

import { useState } from "react"
import { Plus, Search, Filter, Calculator, TrendingUp, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { useRecipes } from "@/hooks/use-recipes"
import { useAuth } from "@/hooks/use-auth"
import { RecipeForm } from "@/components/recipes/recipe-form"
import type { CreateRecipeData, Recipe } from "@/lib/api" // Importe o tipo Recipe

export default function ReceitasPage() {
  // Estados do componente
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks customizados
  const { user, isAuthenticated } = useAuth()
  const { 
    recipes, 
    loading, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe  } = useRecipes()

  // Se não estiver autenticado, mostrar mensagem
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Redirecionando para login...</div>
      </div>
    )
  }

  // Filtrar receitas baseado no termo de busca
  const filteredRecipes = recipes.filter((recipe: Recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipe.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handler para criar receita
  const handleCreateRecipe = async (data: CreateRecipeData) => {
    setIsSubmitting(true)
    try {
      await createRecipe(data)
      setShowForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para atualizar receita
  const handleUpdateRecipe = async (data: CreateRecipeData) => {
    if (!editingRecipe) return

    setIsSubmitting(true)
    try {
      await updateRecipe(editingRecipe, data)
      setEditingRecipe(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para deletar receita
  const handleDeleteRecipe = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
      try {
        await deleteRecipe(id)
      } catch (error) {
        console.error("Erro ao excluir receita:", error)
      }
    }
  }

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Traduzir dificuldade
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "EASY": return "Fácil"
      case "MEDIUM": return "Médio"
      case "HARD": return "Difícil"
      default: return difficulty
    }
  }

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Carregando receitas...</div>
      </div>
    )
  }

  // Mostrar formulário se necessário
  if (showForm || editingRecipe) {
    const recipeToEdit = editingRecipe ? recipes.find((r: Recipe) => r.id === editingRecipe) : undefined
    return (
      <div className="space-y-8">
        <RecipeForm
          onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
          initialData={recipeToEdit}
          loading={isSubmitting}
          onCancel={() => {
            setShowForm(false)
            setEditingRecipe(null)
          }}
        />
      </div>
    )
  }

  // Resto do código permanece igual...
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Receitas Culinárias</h2>
          <p className="text-white/80 tracking-wider">Gerencie suas receitas e calcule custos e margens</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Receita
        </button>
      </div>

      {/* Stats Cards com dados reais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Total de Receitas</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">{recipes.length}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-extrabold">
                {recipes.filter((r) => r.isActive).length} ativas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Margem Média</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">
              {recipes.length > 0
                ? (recipes.reduce((acc, r) => acc + r.profitMargin, 0) / recipes.length).toFixed(1)
                : "0"}
              %
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-extrabold">Lucro médio</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Custo Médio</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">
              {recipes.length > 0
                ? formatCurrency(recipes.reduce((acc, r) => acc + r.finalCost, 0) / recipes.length)
                : "R$ 0,00"}
            </div>
            <div className="flex items-center mt-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-500 font-extrabold">Por receita</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Receitas Ativas</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">
              {recipes.filter((r) => r.isActive).length}
            </div>
            <div className="text-sm text-neutral-500 font-extrabold mt-2">
              {recipes.filter((r) => !r.isActive).length} inativas
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border-0 shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar receitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>
          <button className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 px-4 py-2 rounded-lg tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 px-4 py-2 rounded-lg tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculadora
          </button>
        </div>
      </div>

      {/* Recipes Table com dados reais */}
      <div className="bg-white rounded-lg border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Receita</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Categoria</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Custo Final</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Preço Venda</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Margem</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Lucro Líquido</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Status</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="p-4">
                    <div>
                      <div className="font-normal tracking-wider">{recipe.name}</div>
                      <div className="text-sm text-neutral-500">
                        {recipe.servings} porções • {getDifficultyText(recipe.difficulty || "")}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600 tracking-wider">{recipe.category?.name || "Sem categoria"}</td>
                  <td className="p-4 font-extrabold tracking-wider text-red-600">{formatCurrency(recipe.finalCost)}</td>
                  <td className="p-4 font-extrabold tracking-wider text-green-600">
                    {formatCurrency(recipe.sellingPrice)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold tracking-wider">{recipe.profitMargin.toFixed(1)}%</span>
                      <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min(Math.max(recipe.profitMargin, 0), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-extrabold tracking-wider text-indigo-600">
                    {formatCurrency(recipe.netProfit)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                        recipe.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recipe.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingRecipe(recipe.id)}
                        className="p-1 hover:bg-neutral-100 rounded text-blue-600"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="p-1 hover:bg-neutral-100 rounded text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecipes.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-neutral-400 mb-4">
            <Calculator className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-extrabold text-neutral-600 mb-2">Nenhuma receita encontrada</h3>
          <p className="text-neutral-500 mb-6">
            {searchTerm ? "Tente ajustar os termos de busca." : "Comece criando sua primeira receita."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider px-6 py-3 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Criar Primeira Receita
            </button>
          )}
        </div>
      )}
    </div>
  )
}
