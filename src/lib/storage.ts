import type { Profile } from '../../shared/modes'
import { DEFAULT_PROFILE } from '../../shared/countries'

const KEYS = {
  profile: 'liggo.profile',
  theme: 'liggo.theme',
} as const

export type Theme = 'light' | 'dark'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...(JSON.parse(raw) as object) } as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* modo privado / cuota llena: no rompemos la app */
  }
}

export function loadProfile(): Required<Profile> {
  return read<Required<Profile>>(KEYS.profile, DEFAULT_PROFILE as Required<Profile>)
}

export function saveProfile(profile: Required<Profile>) {
  write(KEYS.profile, profile)
}

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(KEYS.theme)
    if (raw === '"dark"' || raw === 'dark') return 'dark'
    if (raw === '"light"' || raw === 'light') return 'light'
  } catch {
    /* noop */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(KEYS.theme, JSON.stringify(theme))
  } catch {
    /* noop */
  }
}

