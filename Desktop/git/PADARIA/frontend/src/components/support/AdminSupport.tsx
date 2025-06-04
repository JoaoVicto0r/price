"use client"

import { useState, useEffect } from "react"
import type { SupportTicket } from "@/types/user"

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = () => {
    const savedTickets = localStorage.getItem("price_support_tickets")
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets))
    }
  }

  const updateTicketStatus = (ticketId: string, status: "open" | "in_progress" | "closed") => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date() } : ticket,
    )
    setTickets(updatedTickets)
    localStorage.setItem("price_support_tickets", JSON.stringify(updatedTickets))

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status, updatedAt: new Date() })
    }
  }

  const addAdminNotes = (ticketId: string) => {
    if (!adminNotes.trim()) return

    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, adminNotes, updatedAt: new Date() } : ticket,
    )
    setTickets(updatedTickets)
    localStorage.setItem("price_support_tickets", JSON.stringify(updatedTickets))

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, adminNotes, updatedAt: new Date() })
    }
    setAdminNotes("")
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto"
      case "in_progress":
        return "Em Andamento"
      case "closed":
        return "Fechado"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length
  const closedTickets = tickets.filter((t) => t.status === "closed").length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
            Painel de Suporte - Admin
          </h2>
          <p className="text-gray-600 font-['Telegraf'] tracking-wider">Gerencie todos os chamados de suporte</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">Abertos</p>
                <p className="text-3xl font-extrabold text-blue-600 font-['Telegraf'] tracking-wider">{openTickets}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">Em Andamento</p>
                <p className="text-3xl font-extrabold text-yellow-600 font-['Telegraf'] tracking-wider">
                  {inProgressTickets}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-gray-600 font-['Telegraf'] tracking-wider">Fechados</p>
                <p className="text-3xl font-extrabold text-green-600 font-['Telegraf'] tracking-wider">
                  {closedTickets}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Tickets */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">Todos os Chamados</h3>
            {tickets.length === 0 ? (
              <div className="bg-white shadow-lg rounded-lg p-8">
                <p className="text-center text-gray-500 font-['Telegraf'] tracking-wider">Nenhum chamado encontrado</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-white shadow-lg rounded-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedTicket?.id === ticket.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
                        {ticket.title}
                      </h4>
                      <p className="text-sm text-gray-500 font-['Telegraf'] tracking-wider">
                        {ticket.userName} • {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-extrabold rounded-full font-['Telegraf'] tracking-wider ${getStatusColor(ticket.status)}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detalhes do Ticket */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
              Detalhes do Chamado
            </h3>
            {selectedTicket ? (
              <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
                <div>
                  <h4 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
                    {selectedTicket.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-['Telegraf'] tracking-wider">
                    Por {selectedTicket.userName} em {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h5 className="font-extrabold text-gray-900 mb-3 font-['Telegraf'] tracking-wider">Descrição:</h5>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg font-['Telegraf'] tracking-wider">
                    {selectedTicket.description}
                  </p>
                </div>

                <div>
                  <h5 className="font-extrabold text-gray-900 mb-3 font-['Telegraf'] tracking-wider">Status:</h5>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicketStatus(selectedTicket.id, e.target.value as "open" | "in_progress" | "closed")
                    }
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                  >
                    <option value="open">Aberto</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="closed">Fechado</option>
                  </select>
                </div>

                <div>
                  <h5 className="font-extrabold text-gray-900 mb-3 font-['Telegraf'] tracking-wider">
                    Resposta do Suporte:
                  </h5>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Adicione uma resposta ou observação..."
                    rows={4}
                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                  />
                  <button
                    onClick={() => addAdminNotes(selectedTicket.id)}
                    disabled={!adminNotes.trim()}
                    className="mt-3 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 font-['Telegraf'] font-extrabold tracking-wider transition"
                  >
                    Adicionar Resposta
                  </button>
                </div>

                {selectedTicket.adminNotes && (
                  <div>
                    <h5 className="font-extrabold text-gray-900 mb-3 font-['Telegraf'] tracking-wider">
                      Resposta Atual:
                    </h5>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="text-indigo-700 font-['Telegraf'] tracking-wider">{selectedTicket.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-8">
                <p className="text-center text-gray-500 font-['Telegraf'] tracking-wider">
                  Selecione um chamado para ver os detalhes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
