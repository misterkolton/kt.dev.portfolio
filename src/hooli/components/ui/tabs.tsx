import * as React from 'react'

import { cn } from '@/lib/utils'

type TabsContextValue = {
  value: string | undefined
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const useTabsContext = (component: string) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error(`${component} must be used within <Tabs />`)
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value: valueProp, onValueChange, children, ...props }, ref) => {
    const isControlled = valueProp !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(
      defaultValue,
    )

    const value = isControlled ? valueProp : uncontrolledValue

    const setValue = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange],
    )

    React.useEffect(() => {
      if (defaultValue !== undefined && !isControlled) {
        setUncontrolledValue(defaultValue)
      }
    }, [defaultValue, isControlled])

    const contextValue = React.useMemo(
      () => ({
        value,
        setValue,
      }),
      [setValue, value],
    )

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex flex-col gap-3', className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex items-center justify-start gap-1 rounded-lg bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  ),
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, ...props }, ref) => {
    const { value: activeValue, setValue } = useTabsContext('TabsTrigger')
    const isActive = activeValue === value

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        disabled={disabled}
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          isActive ? 'bg-background text-foreground shadow-sm' : 'opacity-70 hover:opacity-100',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        onClick={() => {
          if (!disabled) {
            setValue(value)
          }
        }}
        {...props}
      />
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, forceMount = false, children, ...props }, ref) => {
    const { value: activeValue } = useTabsContext('TabsContent')
    const isActive = activeValue === value

    if (!isActive && !forceMount) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(isActive ? 'block' : 'hidden', className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
