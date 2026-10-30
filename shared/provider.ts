import {
  isModeId,
  MODE_MAP,
  type GenerateRequest,
  type GenerateResponse,
  type ModeId,
  type Suggestion,
  type VibeId,
} from './modes'
import { buildUserPrompt, SYSTEM_PROMPT } from './prompt'

export interface ProviderConfig {
  key: string
  baseUrl: string
  model: string
}

const VIBES: VibeId[] = ['fluida', 'picante', 'fria', 'monosilabo', 'en-visto', 'sin-contexto']

const VIBE_LABELS: Record<VibeId, string> = {
  fluida: 'Conversación fluida',
  picante: 'Chispa alta',
  fria: 'Conversación fría',
  monosilabo: 'Respuestas mínimas',
  'en-visto': 'Esperando respuesta',
  'sin-contexto': 'Sin contexto',
}

export class ProviderError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ProviderError'
    this.status = status
  }
}

/** Parseo defensivo del JSON que devuelve el modelo. */
export function parseModelJson(raw: string): Record<string, unknown> | null {
  const cleaned = raw
    .replace(/^\s*```(?:json)?/i, '')
    .replace(/```\s*$/, '')
    .trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>
  } catch {
    return null
  }
}

export function coerceAiResponse(raw: unknown, req: GenerateRequest): GenerateResponse | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  const rawSuggestions = Array.isArray(data.suggestions) ? data.suggestions : []

  const suggestions: Suggestion[] = []
  for (const item of rawSuggestions) {
    if (!item || typeof item !== 'object') continue
    const s = item as Record<string, unknown>
    const text = typeof s.text === 'string' ? s.text.trim() : ''
    if (!text) continue
    const requested = req.modes.find((m) => !suggestions.some((x) => x.mode === m))
    const mode: ModeId = isModeId(s.mode) ? s.mode : (requested ?? 'gracioso')
    suggestions.push({
      mode,
      text: text.replace(/^["'“”]|["'“”]$/g, '').slice(0, 600),
      note: typeof s.note === 'string' ? s.note.trim().slice(0, 200) : MODE_MAP[mode].tagline,
    })
    if (suggestions.length === 3) break
  }

  if (!suggestions.length) return null

  const vibe = VIBES.includes(data.vibe as VibeId) ? (data.vibe as VibeId) : 'fluida'
  const interest = Math.max(0, Math.min(100, Number(data.interest) || 55))

  return {
    reading: typeof data.reading === 'string' ? data.reading.trim().slice(0, 400) : '',
    vibe,
    vibeLabel: VIBE_LABELS[vibe] ?? 'Conversación',
    interest,
    suggestions,
    proTip:
      typeof data.proTip === 'string' && data.proTip.trim()
        ? data.proTip.trim().slice(0, 300)
        : 'Espera unos minutos antes de enviarlo: escribir con prisa se nota.',
    source: 'ai',
  }
}

function friendlyHttpError(status: number, detail: string): string {
  if (status === 401 || status === 403) return 'La API key no es válida o no tiene permisos.'
  if (status === 404)
    return 'La URL del proveedor o el modelo no existen: revisa la base URL y el nombre del modelo.'
  if (status === 429) return 'El proveedor está limitando peticiones. Espera un momento y reinténtalo.'
  if (status === 400) {
    const modelIssue = /model/i.test(detail) ? 'Parece que el modelo no existe o no admite imágenes. ' : ''
    return `${modelIssue}El proveedor rechazó la petición.`
  }
  if (status >= 500) return 'El proveedor está caído o saturado (error 5xx). Prueba en un rato.'
  return `El proveedor respondió con un error ${status}.`
}

function friendlyNetworkError(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (/abort/i.test(message)) return 'El proveedor tardó demasiado en responder.'
  if (/failed to fetch|fetch failed|networkerror|load failed|cors/i.test(message)) {
    return 'No hay conexión con el proveedor. Si la clave está en el navegador, puede que ese proveedor no permita llamadas desde aquí (CORS): pásala al servidor con .env.'
  }
  return 'No se pudo contactar con el proveedor de IA.'
}

export function normalizeProviderBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '')
  return trimmed || 'https://api.openai.com/v1'
}

/** Llama a cualquier proveedor compatible con la API de OpenAI y devuelve el resultado validado. */
export async function requestCompletion(
  config: ProviderConfig,
  req: GenerateRequest,
  externalSignal?: AbortSignal,
): Promise<GenerateResponse> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45_000)
  const forwardAbort = () => controller.abort()
  externalSignal?.addEventListener('abort', forwardAbort)

  const content: Record<string, unknown>[] = [{ type: 'text', text: buildUserPrompt(req) }]
  for (const image of req.images ?? []) {
    content.push({ type: 'image_url', image_url: { url: image, detail: 'high' } })
  }

  try {
    const res = await fetch(`${normalizeProviderBaseUrl(config.baseUrl)}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        temperature: 0.9,
        max_tokens: 1100,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new ProviderError(friendlyHttpError(res.status, detail), res.status)
    }

    const payload = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const text = payload.choices?.[0]?.message?.content
    if (!text) throw new ProviderError('El modelo respondió vacío. Prueba otra vez.')

    const result = coerceAiResponse(parseModelJson(text), req)
    if (!result) throw new ProviderError('El modelo no devolvió el formato esperado. Reinténtalo.')
    if (!result.reading) result.reading = 'Hay conversación y margen para subir el nivel.'

    return result
  } catch (error) {
    if (error instanceof ProviderError) throw error
    throw new ProviderError(friendlyNetworkError(error))
  } finally {
    clearTimeout(timer)
    externalSignal?.removeEventListener('abort', forwardAbort)
  }
}

/** Comprueba que la clave y la URL funcionan (endpoint /models, barato y sin gastar tokens). */
export interface TestResult {
  ok: boolean
  warning?: boolean
  message: string
}

export async function testProvider(config: ProviderConfig): Promise<TestResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20_000)
  try {
    const res = await fetch(`${normalizeProviderBaseUrl(config.baseUrl)}/models`, {
      headers: { Authorization: `Bearer ${config.key}` },
      signal: controller.signal,
    })

    if (res.ok) return { ok: true, message: 'Conexión correcta: la clave funciona.' }

    if (res.status === 404) {
      // Algunos proveedores no exponen /models: no lo tomamos como error de clave.
      return {
        ok: true,
        warning: true,
        message: 'Guardado. Tu proveedor no permite comprobar modelos, pero la clave se usará igual.',
      }
    }

    const detail = await res.text().catch(() => '')
    return { ok: false, message: friendlyHttpError(res.status, detail) }
  } catch (error) {
    return { ok: false, message: friendlyNetworkError(error) }
  } finally {
    clearTimeout(timer)
  }
}
