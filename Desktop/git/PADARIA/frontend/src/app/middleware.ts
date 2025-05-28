import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    null // não dá pra acessar localStorage aqui

  const isAuthPage = ["/", "/login"].includes(request.nextUrl.pathname)
  const isProtectedPage = ["/receitas", "/insumos", "/financeiro", "/suporte"].some(path =>
    request.nextUrl.pathname.startsWith(path),
  )
  const isRootPage = request.nextUrl.pathname === "/"

  // Se está na raiz (login)
  if (isRootPage) {
    if (token) {
      return NextResponse.redirect(new URL("/receitas", request.url))
    }
    return NextResponse.next()
  }

  // Se está tentando acessar página protegida sem token
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Se está logado e tentando acessar login, redireciona para receitas
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/receitas", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/receitas/:path*", "/insumos/:path*", "/financeiro/:path*", "/suporte/:path*"],
}
