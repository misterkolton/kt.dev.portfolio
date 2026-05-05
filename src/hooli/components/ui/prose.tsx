import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'sm' | 'lg'

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  invert?: boolean
}

export const Prose: React.FC<ProseProps> = ({ variant = 'default', invert, className, ...rest }) => {
  return (
    <div
      className={cn(
        'prose',
        variant === 'sm' && 'prose-sm',
        variant === 'lg' && 'prose-lg',
        invert && 'prose-invert',
        className,
      )}
      {...rest}
    />
  )
}

export default Prose

