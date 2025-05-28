"use client"

import { useState, useEffect } from "react"
import { api, type Category } from "@/lib/api"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await api.getCategories()
      setCategories(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (data: { name: string; description?: string }) => {
    try {
      const newCategory = await api.createCategory(data)
      setCategories((prev) => [newCategory, ...prev])
      return newCategory
    } catch (err) {
      throw err
    }
  }

  return {
    categories,
    loading,
    error,
    createCategory,
    refetch: fetchCategories,
  }
}
