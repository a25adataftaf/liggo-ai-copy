import type { GenerateRequest, GenerateResponse } from '../../shared/modes'

export interface ApiError {
  error: string
}

export async function generateResponses(payload: GenerateRequest): Promise<GenerateResponse> {
  let res: Response
  try {
    res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('No hay conexión con el servidor de Liggo. Revisa tu red e inténtalo otra vez.')
  }

  const data = (await res.json().catch(() => null)) as GenerateResponse | ApiError | null

  if (!res.ok) {
    const message =
      data && 'error' in data && data.error ? data.error : 'Algo ha fallado. Prueba de nuevo en un momento.'
    throw new Error(message)
  }

  if (!data || !('suggestions' in data)) {
    throw new Error('La respuesta ha llegado vacía. Prueba de nuevo.')
  }

  return data
}

export async function checkHealth(): Promise<{ ai: boolean; provider: string }> {
  try {
    const res = await fetch('/api/health')
    if (!res.ok) return { ai: false, provider: 'demo' }
    const data = (await res.json()) as { ai?: boolean; provider?: string }
    return { ai: Boolean(data.ai), provider: data.provider ?? 'demo' }
  } catch {
    return { ai: false, provider: 'demo' }
  }
}
