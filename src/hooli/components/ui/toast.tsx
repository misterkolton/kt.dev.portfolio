import * as React from 'react'

type ToastItem = {
  id: number
  title: string
  description?: string
  duration?: number
}

type ToastContextValue = {
  toast: (opts: Omit<ToastItem, 'id'> | string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const idRef = React.useRef(0)

  const toast = React.useCallback((opts: Omit<ToastItem, 'id'> | string) => {
    const id = ++idRef.current
    const item: ToastItem =
      typeof opts === 'string'
        ? { id, title: opts, duration: 1600 }
        : { id, duration: 1600, ...opts }
    setItems((prev) => [...prev, item])
    const duration = item.duration ?? 1600
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Container */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4">
        <div className="flex max-w-sm flex-col gap-2">
          {items.map((t) => (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto overflow-hidden rounded-md border border-border/70 bg-card/90 px-3 py-2 text-sm text-card-foreground shadow-md backdrop-blur"
            >
              <div className="font-medium">{t.title}</div>
              {t.description ? (
                <div className="text-xs text-muted-foreground">{t.description}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

