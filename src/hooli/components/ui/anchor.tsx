import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Slot } from '@/lib/slot'

// API notes
// - size maps named size tokens (xSmall..xLarge) to Tailwind text sizes
// - isDecorated toggles underline with an accent decoration color
// - color maps supported aliases to CSS variables
// - onMouseEvent is invoked with the click event before onClick (if provided)

const anchorVariants = cva(
  [
    'inline-flex items-center gap-1 whitespace-nowrap align-baseline',
    'text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
  ].join(' '),
  {
    variants: {
      tone: {
        // default maps to body/foreground
        default: 'text-foreground visited:text-foreground/90',
        primary: 'text-primary visited:text-primary',
        accent: 'text-accent-foreground visited:text-accent-foreground/90',
        muted: 'text-muted-foreground visited:text-muted-foreground/80',
        destructive: 'text-destructive visited:text-destructive',
      },
      size: {
        xSmall: 'text-xs',
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-base',
        xLarge: 'text-lg',
      },
      decorated: {
        true: 'underline underline-offset-4 decoration-current hover:decoration-current',
        false: 'no-underline',
      },
    },
    defaultVariants: {
      tone: 'default',
      size: 'small',
      decorated: false,
    },
  },
)

export interface AnchorProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color' | 'size'>,
    VariantProps<typeof anchorVariants> {
  asChild?: boolean
  // Legacy compatibility
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
  isDecorated?: boolean
  shouldDownload?: boolean
  onMouseEvent?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

function mapLegacyColorToTone(color?: AnchorProps['color']): VariantProps<typeof anchorVariants>['tone'] {
  switch (color) {
    case 'primaryBody':
    case 'primaryHeading':
    case 'inverseBody':
    case 'inverseHeading':
      return 'default'
    case 'accent':
    case 'primaryBrand':
    case 'secondaryBrand':
    case 'anchorBlue':
      return 'primary'
    case 'danger':
      return 'destructive'
    case 'success':
    case 'warning':
      return 'accent'
    default:
      return undefined
  }
}

export const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  (
    {
      className,
      asChild = false,
      tone,
      color,
      size = 'small',
      decorated,
      isDecorated,
      shouldDownload,
      target,
      rel,
      onClick,
      onMouseEvent,
      children,
      title,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'a'

    const derivedTone = tone ?? mapLegacyColorToTone(color)
    const isDecoratedFinal = decorated ?? isDecorated ?? false
    const relFinal = target === '_blank' ? rel ?? 'noopener noreferrer' : rel

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onMouseEvent) onMouseEvent(e)
      if (onClick) onClick(e)
    }

    return (
      <Comp
        ref={ref}
        className={cn(anchorVariants({ tone: derivedTone, size, decorated: isDecoratedFinal }), className)}
        download={shouldDownload}
        target={target}
        rel={relFinal}
        onClick={handleClick}
        {...props}
      >
        {title ?? children}
      </Comp>
    )
  },
)
Anchor.displayName = 'Anchor'

export { anchorVariants }
