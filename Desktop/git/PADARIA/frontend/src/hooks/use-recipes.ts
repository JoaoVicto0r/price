"use client"

import { useState, useEffect } from "react"
import { api, type Recipe, type CreateRecipeData } from "@/lib/api"

export function useRecipes(categoryId?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const data = await api.getRecipes(categoryId)
      setRecipes(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar receitas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [categoryId])

  const createRecipe = async (data: CreateRecipeData) => {
    try {
      const newRecipe = await api.createRecipe(data)
      setRecipes((prev) => [newRecipe, ...prev])
      return newRecipe
    } catch (err) {
      throw err
    }
  }

  const updateRecipe = async (id: string, data: Partial<CreateRecipeData>) => {
    try {
      const updatedRecipe = await api.updateRecipe(id, data)
      setRecipes((prev) => prev.map((recipe) => (recipe.id === id ? updatedRecipe : recipe)))
      return updatedRecipe
    } catch (err) {
      throw err
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      await api.deleteRecipe(id)
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  }
}

export function useRecipe(id: string) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const data = await api.getRecipe(id)
        setRecipe(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar receita")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  return { recipe, loading, error }
}
