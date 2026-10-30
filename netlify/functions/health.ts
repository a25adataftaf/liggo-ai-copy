import { healthPayload } from '../../server/handler'

/** Función serverless de Netlify: /api/health (ver netlify.toml). */
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

export async function handler() {
  return {
    statusCode: 200,
    headers: HEADERS,
    body: JSON.stringify(healthPayload(process.env)),
  }
}
