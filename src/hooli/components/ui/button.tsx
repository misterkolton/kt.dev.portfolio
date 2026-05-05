import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Slot } from '@/lib/slot'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50',
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/60',
        accent:
          'bg-accent text-accent-foreground hover:bg-accent/80 focus-visible:ring-accent/60',
        success:
          'bg-emerald-600 text-emerald-50 hover:bg-emerald-500 focus-visible:ring-emerald-500/60',
        warning:
          'bg-amber-500 text-amber-950 hover:bg-amber-400 focus-visible:ring-amber-500/60',
        danger:
          'bg-red-600 text-red-50 hover:bg-red-500 focus-visible:ring-red-500/60',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/60',
        outline:
          'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost:
          'hover:bg-accent hover:text-accent-foreground text-foreground focus-visible:ring-accent/40',
        subtle:
          'border border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        link: 'text-primary underline-offset-4 hover:underline px-0',
        smoke:
          'border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-300',
        shadow:
          'bg-primary text-primary-foreground shadow-md shadow-primary/40 hover:bg-primary/90 hover:shadow-lg focus-visible:ring-primary/50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-6',
        xl: 'h-12 rounded-lg px-7 text-base',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      elevated: {
        true: 'shadow-md shadow-primary/25 hover:shadow-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      elevated: false,
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
