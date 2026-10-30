import { countEmojis, isMeLabel, parseChatLines } from './chat'
import { detectTopics, type TopicMeta } from './topics'

export interface SideStats {
  lines: number
  words: number
  questions: number
  emojis: number
  avgWords: number
  /** % de palabras del chat que pone este lado (0-100). */
  share: number
}

export type InsightTone = 'balanced' | 'me' | 'match'

export interface ChatInsights {
  ready: boolean
  reason?: string
  me: SideStats
  match: SideStats
  totalLines: number
  labeledLines: number
  topics: TopicMeta[]
  initiator: 'me' | 'match' | null
  last: 'me' | 'match' | null
  title: string
  tone: InsightTone
  verdict: string
  notes: string[]
}

const EMPTY: SideStats = { lines: 0, words: 0, questions: 0, emojis: 0, avgWords: 0, share: 0 }

function wordsOf(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/**
 * Radiografía del chat: reparto de esfuerzo, preguntas y temas.
 * Necesita líneas etiquetadas ("Tú: …" / "Sara: …") para separar a cada lado.
 */
export function analyzeInsights(raw: string, alias?: string): ChatInsights {
  const lines = parseChatLines(raw)
  const labeled = lines.filter((line): line is { speaker: string; text: string } => Boolean(line.speaker))

  const meAcc = { ...EMPTY }
  const matchAcc = { ...EMPTY }
  let initiator: 'me' | 'match' | null = null
  let last: 'me' | 'match' | null = null

  for (const line of labeled) {
    const mine = isMeLabel(line.speaker, alias)
    const side = mine ? meAcc : matchAcc
    const words = wordsOf(line.text)
    side.lines += 1
    side.words += words
    side.questions += /\?/.test(line.text) ? 1 : 0
    side.emojis += countEmojis(line.text)
    initiator = initiator ?? (mine ? 'me' : 'match')
    last = mine ? 'me' : 'match'
  }

  const ready = labeled.length >= 4 && meAcc.lines > 0 && matchAcc.lines > 0
  if (!ready) {
    return {
      ready: false,
      reason:
        labeled.length === 0
          ? 'Etiqueta las líneas con nombres («Tú: …» y «Sara: …») y te hago la radiografía del chat.'
          : 'Necesito al menos 4 líneas con nombres de los dos lados para medir el esfuerzo.',
      me: meAcc,
      match: matchAcc,
      totalLines: lines.length,
      labeledLines: labeled.length,
      topics: detectTopics(raw),
      initiator,
      last,
      title: '',
      tone: 'balanced',
      verdict: '',
      notes: [],
    }
  }

  const totalWords = meAcc.words + matchAcc.words
  const matchShare = totalWords > 0 ? Math.round((matchAcc.words / totalWords) * 100) : 50
  meAcc.share = 100 - matchShare
  matchAcc.share = matchShare
  meAcc.avgWords = Math.round((meAcc.words / meAcc.lines) * 10) / 10
  matchAcc.avgWords = Math.round((matchAcc.words / matchAcc.lines) * 10) / 10

  let title = 'Buen equilibrio'
  let tone: InsightTone = 'balanced'
  let verdict = 'Los dos escribís parecido: el chat está sano y hay margen para proponer plan.'

  if (matchShare >= 65) {
    title = 'Tu match tira del carro'
    tone = 'match'
    verdict = 'Está invirtiendo más que tú. No fuerces: responde con ganas y deja que siga buscándote.'
  } else if (matchShare <= 38) {
    title = 'Tú tiras del carro'
    tone = 'me'
    verdict = 'Estás escribiendo mucho más que la otra persona. Baja el ritmo y deja hueco para que pregunte.'
  }

  const notes: string[] = []

  if (meAcc.questions - matchAcc.questions >= 3) {
    notes.push(`Tú preguntas ${meAcc.questions} veces y la otra persona ${matchAcc.questions}: pide reciprocidad.`)
  } else if (matchAcc.questions - meAcc.questions >= 3) {
    notes.push('La otra persona pregunta mucho más que tú: devuélvele una pregunta abierta.')
  }

  if (matchAcc.lines >= 3 && matchAcc.avgWords <= 3 && meAcc.avgWords >= 8) {
    notes.push('Sus respuestas son cortas y las tuyas largas: aplica la ley del esfuerzo y recorta.')
  }

  if (last === 'me') notes.push('El último mensaje es tuyo: espera sin escribir de nuevo.')

  if (meAcc.emojis === 0 && matchAcc.emojis >= 3) {
    notes.push('La otra persona usa emojis y tú ninguno: un guiño suave suma cercanía.')
  }

  return {
    ready: true,
    me: meAcc,
    match: matchAcc,
    totalLines: lines.length,
    labeledLines: labeled.length,
    topics: detectTopics(raw),
    initiator,
    last,
    title,
    tone,
    verdict,
    notes: notes.slice(0, 2),
  }
}
