import { BookmarkIcon, ChevronIcon, HeartIcon, LeafIcon, LogoutIcon, PanelIcon, UserIcon } from './Icons'

export type View = 'cupido' | 'frases' | 'perfil'

interface SidebarProps {
  view: View
  collapsed: boolean
  mobileOpen: boolean
  nickname: string
  isPro: boolean
  savedCount: number
  onNavigate: (view: View) => void
  onToggleCollapse: () => void
  onCloseMobile: () => void
  onOpenPro: () => void
  onOpenProfile: () => void
}

export function Sidebar({
  view,
  collapsed,
  mobileOpen,
  nickname,
  isPro,
  savedCount,
  onNavigate,
  onToggleCollapse,
  onCloseMobile,
  onOpenPro,
  onOpenProfile,
}: SidebarProps) {
  const initial = (nickname || 'A').trim().charAt(0).toUpperCase()

  return (
    <>
      <div
        className={`sidebar-scrim${mobileOpen ? ' is-visible' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`sidebar${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-open' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="sidebar__brand">
          <span className="brand-badge" aria-hidden="true">
            🐵
          </span>
          <span className="brand-name">Liggo</span>
          <button
            type="button"
            className="icon-btn sidebar__collapse"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            <PanelIcon size={17} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <button
            type="button"
            className={`nav-item${view === 'cupido' ? ' is-active' : ''}`}
            onClick={() => onNavigate('cupido')}
            aria-current={view === 'cupido' ? 'page' : undefined}
          >
            <HeartIcon size={17} />
            <span>Cupido</span>
          </button>
          <button
            type="button"
            className={`nav-item${view === 'frases' ? ' is-active' : ''}`}
            onClick={() => onNavigate('frases')}
            aria-current={view === 'frases' ? 'page' : undefined}
          >
            <BookmarkIcon size={17} />
            <span>Mis frases</span>
            {savedCount > 0 && <span className="nav-item__badge">{savedCount}</span>}
          </button>
          <button
            type="button"
            className={`nav-item${view === 'perfil' ? ' is-active' : ''}`}
            onClick={() => onNavigate('perfil')}
            aria-current={view === 'perfil' ? 'page' : undefined}
          >
            <UserIcon size={17} />
            <span>Perfil</span>
          </button>
        </nav>

        <button type="button" className="pro-card" onClick={onOpenPro}>
          <span className="pro-card__laurel pro-card__laurel--left" aria-hidden="true">
            <LeafIcon size={15} />
          </span>
          <span className="pro-card__laurel pro-card__laurel--right" aria-hidden="true">
            <LeafIcon size={15} />
          </span>
          <span className="pro-card__head">
            <span className="pro-card__monkey" aria-hidden="true">
              🐵
            </span>
            <span className="pro-card__label">Liggo</span>
            <span className="pro-card__badge">{isPro ? 'Activo' : 'Pro'}</span>
          </span>
          <span className="pro-card__title">
            Tu Asistente IA
            <br />
            para Conquistar
          </span>
          <span className="pro-card__link">
            {isPro ? 'Ver ventajas' : 'Hazte Pro'} <ChevronIcon size={12} />
          </span>
        </button>

        <button type="button" className="user-row" onClick={onOpenProfile}>
          <span className="avatar" aria-hidden="true">
            {initial}
          </span>
          <span className="user-row__name">{nickname || 'tu cuenta'}</span>
          <span className="user-row__exit" aria-hidden="true">
            <LogoutIcon size={15} />
          </span>
        </button>
      </aside>
    </>
  )
}
