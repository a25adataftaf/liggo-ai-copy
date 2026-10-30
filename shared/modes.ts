/**
 * Tipos y metadatos compartidos entre el cliente (React) y el motor (servidor).
 */

export type ModeId = 'gracioso' | 'coquetear' | 'provocativo' | 'enamorado' | 'salvada'

export type Format = 'chat' | 'story'

export type LastSpeaker = 'match' | 'me'

export interface Profile {
  alias?: string
  country?: string
  matchName?: string
}

export interface GenerateRequest {
  chat: string
  story?: string
  format: Format
  modes: ModeId[]
  lastSpeaker: LastSpeaker
  images?: string[]
  profile?: Profile
  /** Semilla extra para que "regenerar" devuelva variantes distintas. */
  seed?: number
}

export interface Suggestion {
  mode: ModeId
  text: string
  note: string
}

export type VibeId =
  | 'sin-contexto'
  | 'fluida'
  | 'picante'
  | 'monosilabo'
  | 'en-visto'
  | 'fria'

export interface GenerateResponse {
  reading: string
  vibe: VibeId
  vibeLabel: string
  interest: number
  suggestions: Suggestion[]
  proTip: string
  source: 'demo' | 'ai'
  note?: string
}

export interface ModeMeta {
  id: ModeId
  name: string
  emoji: string
  tagline: string
  description: string
  /** Variables CSS del degradado de la tarjeta. */
  from: string
  to: string
  border: string
  accent: string
}

export const MODES: ModeMeta[] = [
  {
    id: 'gracioso',
    name: 'Graciosa',
    emoji: '😎',
    tagline: 'Banter fino',
    description: 'Humor inteligente, ironía ligera y bromas con clase. Nada de chistes gastados.',
    from: '#fffdf6',
    to: '#fff1d2',
    border: '#f0e3c4',
    accent: '#c99a2e',
  },
  {
    id: 'coquetear',
    name: 'Coquetear',
    emoji: '😘',
    tagline: 'Sutil y magnético',
    description: 'Cumplidos indirectos, complicidad y esa chispa que deja con ganas de más.',
    from: '#fff7fb',
    to: '#f3e9ff',
    border: '#ecdcf3',
    accent: '#9a5bd6',
  },
  {
    id: 'provocativo',
    name: 'Provocativo',
    emoji: '🔥',
    tagline: 'Tensión elegante',
    description: 'Atrevido, con confianza y doble sentido limpio. Nunca vulgar.',
    from: '#fffaf2',
    to: '#ffe9c9',
    border: '#e6c489',
    accent: '#c07c13',
  },
  {
    id: 'enamorado',
    name: 'Enamorado',
    emoji: '😍',
    tagline: 'Cercano y real',
    description: 'Dulce, genuino y vulnerable. Para cuando ya hay confianza de verdad.',
    from: '#fff8f8',
    to: '#ffe7ee',
    border: '#f6d6de',
    accent: '#d4517c',
  },
  {
    id: 'salvada',
    name: 'Salvada Épica',
    emoji: '🦸',
    tagline: 'Rescate de chat',
    description: 'Para el visto, el "jaja" y el silencio incómodo. Reabre con dignidad.',
    from: '#f8fbff',
    to: '#e6f1ff',
    border: '#cfe1f7',
    accent: '#2f6bbd',
  },
]

export const MODE_MAP: Record<ModeId, ModeMeta> = Object.fromEntries(
  MODES.map((m) => [m.id, m]),
) as Record<ModeId, ModeMeta>

export function isModeId(value: unknown): value is ModeId {
  return typeof value === 'string' && value in MODE_MAP
}
