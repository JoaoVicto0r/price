import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Obter token do cookie ou header Authorization
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

  // Rotas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/receitas',
    '/insumos',
    '/financeiro',
    '/suporte'
  ];

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Se não for rota protegida, continuar
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Se for rota protegida e não tiver token, redirecionar para login
  if (!token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verificar token com o backend
    const verifyResponse = await fetch(`${process.env.API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Se token válido, continuar
    if (verifyResponse.ok) {
      return NextResponse.next();
    }

    // Se token inválido, redirecionar para login
    throw new Error('Token inválido');
    
  } catch (error) {
    // Limpar cookie e redirecionar
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('auth_token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};