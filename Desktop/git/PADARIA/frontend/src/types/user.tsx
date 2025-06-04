export interface SupportTicket {
  id: string
  title: string
  description: string
  status: "open" | "in_progress" | "closed"
  priority: "low" | "medium" | "high"
  userId: string
  userName: string
  createdAt: Date
  updatedAt: Date
  adminNotes?: string
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
