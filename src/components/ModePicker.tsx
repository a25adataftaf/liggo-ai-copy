import { MODES, type ModeId } from '../../shared/modes'
import { CheckIcon, SlidersIcon } from './Icons'

interface ModePickerProps {
  selected: ModeId[]
  onToggle: (mode: ModeId) => void
  maxModes: number
}

export function ModePicker({ selected, onToggle, maxModes }: ModePickerProps) {
  return (
    <section className="card modes-card" aria-labelledby="modes-title">
      <header className="card__head">
        <span className="card__icon" aria-hidden="true">
          <SlidersIcon size={17} />
        </span>
        <div>
          <h2 id="modes-title">Modo de respuesta</h2>
          <p>Elige el estilo de tu respuesta · hasta {maxModes}</p>
        </div>
        <span className="modes-card__count" aria-live="polite">
          {selected.length}/{maxModes}
        </span>
      </header>

      <div className="modes-grid" role="group" aria-label="Estilos de respuesta">
        {MODES.map((mode) => {
          const active = selected.includes(mode.id)
          return (
            <button
              type="button"
              key={mode.id}
              className={`mode-card${active ? ' is-active' : ''}${mode.id === 'salvada' ? ' mode-card--wide' : ''}`}
              style={
                {
                  '--mode-from': mode.from,
                  '--mode-to': mode.to,
                  '--mode-border': mode.border,
                  '--mode-accent': mode.accent,
                } as React.CSSProperties
              }
              onClick={() => onToggle(mode.id)}
              aria-pressed={active}
              title={mode.description}
            >
              <span className="mode-card__emoji" aria-hidden="true">
                {mode.emoji}
              </span>
              <span className="mode-card__name">{mode.name}</span>
              <span className="mode-card__tag">{mode.tagline}</span>
              <span className="mode-card__check" aria-hidden="true">
                <CheckIcon size={10} />
              </span>
            </button>
          )
        })}
      </div>
      <p className="micro-hint">
        {selected.length === 0
          ? 'Sin selección: Liggo te da 3 estilos distintos para elegir.'
          : 'Consejo: pide un solo modo y afinas más el tono.'}
      </p>
    </section>
  )
}
