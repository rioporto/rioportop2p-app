import { NextRequest } from 'next/server'

interface RateLimitOptions {
  interval: number // em milissegundos
  uniqueTokenPerInterval: number // número de tokens únicos por intervalo
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const ratelimit = new Map<string, { count: number; resetTime: number }>()

export async function rateLimiter(
  request: NextRequest,
  options: RateLimitOptions = {
    interval: 60 * 1000, // 1 minuto
    uniqueTokenPerInterval: 10, // 10 requisições por minuto
  }
): Promise<RateLimitResult> {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
  const key = `${ip}:${request.nextUrl.pathname}`
  
  const now = Date.now()
  const resetTime = now + options.interval
  
  const tokenData = ratelimit.get(key)
  
  if (!tokenData || now > tokenData.resetTime) {
    // Novo intervalo
    ratelimit.set(key, { count: 1, resetTime })
    return {
      success: true,
      limit: options.uniqueTokenPerInterval,
      remaining: options.uniqueTokenPerInterval - 1,
      reset: resetTime,
    }
  }
  
  if (tokenData.count >= options.uniqueTokenPerInterval) {
    // Limite excedido
    return {
      success: false,
      limit: options.uniqueTokenPerInterval,
      remaining: 0,
      reset: tokenData.resetTime,
    }
  }
  
  // Incrementar contador
  tokenData.count++
  ratelimit.set(key, tokenData)
  
  return {
    success: true,
    limit: options.uniqueTokenPerInterval,
    remaining: options.uniqueTokenPerInterval - tokenData.count,
    reset: tokenData.resetTime,
  }
}

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of ratelimit.entries()) {
    if (now > value.resetTime) {
      ratelimit.delete(key)
    }
  }
}, 60 * 1000) // Limpar a cada minuto