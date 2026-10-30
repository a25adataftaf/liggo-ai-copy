import { type GenerateRequest, type GenerateResponse, type ModeId, type Suggestion } from '../modes'
import { analyze, type Bucket } from './analysis'
import { BANKS, BUCKET_NOTES, PRO_TIPS, STORY_BANK, STORY_NOTE, type Template } from './templates'

const FALLBACK_TOPIC = 'eso que estabas contando'
const FALLBACK_QUESTION = '¿qué es lo mejor que te ha pasado hoy?'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function fill(text: string, mention: string, question: string): string {
  return text.replace(/\{tema\}/g, mention).replace(/\{pregunta\}/g, question)
}

function pick<T>(items: T[], rnd: () => number): T {
  return items[Math.floor(rnd() * items.length) % items.length]
}

const READINGS: Record<string, string[]> = {
  'sin-contexto': [
    'Aún no hay chat que leer, así que te dejo respuestas comodín para abrir conversación con gancho.',
  ],
  hot: [
    'La conversación está caliente y el interés se nota: hay chispa y margen para subir la apuesta.',
    'Vibra alta: te está dando juego y responde con ganas. Es momento de arriesgar un poco más.',
  ],
  fluid: [
    'Conversación fluida y sana: hay interés suficiente para mantener el ritmo y proponer plan pronto.',
    'Buen rollo y respuestas con contenido. No hay que forzar nada, solo no enfriarla.',
  ],
  cold: [
    'Está fría: respuestas cortas y poca inversión. Toca bajar el esfuerzo y cambiar de ángulo.',
    'Interés bajo por ahora. Nada de párrafos: menos es más y mejor un giro que otra pregunta.',
  ],
  stale: [
    'El chat está estancado (visto, monosílabo o silencio). Toca reabrir con dignidad, sin reproches.',
    'Silencio incómodo: el objetivo es reabrir con ligereza y sin parecer que estabas esperando.',
  ],
}

const BUCKET_LABEL: Record<Bucket, string> = {
  hot: 'Chispa alta',
  fluid: 'Conversación fluida',
  cold: 'Conversación fría',
  stale: 'Chat estancado',
}

const VIBE_LABEL: Record<string, string> = {
  'sin-contexto': 'Sin contexto suficiente',
  hot: 'Chispa alta',
  fluid: 'Conversación fluida',
  cold: 'Conversación fría',
  stale: 'Chat estancado',
  picante: 'Chispa alta',
  monosilabo: 'Respuestas mínimas',
  'en-visto': 'Esperando respuesta',
  fria: 'Conversación fría',
  fluida: 'Conversación fluida',
}

const STORY_READINGS = [
  'Para una story, menos es más: una línea con gancho y que la conversación se abra sola en el DM.',
  'Aquí no hay que analizar un chat, sino colarte en su día con una frase corta que pida contexto.',
]

const STORY_TIPS = [
  'Responde en la primera hora: las stories se ven rápido y luego se enfrían.',
  'Una sola línea. Si contesta con emoji, ya tienes pie para seguir en el DM.',
  'Nada de halagos genéricos: engancha con lo que hay en la foto o en el texto.',
]

export function generateDemo(req: GenerateRequest): GenerateResponse {
  const analysis = analyze(req.chat, req.lastSpeaker)
  const seed = (req.seed ?? Date.now()) >>> 0
  const rnd = mulberry32(seed)
  const isStory = req.format === 'story'

  const mention = analysis.topic?.mention ?? FALLBACK_TOPIC
  const question = analysis.topic?.question ?? FALLBACK_QUESTION

  // Siempre 3 opciones: con un solo modo pedido damos 3 ángulos de ese estilo.
  const base: ModeId[] = req.modes.length
    ? req.modes
    : isStory
      ? ['coquetear', 'gracioso', 'provocativo']
      : ['gracioso', 'coquetear', 'provocativo']

  const slots: ModeId[] =
    base.length === 1
      ? [base[0], base[0], base[0]]
      : base.length === 2
        ? [base[0], base[1], base[0]]
        : base.slice(0, 3)

  const suggestions: Suggestion[] = []
  const used = new Set<string>()

  for (const mode of slots) {
    const pool = isStory
      ? STORY_BANK[mode]
      : (analysis.topic ? BANKS[mode][analysis.bucket] : BANKS[mode][analysis.bucket].filter((t) => !t.topic))

    const usable = (pool.length ? pool : BANKS[mode][analysis.bucket]).filter(
      (t: Template) => !used.has(t.t),
    )
    const template = pick(usable.length ? usable : pool, rnd)
    used.add(template.t)

    const notes = isStory ? [STORY_NOTE] : BUCKET_NOTES[analysis.bucket]
    const previous = suggestions[suggestions.length - 1]?.note
    const availableNotes = notes.filter((note) => note !== previous)
    const note = pick(availableNotes.length ? availableNotes : notes, rnd)

    suggestions.push({
      mode,
      text: fill(template.t, mention, question),
      note,
    })
  }

  const tipPool = isStory ? STORY_TIPS : (PRO_TIPS[analysis.bucket] ?? PRO_TIPS.default)
  const proTip = pick(tipPool, rnd)

  const storyContext = isStory && Boolean(req.story?.trim())
  const imageOnly = Boolean(req.images?.length) && !analysis.hasChat && !storyContext
  const readingPool = isStory
    ? STORY_READINGS
    : READINGS[analysis.hasChat ? analysis.bucket : 'sin-contexto']
  let reading = imageOnly
    ? isStory
      ? 'En modo demo todavía no puedo leer la captura: descríbeme en una línea qué pone la story y te doy respuestas.'
      : 'En modo demo todavía no puedo leer la captura: pega el texto del chat y te doy respuestas ajustadas de verdad.'
    : pick(readingPool, rnd)
  if (analysis.hasChat && analysis.topic) {
    reading += ` Tema de fondo: ${analysis.topic.label}.`
  }

  return {
    reading,
    vibe: analysis.hasChat ? analysis.vibe : 'sin-contexto',
    vibeLabel: VIBE_LABEL[analysis.hasChat ? analysis.vibe : 'sin-contexto'] ?? BUCKET_LABEL[analysis.bucket],
    interest: analysis.hasChat && analysis.lastFrom !== 'me' ? analysis.score : 0,
    suggestions,
    proTip,
    source: 'demo',
    note: 'Modo demo: respuestas generadas localmente. Conecta un modelo para análisis real de la captura.',
  }
}
