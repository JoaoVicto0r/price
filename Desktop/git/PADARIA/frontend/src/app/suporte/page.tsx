"use client"

import { ProtectedRoute } from "@/components/auth/protected-routes"
import EnhancedSupportePage from "@/components/support/EnhancedSupportePage"

export default function SuporteEnhancedPage() {
  return (
    <ProtectedRoute>
      <EnhancedSupportePage />
    </ProtectedRoute>
  )
}
