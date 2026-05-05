import * as React from 'react'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  mode: 'light' | 'dark'
  onToggle: () => void
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, onToggle, className }) => {
  const isDark = mode === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn(
        'h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground',
        className,
      )}
      aria-label="Toggle color mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle color mode</span>
    </Button>
  )
}
