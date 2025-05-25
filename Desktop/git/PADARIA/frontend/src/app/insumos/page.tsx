"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, TrendingUp, AlertTriangle } from "lucide-react"

const mockIngredients = [
  {
    id: 1,
    name: "Farinha de Trigo",
    categoria: "Cereais",
    estoque: 25.5,
    unidade: "kg",
    custoUnitario: 4.5,
    fornecedor: "Moinho ABC",
    validade: "2024-06-15",
    estoqueMinimo: 10,
    status: "Em estoque",
  },
  {
    id: 2,
    name: "Açúcar Cristal",
    categoria: "Adoçantes",
    estoque: 18.2,
    unidade: "kg",
    custoUnitario: 3.2,
    fornecedor: "Usina XYZ",
    validade: "2025-01-20",
    estoqueMinimo: 15,
    status: "Em estoque",
  },
  {
    id: 3,
    name: "Ovos",
    categoria: "Proteínas",
    estoque: 8.5,
    unidade: "dúzia",
    custoUnitario: 8.9,
    fornecedor: "Granja São João",
    validade: "2024-02-05",
    estoqueMinimo: 10,
    status: "Estoque baixo",
  },
  {
    id: 4,
    name: "Leite Integral",
    categoria: "Laticínios",
    estoque: 12.0,
    unidade: "litros",
    custoUnitario: 4.8,
    fornecedor: "Laticínios Bela Vista",
    validade: "2024-01-28",
    estoqueMinimo: 8,
    status: "Em estoque",
  },
  {
    id: 5,
    name: "Chocolate em Pó",
    categoria: "Cacau",
    estoque: 3.2,
    unidade: "kg",
    custoUnitario: 15.6,
    fornecedor: "Chocolates Premium",
    validade: "2024-08-10",
    estoqueMinimo: 5,
    status: "Estoque baixo",
  },
]

export default function InsumosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIngredients = mockIngredients.filter(
    (ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ingredient.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Insumos</h2>
          <p className="text-white/80 tracking-wider">Gerencie seus ingredientes e matérias-primas</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Insumo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Total de Insumos</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">245</div>
          <div className="text-sm text-neutral-500 font-extrabold mt-2">15 categorias</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Estoque Baixo</h3>
          <div className="text-2xl font-extrabold text-red-600 tracking-wider">12</div>
          <div className="text-sm text-red-500 font-extrabold mt-2">Requer atenção</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Valor do Estoque</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">R$ 8.450</div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-extrabold">+R$ 320</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Vencendo</h3>
          <div className="text-2xl font-extrabold text-yellow-600 tracking-wider">8</div>
          <div className="text-sm text-yellow-500 font-extrabold mt-2">Próximos 30 dias</div>
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
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Insumo</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Categoria</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Estoque</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Custo Unit.</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Fornecedor</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Validade</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Status</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="p-4 font-normal tracking-wider">{ingredient.name}</td>
                  <td className="p-4 text-neutral-600 tracking-wider">{ingredient.categoria}</td>
                  <td className="p-4">
                    <div>
                      <span className="font-extrabold tracking-wider">
                        {ingredient.estoque} {ingredient.unidade}
                      </span>
                      {ingredient.estoque <= ingredient.estoqueMinimo && (
                        <div className="text-xs text-red-500 flex items-center mt-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Abaixo do mínimo
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-extrabold tracking-wider">R$ {ingredient.custoUnitario.toFixed(2)}</td>
                  <td className="p-4 text-neutral-600 tracking-wider">{ingredient.fornecedor}</td>
                  <td className="p-4 tracking-wider">{ingredient.validade}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                        ingredient.status === "Em estoque" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ingredient.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
