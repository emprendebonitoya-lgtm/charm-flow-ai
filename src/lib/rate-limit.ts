// Rate limiting simple en memoria para server functions
// En producción, usar Redis o similar para distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const DEFAULT_LIMIT = 100; // requests por ventana
const DEFAULT_WINDOW = 60 * 1000; // 1 minuto en ms

export function checkRateLimit(
  identifier: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Nueva ventana o ventana expirada
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: limit - 1, resetTime };
  }

  if (entry.count >= limit) {
    // Límite excedido
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Incrementar contador
  entry.count++;
  rateLimitStore.set(identifier, entry);
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime };
}

export function getClientIdentifier(request: Request): string {
  // Intentar obtener IP real del request
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback a user agent si no hay IP
  return request.headers.get('user-agent') || 'unknown';
}

// Cleanup de entradas expiradas (ejecutar periódicamente)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Limpiar cada minuto
