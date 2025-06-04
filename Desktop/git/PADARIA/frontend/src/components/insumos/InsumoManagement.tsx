"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Insumo } from "@/types/user"

export default function InsumoManagement() {
  const [insumos, setInsumos] = useState<Insumo[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingInsumo, setEditingInsumo] = useState<Insumo | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    minStock: 0,
    price: 0,
    supplier: "",
  })

  useEffect(() => {
    loadInsumos()
  }, [])

  const loadInsumos = () => {
    const savedInsumos = localStorage.getItem("price_insumos")
    if (savedInsumos) {
      setInsumos(JSON.parse(savedInsumos))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      minStock: 0,
      price: 0,
      supplier: "",
    })
    setEditingInsumo(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingInsumo) {
      // Editar insumo existente
      const updatedInsumos = insumos.map((insumo) =>
        insumo.id === editingInsumo.id ? { ...insumo, ...formData, updatedAt: new Date() } : insumo,
      )
      setInsumos(updatedInsumos)
      localStorage.setItem("price_insumos", JSON.stringify(updatedInsumos))
    } else {
      // Criar novo insumo
      const newInsumo: Insumo = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedInsumos = [...insumos, newInsumo]
      setInsumos(updatedInsumos)
      localStorage.setItem("price_insumos", JSON.stringify(updatedInsumos))
    }

    resetForm()
  }

  const handleEdit = (insumo: Insumo) => {
    setFormData({
      name: insumo.name,
      category: insumo.category,
      quantity: insumo.quantity,
      unit: insumo.unit,
      minStock: insumo.minStock,
      price: insumo.price,
      supplier: insumo.supplier,
    })
    setEditingInsumo(insumo)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este insumo?")) {
      const updatedInsumos = insumos.filter((insumo) => insumo.id !== id)
      setInsumos(updatedInsumos)
      localStorage.setItem("price_insumos", JSON.stringify(updatedInsumos))
    }
  }

  const lowStockInsumos = insumos.filter((insumo) => insumo.quantity <= insumo.minStock)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
              Gestão de Insumos
            </h2>
            <p className="text-gray-600 font-['Telegraf'] tracking-wider">Cadastre e gerencie seus insumos</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-['Telegraf'] font-extrabold tracking-wider transition"
          >
            Novo Insumo
          </button>
        </div>

        {/* Alerta de estoque baixo */}
        {lowStockInsumos.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-extrabold text-yellow-800 font-['Telegraf'] tracking-wider">
                  Atenção! {lowStockInsumos.length} insumo(s) com estoque baixo:
                </h3>
                <div className="mt-2 text-sm text-yellow-700 font-['Telegraf'] tracking-wider">
                  <p>{lowStockInsumos.map((i) => i.name).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">
                  Total de Insumos
                </p>
                <p className="text-3xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
                  {insumos.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">Estoque Baixo</p>
                <p className="text-3xl font-extrabold text-red-600 font-['Telegraf'] tracking-wider">
                  {lowStockInsumos.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">Valor Total</p>
                <p className="text-3xl font-extrabold text-green-600 font-['Telegraf'] tracking-wider">
                  R$ {insumos.reduce((total, insumo) => total + insumo.quantity * insumo.price, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-['Telegraf'] tracking-wider">
              {editingInsumo ? "Editar Insumo" : "Novo Insumo"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Nome do Insumo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    placeholder="Ex: Farinha de Trigo"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Categoria
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="farinha">Farinha</option>
                    <option value="acucar">Açúcar</option>
                    <option value="gordura">Gordura</option>
                    <option value="fermento">Fermento</option>
                    <option value="tempero">Tempero</option>
                    <option value="conservante">Conservante</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Quantidade
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="unit"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Unidade
                  </label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    required
                  >
                    <option value="">Unidade</option>
                    <option value="kg">Kg</option>
                    <option value="g">Gramas</option>
                    <option value="l">Litros</option>
                    <option value="ml">ML</option>
                    <option value="un">Unidade</option>
                    <option value="cx">Caixa</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="minStock"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    id="minStock"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Preço Unitário (R$)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="supplier"
                    className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                  >
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                    placeholder="Nome do fornecedor"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-['Telegraf'] font-extrabold tracking-wider transition"
                >
                  {editingInsumo ? "Atualizar" : "Cadastrar"} Insumo
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-['Telegraf'] font-extrabold tracking-wider transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Insumos */}
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">Insumos Cadastrados</h3>
          {insumos.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <p className="text-center text-gray-500 font-['Telegraf'] tracking-wider">Nenhum insumo cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insumos.map((insumo) => (
                <div key={insumo.id} className="bg-white shadow-lg rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
                        {insumo.name}
                      </h4>
                      <p className="text-sm text-gray-500 font-['Telegraf'] tracking-wider">{insumo.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(insumo)}
                        className="text-indigo-500 hover:text-indigo-700 text-sm font-extrabold font-['Telegraf'] tracking-wider"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(insumo.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-extrabold font-['Telegraf'] tracking-wider"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-['Telegraf'] tracking-wider">Quantidade:</span>
                      <span className="font-extrabold font-['Telegraf'] tracking-wider">
                        {insumo.quantity} {insumo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-['Telegraf'] tracking-wider">Estoque Mín:</span>
                      <span className="font-extrabold font-['Telegraf'] tracking-wider">
                        {insumo.minStock} {insumo.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-['Telegraf'] tracking-wider">Preço:</span>
                      <span className="font-extrabold font-['Telegraf'] tracking-wider">
                        R$ {insumo.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-['Telegraf'] tracking-wider">Fornecedor:</span>
                      <span className="font-extrabold text-sm font-['Telegraf'] tracking-wider">{insumo.supplier}</span>
                    </div>
                    {insumo.quantity <= insumo.minStock && (
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-extrabold text-center font-['Telegraf'] tracking-wider">
                        Estoque Baixo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
