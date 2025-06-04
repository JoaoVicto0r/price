export interface SupportTicket {
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
  createdAt: Date
  updatedAt: Date
}

export interface Insumo {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  price: number
  supplier: string
  createdAt: Date
  updatedAt: Date
}
