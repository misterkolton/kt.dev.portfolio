import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

type BackgroundColor = { swatch?: string; shade?: string }
type TextColor =
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

const capsuleVariants = cva(
  'inline-flex items-center rounded-full font-semibold tracking-[0.2px] transition-colors',
  {
    variants: {
      tone: {
        default: 'bg-muted text-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-emerald-500 text-emerald-950 dark:text-emerald-50',
        warning: 'bg-amber-400 text-amber-950',
        danger: 'bg-red-500 text-red-50',
        muted: 'bg-muted text-muted-foreground',
      },
      size: {
        xSmall: 'px-2 py-0.5 text-[10px]',
        small: 'px-3 py-0.5 text-[11px]',
        medium: 'px-3.5 py-1 text-xs',
        large: 'px-4 py-1.5 text-sm',
        xLarge: 'px-5 py-2 text-base',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
      },
    },
    defaultVariants: {
      tone: 'success',
      size: 'small',
      shadow: 'none',
    },
  },
)

function mapBg(bg?: BackgroundColor) {
  const s = bg?.swatch?.toLowerCase()
  switch (s) {
    case 'primarybrand':
      return 'primary' as const
    case 'secondarybrand':
      return 'secondary' as const
    case 'accent':
      return 'accent' as const
    case 'success':
      return 'success' as const
    case 'warning':
      return 'warning' as const
    case 'danger':
      return 'danger' as const
    default:
      return undefined
  }
}

function mapTextColor(color?: TextColor): string | undefined {
  switch (color) {
    case 'inverseBody':
    case 'inverseHeading':
      return 'text-primary-foreground'
    case 'primaryBody':
    case 'primaryHeading':
      return 'text-foreground'
    case 'success':
      return 'text-emerald-950 dark:text-emerald-50'
    case 'warning':
      return 'text-amber-950'
    case 'danger':
      return 'text-red-50'
    case 'accent':
      return 'text-accent-foreground'
    default:
      return undefined
  }
}

export interface CapsuleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof capsuleVariants> {
  title?: string
  backgroundColor?: BackgroundColor
  fontColor?: TextColor
  boxShadow?: boolean | 'sm' | 'md'
}

export const Capsule = React.forwardRef<HTMLDivElement, CapsuleProps>(
  (
    { className, title, children, tone, size, shadow, backgroundColor, fontColor, boxShadow, ...props },
    ref,
  ) => {
    const derivedTone = tone ?? mapBg(backgroundColor)
    const textColor = mapTextColor(fontColor)
    const shadowVariant: 'none' | 'sm' | 'md' =
      shadow ?? (boxShadow ? (boxShadow === true ? 'sm' : boxShadow) : 'none')

    return (
      <div
        ref={ref}
        className={cn(capsuleVariants({ tone: derivedTone, size, shadow: shadowVariant }), textColor, className)}
        {...props}
      >
        {title ?? children}
      </div>
    )
  },
)

Capsule.displayName = 'Capsule'

export { capsuleVariants }
