import { healthPayload } from '../server/handler'

/** Función serverless de Vercel: GET /api/health */
interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  json: (payload: unknown) => void
}

export default function handler(_req: unknown, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(healthPayload(process.env))
}
