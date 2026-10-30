import { useEffect, useState } from 'react'
import type { Profile } from '../../shared/modes'
import { COUNTRIES } from '../../shared/countries'
import type { ProviderConfig, TestResult } from '../../shared/provider'
import type { Theme } from '../lib/storage'
import { maskKey } from '../lib/provider'
import {
  ArrowIcon,
  CheckIcon,
  LockIcon,
  MoonIcon,
  RefreshIcon,
  SparkleIcon,
  SunIcon,
  TrashIcon,
} from './Icons'

interface ProfilePageProps {
  profile: Required<Profile>
  theme: Theme
  aiAvailable: boolean
  aiModel: string
  provider: ProviderConfig | null
  generationCount: number
  onSave: (profile: Required<Profile>) => void
  onToggleTheme: () => void
  onOpenPro: () => void
  onReset: () => void
  onRecheckAi: () => void
  onSaveProvider: (config: ProviderConfig) => void
  onClearProvider: () => void
  onTestProvider: (config: ProviderConfig) => Promise<TestResult>
}

const ENV_SNIPPET = `LIGGO_API_KEY=tu_clave
LIGGO_BASE_URL=https://api.openai.com/v1
LIGGO_MODEL=gpt-4o-mini`

const DEFAULT_BASE_URL = 'https://api.openai.com/v1'
const DEFAULT_MODEL = 'gpt-4o-mini'

