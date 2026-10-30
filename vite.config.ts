import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { handleGenerate, handleHealth } from './server/api'

/**
 * Mini-API de LIGGO montada sobre el propio servidor de Vite (dev y preview).
 * Un solo proceso, un solo puerto: nada de proxies ni CORS.
 */
function liggoApi(): Plugin {
  const middleware = (req: any, res: any, next: () => void) => {
    const url = (req.url || '').split('?')[0]
    if (!url.startsWith('/api/')) return next()

    if (url === '/api/health') return void handleHealth(res)
    if (url === '/api/generate') return void handleGenerate(req, res)

    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'Not found' }))
  }

  return {
    name: 'liggo-api',
    configureServer(server) {
      server.middlewares.use(middleware)
      const ai = Boolean(process.env.LIGGO_API_KEY || process.env.OPENAI_API_KEY)
      server.config.logger.info(
        ai
          ? `  ➜  Liggo: motor IA activo (${process.env.LIGGO_MODEL || 'gpt-4o-mini'})`
          : '  ➜  Liggo: modo demo (sin LIGGO_API_KEY) — las respuestas salen del motor local',
      )
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

const ENV_KEYS = ['LIGGO_API_KEY', 'LIGGO_BASE_URL', 'LIGGO_MODEL', 'OPENAI_API_KEY'] as const

/** Parser mínimo de .env (sin dependencias) con la misma precedencia que Vite. */
function loadLiggoEnv(dir: string, mode: string) {
  const files = ['.env', '.env.local', `.env.${mode}`, `.env.${mode}.local`]
  const values: Record<string, string> = {}

  for (const file of files) {
    const full = path.join(dir, file)
    if (!fs.existsSync(full)) continue
    for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!match) continue
      const key = match[1]
      const value = match[2]
        .replace(/\s+#.*$/, '')
        .replace(/^["']|["']$/g, '')
        .trim()
      values[key] = value
    }
  }

  // El archivo manda: así puedes cambiar o vaciar la key sin reiniciar a mano.
  for (const key of ENV_KEYS) {
    if (key in values) process.env[key] = values[key]
  }
}

export default defineConfig(({ mode }) => {
  loadLiggoEnv(process.cwd(), mode)

  return {
    plugins: [react(), liggoApi()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: true,
    },
  }
})
