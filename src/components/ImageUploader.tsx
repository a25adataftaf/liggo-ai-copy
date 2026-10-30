import { useEffect, useRef, useState, type DragEvent } from 'react'
import type { PreparedImage } from '../lib/image'
import { CloseIcon, ImageIcon, PlusIcon } from './Icons'

interface ImageUploaderProps {
  images: PreparedImage[]
  maxImages: number
  title: string
  subtitle: string
  emptyHint: string
  onFiles: (files: File[]) => void
  onRemove: (id: string) => void
  onError: (message: string) => void
}

export function ImageUploader({
  images,
  maxImages,
  title,
  subtitle,
  emptyHint,
  onFiles,
  onRemove,
  onError,
}: ImageUploaderProps) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
      if (files.length) {
        event.preventDefault()
        onFiles(files)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [onFiles])

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const files = Array.from(event.dataTransfer.files ?? []).filter((f) => f.type.startsWith('image/'))
    if (!files.length) {
      onError('Suelta una imagen (JPG, PNG o WebP).')
      return
    }
    onFiles(files)
  }

  const full = images.length >= maxImages

  return (
    <section className="card upload-card" aria-labelledby="upload-title">
      <header className="card__head">
        <span className="card__icon" aria-hidden="true">
          <ImageIcon size={17} />
        </span>
        <div>
          <h2 id="upload-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>

      <div
        className={`dropzone${dragging ? ' is-dragging' : ''}${images.length ? ' has-files' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !full && input.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !full) {
            e.preventDefault()
            input.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${title}. ${subtitle}`}
      >
        <input
          ref={input}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic"
          multiple={maxImages > 1}
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? [])
            if (files.length) onFiles(files)
            e.target.value = ''
          }}
        />

        {images.length === 0 ? (
          <div className="dropzone__empty">
            <span className="dropzone__plus" aria-hidden="true">
              <PlusIcon size={16} />
            </span>
            <span className="dropzone__label">Agregar</span>
            <span className="dropzone__hint">{emptyHint}</span>
          </div>
        ) : (
          <div className="thumbs">
            {images.map((image) => (
              <figure className="thumb" key={image.id} onClick={(e) => e.stopPropagation()}>
                <img src={image.dataUrl} alt={image.name} />
                <button
                  type="button"
                  className="thumb__remove"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(image.id)
                  }}
                  aria-label={`Quitar ${image.name}`}
                >
                  <CloseIcon size={13} />
                </button>
                <figcaption>{image.sizeKb} KB</figcaption>
              </figure>
            ))}
            {!full && (
              <button
                type="button"
                className="thumb thumb--add"
                onClick={(e) => {
                  e.stopPropagation()
                  input.current?.click()
                }}
                aria-label="Añadir otra captura"
              >
                <PlusIcon size={18} />
                <span>Añadir</span>
              </button>
            )}
          </div>
        )}
      </div>
      <p className="micro-hint">
        {images.length
          ? `${images.length}/${maxImages} captura${images.length > 1 ? 's' : ''} lista${images.length > 1 ? 's' : ''} · puedes pegar con ⌘V`
          : 'También puedes arrastrar la imagen o pegarla con ⌘V (Ctrl+V)'}
      </p>
    </section>
  )
}
