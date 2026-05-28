import type { SVGProps } from 'react'

export type NavigationIconName =
  | 'catalog'
  | 'dti'
  | 'rotulacion'
  | 'upload'
  | 'guide'
  | 'explore'
  | 'products'
  | 'resources'
  | 'menu'
  | 'close'

type NavigationIconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: NavigationIconName
  decorative?: boolean
  title?: string
}

function iconProps(decorative: boolean, title?: string) {
  if (decorative) {
    return { 'aria-hidden': true }
  }

  return { 'aria-label': title ?? 'Icono' }
}

export function NavigationIcon({
  name,
  decorative = true,
  className,
  title,
  ...props
}: NavigationIconProps) {
  const sharedProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    ...iconProps(decorative, title),
    ...props,
  }

  switch (name) {
    case 'catalog':
      return (
        <svg {...sharedProps}>
          <rect x="4.5" y="4.5" width="6" height="6" rx="1.5" />
          <rect x="13.5" y="4.5" width="6" height="6" rx="1.5" />
          <rect x="4.5" y="13.5" width="6" height="6" rx="1.5" />
          <rect x="13.5" y="13.5" width="6" height="6" rx="1.5" />
        </svg>
      )
    case 'dti':
      return (
        <svg {...sharedProps}>
          <path d="M6 8.5 12 5l6 3.5-6 3.5L6 8.5Z" />
          <path d="M6 12.5 12 16l6-3.5" />
          <path d="M6 16.5 12 20l6-3.5" />
        </svg>
      )
    case 'rotulacion':
      return (
        <svg {...sharedProps}>
          <path d="M4.5 13.5V9.3c0-1 .8-1.8 1.8-1.8h8.5l2.9 2.7h1.2c.9 0 1.6.7 1.6 1.6v1.7" />
          <path d="M7.2 16.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
          <path d="M16.8 16.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z" />
          <path d="M9.2 18.2h5.6" />
        </svg>
      )
    case 'upload':
      return (
        <svg {...sharedProps}>
          <path d="M12 4.5v10" />
          <path d="m8.5 8 3.5-3.5L15.5 8" />
          <path d="M5 17.5v1c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-1" />
        </svg>
      )
    case 'guide':
      return (
        <svg {...sharedProps}>
          <path d="M7.5 4.5h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Z" />
          <path d="M9 9h6" />
          <path d="M9 12.5h6" />
          <path d="M9 16h4" />
        </svg>
      )
    case 'explore':
      return (
        <svg {...sharedProps}>
          <path d="M12 5.2a6.8 6.8 0 1 0 6.8 6.8" />
          <path d="m10.1 13.9 6.4-6.4-2.2 4.5-4.2 1.9Z" />
          <circle cx="10.1" cy="13.9" r="1.15" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'products':
      return (
        <svg {...sharedProps}>
          <rect x="5" y="5.5" width="14" height="5" rx="1.5" />
          <rect x="5" y="13.5" width="10" height="5" rx="1.5" />
        </svg>
      )
    case 'resources':
      return (
        <svg {...sharedProps}>
          <path d="M7 5.5h8l3 3v10a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 7 5.5Z" />
          <path d="M15 5.5V9h3" />
          <path d="M8.5 12h7" />
          <path d="M8.5 15h5" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...sharedProps}>
          <path d="M5 8.5h14" />
          <path d="M5 15.5h10" />
        </svg>
      )
    case 'close':
      return (
        <svg {...sharedProps}>
          <path d="m7 7 10 10" />
          <path d="M17 7 7 17" />
        </svg>
      )
    default:
      return null
  }
}
