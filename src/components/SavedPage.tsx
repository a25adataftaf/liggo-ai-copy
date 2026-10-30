import { useState } from 'react'
import { MODE_MAP, type Format } from '../../shared/modes'
import type { SavedPhrase } from '../lib/saved'
import { BookmarkIcon, CheckIcon, CopyIcon, SparkleIcon, TrashIcon } from './Icons'

interface SavedPageProps {
  items: SavedPhrase[]
  onCopy: (text: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onGoToCupido: () => void
}

type Filter = 'all' | Format

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'chat', label: 'Chat' },
  { id: 'story', label: 'Stories' },
]

function formatDate(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(timestamp))
  } catch {
    return ''
  }
}

export function SavedPage({ items, onCopy, onRemove, onClear, onGoToCupido }: SavedPageProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const visible = filter === 'all' ? items : items.filter((item) => item.format === filter)

  const copy = (item: SavedPhrase) => {
    onCopy(item.text)
    setCopiedId(item.id)
    window.setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1800)
  }

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Mis frases</p>
          <h1>Tu arsenal</h1>
          <p className="page__sub">Las respuestas que guardas se quedan en este navegador, listas para reutilizar.</p>
        </div>
        <span className="plan-badge">
          <BookmarkIcon size={13} filled />
          {items.length} guardada{items.length === 1 ? '' : 's'}
        </span>
      </header>

      {items.length === 0 ? (
        <section className="card empty-state">
          <span className="empty-state__icon" aria-hidden="true">
            <BookmarkIcon size={22} />
          </span>
          <h2>Todavía no has guardado nada</h2>
          <p>
            Cuando una respuesta te guste, pulsa el marcador junto a «Copiar» y aparecerá aquí para
            reutilizarla cuando el chat se ponga difícil.
          </p>
          <button type="button" className="cta cta--gold cta--sm" onClick={onGoToCupido}>
            <SparkleIcon size={15} />
            Ir a Cupido
          </button>
        </section>
      ) : (
        <>
          <div className="saved-toolbar">
            <div className="segmented segmented--sm" role="group" aria-label="Filtrar frases guardadas">
              {FILTERS.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={filter === option.id ? 'is-active' : ''}
                  onClick={() => setFilter(option.id)}
                  aria-pressed={filter === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button type="button" className="ghost-btn ghost-btn--danger" onClick={onClear}>
              <TrashIcon size={14} />
              Vaciar todo
            </button>
          </div>

          {visible.length === 0 ? (
            <p className="micro-hint">No hay frases guardadas en este filtro.</p>
          ) : (
            <ul className="saved-list">
              {visible.map((item) => {
                const mode = MODE_MAP[item.mode]
                return (
                  <li className="card saved-item" key={item.id}>
                    <header className="saved-item__head">
                      <span className="saved-item__mode">
                        <span aria-hidden="true">{mode.emoji}</span> {mode.name}
                      </span>
                      <span className="saved-item__meta">
                        {item.format === 'story' ? 'Story' : 'Chat'} · {formatDate(item.createdAt)}
                      </span>
                    </header>
                    <p className="saved-item__text">{item.text}</p>
                    {item.note && <p className="saved-item__note">{item.note}</p>}
                    <footer className="saved-item__foot">
                      <button
                        type="button"
                        className={`copy-btn${copiedId === item.id ? ' is-copied' : ''}`}
                        onClick={() => copy(item)}
                      >
                        {copiedId === item.id ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                        {copiedId === item.id ? 'Copiada' : 'Copiar'}
                      </button>
                      <button
                        type="button"
                        className="ghost-btn ghost-btn--danger"
                        onClick={() => onRemove(item.id)}
                        aria-label="Quitar de mis frases"
                      >
                        <TrashIcon size={13} />
                        Quitar
                      </button>
                    </footer>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
