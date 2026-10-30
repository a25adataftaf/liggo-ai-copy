import type { ModeId } from '../shared/modes'
import type { Bucket } from './analysis'

/**
 * Banco de respuestas del modo demo (sin API key).
 * Reglas: español natural, minúsculas, sin cursilerías, 1-2 emojis como máximo.
 * `{tema}` y `{pregunta}` se sustituyen según el tema detectado en el chat.
 */
export interface Template {
  t: string
  /** Solo se usa si se ha detectado un tema en la conversación. */
  topic?: boolean
}

export const BANKS: Record<ModeId, Record<Bucket, Template[]>> = {
  gracioso: {
    hot: [
      { t: 'vale, me estás dejando con la intriga y ahora no puedo dormir. necesito la segunda parte 😅' },
      { t: 'te aviso de que si esto sigue así voy a tener que hacerle un hueco en la agenda' },
      { t: 'me encanta que hables de {tema} como si fuera una competición. respeto', topic: true },
      { t: 'acabo de leer tu mensaje dos veces por si traía instrucciones ocultas. nada, sigo sin saber qué decir 😂' },
      { t: 'oficialmente me caes mejor que el 90% de mis planes de esta semana' },
      { t: 'espera, ¿esto lo dices en serio o me estás testeando? porque estoy dispuesto a fallar' },
    ],
    fluid: [
      { t: 'no sabía que necesitaba saber esto de ti, pero ya es mi dato favorito del día' },
      { t: 'me estás contando tu vida y yo aquí tomando notas como si fuera un examen final' },
      { t: 'te propongo un trato: tú me hablas de {tema} y yo finjo que no estoy impresionado', topic: true },
      { t: 'me gusta que tengas respuesta para todo. menos mal, porque yo no' },
      { t: 'un momento, {pregunta} porque eso cambia todo', topic: true },
      { t: 'voy a fingir que ese mensaje no me ha hecho gracia. spoiler: sí me la ha hecho' },
    ],
    cold: [
      { t: 'uy, respuesta de una palabra. ¿te ha secuestrado alguien o estás ahorrando letras? 😄' },
      { t: 'modo entrevista: una pregunta, una respuesta y sin presión. {pregunta}', topic: true },
      { t: 'te noto seco. ¿te escribo en formato audio o te invito a un café para que hables?' },
      { t: 'tu último mensaje tiene más misterio que el final de una serie de netflix' },
      { t: 'vale, cambio de estrategia: cuéntame algo que no le hayas contado a nadie hoy' },
      { t: 'voy a asumir que estás ocupado y no que me estás evitando. no me des motivos' },
    ],
    stale: [
      { t: 'me retiro con dignidad. si vuelves, tráeme novedades de {tema}', topic: true },
      { t: 'actualizo: sigo vivo, el chat sigue aquí y yo sigo con la teoría de que respondes mejor en persona' },
      { t: 'no pasa nada, me quedo con el "jaja" y lo enmarco' },
      { t: 'resumen de lo que te has perdido: nada, pero había potencial 🍿' },
      { t: 'te dejo espacio. cuando quieras retomamos y me cuentas si ganaste la discusión con el universo' },
      { t: 'misión rescate: te propongo empezar de cero. hola, soy yo, el que te caía bien' },
    ],
  },
  coquetear: {
    hot: [
      { t: 'me gusta el ritmo que llevas, pero te aviso: en persona soy bastante peor 😏' },
      { t: 'llevas dos mensajes seguidos siendo interesante. eso o me estás echando un hechizo' },
      { t: '¿esto es coqueteo o te sale gratis? porque lo estás haciendo muy bien' },
      { t: 'me estás poniendo fácil imaginarte en una terraza conmigo. y no deberías' },
      { t: 'te confieso que he sonreído solo en la cola del súper. espero que estés contenta' },
    ],
    fluid: [
      { t: 'me gusta cómo cuentas las cosas. tengo la sensación de que en persona es mejor todavía' },
      { t: 'cada mensaje tuyo me da una excusa nueva para quedar. voy por la tercera' },
      { t: 'lo de {tema} me ha ganado, pero cómo lo cuentas me ha ganado más', topic: true },
      { t: '¿puedo decir que tienes una forma de escribir bastante peligrosa? ya lo he dicho' },
      { t: 'no sé si estoy flirteando o diciendo la verdad. probablemente las dos' },
      { t: 'me gusta que hables de {tema} con esas ganas. se te nota cuándo algo te importa', topic: true },
    ],
    cold: [
      { t: 'te noto en modo ahorro de palabras. ¿te cambio el plan? cuéntame algo bueno de tu día' },
      { t: 'me gustan las personas que hablan poco porque cuando dicen algo vale la pena. no me falles ahora 😌' },
      { t: 'hoy estás misterioso. me gusta, pero no abuses que me engancho' },
      { t: 'vale, subo la apuesta: {pregunta} (y si respondes con una palabra te quito el turno)', topic: true },
      { t: 'si hoy no tienes chispa no pasa nada, te presto la mía' },
      { t: 'te voy a hacer una pregunta y quiero respuesta de más de tres palabras: ¿qué te ha hecho reír hoy?' },
    ],
    stale: [
      { t: 'te dejo respirar, pero que conste que este chat me estaba gustando 👀' },
      { t: 'vuelvo en unas horas a por esa respuesta que te has dejado en el tintero' },
      { t: 'me quedo esperando como el que espera el postre. sin prisa pero con hambre 😌' },
      { t: 'te guardo el sitio en la conversación, no tardes' },
      { t: 'aviso: si no respondes te voy a imaginar ocupadísimo y eso me da aún más curiosidad' },
      { t: 'me quedo con ganas de saber cómo acabó lo de {tema}. cuando quieras me lo cuentas', topic: true },
    ],
  },
  provocativo: {
    hot: [
      { t: 'me gusta cuando te pones así. lástima que sea por mensaje 🔥' },
      { t: 'apuesto a que pones esa misma cara cuando te llevan la contraria' },
      { t: 'cuidado, que si sigues por ahí me lo voy a tomar como una invitación' },
      { t: '¿te atreves a decírmelo mirándome a los ojos? por aquí es muy fácil' },
      { t: 'tengo una teoría sobre ti y no es precisamente inocente. ¿quieres saberla?' },
    ],
    fluid: [
      { t: 'me estás tentando a saltarme el protocolo y proponerte algo esta semana' },
      { t: 'a ver si te crees que no me doy cuenta de lo que haces con las pausas 😏' },
      { t: 'me gusta la gente que no se corta. tú no te estás cortando, ¿no?' },
      { t: 'me lo estás poniendo demasiado fácil para invitarte a algo. di que sí ya' },
      { t: 'pregunta peligrosa: ¿qué harías si te dijera que estoy a quince minutos de ti?' },
    ],
    cold: [
      { t: 'te noto frenando. no hace falta, no muerdo... salvo que insistas' },
      { t: 'respondes corto pero escribes largo en mi cabeza, qué cosas' },
      { t: 'sube el nivel o te retiro la palabra, y sería una pena' },
      { t: 'me gustan los retos, pero los que se juegan a dos. ¿te apuntas o me quedo con las ganas?' },
      { t: 'estás jugando a hacerme esperar. y está funcionando, no te voy a mentir' },
    ],
    stale: [
      { t: 'te dejo ganar esta. pero la próxima no te salvas 😌' },
      { t: 'me desaparezco con estilo y vuelvo cuando tengas algo que merezca la pena' },
      { t: 'te perdono el visto solo porque me caes bien. no lo repitas' },
      { t: 'cierro el chat con dignidad, pero me debes una' },
      { t: 'ahora me toca esperar a mí. nos vemos en tu próxima historia 🔥' },
    ],
  },
  enamorado: {
    hot: [
      { t: 'me encanta esta versión tuya, la que se ríe y no pide permiso' },
      { t: 'no te lo digo mucho, pero hoy me has alegrado el día de verdad' },
      { t: 'me gusta que esto vaya despacio y a la vez no tanto. contigo funciona' },
      { t: '¿te puedes creer que ya estaba pensando en contarte esto? y no ha pasado nada' },
      { t: 'me quedo con las ganas de que esto no se quede en mensajes' },
    ],
    fluid: [
      { t: 'me gusta hablar contigo, aunque sea de tonterías. sobre todo de tonterías' },
      { t: 'hoy he pensado en algo que dijiste y me ha vuelto a hacer gracia. ya es preocupante' },
      { t: 'no sé adónde va esto, pero me gusta cómo va' },
      { t: 'me encanta que te acuerdes de las cosas pequeñas, se te da bien' },
      { t: 'gracias por contar cosas así. no todo el mundo lo hace' },
    ],
    cold: [
      { t: 'te noto raro hoy. si no te apetece hablar de nada, con saber que estás bien me vale' },
      { t: 'no quiero agobiarte, solo que sepas que aquí sigo' },
      { t: 'me gusta cuando hablas de lo que te importa, incluso si es con pocas palabras' },
      { t: '¿todo bien? te leo más serio de lo normal' },
      { t: 'me quedo con la mejor parte de la conversación: que has aparecido' },
    ],
    stale: [
      { t: 'no pasa nada. cuando quieras retomamos, aquí me tienes' },
      { t: 'te dejo tranquilo. solo quería que supieras que me acuerdo de lo del otro día' },
      { t: 'si el silencio es porque necesitas espacio, perfecto. si no, invítame a un café y lo hablamos' },
      { t: 'me quedo con las ganas de saber cómo acabó {tema}. cuando quieras me lo cuentas', topic: true },
      { t: 'sin presión: cuando te apetezca, seguimos donde lo dejamos' },
    ],
  },
  salvada: {
    hot: [
      { t: 'me acabo de dar cuenta de que llevas tres mensajes sin preguntarme nada. ¿estás bien? 😅' },
      { t: 'pausa. retomemos esto como si no llevaras horas sin responder: {pregunta}', topic: true },
      { t: 'te propongo reiniciar: hola, soy yo, el que te estaba cayendo bien' },
      { t: 'acepto el reto de hacerte escribir más de tres palabras. empiezo yo: ¿cómo va tu día?' },
      { t: 'he decidido que este silencio no cuenta y que me debes una historia buena' },
    ],
    fluid: [
      { t: 'vale, te noto desaparecido. no pasa nada, pero me debes la mejor parte de la historia' },
      { t: 'cambio de tema: si te dieran un billete solo para mañana, ¿dónde acabarías?' },
      { t: 'te voy a ser sincero: no sé si estás ocupado o pasando. y aun así te escribo' },
      { t: 'me han dicho que responder tarde es de gente interesante. enhorabuena, campeón' },
      { t: 'reabro el chat oficialmente: {pregunta}', topic: true },
    ],
    cold: [
      { t: 'vale, acepto que hoy no es nuestro día. mañana lo intento otra vez con más gracia' },
      { t: 'no sé si te pilló el día tonto o si me estás esquivando. elijo creer lo primero 😅' },
      { t: 'no pasa nada, de verdad. mañana me debes una conversación decente' },
      { t: 'me rindo con dignidad. pero antes te dejo una: {pregunta}', topic: true },
      { t: 'kamikaze: te mando esto y desaparezco. {pregunta}', topic: true },
      { t: 'te escribo para algo importante: necesito saber qué opinas de {tema}', topic: true },
    ],
    stale: [
      { t: 'me retiro con estilo. cuando quieras retomamos, que aquí no se ha roto nada' },
      { t: 'te dejo el chat calentito. si vuelves, seguimos donde lo dejamos' },
      { t: 'vengo a romper el hielo por la puerta grande: {pregunta}', topic: true },
      { t: 'nueva estrategia: te escribo solo cuando tenga algo bueno. hoy no tengo nada, pero te echaba de menos' },
      { t: 'paso a modo espera con dignidad. cero reproches 🫡' },
    ],
  },
}

