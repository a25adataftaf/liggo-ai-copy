import type { LastSpeaker, VibeId } from '../shared/modes'
import { countEmojis, parseChatLines } from '../shared/chat'
import { detectTopics, type TopicMeta } from '../shared/topics'

export type Bucket = 'hot' | 'fluid' | 'cold' | 'stale'
export type { TopicMeta }

const FLIRT_WORDS =
  /(guap[oa]|lind[oa]|bell[oa]|precios[oa]|beso|besit|quedamos|vernos|verte|cita|invito|te apetece|me gustas|me encantas|🔥|😏|😘|💋|🥵|😍|💘|🙈)/i
const DRY_WORDS = /(^|\s)(ok|okay|vale|bueno|nada|ya|si|sí|no|jaja|jeje|xd|👍|👌|🙂|😅)(\s|$)/i
const QUESTION_OPENERS = /(qué|cómo|como|cuándo|cuando|dónde|donde|quién|quien|por qué|porque|cuál|cual)/i

export interface Analysis {
  hasChat: boolean
  lastText: string
  lastFrom: LastSpeaker
  topic: TopicMeta | null
  score: number
  vibe: VibeId
  vibeLabel: string
  bucket: Bucket
  isMono: boolean
  isQuestion: boolean
  matchLines: number
  words: number
}

/** Primer tema detectado en la conversación (o null). */
function detectTopic(text: string): TopicMeta | null {
  return detectTopics(text, 1)[0] ?? null
}

export function analyze(rawChat: string, lastSpeaker: LastSpeaker): Analysis {
  const chat = rawChat.trim()
  const lines = parseChatLines(chat).map((l) => l.text)
  const lastText = lines.length ? lines[lines.length - 1] : ''
  const whole = lines.join(' \n ')
  const words = lastText.split(/\s+/).filter(Boolean).length

  if (!chat) {
    return {
      hasChat: false,
      lastText: '',
      lastFrom: lastSpeaker,
      topic: null,
      score: 0,
      vibe: 'sin-contexto',
      vibeLabel: 'Sin contexto',
      bucket: 'fluid',
      isMono: false,
      isQuestion: false,
      matchLines: 0,
      words: 0,
    }
  }

  const isMono =
    words <= 3 &&
    (DRY_WORDS.test(lastText.toLowerCase()) ||
      lastText.replace(/[^\p{L}]/gu, '').length <= 6 ||
      countEmojis(lastText) >= 1)
  const isQuestion = /\?/.test(lastText) || QUESTION_OPENERS.test(lastText)
  const flirt = FLIRT_WORDS.test(whole)
  const emojis = countEmojis(lastText)
  const exclam = /!/.test(lastText)

  let score = 52
  if (lastSpeaker === 'match') {
    if (isQuestion) score += 14
    if (words >= 8) score += 10
    if (words >= 18) score += 6
    if (emojis > 0) score += 6
    if (emojis > 2) score += 4
    if (flirt) score += 10
    if (exclam) score += 3
    if (isMono) score -= 26
    if (words <= 2 && !isMono) score -= 6
  } else {
    score -= 4
  }
  if (/\b(ocupad[oa]|luego te digo|ya te cuento|sin ganas|estoy liad[oa])\b/i.test(lastText)) score -= 12
  if (/(quedamos|vernos|nos vemos|tomar algo|un café|un cafe|cita|invito yo)/i.test(whole)) score += 8

  score = Math.max(6, Math.min(97, Math.round(score)))

  let vibe: VibeId = 'fluida'
  if (lastSpeaker === 'me') vibe = 'en-visto'
  else if (isMono) vibe = 'monosilabo'
  else if (score < 40) vibe = 'fria'
  else if (score >= 66 && (flirt || emojis >= 2)) vibe = 'picante'

  const vibeLabel: Record<VibeId, string> = {
    'sin-contexto': 'Sin contexto',
    fluida: 'Conversación fluida',
    picante: 'Chispa alta',
    monosilabo: 'Respuestas mínimas',
    'en-visto': 'Esperando respuesta',
    fria: 'Conversación fría',
  }

  const bucket: Bucket =
    vibe === 'picante' ? 'hot' : vibe === 'fluida' ? 'fluid' : vibe === 'fria' ? 'cold' : 'stale'

  return {
    hasChat: true,
    lastText,
    lastFrom: lastSpeaker,
    topic: detectTopic(whole),
    score,
    vibe,
    vibeLabel: vibeLabel[vibe],
    bucket,
    isMono,
    isQuestion,
    matchLines: lines.length,
    words,
  }
}
