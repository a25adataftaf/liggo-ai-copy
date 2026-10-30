import type { GenerateRequest, GenerateResponse } from '../../shared/modes'
import { generateDemo } from '../../shared/engine/engine'

export interface ApiError {
  error: string
}

/**
 * Motor local en el navegador.
 * Sirve de red de seguridad: si la web se sirve como estático (GitHub Pages, un CDN…)
 * o el backend falla, Liggo sigue respondiendo en lugar de romperse.
 */
function localEngine(payload: GenerateRequest, reason?: string): GenerateResponse {
  const data = generateDemo(payload)
  if (reason) data.note = `${reason} Respuesta generada en tu navegador.`
  return data
}

export async function generateResponses(payload: GenerateRequest): Promise<GenerateResponse> {
  let res: Response
  try {
    // Ruta relativa: funciona igual en la raíz (Vercel/Netlify) y en un subpath (Pages).
    res = await fetch('api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    return localEngine(
      payload,
      'Sin conexión con el servidor de Liggo: modo local (sin IA, las capturas no se leen).',
    )
  }

  // Sin backend desplegado, un host estático devuelve el index.html: no es JSON válido.
  const data = (await res.json().catch(() => null)) as GenerateResponse | ApiError | null

  if (!res.ok) {
    if (res.status >= 500 || res.status === 404) {
      return localEngine(payload, 'El servidor no está disponible: respondo en modo local.')
    }
    const message =
      data && 'error' in data && data.error ? data.error : 'Algo ha fallado. Prueba de nuevo en un momento.'
    throw new Error(message)
  }

  if (!data || !('suggestions' in data)) {
    return localEngine(payload, 'El servidor no ha devuelto nada útil: respondo en modo local.')
  }

  return data
}

export async function checkHealth(): Promise<{ ai: boolean; provider: string }> {
  try {
    const res = await fetch('api/health')
    if (!res.ok) return { ai: false, provider: 'demo' }
    const data = (await res.json()) as { ai?: boolean; provider?: string }
    return { ai: Boolean(data.ai), provider: data.provider ?? 'demo' }
  } catch {
    return { ai: false, provider: 'demo' }
  }
}
