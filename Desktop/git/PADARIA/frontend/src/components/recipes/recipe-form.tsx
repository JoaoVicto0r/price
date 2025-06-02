"use client"

import type React from "react"
import { useState } from "react"
import { useIngredients } from "@/hooks/use-ingredients"
import type { CreateRecipeData } from "@/lib/api"
import { Plus, X } from "lucide-react"

interface RecipeFormProps {
  onSubmit: (data: CreateRecipeData) => Promise<void>
  initialData?: Partial<CreateRecipeData>
  loading?: boolean
  onCancel?: () => void
}

export function RecipeForm({ onSubmit, initialData, loading, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<CreateRecipeData>({
    name: "",
    description: "",
    servings: 1,
    preparationTime: 0,
    difficulty: "EASY",
    instructions: "",
    operationalCost: 0,
    sellingPrice: 0,
    categoryId: "",
    ingredients: [],
    ...initialData,
  })

  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [ingredientQuantity, setIngredientQuantity] = useState(0)
  const [error, setError] = useState("")

  const { ingredients } = useIngredients()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar receita")
    }
  }

  const addIngredient = () => {
    if (!selectedIngredient || ingredientQuantity <= 0) return

    const ingredient = ingredients.find((i) => i.id === selectedIngredient)
    if (!ingredient) return

    const newIngredient = {
      ingredientId: selectedIngredient,
      quantity: ingredientQuantity,
    }

    setFormData((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), newIngredient],
    }))

    setSelectedIngredient("")
    setIngredientQuantity(0)
  }

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-black tracking-wider">
          {initialData ? "Editar Receita" : "Nova Receita"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Nome da Receita</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Porções</label>
            <input
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData((prev) => ({ ...prev, servings: Number(e.target.value) }))}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tempo de Preparo (min)</label>
            <input
              type="number"
              min="0"
              value={formData.preparationTime || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, preparationTime: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Dificuldade</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            >
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Médio</option>
              <option value="HARD">Difícil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Instruções</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
            rows={5}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
          />
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Ingredientes</label>
          <div className="flex gap-2 mb-4">
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            >
              <option value="">Selecione um ingrediente</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} ({ingredient.unit})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantidade"
              value={ingredientQuantity || ""}
              onChange={(e) => setIngredientQuantity(Number(e.target.value))}
              className="w-32 px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />

            <button
              type="button"
              onClick={addIngredient}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {formData.ingredients?.map((recipeIngredient, index) => {
              const ingredient = ingredients.find((i) => i.id === recipeIngredient.ingredientId)
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="tracking-wider">
                    {ingredient?.name} - {recipeIngredient.quantity} {ingredient?.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Custos e Preços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Custo Operacional (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.operationalCost || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, operationalCost: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Preço de Venda (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.sellingPrice || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, sellingPrice: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Receita"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-extrabold tracking-wider py-3 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