export function ProfilePage({
  profile,
  theme,
  aiAvailable,
  aiModel,
  provider,
  generationCount,
  onSave,
  onToggleTheme,
  onOpenPro,
  onReset,
  onRecheckAi,
  onSaveProvider,
  onClearProvider,
  onTestProvider,
}: ProfilePageProps) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  const [copiedEnv, setCopiedEnv] = useState(false)

  const [keyDraft, setKeyDraft] = useState('')
  const [baseUrlDraft, setBaseUrlDraft] = useState(provider?.baseUrl ?? DEFAULT_BASE_URL)
  const [modelDraft, setModelDraft] = useState(provider?.model ?? DEFAULT_MODEL)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 2200)
    return () => window.clearTimeout(timer)
  }, [saved])

  const aiConnected = aiAvailable || Boolean(provider)
  const initial = (profile.alias || 'A').trim().charAt(0).toUpperCase()
  const dirty = JSON.stringify(draft) !== JSON.stringify(profile)

  const copy = async (text: string, mark: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      mark(true)
      window.setTimeout(() => mark(false), 2000)
    } catch {
      mark(false)
    }
  }

  const runTest = async (config: ProviderConfig) => {
    setTesting(true)
    setTestResult(null)
    const result = await onTestProvider(config)
    setTestResult(result)
    setTesting(false)
    return result
  }

  const saveKey = async () => {
    const cleanKey = keyDraft.trim()
    if (!cleanKey) {
      setTestResult({ ok: false, message: 'Pega primero tu clave de API.' })
      return
    }
    const config: ProviderConfig = {
      key: cleanKey,
      baseUrl: baseUrlDraft.trim() || DEFAULT_BASE_URL,
      model: modelDraft.trim() || DEFAULT_MODEL,
    }
    onSaveProvider(config)
    setKeyDraft('')
    const result = await runTest(config)
    if (!result.ok) {
      setTestResult({
        ...result,
        message: `${result.message} La clave queda guardada por si quieres corregir la URL o el modelo.`,
      })
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Perfil</p>
          <h1>Tu cuenta de Cupido</h1>
          <p className="page__sub">Ajusta el tono y los modismos para que nada suene a doblaje.</p>
        </div>
        <span className="plan-badge">
          <SparkleIcon size={14} />
          {aiConnected ? 'IA conectada' : 'Beta gratis'}
        </span>
      </header>

      <section className="card profile-card">
        <div className="profile-card__identity">
          <span className="avatar avatar--lg" aria-hidden="true">
            {initial}
          </span>
          <div>
            <h2>{profile.alias || 'Sin nombre todavía'}</h2>
            <p>
              {generationCount > 0
                ? `${generationCount} respuesta${generationCount === 1 ? '' : 's'} generada${
                    generationCount === 1 ? '' : 's'
                  } en este navegador`
                : 'Aún no has generado ninguna respuesta'}
            </p>
          </div>
          <button type="button" className="ghost-btn" onClick={onOpenPro}>
            Ver Liggo Pro
            <ArrowIcon size={14} />
          </button>
        </div>

        <div className="field-grid">
          <label className="field">
            <span className="field__label">¿Cómo te llamas?</span>
            <input
              className="text-input"
              value={draft.alias}
              onChange={(e) => setDraft({ ...draft, alias: e.target.value })}
              placeholder="Tu nombre o alias"
              maxLength={40}
            />
          </label>
          <label className="field">
            <span className="field__label">Nombre de tu match (opcional)</span>
            <input
              className="text-input"
              value={draft.matchName}
              onChange={(e) => setDraft({ ...draft, matchName: e.target.value })}
              placeholder="Ej: Sara"
              maxLength={40}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">Variante de español</span>
          <select
            className="text-input"
            value={draft.country}
            onChange={(e) => setDraft({ ...draft, country: e.target.value })}
          >
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>
                {country.label} — {country.hint}
              </option>
            ))}
          </select>
        </label>

        <div className="profile-card__actions">
          <button
            type="button"
            className="cta cta--gold cta--sm"
            onClick={() => {
              onSave(draft)
              setSaved(true)
            }}
            disabled={!dirty}
          >
            {saved ? <CheckIcon size={15} /> : null}
            {saved ? 'Guardado' : 'Guardar cambios'}
          </button>
          <span className="micro-hint">Todo se queda en tu navegador. Sin cuentas, sin servidores.</span>
        </div>
      </section>

      <section className="card ai-card" aria-labelledby="ai-title">
        <header className="card__head">
          <span className="card__icon" aria-hidden="true">
            <SparkleIcon size={16} />
          </span>
          <div>
            <h2 id="ai-title">Motor de IA</h2>
            <p>
              {aiAvailable
                ? `Conectado desde el servidor · ${aiModel}`
                : provider
                  ? `Conectado desde este navegador · ${provider.model}`
                  : 'Modo demo · respuestas del motor local'}
            </p>
          </div>
          <span className={`ai-dot${aiConnected ? ' is-on' : ''}`} aria-hidden="true" />
        </header>

        {aiAvailable ? (
          <p className="ai-note">
            La clave está en el archivo <code>.env</code> del servidor. Las capturas se leen con el
            modelo y no se guardan; si el proveedor falla, Liggo responde con el motor local.
          </p>
        ) : provider ? (
          <>
            <div className="key-row">
              <span className="key-chip" aria-label="Clave guardada">
                <LockIcon size={12} />
                {maskKey(provider.key)}
              </span>
              <span className="key-meta">
                {provider.model} · {provider.baseUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <div className="card-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={() => void runTest(provider)}
                disabled={testing}
              >
                <RefreshIcon size={14} />
                {testing ? 'Comprobando…' : 'Probar conexión'}
              </button>
              <button
                type="button"
                className="ghost-btn ghost-btn--danger"
                onClick={() => {
                  setTestResult(null)
                  onClearProvider()
                }}
              >
                <TrashIcon size={14} />
                Quitar clave
              </button>
            </div>
            <p className="ai-note">
              La clave vive solo en este navegador y viaja directa al proveedor. En un equipo compartido,
              quítala al terminar.
            </p>
          </>
        ) : (
          <>
            <p className="ai-note">
              Sin clave, Liggo funciona en modo demo con el motor local. Si conectas un modelo, podrá leer
              las capturas y afinar mucho más el tono.
            </p>

            <label className="field ai-form" htmlFor="ai-key">
              <span className="field__label">API key</span>
              <input
                id="ai-key"
                className="text-input"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="sk-…"
              />
            </label>

            <div className="field-grid ai-form">
              <label className="field">
                <span className="field__label">Base URL del proveedor</span>
                <input
                  className="text-input"
                  value={baseUrlDraft}
                  onChange={(e) => setBaseUrlDraft(e.target.value)}
                  placeholder={DEFAULT_BASE_URL}
                  spellCheck={false}
                />
              </label>
              <label className="field">
                <span className="field__label">Modelo (con visión)</span>
                <input
                  className="text-input"
                  value={modelDraft}
                  onChange={(e) => setModelDraft(e.target.value)}
                  placeholder={DEFAULT_MODEL}
                  spellCheck={false}
                />
              </label>
            </div>

            <div className="card-actions">
              <button type="button" className="cta cta--gold cta--sm" onClick={() => void saveKey()}>
                <SparkleIcon size={15} />
                {testing ? 'Comprobando…' : 'Guardar y probar'}
              </button>
              <button type="button" className="ghost-btn" onClick={onRecheckAi}>
                <RefreshIcon size={14} />
                ¿Ya está en .env?
              </button>
            </div>

            <p className="ai-note ai-note--warn">
              La clave se guarda solo en este navegador y no pasa por nuestro servidor. No la pegues en
              chats ni la subas a GitHub: es un secreto.
            </p>
          </>
        )}

        {testResult && (
          <p className={`ai-status${testResult.ok ? ' is-ok' : ' is-error'}`} role="status">
            {testResult.ok ? <CheckIcon size={13} /> : <LockIcon size={13} />}
            {testResult.message}
          </p>
        )}

        <details className="env-details">
          <summary>Conectarla en el servidor con un archivo .env</summary>
          <ol className="env-steps">
            <li>
              En la raíz del proyecto, copia <code>.env.example</code> a <code>.env</code>.
            </li>
            <li>
              Rellena <code>LIGGO_API_KEY</code>, <code>LIGGO_BASE_URL</code> y <code>LIGGO_MODEL</code>.
            </li>
            <li>Guarda el archivo: el servidor se reinicia solo. Después pulsa «¿Ya está en .env?».</li>
          </ol>
          <div className="code-wrap">
            <pre className="code-block">{ENV_SNIPPET}</pre>
            <button
              type="button"
              className="ghost-btn code-wrap__copy"
              onClick={() => void copy(ENV_SNIPPET, setCopiedEnv)}
            >
              {copiedEnv ? <CheckIcon size={13} /> : null}
              {copiedEnv ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="micro-hint">
            Recomendado si despliegas la app: la clave queda en el servidor y nunca en el navegador.
          </p>
        </details>
      </section>

      <section className="card preference-card">
        <header className="card__head">
          <span className="card__icon" aria-hidden="true">
            <SunIcon size={16} />
          </span>
          <div>
            <h2>Apariencia</h2>
            <p>Modo claro para el día, oscuro para el late night texting.</p>
          </div>
          <button type="button" className="theme-switch" onClick={onToggleTheme} aria-label="Cambiar tema">
            <span className={theme === 'light' ? 'is-active' : ''}>
              <SunIcon size={14} />
            </span>
            <span className={theme === 'dark' ? 'is-active' : ''}>
              <MoonIcon size={14} />
            </span>
          </button>
        </header>
      </section>

      <section className="card preference-card">
        <header className="card__head">
          <span className="card__icon card__icon--muted" aria-hidden="true">
            <LockIcon size={16} />
          </span>
          <div>
            <h2>Privacidad</h2>
            <p>Las capturas se procesan en el momento y no se guardan en ningún servidor.</p>
          </div>
        </header>
        <button type="button" className="ghost-btn ghost-btn--danger" onClick={onReset}>
          <TrashIcon size={14} />
          Borrar mis datos de este navegador
        </button>
      </section>
    </div>
  )
}
