"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Calculator, TrendingUp, AlertTriangle } from "lucide-react"

// Simulando dados (substitua pela sua API/Prisma)
const mockRecipes = [
  {
    id: 1,
    name: "Pão Francês",
    category: "Panificação",
    costoProdução: 2.5,
    precoVenda: 8.0,
    margemLucro: 68.75,
    custoOperacional: 1.2,
    lucroLiquido: 4.3,
    rendimento: "20 unidades",
    status: "Ativa",
  },
  {
    id: 2,
    name: "Bolo de Chocolate",
    category: "Confeitaria",
    costoProdução: 12.8,
    precoVenda: 35.0,
    margemLucro: 63.43,
    custoOperacional: 5.5,
    lucroLiquido: 16.7,
    rendimento: "1 bolo (8 fatias)",
    status: "Ativa",
  },
  {
    id: 3,
    name: "Pizza Margherita",
    category: "Salgados",
    costoProdução: 8.9,
    precoVenda: 28.0,
    margemLucro: 68.21,
    custoOperacional: 4.2,
    lucroLiquido: 14.9,
    rendimento: "1 pizza média",
    status: "Ativa",
  },
  {
    id: 4,
    name: "Brigadeiro Gourmet",
    category: "Doces",
    costoProdução: 0.85,
    precoVenda: 3.5,
    margemLucro: 75.71,
    custoOperacional: 0.4,
    lucroLiquido: 2.25,
    rendimento: "1 unidade",
    status: "Inativa",
  },
  {
    id: 5,
    name: "Croissant",
    category: "Panificação",
    costoProdução: 1.8,
    precoVenda: 6.5,
    margemLucro: 72.31,
    custoOperacional: 0.9,
    lucroLiquido: 3.8,
    rendimento: "1 unidade",
    status: "Ativa",
  },
]

export default function ReceitasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [recipes, setRecipes] = useState(mockRecipes)

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Receitas Culinárias</h2>
          <p className="text-white/80 tracking-wider">Gerencie suas receitas e calcule custos e margens</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Receita
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Total de Receitas</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">127</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-extrabold">+8 este mês</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Margem Média</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">68.5%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500 font-extrabold">+2.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Custo Médio</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">R$ 6,19</div>
            <div className="flex items-center mt-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-500 font-extrabold">+R$ 0,45</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-0 shadow-lg p-6">
          <div className="pb-3">
            <h3 className="text-sm font-normal text-neutral-400 tracking-wider">Receitas Ativas</h3>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-black tracking-wider">98</div>
            <div className="text-sm text-neutral-500 font-extrabold mt-2">29 inativas</div>
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

      {/* Recipes Table */}
      <div className="bg-white rounded-lg border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Receita</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Categoria</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Custo Produção</th>
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
                      <div className="text-sm text-neutral-500">{recipe.rendimento}</div>
                    </div>
                  </td>
                  <td className="p-4 text-neutral-600 tracking-wider">{recipe.category}</td>
                  <td className="p-4 font-extrabold tracking-wider text-red-600">
                    R$ {recipe.costoProdução.toFixed(2)}
                  </td>
                  <td className="p-4 font-extrabold tracking-wider text-green-600">
                    R$ {recipe.precoVenda.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold tracking-wider">{recipe.margemLucro.toFixed(1)}%</span>
                      <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min(recipe.margemLucro, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-extrabold tracking-wider text-indigo-600">
                    R$ {recipe.lucroLiquido.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                        recipe.status === "Ativa" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {recipe.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <button className="p-1 hover:bg-neutral-100 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
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
