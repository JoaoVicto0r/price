"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { SupportTicket } from "@/types/user"

export default function UserSupport() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  useEffect(() => {
    loadTickets()
  }, [user])

  const loadTickets = () => {
    const savedTickets = localStorage.getItem("price_support_tickets")
    if (savedTickets) {
      const allTickets = JSON.parse(savedTickets)
      setTickets(allTickets.filter((t: SupportTicket) => t.userId === user?.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: "open",
      priority: formData.priority,
      userId: user!.id,
      userName: user!.name || user!.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const savedTickets = localStorage.getItem("price_support_tickets")
    const allTickets = savedTickets ? JSON.parse(savedTickets) : []
    allTickets.push(newTicket)
    localStorage.setItem("price_support_tickets", JSON.stringify(allTickets))

    setTickets([...tickets, newTicket])
    setFormData({ title: "", description: "", priority: "medium" })
    setShowForm(false)
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">Suporte</h2>
            <p className="text-gray-600 font-['Telegraf'] tracking-wider">Abra chamados e acompanhe o status</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-['Telegraf'] font-extrabold tracking-wider transition"
          >
            Novo Chamado
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6 font-['Telegraf'] tracking-wider">
              Novo Chamado de Suporte
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                >
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                  placeholder="Resumo do problema"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                  placeholder="Descreva detalhadamente o problema"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-extrabold text-gray-700 font-['Telegraf'] tracking-wider"
                >
                  Prioridade
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" })}
                  className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-4 py-3 font-['Telegraf'] tracking-wider"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-['Telegraf'] font-extrabold tracking-wider transition"
                >
                  Criar Chamado
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-['Telegraf'] font-extrabold tracking-wider transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">Meus Chamados</h3>
          {tickets.length === 0 ? (
            <div className="bg-white shadow-lg rounded-lg p-8">
              <p className="text-center text-gray-500 font-['Telegraf'] tracking-wider">Nenhum chamado encontrado</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white shadow-lg rounded-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-extrabold text-gray-900 font-['Telegraf'] tracking-wider">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-['Telegraf'] tracking-wider">
                      Criado em {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span
                      className={`px-3 py-1 text-sm font-extrabold rounded-full font-['Telegraf'] tracking-wider ${getStatusColor(ticket.status)}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                    <span className="px-3 py-1 text-sm font-extrabold rounded-full bg-gray-100 text-gray-800 font-['Telegraf'] tracking-wider">
                      {getPriorityText(ticket.priority)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 font-['Telegraf'] tracking-wider">{ticket.description}</p>
                {ticket.adminNotes && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <p className="text-sm font-extrabold text-indigo-800 font-['Telegraf'] tracking-wider">
                      Resposta do Suporte:
                    </p>
                    <p className="text-indigo-700 font-['Telegraf'] tracking-wider">{ticket.adminNotes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
