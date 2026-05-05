import * as React from 'react'

import { cn } from '@/lib/utils'

type Tone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'success'
  | 'warning'
  | 'danger'
  | 'destructive'

type BackgroundColor = { swatch?: string; shade?: string } | string

function cssSize(v?: number | string): string | undefined {
  if (v === undefined) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

function mapBgToClass(bg?: BackgroundColor): string | undefined {
  if (!bg) return undefined
  if (typeof bg === 'string') return undefined // handled as style
  const s = bg.swatch?.toLowerCase()
  switch (s) {
    case 'primarybrand':
      return 'bg-primary'
    case 'secondarybrand':
      return 'bg-secondary'
    case 'accent':
      return 'bg-accent'
    case 'success':
      return 'bg-emerald-600'
    case 'warning':
      return 'bg-amber-500'
    case 'danger':
      return 'bg-red-600'
    case 'grayscale':
      return 'bg-muted'
    default:
      return undefined
  }
}

export interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string
  width?: number | string
  overflow?: React.CSSProperties['overflow']
  position?: React.CSSProperties['position']
  backgroundColor?: BackgroundColor
  tone?: Tone
  rounded?: boolean
}

export const Bar = React.forwardRef<HTMLDivElement, BarProps>(
  (
    {
      className,
      height,
      width,
      overflow,
      position,
      backgroundColor,
      tone = 'muted',
      rounded = true,
      style,
      ...props
    },
    ref,
  ) => {
    const backgroundClass = mapBgToClass(backgroundColor)
    const styleBg = typeof backgroundColor === 'string' ? { backgroundColor } : {}

    const toneClass = backgroundClass
      ? backgroundClass
      : tone === 'primary'
        ? 'bg-primary'
        : tone === 'secondary'
          ? 'bg-secondary'
          : tone === 'accent'
            ? 'bg-accent'
            : tone === 'success'
              ? 'bg-emerald-600'
              : tone === 'warning'
                ? 'bg-amber-500'
                : tone === 'danger' || tone === 'destructive'
                  ? 'bg-red-600'
                  : tone === 'muted'
                    ? 'bg-muted'
                    : 'bg-foreground'

    return (
      <div
        ref={ref}
        className={cn('shrink-0', rounded ? 'rounded' : '', toneClass, className)}
        style={{
          ...style,
          ...styleBg,
          height: cssSize(height),
          width: cssSize(width),
          overflow,
          position,
        }}
        {...props}
      />
    )
  },
)

Bar.displayName = 'Bar'
