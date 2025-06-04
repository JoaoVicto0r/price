"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTickets, type Ticket } from "@/hooks/use-tickets"
import NewTicketModal from "./NewTicketModal"
import TicketDetailModal from "./TicketDetailModal"

export default function EnhancedSupportePage() {
  const { user } = useAuth()
  const { tickets, addTicket, updateTicket, getStats } = useTickets()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Verificar se é admin (adapte conforme sua lógica)
  const isAdmin = user?.role === "admin" || user?.email === "admin@price.com"

  const stats = getStats()

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTicketCreated = (newTicket: Ticket) => {
    addTicket(newTicket)
  }

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    updateTicket(updatedTicket)
    setSelectedTicket(updatedTicket)
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-widest mb-2">Suporte {isAdmin && "- Admin"}</h2>
          <p className="text-white/80 tracking-wider">
            {isAdmin ? "Gerenciamento de tickets de suporte" : "Atendimento e suporte aos clientes"}
          </p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Ticket
        </button>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Tickets Abertos</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">{stats.abertos}</div>
          <div className="text-sm text-red-500 font-extrabold mt-2">Pendentes</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Em Andamento</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">{stats.emAndamento}</div>
          <div className="text-sm text-yellow-500 font-extrabold mt-2">Processando</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Resolvidos</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">{stats.resolvidos}</div>
          <div className="text-sm text-green-500 font-extrabold mt-2">Concluídos</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-sm text-neutral-400 tracking-wider mb-2">Total</h3>
          <div className="text-2xl font-extrabold text-black tracking-wider">{stats.total}</div>
          <div className="text-sm text-indigo-500 font-extrabold mt-2">Tickets</div>
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
          <h3 className="text-lg font-extrabold text-black tracking-wider">
            {isAdmin ? "Todos os Tickets" : "Tickets Recentes"}
          </h3>
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
                      <div className="text-sm text-neutral-500 mt-1 truncate max-w-xs">{ticket.description}</div>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="p-1 hover:bg-neutral-100 rounded text-indigo-500 hover:text-indigo-700"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

      {/* Modals */}
      <NewTicketModal
        isOpen={showNewTicketModal}
        onClose={() => setShowNewTicketModal(false)}
        onTicketCreated={handleTicketCreated}
      />

      <TicketDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        ticket={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  )
}
