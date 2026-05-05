import * as React from 'react'

import { cn } from '@/lib/utils'

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

type SlottableElement = React.ReactElement<{
  className?: string
  ref?: React.Ref<HTMLElement>
}>

export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) {
      if (import.meta.env?.DEV) {
        console.warn('Slot expects a single valid React element child.')
      }

      return null
    }

    const child = children as SlottableElement

    return React.cloneElement(child, {
      ...props,
      ref,
      className: cn(child.props.className, className),
    })
  },
)

Slot.displayName = 'Slot'
