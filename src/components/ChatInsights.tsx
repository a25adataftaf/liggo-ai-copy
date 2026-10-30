import { useMemo, useState } from 'react'
import { analyzeInsights } from '../../shared/insights'
import { ChartIcon, SparkleIcon } from './Icons'

interface ChatInsightsProps {
  chat: string
  alias?: string
  matchName?: string
}

function Stat({ label, mine, theirs }: { label: string; mine: number; theirs: number }) {
  return (
    <div className="insight-stat">
      <span className="insight-stat__label">{label}</span>
      <span className="insight-stat__values">
        <strong>{mine}</strong>
        <span aria-hidden="true">·</span>
        <strong>{theirs}</strong>
      </span>
    </div>
  )
}

export function ChatInsights({ chat, alias, matchName }: ChatInsightsProps) {
  const insights = useMemo(() => analyzeInsights(chat, alias), [chat, alias])
  const [open, setOpen] = useState(false)

  if (!chat.trim()) return null

  const matchLabel = matchName?.trim() || 'Tu match'

  if (!insights.ready) {
    return (
      <section className="card insights-card insights-card--empty">
        <header className="card__head">
          <span className="card__icon card__icon--muted" aria-hidden="true">
            <ChartIcon size={16} />
          </span>
          <div>
            <h2>Radiografía del chat</h2>
            <p>{insights.reason}</p>
          </div>
        </header>
      </section>
    )
  }

  const { me, match } = insights

  return (
    <section className={`card insights-card tone-${insights.tone}`} aria-labelledby="insights-title">
      <header className="card__head">
        <span className="card__icon" aria-hidden="true">
          <ChartIcon size={16} />
        </span>
        <div>
          <h2 id="insights-title">Radiografía del chat</h2>
          <p>
            {insights.title} · {insights.labeledLines} mensajes medidos
          </p>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Ocultar detalle' : 'Ver detalle'}
        >
          <span aria-hidden="true" className={`chevron${open ? ' is-open' : ''}`}>
            ›
          </span>
        </button>
      </header>

      <div className="balance">
        <div className="balance__head">
          <span>Tú · {me.share}%</span>
          <span>
            {matchLabel} · {match.share}%
          </span>
        </div>
        <div className="balance__bar" role="img" aria-label={`Reparto de esfuerzo: tú ${me.share}%, ${matchLabel} ${match.share}%`}>
          <span className="balance__me" style={{ width: `${Math.max(6, me.share)}%` }} />
        </div>
      </div>

      <p className="insights-verdict">
        <SparkleIcon size={13} />
        {insights.verdict}
      </p>

      {open && (
        <div className="insights-detail">
          <div className="insight-stats">
            <Stat label="Mensajes" mine={me.lines} theirs={match.lines} />
            <Stat label="Palabras" mine={me.words} theirs={match.words} />
            <Stat label="Media/mensaje" mine={me.avgWords} theirs={match.avgWords} />
            <Stat label="Preguntas" mine={me.questions} theirs={match.questions} />
            <Stat label="Emojis" mine={me.emojis} theirs={match.emojis} />
          </div>
          {insights.topics.length > 0 && (
            <div className="insight-topics">
              <span className="insight-topics__label">Temas abiertos</span>
              <div className="chips">
                {insights.topics.map((topic) => (
                  <span className="chip" key={topic.id}>
                    {topic.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {insights.notes.length > 0 && (
            <ul className="insight-notes">
              {insights.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
