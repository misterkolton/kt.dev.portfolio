// src/components/ui/section.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Heading } from '@/components/ui/heading'

export type Align = 'start' | 'center' | 'end'
export type Padding = 'none' | 'sm' | 'md' | 'lg'
export type Tone = 'default' | 'muted' | 'card'

export type SectionProps = Omit<React.ComponentPropsWithoutRef<'section'>, 'title'> & {
  tone?: Tone
  padding?: Padding
  divider?: 'none' | 'top' | 'bottom' | 'both'
  align?: Align
  actionsAlign?: Align
  contained?: boolean
  containerClassName?: string
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export const Section = React.forwardRef<React.ElementRef<'section'>, SectionProps>(function Section(
  {
    tone = 'default',
    padding = 'md',
    divider = 'none',
    align = 'start',
    actionsAlign,
    contained = true,
    containerClassName,
    title,
    subtitle,
    actions,
    className,
    role = 'region',
    children,
    ...rest
  },
  ref,
) {
  const TONE_CLASS: Record<Tone, string> = {
    default: 'bg-background text-foreground',
    muted: 'bg-muted text-foreground',
    card: 'bg-card text-card-foreground',
  }
  const PAD_CLASS: Record<Padding, string> = {
    none: 'py-0',
    sm: 'py-6',
    md: 'py-10',
    lg: 'py-14',
  }
  const DIVIDER_CLASS: Record<NonNullable<SectionProps['divider']>, string> = {
    none: '',
    top: 'border-t border-border',
    bottom: 'border-b border-border',
    both: 'border-y border-border',
  }

  const textAlign =
    align === 'center' ? 'text-center' : align === 'end' ? 'text-right' : 'text-left'
  const itemsAlign =
    align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : 'items-start'
  const actionsAlignFinal = actions ? (actionsAlign ?? align) : align
  const actionsJustify =
    actionsAlignFinal === 'center'
      ? 'justify-center'
      : actionsAlignFinal === 'end'
        ? 'justify-end'
        : 'justify-start'

  const idBase = React.useId()
  const titleId = title ? `${idBase}-title` : undefined

  const header =
    title || subtitle || actions ? (
      <div className={cn('flex flex-col gap-2', itemsAlign, textAlign)}>
        {title ? (
          <Heading id={titleId} level={2} className={textAlign}>
            {title}
          </Heading>
        ) : null}
        {subtitle ? (
          <p className={cn('text-sm text-muted-foreground md:text-base', textAlign)}>
            {subtitle}
          </p>
        ) : null}
        {actions ? (
          <div className={cn('mt-2 flex w-full flex-wrap items-center gap-2', actionsJustify)}>
            {actions}
          </div>
        ) : null}
      </div>
    ) : null

  const content = (
    <div>
      {header}
      {children ? <div className="mt-6" rounded-sm>{children}</div> : null}
    </div>
  )

  const inner = contained ? (
    <div className={cn('mx-auto max-w-6xl px-6', containerClassName)}>{content}</div>
  ) : (
    content
  )

  return (
    <section
      ref={ref}
      role={role}
      aria-labelledby={titleId}
      className={cn('w-full', TONE_CLASS[tone], PAD_CLASS[padding], DIVIDER_CLASS[divider], className)}
      {...rest}
    >
      {inner}
    </section>
  )
})

export default Section
