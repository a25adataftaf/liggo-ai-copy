/** Frases por país para que las respuestas no suenen a doblaje. */
export const COUNTRIES: { id: string; label: string; hint: string }[] = [
  { id: 'es', label: 'España', hint: 'tío, guapa, quedar, majo' },
  { id: 'mx', label: 'México', hint: 'güey, chava, platicar, sale' },
  { id: 'ar', label: 'Argentina', hint: 'boludo/a, che, re, juntarnos' },
  { id: 'co', label: 'Colombia', hint: 'parce, bacano, rumba, ¿cierto?' },
  { id: 'cl', label: 'Chile', hint: 'weón, cachai, carrete' },
  { id: 'pe', label: 'Perú', hint: 'causa, chévere, jato' },
  { id: 'neutral', label: 'Neutro / LatAm', hint: 'sin modismos marcados' },
]

export const DEFAULT_PROFILE = {
  alias: '',
  country: 'es',
  matchName: '',
}
