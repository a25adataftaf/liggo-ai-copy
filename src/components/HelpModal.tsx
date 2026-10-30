import { Modal } from './Modal'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

const STEPS = [
  {
    title: 'Sube la captura o pega el chat',
    body: 'La captura manda contexto: quién habló último, qué tono hay y qué tema está abierto. Si prefieres, pega el texto tal cual.',
  },
  {
    title: 'Elige 1-3 modos',
    body: 'Un modo = respuestas afinadas a ese estilo. Sin selección, Liggo te da tres estilos distintos para comparar.',
  },
  {
    title: 'Copia y pega',
    body: 'Cada opción está lista para copiar. Respeta la ley del esfuerzo: si te escriben tres palabras, no respondas con un párrafo.',
  },
  {
    title: 'Si no funciona, regenera',
    body: 'Cada vez que regeneras cambian las variantes. Una respuesta que no te encaja no es un fracaso: es una opción menos.',
  },
  {
    title: 'Guarda lo que funciona',
    body: 'El marcador de cada respuesta la guarda en «Mis frases», en este navegador. Ahí tienes tu arsenal para cuando el chat se ponga difícil.',
  },
  {
    title: '¿Y si no tienes nada que responder?',
    body: 'En Insta Story, «Ideas para tu story» te propone qué subir, con texto, sticker y el mejor momento. Tú publicas, la otra persona escribe.',
  },
]

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cómo usar Liggo"
      subtitle="Cuatro pasos y una regla: nunca suenes a robot."
      footer={
        <div className="modal__footer-row">
          <button type="button" className="cta cta--gold cta--sm" onClick={onClose}>
            Entendido
          </button>
        </div>
      }
    >
      <ol className="steps">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <span className="steps__index">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="micro-hint">
        Atajo: ⌘ + Enter (Ctrl + Enter) genera respuestas. Esc cierra las ventanas.
      </p>
    </Modal>
  )
}
