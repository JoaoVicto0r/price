"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, TrendingUp, AlertTriangle, Package, Edit, Trash2 } from "lucide-react"
import { useIngredients } from "@/hooks/use-ingredients"
import { useAuth } from "@/hooks/use-auth"
import { InsumoForm } from "@/components/insumos/insumos-form"
import type { Ingredient } from "@/lib/api"

export default function InsumosPage() {
  // Estados do componente
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLowStock, setShowLowStock] = useState(false)

  // Hooks customizados
  const { user, isAuthenticated } = useAuth()
  const { 
    ingredients, 
    loading, 
    createIngredient, 
    updateIngredient, 
    deleteIngredient,
    updateStock 
  } = useIngredients(undefined, showLowStock)

  // Se não estiver autenticado, mostrar mensagem
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Redirecionando para login...</div>
      </div>
    )
  }

  // Filtrar insumos baseado no termo de busca
  const filteredIngredients = ingredients.filter((ingredient: Ingredient) =>
  ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (ingredient.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (ingredient.supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
)

  // Handler para criar insumo
  const handleCreateInsumo = async (data: Ingredient) => {
    setIsSubmitting(true)
    try {
      await createIngredient(data)
      setShowForm(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para atualizar insumo
  const handleUpdateInsumo = async (data: Ingredient) => {
    if (!editingInsumo) return

    setIsSubmitting(true)
    try {
      await updateIngredient(editingInsumo, data)
      setEditingInsumo(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para deletar insumo
  const handleDeleteInsumo = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este insumo?")) {
      try {
        await deleteIngredient(id)
      } catch (error) {
        console.error("Erro ao excluir insumo:", error)
      }
    }
  }

  // Handler para atualizar estoque
  const handleStockUpdate = async (id: string, quantity: number, operation: "add" | "subtract") => {
    try {
      await updateStock(id, quantity, operation)
    } catch (error) {
      console.error("Erro ao atualizar estoque:", error)
    }
  }

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-500/50 flex items-center justify-center">
        <div className="text-white text-xl tracking-wider">Carregando insumos...</div>
      </div>
    )
  }

  // Mostrar formulário se necessário
  if (showForm || editingInsumo) {
    const insumoToEdit = editingInsumo ? ingredients.find((i: Ingredient) => i.id === editingInsumo) : undefined
    return (
      <div className="space-y-8">
        <InsumoForm
          onSubmit={editingInsumo ? handleUpdateInsumo : handleCreateInsumo}
          initialData={insumoToEdit}
          loading={isSubmitting}
          onCancel={() => {
            setShowForm(false)
            setEditingInsumo(null)
          }}
        />
      </div>
    )
  }

  // Calcular estatísticas dos dados reais
  const totalIngredients = ingredients.length
  const lowStockCount = ingredients.filter((i) => i.stock <= i.minStock).length
  const totalStockValue = ingredients.reduce((acc, i) => acc + i.stock * i.unitCost, 0)
  const categoriesCount = new Set(ingredients.map((i) => i.category?.name).filter(Boolean)).size

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Gestão de Insumos</h2>
          <p className="text-white/80 tracking-wider">Gerencie seus ingredientes e matérias-primas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Insumo
        </button>
      </div>

      {/* Stats Cards com dados reais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Total de Insumos</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">{totalIngredients}</div>
            <div className="text-sm text-neutral-500 font-extrabold mt-2">{categoriesCount} categorias</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Estoque Baixo</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-red-600 tracking-wider">{lowStockCount}</div>
            <div className="flex items-center mt-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500 font-extrabold">Requer atenção</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Valor do Estoque</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">{formatCurrency(totalStockValue)}</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-extrabold">Investimento total</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Vencendo</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-yellow-600 tracking-wider">
              {
                ingredients.filter((i) => {
                  if (!i.expirationDate) return false
                  const expDate = new Date(i.expirationDate)
                  const thirtyDaysFromNow = new Date()
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                  return expDate <= thirtyDaysFromNow
                }).length
              }
            </div>
            <div className="flex items-center mt-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-500 font-extrabold">Próximos 30 dias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar insumos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>
          <button className="border border-neutral-300 text-neutral-600 hover:bg-neutral-50 px-4 py-2 rounded-lg tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`px-4 py-2 rounded-lg tracking-wider flex items-center gap-2 ${
              showLowStock ? "bg-red-500 text-white" : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Estoque Baixo
          </button>
        </div>
      </div>

      {/* Ingredients Table com dados reais */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Insumo</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Categoria</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Estoque</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Preço Unit.</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Fornecedor</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Status</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
                            {filteredIngredients.map((ingredient: Ingredient) => {
                const isLowStock = ingredient.stock <= ingredient.minStock
                const status = isLowStock ? "Estoque baixo" : "Em estoque"

                return (
                  <tr key={ingredient.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                    <td className="p-4 font-normal tracking-wider">{ingredient.name}</td>
                    <td className="p-4 text-neutral-600 tracking-wider">{ingredient.category?.name || "Sem categoria"}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-extrabold tracking-wider">
                          {ingredient.stock} {ingredient.unit}
                        </span>
                        {isLowStock && (
                          <div className="text-xs text-red-500 flex items-center mt-1">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Mín: {ingredient.minStock} {ingredient.unit}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-extrabold tracking-wider">{formatCurrency(ingredient.unitCost)}</td>
                    <td className="p-4 text-neutral-600 tracking-wider">{ingredient.supplier?.name || "Sem fornecedor"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                          status === "Em estoque" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingInsumo(ingredient.id)}
                          className="p-1 hover:bg-neutral-100 rounded text-blue-600"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInsumo(ingredient.id)}
                          className="p-1 hover:bg-neutral-100 rounded text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockUpdate(ingredient.id, 1, "add")}
                            className="px-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                            title="Adicionar"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStockUpdate(ingredient.id, 1, "subtract")}
                            className="px-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                            title="Remover"
                          >
                            -1
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredIngredients.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-neutral-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-extrabold text-neutral-600 mb-2">Nenhum insumo encontrado</h3>
          <p className="text-neutral-500 mb-6">
            {searchTerm ? "Tente ajustar os termos de busca." : "Comece criando seu primeiro insumo."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider px-6 py-3 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Criar Primeiro Insumo
            </button>
          )}
        </div>
      )}
    </div>
  )
}