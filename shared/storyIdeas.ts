export type StoryKind = 'encuesta' | 'pregunta' | 'quiz' | 'foto' | 'texto' | 'musica'

export interface StoryIdea {
  id: string
  kind: StoryKind
  title: string
  /** Lo que se escribe encima de la story. Una línea, natural. */
  caption: string
  /** Sticker o recurso interactivo recomendado. */
  sticker: string
  why: string
  when: string
}

export const STORY_KIND_LABEL: Record<StoryKind, string> = {
  encuesta: 'Encuesta',
  pregunta: 'Caja de preguntas',
  quiz: 'Quiz',
  foto: 'Foto',
  texto: 'Solo texto',
  musica: 'Música',
}

export const STORY_IDEAS: StoryIdea[] = [
  {
    id: 'cafe-vino',
    kind: 'encuesta',
    title: 'La encuesta imposible',
    caption: 'café o vino. elige mal y hablamos',
    sticker: 'Encuesta: ☕ café / 🍷 vino',
    why: 'Votar es gratis y sin compromiso: quien participa suele acabar escribiendo para justificarse.',
    when: 'Jueves por la noche o domingo a media tarde.',
  },
  {
    id: 'plan-finde',
    kind: 'encuesta',
    title: 'Plan del finde',
    caption: 'plan A: terraza. plan B: sofá. vota y luego discutimos',
    sticker: 'Encuesta: 🌞 terraza / 🛋️ sofá',
    why: 'Una encuesta con dos opciones deja la puerta abierta a un «me apunto» sin presión.',
    when: 'Viernes a primera hora de la tarde.',
  },
  {
    id: 'caja-preguntas',
    kind: 'pregunta',
    title: 'Caja sin filtro',
    caption: 'pregúntame algo que no preguntarías en persona',
    sticker: 'Caja de preguntas',
    why: 'Las cajas reducen la vergüenza: la otra persona pregunta desde el anonimato del sticker.',
    when: 'Domingo noche, cuando todo el mundo está en el móvil.',
  },
  {
    id: 'verdad-impopular',
    kind: 'pregunta',
    title: 'Opinión impopular',
    caption: 'mi opinión impopular: la piña en la pizza está bien',
    sticker: 'Caja de preguntas: ¿la tuya?',
    why: 'Una opinión polémica y ligera genera respuestas y debate sin tener que coquetear directamente.',
    when: 'Miércoles, a media tarde.',
  },
  {
    id: 'quiz-pelicula',
    kind: 'quiz',
    title: 'Quiz de peli',
    caption: 'a ver si aciertas cuál es la peli que me sé de memoria',
    sticker: 'Quiz con 3 opciones y una respuesta correcta',
    why: 'Un quiz da una excusa perfecta para presumir de haber acertado en el DM.',
    when: 'Sábado por la noche.',
  },
  {
    id: 'quiz-cancion',
    kind: 'quiz',
    title: 'Adivina la canción',
    caption: 'adivina la canción que llevo todo el día silbando',
    sticker: 'Quiz de 4 canciones',
    why: 'Música = conversación asegurada: todos quieren decir que la conocían.',
    when: 'Lunes por la mañana, para romper el inicio de semana.',
  },
  {
    id: 'terraza',
    kind: 'foto',
    title: 'Plan en directo',
    caption: 'reportando desde la mejor terraza de la ciudad',
    sticker: 'Ubicación del sitio',
    why: 'La ubicación es una invitación silenciosa: quien quiera verte ya sabe dónde estás.',
    when: 'Viernes o sábado, con luz de tarde.',
  },
  {
    id: 'cafe-foto',
    kind: 'foto',
    title: 'Ritual de café',
    caption: 'mi teoría es que el café sabe mejor si no lo haces tú',
    sticker: 'Foto del café + sticker de encuesta',
    why: 'Los detalles pequeños invitan a responder con los suyos: baja muchísimo la barrera.',
    when: 'Cualquier mañana entre semana.',
  },
  {
    id: 'cancion-semana',
    kind: 'musica',
    title: 'La canción de la semana',
    caption: 'esta canción me tiene enganchado. ¿la conocías?',
    sticker: 'Sticker de música con la canción',
    why: 'El sticker de música permite escuchar sin salir de la story y comentar en el DM.',
    when: 'Domingo por la noche.',
  },
  {
    id: 'playlist',
    kind: 'musica',
    title: 'Playlist abierta',
    caption: 'haciendo playlist: pásame la canción que no puede faltar',
    sticker: 'Caja de preguntas',
    why: 'Pides algo concreto y fácil de dar. Quien responde ya está entrando en tu mundo.',
    when: 'Jueves o viernes por la tarde.',
  },
  {
    id: 'texto-random',
    kind: 'texto',
    title: 'Pensamiento aleatorio',
    caption: 'me acabo de dar cuenta de que nunca he visto a nadie ganar una discusión con un gato',
    sticker: 'Solo texto sobre fondo liso',
    why: 'El humor absurdo y sin foto destaca en un feed lleno de imágenes perfectas.',
    when: 'Martes a mediodía.',
  },
  {
    id: 'meta-doble',
    kind: 'texto',
    title: 'Meta con doble sentido',
    caption: 'meta de la semana: dormir más y pensar menos',
    sticker: 'Sticker de cuenta atrás',
    why: 'Es cercano, no da pena y deja un hueco para un «yo también» en el DM.',
    when: 'Lunes por la mañana.',
  },
  {
    id: 'antes-despues',
    kind: 'foto',
    title: 'Antes y después',
    caption: 'cómo empiezo la semana vs cómo acabo',
    sticker: 'Dos fotos (collage)',
    why: 'El contraste hace gracia y abre la puerta a comentarios cómplices.',
    when: 'Jueves por la noche.',
  },
  {
    id: 'pregunta-directa',
    kind: 'pregunta',
    title: 'Pregunta de alto riesgo',
    caption: 'necesito una opinión sincera: ¿playa con gente o cala vacía?',
    sticker: 'Encuesta con dos opciones',
    why: 'Preguntar algo personal y ligero filtra a quien de verdad tiene ganas de conversación.',
    when: 'Sábado por la mañana.',
  },
  {
    id: 'detalle-casa',
    kind: 'foto',
    title: 'Rincón favorito',
    caption: 'mi rincón favorito de la casa y nadie me lo discute',
    sticker: 'Foto + sticker de localización (opcional)',
    why: 'Mostrar tu espacio genera intimidad y ganas de preguntar «¿y eso de dónde es?».',
    when: 'Domingo por la tarde.',
  },
  {
    id: 'reto-semana',
    kind: 'quiz',
    title: 'Reto de la semana',
    caption: 'reto: adivinar cuántos cafés llevo hoy. sin trampas',
    sticker: 'Quiz o encuesta con números',
    why: 'Un juego rápido convierte la story en un chat de dos líneas sin esfuerzo.',
    when: 'Miércoles por la mañana.',
  },
]

/** Devuelve `count` ideas distintas de forma estable para una semilla. */
export function pickStoryIdeas(seed: number, count = 3): StoryIdea[] {
  let state = seed >>> 0
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const pool = [...STORY_IDEAS]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}
