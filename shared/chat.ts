/**
 * Utilidades de parseo de chats pegados (WhatsApp / capturas / formato "Nombre: texto").
 * Puras y compartidas entre cliente y servidor.
 */

export interface ChatLine {
  speaker: string | null
  text: string
}

const TIME_PREFIX =
  /^(?:\[?\d{1,2}[/.]\d{1,2}[/.]\d{2,4},?\s*)?(?:\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?\s?m\.?)?\]?\s*(?:-\s*)?)?/i

export function stripTimestamps(line: string): string {
  return line
    .replace(
      /^\[?\d{1,2}[/.]\d{1,2}[/.]\d{2,4},?\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?\s?m\.?)?\]?\s*[-–]?\s*/i,
      '',
    )
    .replace(/^\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]\.?\s?m\.?)?\]?\s*[-–]?\s*/i, '')
    .replace(TIME_PREFIX, '')
    .trim()
}

/** Convierte el texto pegado en líneas con hablante (si viene etiquetado). */
export function parseChatLines(raw: string): ChatLine[] {
  return raw
    .split(/\r?\n/)
    .map((line) => stripTimestamps(line.replace(/^[\s>•*-]+/, '').trim()))
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^([\p{L}][\p{L}\s.'-]{0,20}?)\s*:\s*(.+)$/u)
      if (match) {
        const speaker = match[1].trim()
        const text = match[2].trim()
        if (text.length > 0 && !/^\d+$/.test(speaker) && speaker.split(' ').length <= 3) {
          return { speaker, text }
        }
      }
      return { speaker: null, text: line }
    })
}

export function countEmojis(text: string): number {
  const matches = text.match(/\p{Extended_Pictographic}/gu)
  return matches ? matches.length : 0
}

const ME_LABELS = /^(tú|tu|yo|me|mí|mi|mío|mio|user|usuario)$/i

/** ¿La etiqueta corresponde al usuario? Se acepta también su alias. */
export function isMeLabel(speaker: string, alias?: string): boolean {
  const clean = speaker.trim().toLowerCase()
  if (ME_LABELS.test(clean)) return true
  if (alias && clean === alias.trim().toLowerCase()) return true
  return false
}
