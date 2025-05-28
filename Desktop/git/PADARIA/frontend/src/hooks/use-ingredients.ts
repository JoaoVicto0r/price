"use client"

import { useState, useEffect } from "react"
import { api, type Ingredient, type CreateIngredientData } from "@/lib/api"

export function useIngredients(categoryId?: string, lowStock?: boolean) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIngredients = async () => {
    try {
      setLoading(true)
      const data = await api.getIngredients(categoryId, lowStock)
      setIngredients(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar ingredientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIngredients()
  }, [categoryId, lowStock])

  const createIngredient = async (data: CreateIngredientData) => {
    try {
      const newIngredient = await api.createIngredient(data)
      setIngredients((prev) => [newIngredient, ...prev])
      return newIngredient
    } catch (err) {
      throw err
    }
  }

  const updateIngredient = async (id: string, data: Partial<CreateIngredientData>) => {
    try {
      const updatedIngredient = await api.updateIngredient(id, data)
      setIngredients((prev) => prev.map((ingredient) => (ingredient.id === id ? updatedIngredient : ingredient)))
      return updatedIngredient
    } catch (err) {
      throw err
    }
  }

  const deleteIngredient = async (id: string) => {
    try {
      await api.deleteIngredient(id)
      setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
    } catch (err) {
      throw err
    }
  }

  const updateStock = async (id: string, quantity: number, operation: "add" | "subtract") => {
    try {
      const updatedIngredient = await api.updateStock(id, quantity, operation)
      setIngredients((prev) => prev.map((ingredient) => (ingredient.id === id ? updatedIngredient : ingredient)))
      return updatedIngredient
    } catch (err) {
      throw err
    }
  }

  return {
    ingredients,
    loading,
    error,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    updateStock,
    refetch: fetchIngredients,
  }
}

export function useIngredientStats() {
  const [stats, setStats] = useState({
    totalIngredients: 0,
    lowStockCount: 0,
    totalStockValue: 0,
    categoriesCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getIngredientStats()
        setStats(data)
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export function useStockAlerts() {
  const [alerts, setAlerts] = useState({
    lowStock: [] as Ingredient[],
    expiringSoon: [] as Ingredient[],
    alerts: {
      lowStockCount: 0,
      expiringSoonCount: 0,
    },
  })
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    try {
      const data = await api.getStockAlerts()
      setAlerts(data)
    } catch (err) {
      console.error("Erro ao carregar alertas:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return { alerts, loading, refetch: fetchAlerts }
}
