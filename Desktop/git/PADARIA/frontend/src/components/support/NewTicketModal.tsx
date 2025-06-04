"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

// Definir interface local que corresponde ao seu código existente
interface Ticket {
  id: string
  client: string
  subject: string
  priority: "Alta" | "Média" | "Baixa"
  status: "Aberto" | "Em andamento" | "Resolvido"
  date: string
  description: string
  userId?: string
  userName?: string
  adminNotes?: string
  createdAt?: Date
  updatedAt?: Date
}

interface NewTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onTicketCreated: (ticket: Ticket) => void
}

export default function NewTicketModal({ isOpen, onClose, onTicketCreated }: NewTicketModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    client: "",
    subject: "",
    priority: "Média" as "Alta" | "Média" | "Baixa",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTicket: Ticket = {
      id: `#${String(Date.now()).slice(-3)}`,
      client: formData.client,
      subject: formData.subject,
      priority: formData.priority,
      status: "Aberto",
      date: new Date().toISOString().split("T")[0],
      description: formData.description,
      userId: user?.id || "",
      userName: user?.name || user?.email || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Salvar no localStorage
    const savedTickets = localStorage.getItem("price_support_tickets")
    const allTickets = savedTickets ? JSON.parse(savedTickets) : []
    allTickets.push(newTicket)
    localStorage.setItem("price_support_tickets", JSON.stringify(allTickets))

    onTicketCreated(newTicket)
    setFormData({ client: "", subject: "", priority: "Média", description: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h3 className="text-xl font-extrabold text-black tracking-wider">Novo Ticket de Suporte</h3>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-extrabold text-black tracking-wider mb-2">Cliente/Empresa</label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
              placeholder="Nome do cliente ou empresa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-black tracking-wider mb-2">Assunto</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
              placeholder="Resumo do problema"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-black tracking-wider mb-2">Prioridade</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as "Alta" | "Média" | "Baixa" })}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-black tracking-wider mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-indigo-500 focus:outline-none tracking-wider font-['Telegraf']"
              placeholder="Descreva detalhadamente o problema"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold tracking-wider rounded-lg px-6 py-3 flex-1"
            >
              Criar Ticket
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-300 hover:bg-neutral-400 text-black font-extrabold tracking-wider rounded-lg px-6 py-3 flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
