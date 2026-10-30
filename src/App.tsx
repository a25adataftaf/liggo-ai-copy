import { useCallback, useEffect, useRef, useState } from 'react'
import type { Format, GenerateResponse, LastSpeaker, ModeId, Profile } from '../shared/modes'
import { ChatInsights } from './components/ChatInsights'
import { ChatPanel } from './components/ChatPanel'
import { HelpModal } from './components/HelpModal'
import { HelpIcon, MenuIcon, MoonIcon, SparkleIcon, SunIcon } from './components/Icons'
import { ImageUploader } from './components/ImageUploader'
import { ModePicker } from './components/ModePicker'
import { ProfileModal } from './components/ProfileModal'
import { ProModal } from './components/ProModal'
import { ProfilePage } from './components/ProfilePage'
import { ResultsPanel } from './components/ResultsPanel'
import { SavedPage } from './components/SavedPage'
import { Sidebar, type View } from './components/Sidebar'
import { StoryIdeas } from './components/StoryIdeas'
import { checkHealth, generateResponses } from './lib/api'
import { prepareImage, type PreparedImage } from './lib/image'
import { loadProfile, loadTheme, saveProfile, saveTheme, type Theme } from './lib/storage'
import { clearProvider, loadProvider, saveProvider } from './lib/provider'
import { requestCompletion, testProvider, type ProviderConfig } from '../shared/provider'
import { addSaved, clearSaved, isSavedText, loadSaved, removeSaved, type SavedPhrase } from './lib/saved'
import type { Suggestion } from '../shared/modes'

const MAX_MODES = 3
const EXAMPLES = [
  {
    chat: `Tú: hola! qué tal el finde?
Sara: bien, el sábado salí con unos amigos y acabamos en la playa
Tú: no me digas que te has bañado
Sara: jaja de hecho sí, estaba helada
Tú: valiente
Sara: la próxima te llevo a ti, a ver si aguantas`,
    lastSpeaker: 'match' as LastSpeaker,
    format: 'chat' as Format,
  },
  {
    chat: `Tú: oye, ¿sigues vivo? 😄
Álex: jaja sí
Tú: vale, me quedo más tranquilo
Álex: ok`,
    lastSpeaker: 'match' as LastSpeaker,
    format: 'chat' as Format,
  },
  {
    chat: '',
    story: 'foto en una terraza al sol con la frase "san viernes y cero planes"',
    lastSpeaker: 'match' as LastSpeaker,
    format: 'story' as Format,
  },
]

