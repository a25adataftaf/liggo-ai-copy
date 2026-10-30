import { Modal } from './Modal'
import { CheckIcon, LockIcon, SparkleIcon } from './Icons'

interface ProModalProps {
  open: boolean
  aiAvailable: boolean
  onClose: () => void
  onNotify: () => void
}

const FEATURES = [
  'Lectura real de la captura: nombres, tono, quién habló último y qué tema hay abierto.',
  'Respuestas ilimitadas y variantes por modo, sin esperas.',
  'Historial de chats y de respuestas que te han funcionado.',
  'Modo Story ilimitado y ajustes de país automáticos.',
]

export function ProModal({ open, aiAvailable, onClose, onNotify }: ProModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Liggo Pro"
      subtitle="El wingman completo, no solo el generador de frases."
      footer={
        <div className="modal__footer-row">
          <button type="button" className="cta cta--gold cta--sm" onClick={onNotify}>
            <SparkleIcon size={16} />
            Avísame cuando abra
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Seguir con la versión gratis
          </button>
        </div>
      }
    >
      <div className="pro-hero">
        <span className="pro-hero__badge" aria-hidden="true">
          🐵
        </span>
        <div>
          <p className="pro-hero__price">
            7,99 €<span>/mes</span>
          </p>
          <p className="pro-hero__meta">Beta cerrada · cancela cuando quieras</p>
        </div>
      </div>

      <ul className="feature-list">
        {FEATURES.map((feature) => (
          <li key={feature}>
            <span className="feature-list__check" aria-hidden="true">
              <CheckIcon size={11} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className={`status-pill${aiAvailable ? ' status-pill--ok' : ''}`}>
        {aiAvailable ? <SparkleIcon size={14} /> : <LockIcon size={14} />}
        {aiAvailable
          ? 'El motor de IA ya está conectado en este entorno.'
          : 'Ahora mismo estás en modo demo: las respuestas se generan localmente. Puedes conectar tu clave en Perfil → Motor de IA.'}
      </div>
    </Modal>
  )
}
