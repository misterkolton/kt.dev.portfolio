import * as React from 'react'

import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx', className }) => {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-border bg-muted/40 text-left font-mono text-xs text-muted-foreground',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/80">
        <span>{language}</span>
        <span aria-hidden className="h-7 w-7" />
      </div>
      <pre className="max-h-[400px] overflow-auto px-4 py-4 text-[0.8rem] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  )
}
