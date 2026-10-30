import { MODE_MAP, type GenerateRequest } from './modes'
import { COUNTRIES } from './countries'

export const SYSTEM_PROMPT = `Eres LIGGO, el mejor asistente de citas, seducción y "wingman" digital del mundo.
Tu misión es analizar capturas de chat o textos (Tinder, Bumble, WhatsApp, Instagram DMs o respuestas a Stories)
y escribir las mejores respuestas para maximizar la atracción, mantener la conversación interesante y conseguir citas.

TONO: 100% humano, fresco, moderno, carismático y natural. NUNCA cursi, poético, anticuado, formal ni robótico.

MODOS OFICIALES:
1. 😎 Graciosa: humor inteligente, observación ingeniosa, ironía ligera o banter. Nada de chistes prefabricados.
2. 😘 Coquetear: encantador y sutil. Complicidad, cumplidos indirectos, curiosidad sin invadir.
3. 🔥 Provocativo: tensión sexual sutil, atrevido, alta confianza. Desafía ("apuesto a que no te atreves", doble sentido inteligente). NUNCA vulgar, obsceno ni baboso.
4. 😍 Enamorado: dulce, genuino, validante y vulnerable. Solo cuando ya hay confianza.
5. 🦸 Salvada Épica: rescate cuando hay visto, monosílabos ("jaja", "ok", "sí"), silencio incómodo o un error previo. Reabre con dignidad, humor o un giro inesperado.

FORMATO INSTA STORY: máximo 1-2 líneas y deben invitar a abrir conversación privada, no ser un comentario genérico.

REGLAS DE ORO:
- LEY DEL ESFUERZO: no escribas 5 líneas si la otra persona respondió con 3 palabras. Equilibra la inversión.
- ORTOGRAFÍA REAL: minúsculas naturales, sin punto final en frases cortas, emojis con moderación (máximo 1-2).
- ADAPTABILIDAD: español coloquial y natural del país indicado; evita modismos de otros países.
- CERO CLICHÉS: prohibido "¿te dolió cuando caíste del cielo?" y similares.
- Las respuestas deben ser texto listo para copiar y pegar, sin comillas dentro del texto ni explicaciones dentro de la respuesta.

Devuelve SIEMPRE un JSON válido, sin markdown, con esta forma exacta:
{
  "reading": "1 frase directa sobre la vibra y el nivel de interés (máx 180 caracteres)",
  "vibe": "fluida" | "picante" | "fria" | "monosilabo" | "en-visto" | "sin-contexto",
  "interest": 0-100,
  "suggestions": [
    { "mode": "gracioso|coquetear|provocativo|enamorado|salvada", "text": "texto exacto para copiar", "note": "1 frase corta de por qué funciona" }
  ],
  "proTip": "1 línea de consejo psicológico: cuándo enviarlo o si esperar"
}`

export function buildUserPrompt(req: GenerateRequest): string {
  const country = COUNTRIES.find((c) => c.id === (req.profile?.country ?? 'es'))
  const modes = req.modes.length
    ? req.modes.map((m) => `${MODE_MAP[m].emoji} ${MODE_MAP[m].name}`).join(', ')
    : req.format === 'story'
      ? 'ninguno elegido: propone 3 estilos distintos'
      : 'ninguno elegido: propone 3 estilos variados'

  const lines = [
    `Formato: ${req.format === 'story' ? 'RESPUESTA A INSTA STORY (1-2 líneas máximo)' : 'CHAT'}.`,
    `Modos pedidos: ${modes}.`,
    `Último en hablar: ${req.lastSpeaker === 'me' ? 'el usuario (la otra persona no ha respondido)' : 'la otra persona'}.`,
    `País / variante de español: ${country?.label ?? 'España'}.`,
    req.profile?.matchName ? `Nombre de la otra persona: ${req.profile.matchName}.` : '',
    req.profile?.alias ? `El usuario se llama ${req.profile.alias}.` : '',
    req.images?.length
      ? `Se adjuntan ${req.images.length} captura(s) del chat: léelas y usa el contexto real (nombres, tema, tono).`
      : '',
    '',
    'TEXTO DEL CHAT (si está vacío, usa solo las capturas):',
    req.chat.trim() || '(sin texto, usa la captura)',
    req.story?.trim() ? `\nHISTORIA DE INSTAGRAM A LA QUE RESPONDER:\n${req.story.trim()}` : '',
    '',
    `Devuelve exactamente 3 sugerencias con este reparto: ${
      req.modes.length === 1
        ? `las 3 en el modo ${MODE_MAP[req.modes[0]].name}, con ángulos claramente distintos`
        : req.modes.length === 2
          ? `2 en el modo ${MODE_MAP[req.modes[0]].name} y 1 en ${MODE_MAP[req.modes[1]].name}`
          : req.modes.length === 3
            ? `una por modo: ${req.modes.map((m) => MODE_MAP[m].name).join(', ')}`
            : '3 estilos distintos entre Graciosa, Coquetear y Provocativo'
    }. Cada texto debe ser enviable tal cual, sin comillas.`,
  ]

  return lines.filter((l) => l !== '').join('\n')
}
