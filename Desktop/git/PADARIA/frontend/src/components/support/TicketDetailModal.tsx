"use client"

import { useState } from "react"
import { X, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Ticket } from "@/hooks/use-tickets"

interface TicketDetailModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  onTicketUpdated: (updatedTicket: Ticket) => void
}

export default function TicketDetailModal({ isOpen, onClose, ticket, onTicketUpdated }: TicketDetailModalProps) {
  const { user } = useAuth()
  const [adminNotes, setAdminNotes] = useState("")
  const [newStatus, setNewStatus] = useState<"Aberto" | "Em andamento" | "Resolvido">(ticket?.status || "Aberto")

  // Verificar se é admin (adapte conforme sua lógica)
  const isAdmin = user?.role === "admin" || user?.email === "admin@price.com"

  const handleStatusUpdate = () => {
    if (!ticket) return

    const updatedTicket: Ticket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date(),
    }

    // Atualizar no localStorage
    const savedTickets = localStorage.getItem("price_support_tickets")
    const allTickets = savedTickets ? JSON.parse(savedTickets) : []
    const updatedTickets = allTickets.map((t: Ticket) => (t.id === ticket.id ? updatedTicket : t))
    localStorage.setItem("price_support_tickets", JSON.stringify(updatedTickets))

    onTicketUpdated(updatedTicket)
  }

  const handleAddNotes = () => {
    if (!ticket || !adminNotes.trim()) return

    const updatedTicket: Ticket = {
      ...ticket,
      adminNotes,
      updatedAt: new Date(),
    }

    // Atualizar no localStorage
    const savedTickets = localStorage.getItem("price_support_tickets")
    const allTickets = savedTickets ? JSON.parse(savedTickets) : []
    const updatedTickets = allTickets.map((t: Ticket) => (t.id === ticket.id ? updatedTicket : t))
    localStorage.setItem("price_support_tickets", JSON.stringify(updatedTickets))

    onTicketUpdated(updatedTicket)
    setAdminNotes("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto":
        return <MessageCircle className="w-4 h-4" />
      case "Em andamento":
        return <Clock className="w-4 h-4" />
      case "Resolvido":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  if (!isOpen || !ticket) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xl font-extrabold text-black tracking-wider">{ticket.subject}</h3>
            <p className="text-sm text-neutral-500 tracking-wider">
              {ticket.id} • {ticket.client} • {ticket.date}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status e Prioridade */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(ticket.status)}
              <span
                className={`inline-flex px-3 py-1 text-sm font-extrabold rounded-full tracking-wider ${
                  ticket.status === "Aberto"
                    ? "bg-red-100 text-red-800"
                    : ticket.status === "Em andamento"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {ticket.status}
              </span>
            </div>
            <span
              className={`inline-flex px-3 py-1 text-sm font-extrabold rounded-full tracking-wider ${
                ticket.priority === "Alta"
                  ? "bg-red-100 text-red-800"
                  : ticket.priority === "Média"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {ticket.priority}
            </span>
          </div>

          {/* Descrição */}
          <div>
            <h4 className="text-lg font-extrabold text-black tracking-wider mb-3">Descrição do Problema</h4>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <p className="tracking-wider font-['Telegraf']">{ticket.description}</p>
            </div>
          </div>

          {/* Seção Admin */}
          {isAdmin && (
            <div className="border-t border-neutral-200 pt-6 space-y-6">
              <h4 className="text-lg font-extrabold text-black tracking-wider">Painel Administrativo</h4>

              {/* Alterar Status */}
              <div>
                <label className="block text-sm font-extrabold text-black tracking-wider mb-2">Status do Ticket</label>
                <div className="flex gap-4">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as "Aberto" | "Em andamento" | "Resolvido")}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Resolvido">Resolvido</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3"
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              {/* Adicionar Resposta */}
              <div>
                <label className="block text-sm font-extrabold text-black tracking-wider mb-2">
                  Resposta do Suporte
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
                  placeholder="Adicione uma resposta ou observação para o cliente..."
                />
                <button
                  onClick={handleAddNotes}
                  disabled={!adminNotes.trim()}
                  className="mt-3 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 disabled:opacity-50"
                >
                  Adicionar Resposta
                </button>
              </div>
            </div>
          )}

          {/* Resposta Atual */}
          {ticket.adminNotes && (
            <div>
              <h4 className="text-lg font-extrabold text-black tracking-wider mb-3">Resposta do Suporte</h4>
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                <p className="text-indigo-700 tracking-wider font-['Telegraf']">{ticket.adminNotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
