import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimiter } from '@/lib/rate-limit'
import { validateCSRFToken, generateCSRFToken } from '@/lib/csrf'

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/transactions', '/otc']

// Rotas administrativas que requerem role admin
const adminRoutes = ['/admin']

// Rotas públicas que redirecionam se autenticado
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')
  const { pathname } = request.nextUrl

  // Rate limiting para APIs
  if (pathname.startsWith('/api/')) {
    const rateLimit = await rateLimiter(request, {
      interval: 60 * 1000, // 1 minuto
      uniqueTokenPerInterval: pathname.includes('auth') ? 5 : 30, // Limites diferentes por tipo de API
    })

    if (!rateLimit.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.reset).toISOString(),
          'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
        },
      })
    }

    // Validação CSRF para APIs de mutação
    if (!pathname.includes('/auth/') && !validateCSRFToken(request)) {
      return new NextResponse('Invalid CSRF Token', { status: 403 })
    }
  }

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Verificar se é uma rota administrativa
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirecionar para login se tentar acessar rota protegida sem token
  if ((isProtectedRoute || isAdminRoute) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Verificação específica para rotas admin
  if (isAdminRoute && token) {
    try {
      // Por enquanto, vamos redirecionar todos para o dashboard
      // TODO: Implementar verificação de role admin via Stack Auth
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    } catch (error) {
      // Em caso de erro, redirecionar para login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirecionar para dashboard se tentar acessar login/signup com token
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}