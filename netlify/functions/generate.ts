import { generateResponse } from '../../server/handler'
import { fallbackResponse } from '../../server/fallback'

/**
 * Función serverless de Netlify: /api/generate (ver netlify.toml).
 */
interface NetlifyEvent {
  httpMethod: string
  body: string | null
  isBase64Encoded?: boolean
}

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let rawBody: unknown = {}
  try {
    const text = event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body
      : '{}'
    rawBody = JSON.parse(text)
  } catch {
    return {
      statusCode: 400,
      headers: HEADERS,
      body: JSON.stringify({ error: 'No he podido leer la petición.' }),
    }
  }

  try {
    const result = await generateResponse(rawBody, process.env)
    return { statusCode: result.status, headers: HEADERS, body: JSON.stringify(result.body) }
  } catch (error) {
    const detail = error instanceof Error ? error.message.slice(0, 120) : 'error inesperado'
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(fallbackResponse(rawBody, detail)),
    }
  }
}
