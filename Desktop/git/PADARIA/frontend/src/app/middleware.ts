import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Adicione esta função de verificação
async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials: "include"
    })
    return response.ok
  } catch (error) {
    console.error("Token verification failed:", error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || null

  const authRoutes = ["/"]
  const protectedRoutes = [
    "/dashboard",
    "/receitas",
    "/insumos",
    "/financeiro",
    "/suporte"
  ]

  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isAuthRoute) {
    if (token) {
      // Verifique se o token é válido antes de redirecionar
      const isValid = await verifyToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      // Se inválido, limpe o cookie
      const response = NextResponse.next()
      response.cookies.delete("token")
      return response
    }
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Verifique a validade do token
    const isValid = await verifyToken(token)
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/", request.url))
      response.cookies.delete("token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/receitas/:path*",
    "/insumos/:path*",
    "/financeiro/:path*",
    "/suporte/:path*"
  ]
}