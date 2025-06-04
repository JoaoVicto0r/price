"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal } from "lucide-react"

const mockTickets = [
  {
    id: "#001",
    client: "Padaria Central",
    subject: "Erro no cálculo de margem",
    priority: "Alta",
    status: "Aberto",
    date: "2024-01-15",
    description: "Cliente relatou inconsistência no cálculo da margem de lucro do pão francês",
  },
  {
    id: "#002",
    client: "Confeitaria Doce Mel",
    subject: "Dúvida sobre custo operacional",
    priority: "Média",
    status: "Em andamento",
    date: "2024-01-14",
    description: "Como incluir custos de energia elétrica no cálculo das receitas",
  },
  {
    id: "#003",
    client: "Pizzaria Bella",
    subject: "Solicitação de nova receita",
    priority: "Baixa",
    status: "Resolvido",
    date: "2024-01-13",
    description: "Pedido para adicionar receita de pizza calabresa ao sistema",
  },
  {
    id: "#004",
    client: "Doceria Artesanal",
    subject: "Bug no cadastro de ingredientes",
    priority: "Alta",
    status: "Aberto",
    date: "2024-01-12",
    description: "Sistema não permite cadastrar ingredientes com vírgula no preço",
  },
]

export default function SuportePage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTickets = mockTickets.filter(
    (ticket) =>
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Suporte</h2>
          <p className="text-white/80 tracking-wider">Atendimento e suporte aos clientes</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Ticket
        </button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Tickets Abertos</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">23</div>
          <div className="text-sm text-red-500 font-extrabold mt-2">+3 hoje</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Em Andamento</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">15</div>
          <div className="text-sm text-yellow-500 font-extrabold mt-2">Aguardando</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Resolvidos Hoje</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">8</div>
          <div className="text-sm text-green-500 font-extrabold mt-2">Concluídos</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Tempo Médio</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">2.5h</div>
          <div className="text-sm text-green-500 font-extrabold mt-2">-30min</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider"
            />
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-extrabold text-black tracking-wider">Tickets Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left p-4 font-extrabold text-black tracking-wider">ID</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Cliente</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Assunto</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Prioridade</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Status</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Data</th>
                <th className="text-left p-4 font-extrabold text-black tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="p-4 font-extrabold tracking-wider text-indigo-500">{ticket.id}</td>
                  <td className="p-4 tracking-wider">{ticket.client}</td>
                  <td className="p-4">
                    <div>
                      <div className="tracking-wider">{ticket.subject}</div>
                      <div className="text-sm text-neutral-500 mt-1">{ticket.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                        ticket.priority === "Alta"
                          ? "bg-red-100 text-red-800"
                          : ticket.priority === "Média"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full tracking-wider ${
                        ticket.status === "Aberto"
                          ? "bg-red-100 text-red-800"
                          : ticket.status === "Em andamento"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-600 tracking-wider">{ticket.date}</td>
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
