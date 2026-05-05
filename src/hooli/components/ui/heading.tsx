import * as React from 'react'
import { cn } from '@/lib/utils'

type HeadingAs = 'h1' | 'h2' | 'h3' | 'h4'
type Level = 1 | 2 | 3 | 4
type Align = 'start' | 'center' | 'end'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingAs
  level?: Level
  align?: Align
  balance?: boolean
}

const SIZE_BY_LEVEL: Record<Level, { lh: string; varName: string }> = {
  1: { lh: 'leading-[var(--leading-tight)]', varName: '--heading-1' },
  2: { lh: 'leading-[1.2]', varName: '--heading-2' },
  3: { lh: 'leading-[1.3]', varName: '--heading-3' },
  4: { lh: 'leading-[1.35]', varName: '--heading-4' },
}

const ALIGN_CLASSES: Record<Align, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end'
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as, level = 1, align = 'start', balance, className, style, ...rest }, ref) => {
    const tag: HeadingAs = as ?? (('h' + level) as HeadingAs)
    const Comp: any = tag
    const shouldBalance = balance ?? (level === 1 || level === 2)
    const sizing = SIZE_BY_LEVEL[level]
    const fontSizeStyle: React.CSSProperties = { fontSize: `var(${sizing.varName})` as any }
    return (
      <Comp
        ref={ref}
        className={cn(
          sizing.lh,
          'font-[var(--heading-weight)] tracking-[var(--tracking-tight)]',
          ALIGN_CLASSES[align],
          shouldBalance && 'text-balance',
          className,
        )}
        style={{ ...fontSizeStyle, ...style }}
        {...rest}
      />
    )
  }
)
Heading.displayName = 'Heading'

export default Heading