export default function App() {
  const [view, setView] = useState<View>('cupido')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [format, setFormat] = useState<Format>('chat')
  const [chat, setChat] = useState('')
  const [story, setStory] = useState('')
  const [lastSpeaker, setLastSpeaker] = useState<LastSpeaker>('match')
  const [modes, setModes] = useState<ModeId[]>(['provocativo'])
  const [images, setImages] = useState<PreparedImage[]>([])

  const [profile, setProfile] = useState<Required<Profile>>(() => loadProfile())
  const [theme, setTheme] = useState<Theme>(() => loadTheme())
  const [aiAvailable, setAiAvailable] = useState(false)
  const [aiModel, setAiModel] = useState('demo')
  const [provider, setProvider] = useState<ProviderConfig | null>(() => loadProvider())
  const [saved, setSaved] = useState<SavedPhrase[]>(() => loadSaved())

  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationCount, setGenerationCount] = useState(0)

  const [modal, setModal] = useState<'pro' | 'profile' | 'help' | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const [nudge, setNudge] = useState(false)
  const [exampleIndex, setExampleIndex] = useState(0)

  const resultsRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<number>()
  const nudgeTimer = useRef<number>()

  const maxImages = format === 'story' ? 1 : 3

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    if (format === 'story') setImages((current) => current.slice(0, 1))
  }, [format])

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const refreshAiStatus = useCallback(
    async (notify = false) => {
      const health = await checkHealth()
      setAiAvailable(health.ai)
      setAiModel(health.provider)
      if (notify) {
        showToast(
          health.ai
            ? `Motor IA conectado (${health.provider}) ✓`
            : 'Sigue en modo demo: revisa la clave del archivo .env',
        )
      }
    },
    [showToast],
  )

  useEffect(() => {
    void refreshAiStatus()
  }, [refreshAiStatus])

  const stepOnInput = useCallback(() => {
    window.clearTimeout(nudgeTimer.current)
    setNudge(true)
    nudgeTimer.current = window.setTimeout(() => setNudge(false), 700)
  }, [])

  const handleFiles = useCallback(
    async (files: File[]) => {
      const room = maxImages - images.length
      if (room <= 0) {
        showToast(`Puedes subir hasta ${maxImages} captura${maxImages > 1 ? 's' : ''}.`)
        return
      }
      const batch = files.slice(0, room)
      const prepared: PreparedImage[] = []
      for (const file of batch) {
        try {
          prepared.push(await prepareImage(file))
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Esa imagen no se ha podido procesar.')
        }
      }
      if (prepared.length) {
        setImages((current) => [...current, ...prepared].slice(0, maxImages))
      }
    },
    [images.length, maxImages, showToast],
  )

  const removeImage = (id: string) => setImages((current) => current.filter((image) => image.id !== id))

  const toggleMode = (mode: ModeId) => {
    setModes((current) => {
      if (current.includes(mode)) return current.filter((m) => m !== mode)
      if (current.length >= MAX_MODES) {
        showToast(`Máximo ${MAX_MODES} modos por consulta. Quita uno para añadir otro.`)
        return current
      }
      return [...current, mode]
    })
  }

  const copyText = async (text: string, label = 'Respuesta copiada ✓') => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(label)
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      try {
        document.execCommand('copy')
        showToast(label)
      } catch {
        showToast('No he podido copiar. Selecciona el texto a mano.')
      }
      document.body.removeChild(area)
    }
  }

  const saveSuggestion = (suggestion: Suggestion) => {
    if (isSavedText(saved, suggestion.text)) {
      showToast('Esa frase ya está en Mis frases.')
      return
    }
    setSaved((current) =>
      addSaved(current, {
        text: suggestion.text,
        mode: suggestion.mode,
        format,
        note: suggestion.note,
        vibeLabel: result?.vibeLabel,
      }),
    )
    showToast('Guardada en Mis frases ✓')
  }

  const hasContent = Boolean(chat.trim() || images.length || (format === 'story' && story.trim()))

  const runGeneration = useCallback(async () => {
    if (loading) return
    if (!hasContent) {
      stepOnInput()
      showToast(
        format === 'story'
          ? 'Cuéntame qué pone la historia (o sube la captura) para poder responderla.'
          : 'Sube una captura o pega el chat para que Liggo lo lea.',
      )
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const payload = {
      chat: chat.trim(),
      story: format === 'story' ? story.trim() : '',
      format,
      modes,
      lastSpeaker,
      images: images.map((image) => image.dataUrl),
      profile,
      seed: Math.floor(Math.random() * 2 ** 31),
    }

    const finish = (data: GenerateResponse) => {
      setResult(data)
      setGenerationCount((count) => count + 1)
      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
      }, 80)
    }

    try {
      // 1) Clave guardada en el navegador: llamada directa al proveedor.
      if (provider) {
        try {
          finish(await requestCompletion(provider, payload))
          return
        } catch (err) {
          const detail = err instanceof Error ? err.message : 'error con el proveedor'
          // 2) Respaldo: servidor (IA o motor local) con una nota honesta.
          const data = await generateResponses(payload)
          data.note = `${detail} Mientras tanto te dejo el motor local.`
          finish(data)
          return
        }
      }

      finish(await generateResponses(payload))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo ha fallado. Prueba otra vez.')
    } finally {
      setLoading(false)
    }
  }, [chat, format, hasContent, images, lastSpeaker, loading, modes, profile, provider, showToast, stepOnInput, story])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && view === 'cupido') {
        event.preventDefault()
        void runGeneration()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [runGeneration, view])

  const useExample = () => {
    const example = EXAMPLES[exampleIndex % EXAMPLES.length]
    setFormat(example.format)
    setChat(example.chat)
    setStory(example.story ?? '')
    setLastSpeaker(example.lastSpeaker)
    setExampleIndex((index) => index + 1)
    setResult(null)
    setError(null)
    showToast('Ejemplo cargado. Pulsa Generar respuestas.')
  }

  const resetData = () => {
    setProfile({ alias: '', country: 'es', matchName: '' })
    saveProfile({ alias: '', country: 'es', matchName: '' })
    setChat('')
    setStory('')
    setImages([])
    setModes([])
    setResult(null)
    setGenerationCount(0)
    setProvider(null)
    clearProvider()
    setSaved(clearSaved())
    showToast('Datos de este navegador borrados.')
  }

  return (
    <div className="shell">
      <Sidebar
        view={view}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        nickname={profile.alias}
        isPro={aiAvailable || Boolean(provider)}
        savedCount={saved.length}
        onNavigate={(next) => {
          setView(next)
          setMobileOpen(false)
        }}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenPro={() => setModal('pro')}
        onOpenProfile={() => setModal('profile')}
      />

      <main className="stage">
        <div className="stage__clouds" aria-hidden="true">
          <span className="cloud cloud--1" />
          <span className="cloud cloud--2" />
          <span className="cloud cloud--3" />
          <span className="cloud cloud--4" />
          <span className="cloud cloud--5" />
        </div>

        <div className="stage__scroll">
          <div className="stage__inner">
            <header className="topbar">
              <button
                type="button"
                className="icon-btn topbar__menu"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <MenuIcon size={18} />
              </button>
              <button
                type="button"
                className="logo"
                onClick={() => setView('cupido')}
                aria-label="Liggo, ir al inicio"
              >
                <span className="logo__text">LIGG</span>
                <span className="logo__monkey" aria-hidden="true">
                  🐵
                </span>
              </button>
            </header>

            {view === 'perfil' ? (
              <ProfilePage
                profile={profile}
                theme={theme}
                aiAvailable={aiAvailable}
                aiModel={aiModel}
                provider={provider}
                generationCount={generationCount}
                onSave={(next) => {
                  setProfile(next)
                  saveProfile(next)
                  showToast('Perfil guardado ✓')
                }}
                onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
                onOpenPro={() => setModal('pro')}
                onReset={resetData}
                onRecheckAi={() => void refreshAiStatus(true)}
                onSaveProvider={(config) => {
                  setProvider(config)
                  saveProvider(config)
                }}
                onClearProvider={() => {
                  setProvider(null)
                  clearProvider()
                  showToast('Clave del navegador borrada.')
                }}
                onTestProvider={(config) => testProvider(config)}
              />
            ) : view === 'frases' ? (
              <SavedPage
                items={saved}
                onCopy={(text) => void copyText(text, 'Frase copiada ✓')}
                onRemove={(id) => {
                  setSaved((current) => removeSaved(current, id))
                  showToast('Frase eliminada.')
                }}
                onClear={() => {
                  setSaved(clearSaved())
                  showToast('Mis frases está vacío otra vez.')
                }}
                onGoToCupido={() => setView('cupido')}
              />
            ) : (
              <div className={`cupido${nudge ? ' is-nudged' : ''}`}>
                <div className="mode-switch" role="group" aria-label="Tipo de respuesta">
                  <button
                    type="button"
                    aria-pressed={format === 'chat'}
                    className={format === 'chat' ? 'is-active' : ''}
                    onClick={() => setFormat('chat')}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    aria-pressed={format === 'story'}
                    className={format === 'story' ? 'is-active' : ''}
                    onClick={() => setFormat('story')}
                  >
                    Insta Story
                  </button>
                </div>

                <ImageUploader
                  images={images}
                  maxImages={maxImages}
                  title={format === 'story' ? 'Historia de Instagram' : 'Imágenes de la conversación'}
                  subtitle={
                    format === 'story'
                      ? 'Sube la story a la que quieres responder'
                      : `Sube ${maxImages > 1 ? 'hasta 3' : '1'} imagen${maxImages > 1 ? 'es' : ''} de tu chat`
                  }
                  emptyHint={
                    format === 'story'
                      ? 'Captura de la historia (opcional)'
                      : 'Captura de Tinder, Bumble, WhatsApp o Insta'
                  }
                  onFiles={handleFiles}
                  onRemove={removeImage}
                  onError={showToast}
                />

                <ChatPanel
                  format={format}
                  chat={chat}
                  story={story}
                  lastSpeaker={lastSpeaker}
                  onChatChange={setChat}
                  onStoryChange={setStory}
                  onLastSpeakerChange={setLastSpeaker}
                  onUseExample={useExample}
                />

                {format === 'chat' && (
                  <ChatInsights chat={chat} alias={profile.alias} matchName={profile.matchName} />
                )}

                <ModePicker selected={modes} onToggle={toggleMode} maxModes={MAX_MODES} />

                <div className="cta-area">
                  <button
                    type="button"
                    className="cta cta--gold"
                    onClick={() => void runGeneration()}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Liggo está pensando…
                      </>
                    ) : (
                      <>
                        <SparkleIcon size={18} />
                        {hasContent ? 'Generar respuestas' : 'Desbloquear Liggo'}
                      </>
                    )}
                  </button>
                  <p className="cta-area__hint">
                    Gratis durante la beta · sin tarjeta · ⌘ Enter para generar
                  </p>
                </div>

                {format === 'story' && (
                  <StoryIdeas onCopy={(text) => void copyText(text, 'Idea copiada ✓')} />
                )}

                <div ref={resultsRef} className="results-anchor">
                  <ResultsPanel
                    result={result}
                    loading={loading}
                    error={error}
                    savedTexts={saved.map((item) => item.text)}
                    onRegenerate={() => void runGeneration()}
                    onCopy={copyText}
                    onSave={saveSuggestion}
                  />
                </div>

                <footer className="stage__footer">
                  <span>🐵 Liggo</span>
                  <span aria-hidden="true">·</span>
                  <span>Hecho para conversaciones reales, no para guiones.</span>
                </footer>
              </div>
            )}
          </div>
        </div>

        <div className="dock">
          <button
            type="button"
            className="dock__btn"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          >
            {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </button>
          <button
            type="button"
            className="dock__btn"
            onClick={() => setModal('help')}
            aria-label="Cómo funciona Liggo"
            title="Cómo funciona"
          >
            <HelpIcon size={16} />
          </button>
        </div>
      </main>

      <ProModal
        open={modal === 'pro'}
        aiAvailable={aiAvailable || Boolean(provider)}
        onClose={() => setModal(null)}
        onNotify={() => {
          setModal(null)
          showToast('Apuntado. Te escribimos cuando abra Pro (sin spam).')
        }}
      />
      <ProfileModal
        open={modal === 'profile'}
        profile={profile}
        onClose={() => setModal(null)}
        onSave={(next) => {
          setProfile(next)
          saveProfile(next)
          showToast('Perfil guardado ✓')
        }}
      />
      <HelpModal open={modal === 'help'} onClose={() => setModal(null)} />

      {toast && (
        <div className="toast" role="status" key={toast.id}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
