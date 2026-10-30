import { isModeId, type GenerateRequest } from '../shared/modes'
import { ProviderError, requestCompletion, type ProviderConfig } from '../shared/provider'
import { generateDemo } from '../shared/engine/engine'

/**
 * Núcleo de la API de LIGGO, independiente del framework.
 * Lo usan el middleware de Vite (dev/preview), las funciones serverless de Vercel y
 * las de Netlify: un solo sitio donde vive la lógica.
 */

export const MAX_IMAGES = 4
export const MAX_CHAT = 12000

export interface ApiResult {
  status: number
  body: unknown
}

export interface EnvLike {
  [key: string]: string | undefined
}

export function providerConfigFromEnv(env: EnvLike): ProviderConfig | null {
  const key = env.LIGGO_API_KEY || env.OPENAI_API_KEY
  if (!key) return null
  return {
    key,
    baseUrl: env.LIGGO_BASE_URL || 'https://api.openai.com/v1',
    model: env.LIGGO_MODEL || 'gpt-4o-mini',
  }
}

export function normalizeRequest(input: unknown): GenerateRequest {
  const body = (input ?? {}) as Record<string, unknown>
  const modes = Array.isArray(body.modes) ? body.modes.filter(isModeId) : []
  const images = Array.isArray(body.images)
    ? body.images
        .filter((i): i is string => typeof i === 'string' && i.startsWith('data:image/'))
        .slice(0, MAX_IMAGES)
    : []

  return {
    chat: typeof body.chat === 'string' ? body.chat.slice(0, MAX_CHAT) : '',
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

export function healthPayload(env: EnvLike) {
  const provider = providerConfigFromEnv(env)
  return {
    ok: true,
    provider: provider ? provider.model : 'demo',
    ai: Boolean(provider),
    where: provider ? 'server' : null,
  }
}

export async function generateResponse(input: unknown, env: EnvLike): Promise<ApiResult> {
  const parsed = normalizeRequest(input)

  if (!parsed.chat.trim() && !parsed.images?.length && !parsed.story?.trim()) {
    return {
      status: 400,
      body: { error: 'Pega el chat, sube una captura o cuéntame la situación para poder ayudarte.' },
    }
  }

  const config = providerConfigFromEnv(env)
  if (config) {
    try {
      return { status: 200, body: await requestCompletion(config, parsed) }
    } catch (error) {
      const detail =
        error instanceof ProviderError ? error.message : 'error desconocido al llamar al modelo'
      const fallback = generateDemo(parsed)
      fallback.note = `No he podido usar el modelo (${detail}), así que te dejo el motor local.`
      return { status: 200, body: fallback }
    }
  }

  return { status: 200, body: generateDemo(parsed) }
}
