"use client"

import { TrendingUp } from "lucide-react"

export default function FinanceiroPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Controle Financeiro</h2>
        <p className="text-white/80 tracking-wider">Acompanhe receitas, custos e lucratividade</p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Receita Mensal</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">R$ 6.700</div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-extrabold">+21.8%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Custos Totais</h3>
          <div className="text-2xl font-extrabold text-red-600 tracking-wider">R$ 3.800</div>
          <div className="text-sm text-neutral-500 font-extrabold mt-2">56.7% da receita</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Lucro Líquido</h3>
          <div className="text-2xl font-extrabold text-green-600 tracking-wider">R$ 2.900</div>
          <div className="text-sm text-green-500 font-extrabold mt-2">43.3% margem</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">ROI</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">76.3%</div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-500 font-extrabold">+5.2%</span>
          </div>
        </div>
      </div>

      {/* Placeholder para gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-extrabold text-black tracking-wider mb-4">Evolução Financeira</h3>
          <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
            Gráfico de evolução financeira
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-extrabold text-black tracking-wider mb-4">Distribuição de Custos</h3>
          <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500">
            Gráfico de distribuição de custos
          </div>
        </div>
      </div>

      {/* Additional Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-extrabold text-black tracking-wider mb-4">Fluxo de Caixa</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 tracking-wider">Entradas</span>
              <span className="font-extrabold text-green-600 tracking-wider">R$ 6.700</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 tracking-wider">Saídas</span>
              <span className="font-extrabold text-red-600 tracking-wider">R$ 3.800</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-black tracking-wider">Saldo</span>
                <span className="font-extrabold text-indigo-600 tracking-wider">R$ 2.900</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-extrabold text-black tracking-wider mb-4">Metas do Mês</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-600 tracking-wider">Receita</span>
                <span className="text-sm font-extrabold">89%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "89%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-neutral-600 tracking-wider">Margem</span>
                <span className="text-sm font-extrabold">76%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-extrabold text-black tracking-wider mb-4">Comparativo</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 tracking-wider">Mês Anterior</span>
              <span className="font-extrabold tracking-wider">R$ 5.500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 tracking-wider">Mês Atual</span>
              <span className="font-extrabold tracking-wider">R$ 6.700</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-black tracking-wider">Crescimento</span>
                <span className="font-extrabold text-green-600 tracking-wider">+21.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
