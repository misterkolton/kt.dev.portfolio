import * as React from 'react'

import { cn } from '@/lib/utils'

export type SizeType = 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'

type AvatarSizeSpec = { avatarSize: number; bubbleLeftPosition: number; bubbleSize: number }

const AVATAR_SIZES: Record<SizeType, AvatarSizeSpec> = {
  // Tuned to keep avatars balanced across compact and roomy layouts.
  xSmall: { avatarSize: 34, bubbleLeftPosition: 22, bubbleSize: 12 },
  small: { avatarSize: 44, bubbleLeftPosition: 28, bubbleSize: 14 },
  medium: { avatarSize: 60, bubbleLeftPosition: 40, bubbleSize: 16 },
  large: { avatarSize: 76, bubbleLeftPosition: 58, bubbleSize: 20 },
  xLarge: { avatarSize: 96, bubbleLeftPosition: 58, bubbleSize: 28 },
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  initials?: string
  size?: SizeType
  isActive?: boolean
  isSelected?: boolean
  /** Rounded shape by default; set to 'circle' for fully circular avatar */
  shape?: 'rounded' | 'circle'
  /** Active status style: 'dot' or 'ring' */
  activeAppearance?: 'dot' | 'ring'
}

function textSizeClass(size: SizeType) {
  switch (size) {
    case 'xSmall':
      return 'text-[10px]'
    case 'small':
      return 'text-xs'
    case 'medium':
      return 'text-sm'
    case 'large':
      return 'text-sm'
    case 'xLarge':
      return 'text-base'
  }
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      initials,
      size = 'small',
      isActive,
      isSelected,
      shape = 'rounded',
      activeAppearance = 'dot',
      ...props
    },
    ref,
  ) => {
    const spec = AVATAR_SIZES[size]
    const [showImage, setShowImage] = React.useState<boolean>(!!src)
    const ringActive = !!isActive && activeAppearance === 'ring'
    // Extra gap between the gradient ring and the avatar content
    // Scaled so xLarge = 4px and smaller sizes reduce proportionally
    const RING_PAD: Record<SizeType, string> = {
      xSmall: 'p-[2px]',
      small: 'p-[2.5px]',
      medium: 'p-[3px]',
      large: 'p-[3.5px]',
      xLarge: 'p-[4px]',
    }
    const RING_PAD_PX: Record<SizeType, number> = {
      xSmall: 2,
      small: 2.5,
      medium: 3,
      large: 3.5,
      xLarge: 4,
    }
    // Size-aware offsets to keep the active dot inside circular avatars
    const DOT_OFFSET: Record<SizeType, number> = {
      xSmall: 2,
      small: 2,
      medium: 2,
      large: 4,
      xLarge: 4,
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          ringActive && 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700',
          ringActive && RING_PAD[size],
          ringActive && (shape === 'circle' ? 'rounded-full' : 'rounded-[15%]'),
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'relative z-0 inline-flex h-full w-full items-center justify-center border text-foreground shadow-sm',
            shape === 'circle' ? 'rounded-full' : 'rounded-[15%]',
            src ? 'bg-muted' : 'bg-accent',
            ringActive ? 'border-white dark:border-background' : 'border-border',
          )}
          style={{ width: spec.avatarSize, height: spec.avatarSize, minWidth: spec.avatarSize, }}
        >
        {showImage && src ? (
          <div
            className={cn(
              'absolute inset-0 overflow-hidden',
              shape === 'circle' ? 'rounded-full' : 'rounded-[15%]'
            )}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={src}
              alt={alt ?? ''}
              className="h-full w-full object-cover"
              draggable={false}
              onError={() => setShowImage(false)}
            />
          </div>
        ) : initials ? (
          <span className={cn('font-semibold', textSizeClass(size), 'text-accent-foreground')}>{initials}</span>
        ) : (
          <span className={cn('font-semibold', textSizeClass(size), 'text-accent-foreground')}>{initials ?? ''}</span>
        )}

        {isSelected ? (
          <span
            className={cn('pointer-events-none absolute z-20 rounded-full bg-emerald-600 shadow ring-2 ring-white dark:ring-background')}
            style={{
              width: spec.bubbleSize,
              height: spec.bubbleSize,
              bottom: shape === 'circle' ? DOT_OFFSET[size] : (size === 'xLarge' ? -5 : 0),
              right: shape === 'circle' ? DOT_OFFSET[size] : undefined,
              left:
                shape === 'circle'
                  ? undefined
                  : spec.bubbleLeftPosition + (ringActive ? RING_PAD_PX[size] : 0),
            }}
            aria-hidden
          />
        ) : null}
        </div>
        {isActive && activeAppearance === 'dot' && !isSelected ? (
          <span
            className={cn('pointer-events-none absolute z-20 rounded-full bg-emerald-500 shadow ring-2 ring-white dark:ring-background')}
            style={{
              width: spec.bubbleSize,
              height: spec.bubbleSize,
              bottom: shape === 'circle' ? DOT_OFFSET[size] : (size === 'xLarge' ? -5 : 0),
              right: shape === 'circle' ? DOT_OFFSET[size] : undefined,
              left:
                shape === 'circle'
                  ? undefined
                  : spec.bubbleLeftPosition + (ringActive ? RING_PAD_PX[size] : 0),
            }}
            aria-hidden
          />
        ) : null}
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'
