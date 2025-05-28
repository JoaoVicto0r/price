import type React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-routes"

export default function ReceitasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}
