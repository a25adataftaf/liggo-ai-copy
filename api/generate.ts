import { generateResponse } from '../server/handler'
import { fallbackResponse } from '../server/fallback'

/**
 * Función serverless de Vercel: POST /api/generate
 * La lógica es la misma que usa el servidor de Vite (server/handler.ts).
 */
interface VercelRequest {
  method?: string
  body?: unknown
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (payload: unknown) => void
}

function parseBody(body: unknown): unknown {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return body ?? {}
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rawBody = parseBody(req.body)
  if (rawBody === null) {
    res.status(400).json({ error: 'No he podido leer la petición.' })
    return
  }

  try {
    const result = await generateResponse(rawBody, process.env)
    res.status(result.status).json(result.body)
  } catch (error) {
    const detail = error instanceof Error ? error.message.slice(0, 120) : 'error inesperado'
    res.status(200).json(fallbackResponse(rawBody, detail))
  }
}
