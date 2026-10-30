import { useEffect, useRef, useState } from 'react'
import { MODE_MAP, type GenerateResponse, type Suggestion } from '../../shared/modes'
import { BookmarkIcon, CheckIcon, CopyIcon, RefreshIcon, SparkleIcon } from './Icons'

interface ResultsPanelProps {
  result: GenerateResponse | null
  loading: boolean
  error: string | null
  savedTexts: string[]
  onRegenerate: () => void
  onCopy: (text: string) => void
  onSave: (suggestion: Suggestion) => void
}

function InterestMeter({ value }: { value: number }) {
  const tone = value >= 66 ? 'hot' : value >= 40 ? 'warm' : 'cold'
  return (
    <div className={`meter meter--${tone}`} aria-label={`Nivel de interés estimado: ${value} sobre 100`}>
      <div className="meter__track">
        <div className="meter__fill" style={{ width: `${Math.max(4, value)}%` }} />
      </div>
      <span className="meter__value">{value}%</span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="results results--loading" aria-busy="true" aria-live="polite">
      <div className="card result-card">
        <div className="skeleton skeleton--sm" />
        <div className="skeleton skeleton--lg" />
        <div className="skeleton skeleton--md" />
      </div>
      <div className="suggestions">
        {[0, 1, 2].map((i) => (
          <div className="card suggestion-card" key={i} style={{ animationDelay: `${i * 90}ms` }}>
            <div className="skeleton skeleton--sm" />
            <div className="skeleton skeleton--md" />
            <div className="skeleton skeleton--xs" />
          </div>
        ))}
      </div>
      <p className="loading-note">Liggo está leyendo el chat…</p>
    </div>
  )
}

export function ResultsPanel({
  result,
  loading,
  error,
  savedTexts,
  onRegenerate,
  onCopy,
  onSave,
}: ResultsPanelProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const timer = useRef<number>()

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  const copy = (text: string) => {
    onCopy(text)
    setCopied(text)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 1800)
  }

  if (loading) return <div ref={container}>{<Skeleton />}</div>

  if (error) {
    return (
      <div className="card error-card" role="alert">
        <strong>Se ha quedado a medias</strong>
        <p>{error}</p>
        <button type="button" className="ghost-btn" onClick={onRegenerate}>
          <RefreshIcon size={14} />
          Reintentar
        </button>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="results" ref={container} aria-live="polite">
      <section className="card result-card">
        <header className="result-card__head">
          <span className="result-card__eyebrow">
            <span aria-hidden="true">🎯</span> Lectura del chat
          </span>
          <span className={`vibe-chip vibe-chip--${result.vibe}`}>{result.vibeLabel}</span>
        </header>
        <p className="result-card__reading">{result.reading}</p>
        {result.interest > 0 && (
          <div className="result-card__meter">
            <span className="result-card__meter-label">Nivel de interés</span>
            <InterestMeter value={result.interest} />
          </div>
        )}
        {result.note && <p className="result-card__note">{result.note}</p>}
      </section>

      <div className="results__section-head">
        <span className="results__eyebrow">
          <span aria-hidden="true">⚡</span> Opciones de respuesta
        </span>
        <button type="button" className="ghost-btn" onClick={onRegenerate}>
          <RefreshIcon size={14} />
          Regenerar
        </button>
      </div>

      <div className="suggestions">
        {result.suggestions.map((suggestion, index) => {
          const mode = MODE_MAP[suggestion.mode]
          const isCopied = copied === suggestion.text
          const isSaved = savedTexts.includes(suggestion.text)
          return (
            <article
              className="card suggestion-card"
              key={`${suggestion.mode}-${index}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <header className="suggestion-card__head">
                <span className="suggestion-card__mode">
                  <span aria-hidden="true">{mode.emoji}</span> Opción {index + 1} · {mode.name}
                </span>
                <span className="suggestion-card__tag">{mode.tagline}</span>
              </header>
              <p className="suggestion-card__text">{suggestion.text}</p>
              <footer className="suggestion-card__foot">
                <p className="suggestion-card__note">{suggestion.note}</p>
                <div className="suggestion-card__actions">
                  <button
                    type="button"
                    className={`icon-btn save-btn${isSaved ? ' is-saved' : ''}`}
                    onClick={() => onSave(suggestion)}
                    aria-label={isSaved ? 'Guardada en mis frases' : `Guardar la opción ${index + 1}`}
                    title={isSaved ? 'Guardada' : 'Guardar en Mis frases'}
                  >
                    <BookmarkIcon size={15} filled={isSaved} />
                  </button>
                  <button
                    type="button"
                    className={`copy-btn${isCopied ? ' is-copied' : ''}`}
                    onClick={() => copy(suggestion.text)}
                    aria-label={isCopied ? 'Respuesta copiada' : `Copiar la opción ${index + 1}`}
                  >
                    {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                    {isCopied ? 'Copiada' : 'Copiar'}
                  </button>
                </div>
              </footer>
            </article>
          )
        })}
      </div>

      <section className="pro-tip">
        <span className="pro-tip__icon" aria-hidden="true">
          <SparkleIcon size={16} />
        </span>
        <div>
          <strong>Consejo Pro</strong>
          <p>{result.proTip}</p>
        </div>
      </section>

      <div className="results__actions">
        <button type="button" className="ghost-btn" onClick={onRegenerate}>
          <RefreshIcon size={14} />
          Otras variantes
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => copy(result.suggestions.map((s) => `· ${s.text}`).join('\n\n'))}
        >
          <CopyIcon size={14} />
          Copiar las {result.suggestions.length}
        </button>
      </div>
    </div>
  )
}
