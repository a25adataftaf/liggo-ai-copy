import { generateDemo } from '../shared/engine/engine'
import { normalizeRequest } from './handler'

/** Último recurso si algo peta en el servidor: responder con el motor local. */
export function fallbackResponse(body: unknown, detail: string) {
  const data = generateDemo(normalizeRequest(body))
  data.note = `El servidor ha tenido un problema (${detail}), así que te dejo el motor local.`
  return data
}
