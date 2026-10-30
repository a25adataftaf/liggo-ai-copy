import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateResponse, healthPayload } from './handler'

/**
 * Adaptador HTTP para el middleware de Vite (dev y preview).
 * La lógica vive en server/handler.ts, compartida con las funciones serverless.
 */

const MAX_BODY_BYTES = 12 * 1024 * 1024

function json(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

export function handleHealth(res: ServerResponse) {
  json(res, 200, healthPayload(process.env))
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload-too-large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw.trim()) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('invalid-json'))
      }
    })
    req.on('error', reject)
  })
}

export async function handleGenerate(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' })

  let body: unknown
  try {
    body = await readBody(req)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'bad-request'
    return json(res, message === 'payload-too-large' ? 413 : 400, {
      error:
        message === 'payload-too-large'
          ? 'La captura es demasiado grande (máx. 12 MB). Prueba con una imagen más ligera.'
          : 'No he podido leer la petición.',
    })
  }

  const result = await generateResponse(body, process.env)
  return json(res, result.status, result.body)
}
