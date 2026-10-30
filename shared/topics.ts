/** Temas detectables en un chat (se usan en servidor y cliente). */
export interface TopicMeta {
  id: string
  label: string
  mention: string
  question: string
}

export const TOPICS: TopicMeta[] = [
  {
    id: 'viaje',
    label: 'viajes',
    mention: 'ese viaje',
    question: '¿y cuál es el próximo destino que te mueres por tachar?',
  },
  {
    id: 'musica',
    label: 'música',
    mention: 'tu playlist',
    question: '¿qué canción te tiene enganchado ahora mismo?',
  },
  {
    id: 'series',
    label: 'series y pelis',
    mention: 'esa serie',
    question: '¿y qué serie te ha robado el sueño esta semana?',
  },
  {
    id: 'comida',
    label: 'comida',
    mention: 'ese sitio de comida',
    question: '¿cuál es ese sitio al que volverías solo por el olor?',
  },
  {
    id: 'gym',
    label: 'deporte',
    mention: 'el gym',
    question: '¿y qué te mueve más, el entreno o el café de después?',
  },
  {
    id: 'trabajo',
    label: 'trabajo y estudios',
    mention: 'el curro',
    question: '¿y qué es lo que más te gusta de lo que haces?',
  },
  {
    id: 'fiesta',
    label: 'planes y fiesta',
    mention: 'ese plan',
    question: '¿y cuál fue el último plan que te dejó con ganas de repetir?',
  },
  {
    id: 'mascotas',
    label: 'mascotas',
    mention: 'tu mascota',
    question: '¿y cómo se llama el que manda en tu casa?',
  },
  {
    id: 'cafe',
    label: 'café y planes tranquilos',
    mention: 'ese café',
    question: '¿cómo te gusta el café? pregunta de alto riesgo, lo sé',
  },
  {
    id: 'playa',
    label: 'playa y verano',
    mention: 'la playa',
    question: '¿y qué prefieres, playa con gente o cala vacía?',
  },
  {
    id: 'foto',
    label: 'fotos y redes',
    mention: 'esa foto',
    question: '¿y de dónde salió esa foto? tengo teorías',
  },
]

export const TOPIC_KEYWORDS: Record<string, RegExp> = {
  viaje:
    /(viaj|vuelo|avión|avion|maleta|destino|bali|roma|parís|paris|londres|tokio|vacaciones|mudanza)/i,
  musica: /(música|musica|cancion|canción|playlist|spotify|concierto|festival|album|álbum|grupo|banda|reggaeton|indie)/i,
  series: /(serie|netflix|hbo|película|pelicula|peli|temporada|capítulo|capitulo|documental|anime|libro|leyendo)/i,
  comida: /(comer|comida|cena|restaurante|sushi|pizza|tacos|hamburguesa|postre|cocin|brunch|desayun)/i,
  gym: /(gym|gimnasio|entren|correr|running|deporte|pesas|yoga|padel|pádel|fútbol|futbol|crossfit)/i,
  trabajo: /(trabajo|curro|oficina|jefe|reunión|reunion|estudi|examen|universidad|clase|fp|grado|proyecto|oposici)/i,
  fiesta: /(fiesta|discoteca|bar |copas|rumba|plan|quedada|cumple|boda|after)/i,
  mascotas: /(perro|perra|gato|gata|mascota|labrador|husky|cachorro|adopt)/i,
  cafe: /(café|cafe|terraza|desayun|merendar|infusión|matcha|chocolate caliente)/i,
  playa: /(playa|mar |verano|sol |piscina|cala|bronce|arena|isla)/i,
  foto: /(foto|foticos|instagram|historia|story|selfie|look|cámara|camara)/i,
}

export function detectTopics(text: string, limit = 3): TopicMeta[] {
  return TOPICS.map((topic) => {
    const regex = TOPIC_KEYWORDS[topic.id]
    const hits = regex ? (text.match(new RegExp(regex.source, 'gi')) || []).length : 0
    return { topic, hits }
  })
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((entry) => entry.topic)
}
