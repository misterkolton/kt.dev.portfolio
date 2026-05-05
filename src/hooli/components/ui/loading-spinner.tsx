import * as React from 'react'
import { cn } from '@/lib/utils'

type LegacySize = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'
type Tone = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'foreground'
type Speed = 'slow' | 'normal' | 'fast'

export interface LoadingSpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: LegacySize | number
  tone?: Tone
  speed?: Speed
  thickness?: number
  label?: string
}

const SIZE_MAP: Record<LegacySize, number> = { xSmall: 18, small: 24, medium: 32, large: 48, xLarge: 64 }
const SPEED_MS: Record<Speed, number> = { slow: 1400, normal: 900, fast: 600 }

function toPx(size?: LegacySize | number): number | undefined {
  if (size == null) return undefined
  return typeof size === 'number' ? size : SIZE_MAP[size]
}

function toneClass(tone?: Tone) {
  switch (tone) {
    case 'primary': return 'text-primary'
    case 'secondary': return 'text-secondary'
    case 'accent': return 'text-accent'
    case 'success': return 'text-emerald-600'
    case 'warning': return 'text-amber-600'
    case 'danger': return 'text-red-600'
    case 'muted': return 'text-muted-foreground'
    case 'foreground':
    default: return 'text-foreground'
  }
}

// Minimal 180° ring with background track
export const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ size = 'small', tone = 'primary', speed = 'normal', thickness = 3, label = 'Loading…', className, ...rest }, ref) => {
    const px = toPx(size) ?? 24
    const dur = SPEED_MS[speed]
    return (
      <svg
        ref={ref}
        width={px}
        height={px}
        viewBox="0 0 24 24"
        role="status"
        aria-label={label}
        className={cn('inline-block align-[-0.125em]', toneClass(tone), className)}
        {...rest}
      >
        {/* Track */}
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={thickness} opacity="0.2" />
        {/* 180° arc that rotates */}
        <g className="origin-center motion-reduce:animate-none" style={{ animation: `spin ${dur}ms linear infinite` as any }}>
          <path d="M12 3 A 9 9 0 0 1 12 21" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={thickness} />
        </g>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </svg>
    )
  })
LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
