"use client"

import { useState, useEffect } from "react"

export interface Ticket {
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

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  // Mock tickets iniciais (você pode remover depois)
  const mockTickets: Ticket[] = [
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

  useEffect(() => {
    // Carregar tickets do localStorage
    const savedTickets = localStorage.getItem("price_support_tickets")
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets)
      setTickets([...mockTickets, ...parsedTickets])
    } else {
      setTickets(mockTickets)
    }
  }, [])

  const addTicket = (ticket: Ticket) => {
    const newTickets = [...tickets, ticket]
    setTickets(newTickets)

    // Salvar apenas os novos tickets (não os mock)
    const newTicketsOnly = newTickets.filter((t) => !mockTickets.find((m) => m.id === t.id))
    localStorage.setItem("price_support_tickets", JSON.stringify(newTicketsOnly))
  }

  const updateTicket = (updatedTicket: Ticket) => {
    const newTickets = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    setTickets(newTickets)

    // Salvar apenas os novos tickets (não os mock)
    const newTicketsOnly = newTickets.filter((t) => !mockTickets.find((m) => m.id === t.id))
    localStorage.setItem("price_support_tickets", JSON.stringify(newTicketsOnly))
  }

  const getStats = () => {
    const abertos = tickets.filter((t) => t.status === "Aberto").length
    const emAndamento = tickets.filter((t) => t.status === "Em andamento").length
    const resolvidos = tickets.filter((t) => t.status === "Resolvido").length

    return {
      abertos,
      emAndamento,
      resolvidos,
      total: tickets.length,
    }
  }

  return {
    tickets,
    addTicket,
    updateTicket,
    getStats,
  }
}