/** Respuestas cortas para historias de Instagram (1-2 líneas, abren DM). */
export const STORY_BANK: Record<ModeId, Template[]> = {
  gracioso: [
    { t: 'esa foto tiene cara de que la historia real es mucho mejor 👀' },
    { t: 'vengo a pedir contexto, no a dar like' },
    { t: 'aviso que estoy juzgando desde aquí y de momento apruebas' },
  ],
  coquetear: [
    { t: 'vale, esto es oficialmente mi historia favorita de hoy 😍' },
    { t: 'sales mejor aquí que en persona? lo dudo' },
    { t: 'me has distraído de lo que estaba haciendo. espero que estés contenta' },
  ],
  provocativo: [
    { t: 'peligrosa esa foto. avísame cuando quieras compañía para la próxima 🔥' },
    { t: 'esto es una invitación encubierta y lo sabes' },
    { t: 'una más así y te escribo directamente' },
  ],
  enamorado: [
    { t: 'me has sacado una sonrisa en medio del día, gracias 🥹' },
    { t: 'qué bien te queda ser feliz' },
    { t: 'guardo esta para cuando tenga un día malo' },
  ],
  salvada: [
    { t: 'juzgando en silencio desde aquí. spoiler: apruebo' },
    { t: 'hola, vengo a romper el hielo por la puerta grande' },
    { t: 'no venía a comentar, venía a abrir conversación. ya está abierta' },
  ],
}

