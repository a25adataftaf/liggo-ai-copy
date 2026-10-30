import type { IncomingMessage, ServerResponse } from 'node:http'
import { isModeId, type GenerateRequest } from '../shared/modes'
import { ProviderError, requestCompletion, type ProviderConfig } from '../shared/provider'
import { generateDemo } from './engine'

const MAX_BODY_BYTES = 12 * 1024 * 1024
const MAX_IMAGES = 4

function json(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

function providerConfig(): ProviderConfig | null {
  const key = process.env.LIGGO_API_KEY || process.env.OPENAI_API_KEY
  if (!key) return null
  return {
    key,
    baseUrl: process.env.LIGGO_BASE_URL || 'https://api.openai.com/v1',
    model: process.env.LIGGO_MODEL || 'gpt-4o-mini',
  }
}

export function handleHealth(res: ServerResponse) {
  const provider = providerConfig()
  json(res, 200, {
    ok: true,
    provider: provider ? provider.model : 'demo',
    ai: Boolean(provider),
    where: provider ? 'server' : null,
  })
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

function normalizeRequest(input: unknown): GenerateRequest {
  const body = (input ?? {}) as Record<string, unknown>
  const modes = Array.isArray(body.modes) ? body.modes.filter(isModeId) : []
  const images = Array.isArray(body.images)
    ? body.images
        .filter((i): i is string => typeof i === 'string' && i.startsWith('data:image/'))
        .slice(0, MAX_IMAGES)
    : []

  return {
    chat: typeof body.chat === 'string' ? body.chat.slice(0, 12000) : '',
    story: typeof body.story === 'string' ? body.story.slice(0, 2000) : '',
    format: body.format === 'story' ? 'story' : 'chat',
    modes: modes.slice(0, 3),
    lastSpeaker: body.lastSpeaker === 'me' ? 'me' : 'match',
    images,
    profile:
      body.profile && typeof body.profile === 'object'
        ? {
            alias: String((body.profile as Record<string, unknown>).alias ?? '').slice(0, 40),
            country: String((body.profile as Record<string, unknown>).country ?? 'es').slice(0, 16),
            matchName: String((body.profile as Record<string, unknown>).matchName ?? '').slice(0, 40),
          }
        : undefined,
    seed: typeof body.seed === 'number' ? body.seed : undefined,
  }
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

  const parsed = normalizeRequest(body)
  if (!parsed.chat.trim() && !parsed.images?.length && !parsed.story?.trim()) {
    return json(res, 400, {
      error: 'Pega el chat, sube una captura o cuéntame la situación para poder ayudarte.',
    })
  }

  const config = providerConfig()
  if (config) {
    try {
      const ai = await requestCompletion(config, parsed)
      return json(res, 200, ai)
    } catch (error) {
      const detail =
        error instanceof ProviderError ? error.message : 'error desconocido al llamar al modelo'
      const fallback = generateDemo(parsed)
      fallback.note = `No he podido usar el modelo (${detail}), así que te dejo el motor local.`
      return json(res, 200, fallback)
    }
  }

  return json(res, 200, generateDemo(parsed))
}
