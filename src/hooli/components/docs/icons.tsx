import * as React from 'react'
import { Icon } from '@/components/ui/icon'
import { ICON_KEYS, NEW_ICON_KEYS } from '@/components/ui/icon'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

export function IconsCatalog() {
  const [query, setQuery] = React.useState('')
  const [view, setView] = React.useState<'all' | 'additional' | 'core'>('all')
  const [tone, setTone] = React.useState<'primary' | 'success' | 'warning' | 'danger' | 'foreground' | 'muted' | 'secondary' | 'accent'>('primary')
  const { toast } = useToast()
  const derived = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = [...ICON_KEYS].sort((a, b) => a.localeCompare(b))
    const coreSet = new Set(NEW_ICON_KEYS as readonly string[])
    const additional = all.filter(n => !coreSet.has(n))
    const inView = view === 'core' ? [...coreSet].sort((a,b)=>a.localeCompare(b)) : view === 'additional' ? additional : all
    const match = q ? inView.filter(n => n.toLowerCase().includes(q)) : inView
    const counts = {
      all: q ? all.filter(n => n.toLowerCase().includes(q)).length : all.length,
      core: q ? [...coreSet].filter(n => n.toLowerCase().includes(q)).length : coreSet.size,
      additional: q ? additional.filter(n => n.toLowerCase().includes(q)).length : additional.length,
    }
    return { items: match, counts }
  }, [query, view])

  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur">
      <CardContent className="p-0">
        {/* Static header to avoid clipping the top border */}
        <div className="flex flex-col gap-3 border-b border-border/60 bg-card p-3 rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
          {/* Search on the left (primary action) */}
          <div className="relative w-full sm:w-[280px]">
            <Icon
              name="search"
              size="xSmall"
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              decorative
            />
            <input
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Search icons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search icons"
            />
          </div>
          {/* Controls on the right: segmented view + tone selector */}
          <div className="flex items-center gap-2">
            <div className="inline-flex overflow-hidden rounded-md border">
              {(['all','additional','core'] as const).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setView(val)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors',
                    view === val ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:text-foreground',
                  )}
                  aria-pressed={view === val}
                >
                  {val === 'all' ? 'All' : val === 'additional' ? 'Additional' : 'Core'}
                  <span className="ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground">{derived.counts[val]}</span>
                </button>
              ))}
            </div>

            <label className="hidden text-xs text-muted-foreground sm:block" htmlFor="icon-tone">Tone</label>
            <select
              id="icon-tone"
              className="rounded-md border bg-background px-2 py-1 text-xs"
              value={tone}
              onChange={(e)=>setTone(e.target.value as any)}
            >
              <option value="primary">Primary</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="foreground">Foreground</option>
              <option value="muted">Muted</option>
              <option value="secondary">Secondary</option>
              <option value="accent">Accent</option>
            </select>
          </div>
        </div>
        {/* Fixed-height scroll region so the page doesn’t reflow while filtering */}
        <ScrollArea className="h-[520px]">
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {derived.items.map((name) => (
              <button
                key={name}
                type="button"
                className={cn(
                  'group flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3 text-left transition-colors hover:bg-accent/30',
                )}
                onClick={async () => {
                  const value = `<Icon name="${name}" />`
                  await navigator.clipboard.writeText(value)
                  toast({ title: 'Copied', description: value })
                }}
              >
                <Icon name={name} tone={tone} />
                <span className="truncate text-xs text-muted-foreground group-hover:text-foreground">{name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
