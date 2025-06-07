"use client"

import { useState, useEffect } from "react"
import { X, Save, Calculator, Package, DollarSign } from "lucide-react"
import type { Ingredient, Category, Supplier } from "@/lib/api"

interface InsumoFormProps {
  onSubmit: (data: Ingredient) => Promise<void>
  initialData?: Partial<Ingredient>
  loading?: boolean
  onCancel?: () => void
  categories?: Category[]
  suppliers?: Supplier[]
}

const units = [
  { value: "kg", label: "Quilograma (kg)", isWeight: true },
  { value: "g", label: "Grama (g)", isWeight: true },
  { value: "l", label: "Litro (l)", isVolume: true },
  { value: "ml", label: "Mililitro (ml)", isVolume: true },
  { value: "un", label: "Unidade (un)", isUnit: true },
  { value: "cx", label: "Caixa (cx)", isUnit: true },
]

export function InsumoForm({
  onSubmit,
  initialData,
  loading = false,
  onCancel,
  categories = [],
  suppliers = [],
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
    ...initialData,
  })

  const [error, setError] = useState("")
  const [calculations, setCalculations] = useState({
    totalValue: 0,
    pricePerKg: 0,
    pricePerUnit: 0,
    isWeightBased: false,
  })

  // Calcular valores baseados na unidade
  useEffect(() => {
    const selectedUnit = units.find((u) => u.value === formData.unit)
    const isWeightBased = selectedUnit?.isWeight || false
    const stock = formData.stock || 0
    const unitCost = formData.unitCost || 0

    let totalValue = 0
    let pricePerKg = 0
    let pricePerUnit = 0

    if (isWeightBased) {
      totalValue = stock * unitCost
      pricePerKg = unitCost
      pricePerUnit = unitCost
    } else {
      totalValue = stock * unitCost
      pricePerUnit = unitCost
      pricePerKg = unitCost
    }

    setCalculations({
      totalValue,
      pricePerKg,
      pricePerUnit,
      isWeightBased,
    })
  }, [formData.stock, formData.unitCost, formData.unit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name?.trim()) {
      setError("Nome do insumo é obrigatório")
      return
    }

    if (!formData.unit) {
      setError("Unidade é obrigatória")
      return
    }

    if (formData.stock! < 0 || formData.minStock! < 0 || formData.unitCost! < 0) {
      setError("Valores não podem ser negativos")
      return
    }

    if (formData.minStock! > formData.stock!) {
      setError("Estoque mínimo não pode ser maior que o estoque atual")
      return
    }

    try {
      await onSubmit(formData as Ingredient)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar insumo")
    }
  }

  const selectedUnit = units.find((u) => u.value === formData.unit)
  const isLowStock = (formData.stock || 0) <= (formData.minStock || 0)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-white" />
            <h3 className="text-xl font-extrabold text-white tracking-wider">
              {initialData?.id ? "Editar Insumo" : "Novo Insumo"}
            </h3>
          </div>
          {onCancel && (
            <button 
              onClick={onCancel} 
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-extrabold text-neutral-800 tracking-wider flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded"></div>
            Informações Básicas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">
                Nome do Insumo *
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
                placeholder="Ex: Farinha de Trigo Especial"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">Categoria</label>
              <select
                value={formData.categoryId || ""}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
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

          <div>
            <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">Descrição</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={loading}
              placeholder="Descrição detalhada do insumo..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all resize-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Stock and Measurements */}
        <div className="space-y-4">
          <h4 className="text-lg font-extrabold text-neutral-800 tracking-wider flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            Estoque e Medidas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">
                Estoque Atual *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">Unidade *</label>
              <select
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
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
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">
                Estoque Mínimo *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minStock || 0}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                required
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none tracking-wider transition-all disabled:opacity-50 ${
                  isLowStock
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-neutral-300 focus:border-indigo-500 focus:ring-indigo-200"
                }`}
              />
              {isLowStock && <p className="text-xs text-red-600 mt-1 font-medium">⚠️ Estoque abaixo do mínimo</p>}
            </div>
          </div>
        </div>

        {/* Prices and Calculations */}
        <div className="space-y-4">
          <h4 className="text-lg font-extrabold text-neutral-800 tracking-wider flex items-center gap-2">
            <div className="w-1 h-6 bg-yellow-500 rounded"></div>
            Preços e Cálculos
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">
                {calculations.isWeightBased ? `Preço por ${selectedUnit?.label} (R$) *` : "Preço Unitário (R$) *"}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitCost || 0}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold text-neutral-700 mb-2 tracking-wider">Fornecedor</label>
              <select
                value={formData.supplierId || ""}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none tracking-wider transition-all disabled:opacity-50"
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

          {/* Calculations Panel */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h5 className="font-extrabold text-indigo-800 tracking-wider">Cálculos Automáticos</h5>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <p className="text-xs font-extrabold text-neutral-600 tracking-wider mb-1">VALOR TOTAL DO ESTOQUE</p>
                <p className="text-lg font-extrabold text-green-600 tracking-wider">
                  R$ {calculations.totalValue.toFixed(2)}
                </p>
              </div>

              {calculations.isWeightBased ? (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <p className="text-xs font-extrabold text-neutral-600 tracking-wider mb-1">PREÇO POR KG</p>
                  <p className="text-lg font-extrabold text-blue-600 tracking-wider">
                    R$ {calculations.pricePerKg.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <p className="text-xs font-extrabold text-neutral-600 tracking-wider mb-1">PREÇO POR UNIDADE</p>
                  <p className="text-lg font-extrabold text-blue-600 tracking-wider">
                    R$ {calculations.pricePerUnit.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg p-3 border border-indigo-100">
                <p className="text-xs font-extrabold text-neutral-600 tracking-wider mb-1">TIPO DE MEDIDA</p>
                <p className="text-lg font-extrabold text-purple-600 tracking-wider">
                  {calculations.isWeightBased ? "Peso" : "Unidade"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h4 className="text-lg font-extrabold text-neutral-800 tracking-wider flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-500 rounded"></div>
            Configurações
          </h4>

          <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive || false}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              disabled={loading}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-neutral-300 rounded disabled:opacity-50"
            />
            <label htmlFor="isActive" className="text-sm font-extrabold text-neutral-700 tracking-wider">
              Insumo ativo no sistema
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {initialData?.id ? "Atualizar Insumo" : "Salvar Insumo"}
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 font-extrabold tracking-wider rounded-lg hover:bg-neutral-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}