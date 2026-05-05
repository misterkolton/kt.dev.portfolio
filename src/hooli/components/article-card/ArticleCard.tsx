// src/components/article-card/ArticleCard.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export type ArticleCardProps = {
  href?: string
  title: string
  imageSrc?: string
  imageAlt?: string
  kicker?: string
  meta?: string
  excerpt?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  tone?: 'default' | 'muted' | 'card'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  className?: string
} & Omit<React.ComponentPropsWithoutRef<'article'>, 'title'>

export const ArticleCard = React.forwardRef<HTMLElement, ArticleCardProps>(function ArticleCard(
  {
    href,
    title,
    imageSrc,
    imageAlt,
    kicker,
    meta,
    excerpt,
    badge,
    actions,
    tone = 'default',
    size = 'md',
    hoverable = false,
    className,
    ...rest
  },
  ref,
) {
  // Local maps for tone/size
  const TONE_CLASS: Record<NonNullable<ArticleCardProps['tone']>, string> = {
    default: 'bg-background text-foreground',
    muted: 'bg-muted text-foreground',
    card: 'bg-card text-card-foreground',
  }

  const PAD_CLASS: Record<NonNullable<ArticleCardProps['size']>, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  const TITLE_CLASS: Record<NonNullable<ArticleCardProps['size']>, string> = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }
  const GAP_CLASS: Record<NonNullable<ArticleCardProps['size']>, string> = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }

  const clickable = !!href

  const [showImage, setShowImage] = React.useState(!!imageSrc)

  return (
    <article
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border shadow-sm',
        TONE_CLASS[tone],
        clickable && 'group cursor-pointer',
        hoverable && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {imageSrc ? (
        <div className="aspect-[16/9] w-full overflow-hidden">
          {showImage ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? ''}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setShowImage(false)}
            />
          ) : (
            <div className="h-full w-full bg-muted" aria-hidden />
          )}
        </div>
      ) : null}

      <div className={cn('relative z-0 flex flex-col', GAP_CLASS[size], PAD_CLASS[size], 'pointer-events-none')}>
        {kicker ? (
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {kicker}
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              'font-semibold',
              TITLE_CLASS[size],
              hoverable && clickable && 'group-hover:underline underline-offset-4',
            )}
          >
            {title}
          </h3>
          {badge ? <div className="pointer-events-auto relative z-20 shrink-0">{badge}</div> : null}
        </div>

        {meta ? (
          <div className="text-xs text-muted-foreground">{meta}</div>
        ) : null}

        {excerpt ? (
          <p className="text-sm text-muted-foreground">{excerpt}</p>
        ) : null}

        {actions ? (
          <div className="pointer-events-auto relative z-20 mt-3 flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      {clickable ? (
        <a
          href={href}
          aria-label={title}
          className={cn(
            'absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'z-10',
          )}
        />
      ) : null}
    </article>
  )
})

export default ArticleCard
