import * as React from 'react'
import { cn } from '@/lib/utils'

type TextAs = 'p' | 'span' | 'small'
type TextSize = 'sm' | 'base' | 'md' | 'lg' | 'caption' | 'footnote'
type Weight = 'regular' | 'medium' | 'semibold' | 'bold'
type Tone = 'primary' | 'secondary' | 'muted' | 'danger' | 'success' | 'warning' | 'foreground'
type Align = 'start' | 'center' | 'end'

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextAs
  size?: TextSize
  weight?: Weight
  tone?: Tone
  align?: Align
  clamp?: 0 | 1 | 2 | 3 | 4 | 5
  nowrap?: boolean
}

const SIZE_CLASSES: Record<TextSize, { lh: string; varName: string; tracking?: string }> = {
  sm: { lh: 'leading-[var(--leading-loose)]', varName: '--size-sm' },
  base: { lh: 'leading-[var(--leading-loose)]', varName: '--size-md' },
  md: { lh: 'leading-[var(--leading-loose)]', varName: '--size-md' },
  lg: { lh: 'leading-[var(--leading-loose)]', varName: '--size-lg' },
  caption: { lh: 'leading-[1.5]', varName: '--size-sm', tracking: 'tracking-[var(--tracking-normal)]' },
  footnote: { lh: 'leading-[1.45]', varName: '--size-xs', tracking: 'tracking-[0.002em]' },
}

const WEIGHT_CLASSES: Record<Weight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

const TONE_CLASSES: Record<Tone, string> = {
  primary: 'text-foreground',
  secondary: 'text-primary',
  muted: 'text-muted-foreground',
  danger: 'text-red-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  foreground: 'text-foreground'
}

const ALIGN_CLASSES: Record<Align, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end'
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = 'p', size = 'base', weight = 'regular', tone = 'foreground', align = 'start', clamp = 0, nowrap, className, style, ...rest }, ref) => {
    const Comp = as as any
    const clampStyle = clamp && clamp > 0 ? {
      display: '-webkit-box',
      WebkitLineClamp: clamp,
      WebkitBoxOrient: 'vertical' as any,
      overflow: 'hidden'
    } : undefined

    const sizing = SIZE_CLASSES[size]
    const fontSizeStyle: React.CSSProperties = { fontSize: `var(${sizing.varName})` as any }
    return (
      <Comp
        ref={ref}
        className={cn(
          sizing.lh,
          sizing.tracking,
          WEIGHT_CLASSES[weight],
          TONE_CLASSES[tone],
          ALIGN_CLASSES[align],
          nowrap && 'whitespace-nowrap',
          'tracking-[var(--body-tracking)]',
          className,
        )}
        style={{ ...fontSizeStyle, ...style, ...(clampStyle as any) }}
        {...rest}
      />
    )
  }
)
Text.displayName = 'Text'

export default Text
