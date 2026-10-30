# 🐵 LIGGO — tu asistente IA para conquistar

Wingman digital: sube una captura de Tinder, Bumble, WhatsApp o Instagram o pega el chat, elige un
modo de respuesta y copia la frase que más te encaje. Con análisis del contexto, respuestas listas
para pegar y un consejo psicológico por respuesta.

> «Una IA que te ayuda a responder mensajes para ligar y mejorar en el chateo». Nada de cursilerías:
> español coloquial, minúsculas, como escribiría una persona real.

## Cómo arrancarlo

```bash
npm install
npm run dev      # http://localhost:5173
```

Build de producción y servidor con la API incluida:

```bash
npm run build
npm run preview  # http://localhost:4173
```

### Conectar tu API key (dos formas)

Sin clave, la app funciona en **modo demo**: analiza el texto con un motor local (tono, tema,
monosílabos, vistos, nivel de interés) y compone respuestas con un banco de frases por modo y
contexto.

**1) En el navegador — la más rápida**
Perfil → **Motor de IA** → pega la clave, la base URL y el modelo → *Guardar y probar*. La clave se
guarda en el `localStorage` de tu navegador y viaja directa al proveedor; nunca pasa por el servidor.
Es la opción que funciona en la preview alojada, porque el sandbox del servidor no tiene salida a
proveedores de IA.

**2) En el servidor con `.env` — recomendada para desplegar**

```bash
cp .env.example .env      # ya existe un .env de plantilla en el repo
# edita .env con tu clave
npm run dev               # se reinicia solo al guardar el archivo
```

| Variable         | Por defecto                 | Para qué                                  |
| ---------------- | --------------------------- | ----------------------------------------- |
| `LIGGO_API_KEY`  | —                           | Clave del proveedor compatible con OpenAI |
| `LIGGO_BASE_URL` | `https://api.openai.com/v1` | OpenAI, Groq, Together, OpenRouter, etc.  |
| `LIGGO_MODEL`    | `gpt-4o-mini`               | Cualquier modelo con visión               |

Si el proveedor falla (clave inválida, sin red, CORS), la app lo explica y cae al motor local: nunca
te deja a medias.

> ⚠️ **Seguridad:** no subas `.env` a Git (ya está en `.gitignore`) ni pegues claves en chats,
> issues o capturas. Si una clave se ha compartido, rótala en el panel del proveedor. El formato de
> OpenAI empieza por `sk-`; si tu clave es de otro proveedor, ajusta la base URL y el modelo.

## Qué hay dentro

```
src/
  App.tsx                  estado, validación, atajos, orquestación
  components/              Sidebar, uploader, chat, modos, resultados, modales, perfil,
                           radiografía del chat, ideas de story y «Mis frases»
  lib/api.ts               cliente de /api/generate y /api/health
  lib/image.ts             redimensiona y recomprime capturas en el navegador
  lib/storage.ts           perfil y tema en localStorage
  lib/provider.ts          clave del proveedor en localStorage (opción navegador)
  lib/saved.ts             frases guardadas en localStorage
shared/
  prompt.ts                system prompt de LIGGO y contrato JSON
  provider.ts              llamada OpenAI-compatible (servidor y navegador), parseo y errores
  insights.ts              radiografía del chat: esfuerzo, preguntas, temas y avisos
  storyIdeas.ts            banco de ideas para publicar stories
  chat.ts, topics.ts       parseo de conversaciones y detección de temas
server/
  api.ts                   endpoints, validación y fallback al motor local
  analysis.ts              heurísticas: quién habló último, tema, monosílabo, visto, interés
  templates.ts             banco de respuestas por modo × contexto + story
  engine.ts                modo demo determinista (seed para regenerar variantes)
shared/
  modes.ts, countries.ts   tipos y metadatos compartidos cliente/servidor
```

### Lógica de producto

- **Modos**: 😎 Graciosa · 😘 Coquetear · 🔥 Provocativo · 😍 Enamorado · 🦸 Salvada Épica.
- **Selección**: 1 modo → 3 variantes de ese estilo; 2 modos → reparto 2+1; 3 modos → una de cada.
  Sin selección, tres estilos distintos.
- **Contexto detectado**: tema (viajes, música, series, comida, gym, trabajo, fiesta, mascotas, café,
  playa, fotos), nivel de interés 0-100, vibra (fluida, chispa, fría, monosílabo, en visto).
- **Reglas de oro** aplicadas también en el banco local: ley del esfuerzo (respuesta proporcional al
  mensaje recibido), máximo 1-2 emojis, cero clichés, variante de español por país.
- **Insta Story**: respuestas de 1-2 líneas pensadas para abrir DM.

### Extras que marcan la diferencia

- **Radiografía del chat**: mide el reparto real de esfuerzo (mensajes, palabras, media por mensaje,
  preguntas y emojis de cada lado), detecta los temas abiertos y avisa cuando estás tirando del carro
  o cuando te toca esperar. Si pegas el chat con nombres («Tú: …», «Sara: …») aparece sola.
- **Mis frases**: guarda cualquier respuesta con el marcador y reutilízala después. Filtros por chat y
  stories, copiar y borrar; todo en `localStorage`.
- **Ideas para tu story**: cuando no hay nada que responder, Liggo propone qué publicar tú (texto,
  sticker de encuesta/quiz/caja de preguntas, por qué funciona y mejor momento), con botón de copiar y
  variantes aleatorias.

## Privacidad

- Las capturas se recomprimen en el navegador y solo se envían al modelo si hay una API key
  configurada. No se guardan en disco ni en base de datos.
- Con la clave en el navegador, las peticiones van directas del navegador al proveedor; el servidor
  de Liggo no ve ni la clave ni el contenido.
- Perfil, tema y preferencias se quedan en `localStorage`. Hay un botón para borrarlo todo.

## Atajos

| Atajo                | Acción                |
| -------------------- | --------------------- |
| `⌘/Ctrl + Enter`     | Generar respuestas    |
| `⌘/Ctrl + V`         | Pegar captura         |
| `Esc`                | Cerrar modales        |

## Stack

React 18 + TypeScript + Vite 5. Sin librerías de UI: CSS propio con variables, tema claro/oscuro y
diseño responsive. API en el mismo servidor de Vite mediante un plugin (un solo puerto, sin CORS).
