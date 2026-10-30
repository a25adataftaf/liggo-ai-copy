const MAX_EDGE = 1400
const QUALITY = 0.82

export interface PreparedImage {
  id: string
  name: string
  dataUrl: string
  width: number
  height: number
  sizeKb: number
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No he podido leer la imagen.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('La imagen no se ha podido abrir.'))
    img.src = src
  })
}

/**
 * Redimensiona y recomprime la captura en el navegador:
 * menos peso, menos espera y menos ancho de banda para el modelo.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Ese archivo no es una imagen.')
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error('La captura pesa más de 12 MB. Prueba con una más ligera.')
  }

  const original = await readAsDataUrl(file)
  const img = await loadImage(original)

  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Tu navegador no permite procesar la imagen.')

  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
  const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024)

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name || 'captura',
    dataUrl,
    width,
    height,
    sizeKb,
  }
}
