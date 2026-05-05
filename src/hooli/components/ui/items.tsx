import * as React from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/ui/icon'

type Tone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger'
type Size = 'sm' | 'md'

type ItemsContextValue = {
  query: string
}
const ItemsContext = React.createContext<ItemsContextValue>({ query: '' })

export interface ItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  searchable?: boolean
  placeholder?: string
  onSearchChange?: (value: string) => void
}

export const Items: React.FC<ItemsProps> = ({
  searchable = true,
  placeholder = 'Search…',
  onSearchChange,
  className,
  children,
  ...rest
}) => {
  const [query, setQuery] = React.useState('')
  const handleChange = (v: string) => {
    setQuery(v)
    onSearchChange?.(v)
  }

  return (
    <div className={cn('rounded-lg border border-border/60 bg-background', className)} {...rest}>
      {searchable && (
        <div className="flex items-center gap-2 border-b border-border/60 p-2">
          <div className="relative w-full">
            <Icon name="search" size="xSmall" className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" decorative />
            <input
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              aria-label="Search items"
              className="w-full rounded-md border border-input bg-background pl-8 pr-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      )}
      <ItemsContext.Provider value={{ query }}>
        <div role="listbox" className="divide-y divide-border/60">
          {children}
        </div>
      </ItemsContext.Provider>
    </div>
  )
}

export interface ItemGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const ItemGroup: React.FC<ItemGroupProps> = ({ label, className, children, ...rest }) => {
  const { query } = React.useContext(ItemsContext)
  // Hide group if none of its Item children match
  const hasMatch = React.Children.toArray(children).some((child: any) => {
    const v = (child?.props?.value ?? '').toString().toLowerCase()
    return v.includes(query.toLowerCase())
  })
  if (!hasMatch) return null
  return (
    <div className={cn('p-2', className)} {...rest}>
      {label ? <div className="mb-1 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div> : null}
      <div className="rounded-md">
        {children}
      </div>
    </div>
  )
}

export interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  tone?: Tone
  size?: Size
  selected?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  asChild?: boolean
}

export const Item = React.forwardRef<HTMLButtonElement, ItemProps>(
  ({ value, tone = 'default', size = 'md', selected, leadingIcon, trailingIcon, className, disabled, ...rest }, ref) => {
    const { query } = React.useContext(ItemsContext)
    const match = value.toLowerCase().includes(query.toLowerCase())
    if (!match) return null

    const sizeCls = size === 'sm' ? 'px-2 py-1 text-sm' : 'px-3 py-2 text-sm'
    const toneCls = (
      tone === 'muted' ? 'text-muted-foreground' :
      tone === 'primary' ? 'text-primary' :
      tone === 'success' ? 'text-emerald-600' :
      tone === 'warning' ? 'text-amber-600' :
      tone === 'danger' ? 'text-red-600' :
      'text-foreground'
    )

    return (
      <button
        ref={ref}
        role="option"
        aria-selected={!!selected}
        disabled={disabled}
        className={cn(
          'group flex w-full items-center justify-between rounded-md text-left outline-none transition-colors',
          'hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground disabled:opacity-50',
          sizeCls,
          toneCls,
          className,
        )}
        {...rest}
      >
        <span className="flex min-w-0 items-center gap-2">
          {leadingIcon ? <span className="shrink-0 text-muted-foreground group-hover:text-accent-foreground">{leadingIcon}</span> : null}
          <span className="truncate">{value}</span>
        </span>
        {trailingIcon ? <span className="shrink-0 text-muted-foreground group-hover:text-accent-foreground">{trailingIcon}</span> : null}
      </button>
    )
  }
)
Item.displayName = 'Item'

