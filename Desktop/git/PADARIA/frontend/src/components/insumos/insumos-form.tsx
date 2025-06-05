"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Ingredient, Category, Supplier } from "@/lib/api" // Importe as interfaces corretas

interface InsumoFormProps {
  onSubmit: (data: Ingredient) => Promise<void>
  initialData?: Partial<Ingredient>
  loading?: boolean
  onCancel?: () => void
  categories?: Category[] // Adicione se precisar de categorias completas
  suppliers?: Supplier[] // Adicione se precisar de fornecedores completos
}

const units = [
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "l", label: "Litro (l)" },
  { value: "ml", label: "Mililitro (ml)" },
  { value: "un", label: "Unidade (un)" },
  { value: "cx", label: "Caixa (cx)" }
]

export function InsumoForm({ 
  onSubmit, 
  initialData, 
  loading, 
  onCancel,
  categories = [],
  suppliers = []
}: InsumoFormProps) {
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    name: "",
    description: "",
    unit: "un",
    unitCost: 0,
    stock: 0,
    minStock: 0,
    isActive: true,
    categoryId: "",
    supplierId: "",
    ...initialData
  })

  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.stock! < 0 || formData.minStock! < 0 || formData.unitCost! < 0) {
      setError("Valores não podem ser negativos")
      return
    }

    try {
      await onSubmit(formData as Ingredient)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar insumo")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Cabeçalho e estrutura básica mantida igual */}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Nome do Insumo
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Categoria
            </label>
            <select
              value={formData.categoryId || ""}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
          />
        </div>

        {/* Quantidade e Unidade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Estoque Atual
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.stock || 0}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Unidade
            </label>
            <select
              value={formData.unit || ""}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            >
              <option value="">Selecione uma unidade</option>
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Estoque Mínimo
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.minStock || 0}
              onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>
        </div>

        {/* Preço e Fornecedor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Preço Unitário (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.unitCost || 0}
              onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fornecedor
            </label>
            <select
              value={formData.supplierId || ""}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            >
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive || false}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-neutral-700">
            Insumo ativo
          </label>
        </div>

        {/* Botões (mantido igual) */}
        <div className="flex gap-4">
          {/* ... */}
        </div>
      </form>
    </div>
  )
}