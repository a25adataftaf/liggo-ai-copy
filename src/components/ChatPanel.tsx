import { useId } from 'react'
import type { Format, LastSpeaker } from '../../shared/modes'
import { ChatIcon, SparkleIcon, TrashIcon } from './Icons'

interface ChatPanelProps {
  format: Format
  chat: string
  story: string
  lastSpeaker: LastSpeaker
  onChatChange: (value: string) => void
  onStoryChange: (value: string) => void
  onLastSpeakerChange: (value: LastSpeaker) => void
  onUseExample: () => void
}

const CHAT_PLACEHOLDER = `Pega aquí el chat tal cual, con nombres si quieres:

Tú: hola! qué tal el finde?
Sara: bien, el sábado salí con unos amigos y acabamos en la playa
Tú: no me digas que te has bañado
Sara: jaja de hecho sí, estaba helada`

export function ChatPanel({
  format,
  chat,
  story,
  lastSpeaker,
  onChatChange,
  onStoryChange,
  onLastSpeakerChange,
  onUseExample,
}: ChatPanelProps) {
  const chatId = useId()
  const storyId = useId()

  return (
    <section className="card chat-card" aria-labelledby="chat-title">
      <header className="card__head">
        <span className="card__icon" aria-hidden="true">
          <ChatIcon size={17} />
        </span>
        <div>
          <h2 id="chat-title">{format === 'story' ? 'La historia' : 'El chat'}</h2>
          <p>
            {format === 'story'
              ? 'Pega lo que pone la story o descríbela en una línea'
              : 'Pega la conversación o cuéntame la situación'}
          </p>
        </div>
        <button type="button" className="ghost-btn" onClick={onUseExample}>
          <SparkleIcon size={14} />
          Ejemplo
        </button>
      </header>

      {format === 'story' ? (
        <>
          <label className="visually-hidden" htmlFor={storyId}>
            Texto de la historia de Instagram
          </label>
          <textarea
            id={storyId}
            className="chat-input chat-input--short"
            value={story}
            onChange={(e) => onStoryChange(e.target.value)}
            placeholder={'Ej: foto en la playa con la frase "último fin de semana de sol ☀️"'}
            rows={3}
            maxLength={2000}
          />
          <label className="field">
            <span className="field__label">¿Algo más de contexto? (opcional)</span>
            <textarea
              className="chat-input chat-input--short"
              value={chat}
              onChange={(e) => onChatChange(e.target.value)}
              placeholder="Ej: nos escribimos hace dos semanas y quedó en frío…"
              rows={2}
              maxLength={2000}
            />
          </label>
          <p className="micro-hint">Las respuestas de story van en 1-2 líneas y abren conversación privada.</p>
        </>
      ) : (
        <>
          <label className="visually-hidden" htmlFor={chatId}>
            Conversación
          </label>
          <textarea
            id={chatId}
            className="chat-input"
            value={chat}
            onChange={(e) => onChatChange(e.target.value)}
            placeholder={CHAT_PLACEHOLDER}
            rows={6}
            maxLength={12000}
          />

          <div className="chat-row">
            <div className="segmented segmented--sm" role="group" aria-label="¿Quién habló último?">
              <button
                type="button"
                className={lastSpeaker === 'match' ? 'is-active' : ''}
                onClick={() => onLastSpeakerChange('match')}
                aria-pressed={lastSpeaker === 'match'}
              >
                Habló la otra persona
              </button>
              <button
                type="button"
                className={lastSpeaker === 'me' ? 'is-active' : ''}
                onClick={() => onLastSpeakerChange('me')}
                aria-pressed={lastSpeaker === 'me'}
              >
                Me dejó en visto
              </button>
            </div>
            {chat.trim() !== '' && (
              <button type="button" className="ghost-btn ghost-btn--danger" onClick={() => onChatChange('')}>
                <TrashIcon size={14} />
                Limpiar
              </button>
            )}
          </div>
          <p className="micro-hint">{chat.length.toLocaleString('es-ES')} / 12.000 caracteres</p>
        </>
      )}
    </section>
  )
}
