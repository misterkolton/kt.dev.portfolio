import * as React from 'react'

import { cn } from '@/lib/utils'

interface ComingSoonProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-border/60 bg-background/60 p-10 text-center',
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-2xl space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description ??
            'This component is planned for Token. Implementation details, variants, and usage examples will land here soon.'}
        </p>
      </div>
    </div>
  )}