export const BUCKET_NOTES: Record<Bucket, string[]> = {
  hot: [
    'Hay chispa real: mándala y deja que la otra persona se acerque.',
    'Funciona porque iguala su energía sin perseguirla.',
    'Buena para pasar de mensajes a plan en los próximos dos intercambios.',
  ],
  fluid: [
    'Mantiene el ritmo sin que parezca que te esfuerzas de más.',
    'Añade un gancho para que la respuesta sea fácil de escribir.',
    'Perfecta para subir un escalón sin cambiar de tema de golpe.',
  ],
  cold: [
    'Baja la inversión: más corta que su mensaje y sin reproches.',
    'Reabre con ligereza; si sigue seco, deja de insistir hoy.',
    'Cambia de ángulo en lugar de preguntar otra vez lo mismo.',
  ],
  stale: [
    'Déjala caer y guarda el móvil. El silencio también comunica.',
    'Cierra el chat con dignidad: no busques la respuesta que no llega.',
    'Mándala solo si de verdad vas a desaparecer después.',
  ],
}

export const STORY_NOTE =
  'Una línea, sin preguntas cerradas. Si contesta, ya tienes el DM abierto.'

export const PRO_TIPS: Record<string, string[]> = {
  hot: [
    'No contestes al instante: deja 5-15 minutos y mantén la tensión.',
    'Propón el plan en el siguiente mensaje, no en este: primero crea la chispa.',
    'Si ella escribe dos mensajes seguidos, responde al último y al más ligero.',
  ],
  fluid: [
    'Responde en proporción a su mensaje: si escribe una línea, no escribas cuatro.',
    'Cierra con una pregunta abierta solo si de verdad te interesa la respuesta.',
    'Cambia de tema cada 3-4 mensajes: la novedad es lo que mantiene el interés.',
  ],
  cold: [
    'No preguntes "¿qué tal?" otra vez: cambia el ángulo, no insistas en el mismo.',
    'Espera al menos unas horas antes de reabrir. Responder rápido a un mensaje seco resta valor.',
    'Si sigue en monosílabos tras dos intentos, deja la pelota en su tejado una semana.',
  ],
  stale: [
    'Manda como máximo un mensaje de rescate. Dos ya es perseguir.',
    'Si no responde en 48 h, archiva el chat y vuelve en dos semanas con contexto nuevo.',
    'Nunca uses el visto como reproche: el humor funciona, la queja no.',
  ],
  default: [
    'Espera 10 minutos antes de enviar: escribir con prisa se nota.',
    'Antes de mandarlo, imagina que te lo escriben a ti. ¿Responderías?',
  ],
}
