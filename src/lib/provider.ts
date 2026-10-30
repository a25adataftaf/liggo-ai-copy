import { normalizeProviderBaseUrl, type ProviderConfig } from '../../shared/provider'

const STORAGE_KEY = 'liggo.provider'

/**
 * Configuración del proveedor guardada SOLO en este navegador.
 * La clave nunca se envía a nuestro servidor: va directa del navegador al proveedor.
 */
export function loadProvider(): ProviderConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<ProviderConfig>
    if (!data?.key) return null
    return {
      key: String(data.key),
      baseUrl: normalizeProviderBaseUrl(String(data.baseUrl ?? 'https://api.openai.com/v1')),
      model: String(data.model || 'gpt-4o-mini'),
    }
  } catch {
    return null
  }
}

export function saveProvider(config: ProviderConfig) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        key: config.key,
        baseUrl: normalizeProviderBaseUrl(config.baseUrl),
        model: config.model || 'gpt-4o-mini',
      }),
    )
  } catch {
    /* modo privado / cuota llena */
  }
}

export function clearProvider() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
}

export function maskKey(key: string): string {
  if (!key) return ''
  if (key.length <= 8) return '••••'
  return `${key.slice(0, 3)}••••${key.slice(-4)}`
}
