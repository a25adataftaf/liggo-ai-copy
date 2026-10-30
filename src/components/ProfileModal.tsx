import { useEffect, useState } from 'react'
import type { Profile } from '../../shared/modes'
import { COUNTRIES } from '../../shared/countries'
import { Modal } from './Modal'

interface ProfileModalProps {
  open: boolean
  profile: Required<Profile>
  onClose: () => void
  onSave: (profile: Required<Profile>) => void
}

export function ProfileModal({ open, profile, onClose, onSave }: ProfileModalProps) {
  const [draft, setDraft] = useState(profile)

  useEffect(() => {
    if (open) setDraft(profile)
  }, [open, profile])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tu perfil"
      subtitle="Con esto Liggo ajusta el tono: nada de sonar a doblaje."
      footer={
        <div className="modal__footer-row">
          <button
            type="button"
            className="cta cta--gold cta--sm"
            onClick={() => {
              onSave({ ...draft, alias: draft.alias.trim(), matchName: draft.matchName.trim() })
              onClose()
            }}
          >
            Guardar cambios
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      }
    >
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

      <p className="micro-hint">
        Solo se guarda en este navegador (localStorage). No enviamos tus datos a ningún sitio.
      </p>
    </Modal>
  )
}
