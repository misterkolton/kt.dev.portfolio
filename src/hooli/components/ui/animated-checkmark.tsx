import * as React from 'react'

import { cn } from '@/lib/utils'

type SizeType = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'

type Tone =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'destructive'

type StrokeWeight = 'thin' | 'default' | 'bold'

type SizeMap = Record<SizeType, number>

export interface AnimatedCheckmarkProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  size?: SizeType
  // Legacy-compatible color mapping through tone classes
  color?:
    | 'primaryBody'
    | 'primaryHeading'
    | 'inverseBody'
    | 'inverseHeading'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger'
    | 'anchorBlue'
    | 'primaryBrand'
    | 'secondaryBrand'
  tone?: Tone
  filled?: boolean
  sizeMap?: Partial<SizeMap>
  strokeWidth?: StrokeWeight
  checked?: boolean
  duration?: number // ms
  delay?: number // ms
  loop?: boolean
  replayOnHover?: boolean
}

const DEFAULT_SIZE_MAP: SizeMap = {
  xSmall: 16,
  small: 20,
  medium: 24,
  large: 28,
  xLarge: 32,
}

const strokeMap: Record<StrokeWeight, number> = {
  thin: 1.5,
  default: 2,
  bold: 3,
}

// Map supported text color aliases to tones.
function mapLegacyColorToTone(color?: AnimatedCheckmarkProps['color']): Tone | undefined {
  switch (color) {
    case 'primaryBody':
    case 'primaryHeading':
    case 'inverseBody':
    case 'inverseHeading':
      return 'default'
    case 'accent':
    case 'anchorBlue':
    case 'primaryBrand':
    case 'secondaryBrand':
      return 'primary'
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'danger'
    default:
      return undefined
  }
}

const toneClass: Record<Tone, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  accent: 'text-accent-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-500 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-500',
  muted: 'text-muted-foreground',
  destructive: 'text-destructive',
}

// Inject keyframes once
let stylesInjected = false
function ensureKeyframes() {
  if (stylesInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.dataset.tokenAnimatedCheckmark = 'true'
  style.textContent = `
@keyframes hds-check-circle { from { stroke-dashoffset: 82; } to { stroke-dashoffset: 0; } }
@keyframes hds-check-tick { from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; } }
@keyframes hds-check-fill { 0% { box-shadow: inset 0 0 0 0 currentColor; transform: scale(1); } 100% { box-shadow: inset 0 0 0 var(--fill-size, 0px) currentColor; transform: scale(1); } }
`
  document.head.appendChild(style)
  stylesInjected = true
}

export const AnimatedCheckmark = React.forwardRef<HTMLDivElement, AnimatedCheckmarkProps>(
  (
    {
      className,
      size = 'small',
      color,
      tone,
      filled = false,
      sizeMap,
      strokeWidth = 'default',
      checked = true,
      duration = 700,
      delay = 0,
      loop = false,
      replayOnHover = false,
      ...props
    },
    ref,
  ) => {
    React.useEffect(() => {
      ensureKeyframes()
    }, [])

    const [playId, setPlayId] = React.useState(0)
    const onMouseEnter = React.useCallback(() => {
      if (!replayOnHover) return
      setPlayId((v) => v + 1)
    }, [replayOnHover])

    // Reduced motion
    const [reduceMotion, setReduceMotion] = React.useState(false)
    React.useEffect(() => {
      if (typeof window === 'undefined') return
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduceMotion(mq.matches)
      const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
      mq.addEventListener?.('change', handler)
      return () => mq.removeEventListener?.('change', handler)
    }, [])

    const resolvedTone: Tone = tone ?? mapLegacyColorToTone(color) ?? 'success'
    const px = (sizeMap ? { ...DEFAULT_SIZE_MAP, ...sizeMap } : DEFAULT_SIZE_MAP)[size]
    const stroke = strokeMap[strokeWidth]

    // Stagger the ring, fill, and tick so the confirmation reads clearly.
    const circleDuration = duration * 0.45
    const tickDelay = filled ? duration * 0.6 : duration * 0.2
    const tickDuration = duration * 0.4
    const fillDelay = duration * 0.4
    const fillDuration = duration * 0.4

    const animationIterationCount = loop ? 'infinite' : '1'
    const commonAnimProps = {
      animationFillMode: 'forwards' as const,
      animationIterationCount,
    }

    const showFinal = reduceMotion || !checked

    return (
      <div
        key={playId}
        ref={ref}
        onMouseEnter={onMouseEnter}
        className={cn('relative inline-flex items-center justify-center', toneClass[resolvedTone], className)}
        style={{ width: px, height: px, ['--fill-size' as any]: `${px}px` }}
        {...props}
      >
        {/* Fill circle */}
        {filled && (
          <div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={
              showFinal
                ? { boxShadow: `inset 0 0 0 ${checked ? px : 0}px currentColor` }
                : {
                    animationName: 'hds-check-fill',
                    animationDuration: `${fillDuration}ms`,
                    animationDelay: `${delay + fillDelay}ms`,
                    ...commonAnimProps,
                  }
            }
          />
        )}

        {/* SVG ring + tick */}
        <svg
          className="absolute inset-0"
          width={px}
          height={px}
          viewBox="0 0 26 26"
          aria-hidden
        >
          {/* outline ring */}
          <circle
            cx="13"
            cy="13"
            r="12"
            fill="transparent"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={stroke}
            strokeDasharray={82}
            style={
              showFinal
                ? { strokeDashoffset: checked ? 0 : 82 }
                : {
                    strokeDashoffset: 82,
                    animationName: 'hds-check-circle',
                    animationDuration: `${circleDuration}ms`,
                    animationDelay: `${delay}ms`,
                    ...commonAnimProps,
                  }
            }
          />
          {/* checkmark */}
          <path
            d="M 0 0 L 4 4 L 12 -6"
            transform="translate(7, 14)"
            fill="none"
            stroke={filled ? 'white' : 'currentColor'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={stroke}
            strokeDasharray={18}
            style={
              showFinal
                ? { strokeDashoffset: checked ? 0 : 18 }
                : {
                    strokeDashoffset: 18,
                    animationName: 'hds-check-tick',
                    animationDuration: `${tickDuration}ms`,
                    animationDelay: `${delay + tickDelay}ms`,
                    ...commonAnimProps,
                  }
            }
          />
        </svg>
      </div>
    )
  },
)

AnimatedCheckmark.displayName = 'AnimatedCheckmark'
