interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  className,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export function HeartIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2l1.6 1.6L12 21l7.2-6.6 1.6-1.6a5.1 5.1 0 0 0 0-7.2Z" />
    </svg>
  )
}

export function UserIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.6 20.2c.6-3.6 3.7-6 7.4-6s6.8 2.4 7.4 6" />
    </svg>
  )
}

export function PanelIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M9 4.5v15" />
      <path d="M5.6 9h1.2M5.6 12h1.2" />
    </svg>
  )
}

export function ImageIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="16" rx="3.4" />
      <circle cx="8.6" cy="9.6" r="1.6" />
      <path d="m4.2 17.4 4.6-4.2a2 2 0 0 1 2.7 0l3.2 3 1.6-1.4a2 2 0 0 1 2.6 0l1.9 1.7" />
    </svg>
  )
}

export function PlusIcon({ size = 18, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function CloseIcon({ size = 18, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function CopyIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="9" y="9" width="11" height="11" rx="2.6" />
      <path d="M15.5 6.2A2.6 2.6 0 0 0 13 4H6.6A2.6 2.6 0 0 0 4 6.6V13a2.6 2.6 0 0 0 2.2 2.6" />
    </svg>
  )
}

export function CheckIcon({ size = 16, className, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  )
}

export function SparkleIcon({ size = 18, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M12 3.4 13.6 9 19 10.6 13.6 12.2 12 17.8 10.4 12.2 5 10.6 10.4 9 12 3.4Z" />
      <path d="M18.4 15.6l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </svg>
  )
}

export function LockIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <rect x="4.5" y="10" width="15" height="10" rx="2.8" />
      <path d="M8.2 10V7.6a3.8 3.8 0 0 1 7.6 0V10" />
    </svg>
  )
}

export function ArrowIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}

export function LogoutIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M14.5 4.5h-7A2.5 2.5 0 0 0 5 7v10a2.5 2.5 0 0 0 2.5 2.5h7" />
      <path d="m13.5 12H21m0 0-3.2-3.2M21 12l-3.2 3.2" />
    </svg>
  )
}

export function MoonIcon({ size = 18, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  )
}

export function SunIcon({ size = 18, className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.4 19.6 6 18M18 6l1.6-1.6" />
    </svg>
  )
}

export function HelpIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .9-1 1.6v.4" />
      <path d="M12 17.2h.01" />
    </svg>
  )
}

export function TrashIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4.5 7h15M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h2.2a1.4 1.4 0 0 1 1.4 1.4V7" />
      <path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7" />
      <path d="M10.6 11v5.4M13.4 11v5.4" />
    </svg>
  )
}

export function RefreshIcon({ size = 16, className, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M20 11.2A8.2 8.2 0 0 0 6 7.4L4 9.4" />
      <path d="M4 4.6v4.8h4.8" />
      <path d="M4 12.8a8.2 8.2 0 0 0 14 3.8l2-2" />
      <path d="M20 19.4v-4.8h-4.8" />
    </svg>
  )
}

export function LeafIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={1.6}>
      <path d="M5 19c-1.5-6 2.5-12 14-14-1 11-7 15-12 13Z" />
      <path d="M8.5 15.5C10 12 12.5 9.6 16 8" />
    </svg>
  )
}

export function SendIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="m4 12 16-7-6.5 16-2.4-6.1L4 12Z" />
    </svg>
  )
}

export function ChevronIcon({ size = 16, className, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="m9 5.5 7 6.5-7 6.5" />
    </svg>
  )
}

export function SlidersIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M5 7h9M18 7h1M5 12h3M12 12h7M5 17h7M16 17h3" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="14" cy="17" r="2" />
    </svg>
  )
}

export function ChatIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M20.5 11.4a7.7 7.7 0 0 1-7.7 7.5 8.6 8.6 0 0 1-3.2-.6L5 19.6l1.3-4a7.4 7.4 0 0 1-.8-3.4 7.7 7.7 0 0 1 7.6-7.5 7.7 7.7 0 0 1 7.4 6.7Z" />
      <path d="M8.8 11.4h.01M12.8 11.4h.01M16.8 11.4h.01" />
    </svg>
  )
}

export function MenuIcon({ size = 20, className, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function BookmarkIcon({ size = 16, className, strokeWidth = 1.8, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth} fill={filled ? 'currentColor' : 'none'}>
      <path d="M6.4 4.6h11.2a1.4 1.4 0 0 1 1.4 1.4v13.6L12 15.4l-7 4.2V6a1.4 1.4 0 0 1 1.4-1.4Z" />
    </svg>
  )
}

export function ChartIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 19.5h16" />
      <rect x="5.5" y="12" width="3.2" height="5.6" rx="1.2" />
      <rect x="10.4" y="7.6" width="3.2" height="10" rx="1.2" />
      <rect x="15.3" y="10.2" width="3.2" height="7.4" rx="1.2" />
    </svg>
  )
}

export function BulbIcon({ size = 18, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M9.4 17.6a5.8 5.8 0 1 1 5.2 0v1.6a1.4 1.4 0 0 1-1.4 1.4h-2.4a1.4 1.4 0 0 1-1.4-1.4v-1.6Z" />
      <path d="M9.6 17.6h4.8" />
      <path d="M12 7.4v3.2" />
    </svg>
  )
}

export function ShuffleIcon({ size = 15, className, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size, className)} strokeWidth={strokeWidth}>
      <path d="M4 6.5h3.2c4.4 0 5.2 11 9.6 11H20" />
      <path d="m17.4 14.9 2.6 2.6-2.6 2.6" />
      <path d="M4 17.5h3.2c1.5 0 2.6-1.3 3.6-3" />
      <path d="M14.2 9.4c.8-1.7 1.7-2.9 2.6-2.9H20" />
      <path d="m17.4 3.9 2.6 2.6-2.6 2.6" />
    </svg>
  )
}
