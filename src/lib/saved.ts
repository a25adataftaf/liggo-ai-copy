import type { Format, ModeId } from '../../shared/modes'

export interface SavedPhrase {
  id: string
  text: string
  mode: ModeId
  format: Format
  note?: string
  vibeLabel?: string
  createdAt: number
}

const KEY = 'liggo.saved'
const MAX_ITEMS = 80

function isSaved(value: unknown): value is SavedPhrase {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return typeof item.id === 'string' && typeof item.text === 'string' && typeof item.mode === 'string'
}

export function loadSaved(): SavedPhrase[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSaved).slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

function persist(list: SavedPhrase[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
  } catch {
    /* modo privado / cuota llena */
  }
}

export function addSaved(list: SavedPhrase[], phrase: Omit<SavedPhrase, 'id' | 'createdAt'>): SavedPhrase[] {
  const exists = list.find((item) => item.text === phrase.text)
  if (exists) return list
  const next: SavedPhrase[] = [
    {
      ...phrase,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    },
    ...list,
  ].slice(0, MAX_ITEMS)
  persist(next)
  return next
}

export function removeSaved(list: SavedPhrase[], id: string): SavedPhrase[] {
  const next = list.filter((item) => item.id !== id)
  persist(next)
  return next
}

export function clearSaved(): SavedPhrase[] {
  persist([])
  return []
}

export function isSavedText(list: SavedPhrase[], text: string): boolean {
  return list.some((item) => item.text === text)
}
